import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import {
  JobResponse,
  JobDBCreateRequest,
  JobDbResponse,
} from './types/job.interface';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

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
    private prisma: PrismaService,
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

      // iterate over jobListings and add each job to the database
      jobListings.forEach(async (job: JobResponse) => {
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

        // return if job already exists in database
        const jobExists = await this.prisma.job.findUnique({
          where: { adzuna_id: id },
        });

        if (jobExists) {
          Logger.log(`${job.title} already exists in database`, 'JobService');
          return;
        }

        try {
          const newJob = await this.prisma.job.create({
            data: jobData,
          });
          Logger.log(`${newJob.title} added to database`, 'JobService');
        } catch (error) {
          Logger.error(`~ ${error.message}`);
        }
      });
      return jobListings;
    } catch (error) {
      Logger.error(`~ ${error.message}`);
      return [];
    }
  }

  // url: /api/v1/jobs/:id
  async getJob(id: string): Promise<JobDbResponse> {
    try {
      const jobListing = await this.prisma.job.findUnique({
        where: { adzuna_id: id },
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
        message: `Job with id ${id} not found`,
      };
    }
  }
}
