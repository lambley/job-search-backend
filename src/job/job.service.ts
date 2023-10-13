import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import {
  JobResponse,
  JobDBCreateRequest,
  JobDbResponse,
} from './types/job.interface';
import { Logger } from '@nestjs/common';
import { PrismaJobRepository } from './prisma-job.repository';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

interface getJobsParams {
  results_per_page: number;
  what: string;
  where: string;
}

@Injectable()
// url: /api/v1/jobs?results_per_page=[number]&what=[string]&where=[string]
export class JobService {
  constructor(
    private configService: ConfigService,
    private readonly jobRepository: PrismaJobRepository,
    @InjectQueue('jobQueue') private readonly jobQueue: Queue,
  ) {}

  app_id = this.configService.get<string>('ADZUNA_APP_ID');
  app_key = this.configService.get<string>('ADZUNA_API_KEY');

  async getJobs(params: getJobsParams): Promise<JobResponse[]> {
    const { results_per_page, what, where } = params;

    try {
      const apiUrl = `https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=${this.app_id}&app_key=${this.app_key}&results_per_page=${results_per_page}&what=${what}&where=${where}&content-type=application/json`;

      const response = await axios.get<{ results: JobResponse[] }>(apiUrl);

      const jobListings: JobResponse[] = response.data.results;
      Logger.log(`${jobListings.length} job(s) found`, 'JobService');

      await this.saveJobsToDatabase(jobListings);

      return jobListings;
    } catch (error) {
      Logger.error(`~ ${error.message}`);
      return [];
    }
  }

  // url: /api/v1/jobs/:id
  async getJob(adzuna_id: string): Promise<JobDbResponse> {
    try {
      const jobListing = await this.jobRepository.findByAdzunaId({
        where: { adzuna_id: adzuna_id },
      });
      Logger.log(
        `#${jobListing.adzuna_id}: ${jobListing.title} found`,
        'JobService',
      );
      return jobListing;
    } catch (error) {
      Logger.error(`~ ${error.message}`);
      return {
        id: 0,
        adzuna_id: '',
        title: '',
        location: [],
        description: '',
        created: '',
        company: '',
        salary_min: 0,
        salary_max: 0,
        contract_type: '',
        category: '',
        message: `Job with id ${adzuna_id} not found`,
      };
    }
  }

  // url: /api/v1/jobs/:id/keywords
  async getJobKeywords(id: string): Promise<string[]> {
    try {
      const jobListing: JobDbResponse = await this.jobRepository.findById(id);

      Logger.log(
        `#${jobListing.adzuna_id}: ${jobListing.title} found`,
        'JobService',
      );
      return jobListing.processed_keywords;
    } catch (error) {
      Logger.error(`~ ${error.message}`);
      return [];
    }
  }

  // url: /api/v1/jobs?title=[string]
  async getJobsByTitle(title: string): Promise<JobDbResponse[]> {
    try {
      const jobListings = await this.jobRepository.findByTitle(title);
      Logger.log(`${jobListings.length} job(s) found`, 'JobService');
      return jobListings;
    } catch (error) {
      Logger.error(`~ ${error.message}`);
      return [];
    }
  }

  private async saveJobsToDatabase(jobs: JobResponse[]): Promise<void> {
    for (const job of jobs) {
      const {
        id,
        title,
        location,
        description,
        created,
        company,
        salary_min,
        salary_max,
        contract_type,
        category,
      } = job;

      const jobData: JobDBCreateRequest = {
        adzuna_id: id,
        title,
        location: location.area,
        description,
        created,
        company: company.display_name,
        salary_min,
        salary_max,
        contract_type: contract_type || '',
        category: category.label,
      };

      const jobExists = await this.jobRepository.findByAdzunaId({
        where: { adzuna_id: id },
      });
      if (jobExists) {
        Logger.log(`${job.title} already exists in database`, 'JobService');
        continue;
      }

      try {
        const newJob = await this.jobRepository.create({
          ...jobData,
        });
        Logger.log(`${newJob.title} added to database`, 'JobService');

        // Add the job description to the processing queue
        try {
          await this.jobQueue.add('processJob', {
            description: newJob.description,
            id: newJob.id,
            adzuna_id: newJob.adzuna_id,
          });
          Logger.log(
            `Added job ${newJob.title} to the processing queue`,
            'JobService',
          );
        } catch (error) {
          Logger.error(`~ ${error.message}`);
        }
      } catch (error) {
        Logger.error(`~ ${error.message}`);
      }
    }
  }
}
