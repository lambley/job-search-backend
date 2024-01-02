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
import * as NodeCache from 'node-cache';

interface getJobsParams {
  results_per_page?: number;
  what?: string;
  where?: string;
  force_update?: string;
}

@Injectable()
export class JobService {
  constructor(
    private configService: ConfigService,
    private readonly jobRepository: PrismaJobRepository,
    @InjectQueue('jobQueue') private readonly jobQueue: Queue,
  ) {}

  // Create a cache to store the job listings for 1 hour to reduce the number of API calls
  cache = new NodeCache({ stdTTL: 3600 });

  app_id = this.configService.get<string>('ADZUNA_APP_ID');
  app_key = this.configService.get<string>('ADZUNA_API_KEY');

  // cache keys
  getJobsCacheKey = (params: getJobsParams): string => {
    const { results_per_page, what, where } = params;
    return `getJobs-${results_per_page}-${what}-${where}`;
  };

  getRecentJobsCacheKey = (results_per_page: number): string => {
    return `getRecentJobs-${results_per_page}`;
  };

  getAllJobsCacheKey = (): string => {
    return `getAllJobs`;
  };

  getTopKeywordsCacheKey = (limit: number): string => {
    return `getTopKeywords-${limit}`;
  };

  // url: /api/v1/jobs./refresh?results_per_page=[number]&what=[string]&where=[string]
  // refresh jobs from API
  async refreshJobs(params: getJobsParams): Promise<JobResponse[]> {
    const { results_per_page, what, where } = params;

    try {
      const apiUrl = `https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=${this.app_id}&app_key=${this.app_key}&results_per_page=${results_per_page}&what=${what}&where=${where}&content-type=application/json`;

      const response = await axios.get<{ results: JobResponse[] }>(apiUrl);

      const jobListings: JobResponse[] = response.data.results;
      Logger.log(`${jobListings.length} job(s) found`, 'JobService');

      await this.saveJobsToDatabase(jobListings);

      Logger.log(`Saved jobs to database`, 'JobService');

      return jobListings;
    } catch (error) {
      Logger.error(`~ ${error.message}`);
      return [];
    }
  }

  // url: /api/v1/jobs?results_per_page=[number]&what=[string]&where=[string]
  // getJobs from database
  async getJobs(params: getJobsParams): Promise<JobDbResponse[]> {
    const { results_per_page, what, where, force_update } = params;

    Logger.log(`Params: ${JSON.stringify(params)}`, 'JobService');

    const cacheKey = this.getJobsCacheKey(params);

    // Check if force_update flag is set, if true, clear the cache
    if (force_update === 'true') {
      this.cache.del(cacheKey);
      Logger.log(`Cache cleared for top keywords`, 'JobService');
    }

    // check if the cache already has the job listings
    const cachedJobs = this.cache.get(cacheKey);

    if (cachedJobs) {
      Logger.log(`Retrieved jobs from cache`, 'JobService');
      return cachedJobs as JobDbResponse[];
    }

    try {
      const jobListings = await this.jobRepository.findByTitleAndLocation(
        what,
        where,
        results_per_page,
      );
      Logger.log(`${jobListings.length} job(s) found`, 'JobService');

      // store the job listings in the cache
      this.cache.set(cacheKey, jobListings);

      return jobListings;
    } catch (error) {
      Logger.error(`~ ${error.message}`);
      return [];
    }
  }

  // url: /api/v1/jobs?results_per_page=[number]
  // get specific number of recent jobs from database
  async recentJobs(
    results_per_page: number,
    force_update?: string,
  ): Promise<JobDbResponse[]> {
    const cacheKey = this.getRecentJobsCacheKey(results_per_page);

    // Check if force_update flag is set, if true, clear the cache
    if (force_update === 'true') {
      this.cache.del(cacheKey);
      Logger.log(`Cache cleared for top keywords`, 'JobService');
    }

    const cachedJobs = this.cache.get(cacheKey);

    if (cachedJobs) {
      Logger.log(`Retrieved jobs from cache`, 'JobService');
      return cachedJobs as JobDbResponse[];
    }

    try {
      const jobListings = await this.jobRepository.findRecent(results_per_page);
      Logger.log(`${jobListings.length} job(s) found`, 'JobService');

      this.cache.set(cacheKey, jobListings);

      return jobListings;
    } catch (error) {
      Logger.error(`~ ${error.message}`);
      return [];
    }
  }

  // url: /api/v1/jobs
  // get all jobs from database - when no params are present
  async getAllJobs(force_update?: string): Promise<JobDbResponse[]> {
    const cacheKey = this.getAllJobsCacheKey();

    // Check if force_update flag is set, if true, clear the cache
    if (force_update === 'true') {
      this.cache.del(cacheKey);
      Logger.log(`Cache cleared for top keywords`, 'JobService');
    }

    // check if the cache already has the job listings
    const cachedJobs = this.cache.get(cacheKey);

    if (cachedJobs) {
      Logger.log(`Retrieved jobs from cache`, 'JobService');
      return cachedJobs as JobDbResponse[];
    }

    try {
      const jobListings = await this.jobRepository.findAll();
      Logger.log(`${jobListings.length} job(s) found`, 'JobService');

      // store the job listings in the cache
      this.cache.set(cacheKey, jobListings);

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

  // url: /api/v1/jobs/top-keywords
  async getTopKeywords(
    limit?: number,
    force_update?: string,
  ): Promise<string[]> {
    // check if limit is present, if not, set it to 10
    if (limit === undefined) {
      limit = 10;
    }

    // Check if force_update flag is set, if true, clear the cache
    if (force_update === 'true') {
      this.cache.del(this.getTopKeywordsCacheKey(limit));
      Logger.log(`Cache cleared for top keywords`, 'JobService');
    }

    // check if the cache already has the Top Keywords
    const cachedKeywords: string[] = this.cache.get(
      this.getTopKeywordsCacheKey(limit),
    );

    if (cachedKeywords) {
      Logger.log(`Retrieved jobs from cache`, 'JobService');
      return cachedKeywords;
    }

    try {
      // get all the job listings
      let allJobs: JobDbResponse[] = [];
      if (this.cache.get(this.getAllJobsCacheKey())) {
        allJobs = this.cache.get(this.getAllJobsCacheKey());
        Logger.log(`Retrieved jobs from cache`, 'JobService');
      } else {
        allJobs = await this.jobRepository.findAll();
        Logger.log(`${allJobs.length} job(s) found`, 'JobService');
      }

      // get all the keywords from the job listings
      const allKeywords = allJobs.map((job) => job.processed_keywords).flat();

      // count the number of times each keyword appears
      const keywordCounts = allKeywords.reduce((acc, curr) => {
        if (acc[curr]) {
          acc[curr] += 1;
        } else {
          acc[curr] = 1;
        }
        return acc;
      }, {});

      // sort the keywords by the number of times they appear
      const sortedKeywords = Object.keys(keywordCounts).sort(
        (a, b) => keywordCounts[b] - keywordCounts[a],
      );

      const topKeywords = sortedKeywords.slice(0, limit);

      // store the job listings in the cache
      this.cache.set(this.getTopKeywordsCacheKey(limit), topKeywords);

      return topKeywords;
    } catch (error) {
      Logger.error(`~ ${error.message}`);
      return [];
    }
  }

  // url: /api/v1/jobs/reprocess-keywords
  async reprocessKeywords(): Promise<void> {
    try {
      const allJobs = await this.jobRepository.findAll();

      for (const job of allJobs) {
        const { id, description, adzuna_id } = job;

        // Add the job description to the processing queue
        try {
          await this.jobQueue.add(
            'processJob',
            {
              description,
              id,
              adzuna_id,
            },
            {
              timeout: 10000,
              attempts: 3,
              backoff: {
                type: 'exponential',
                delay: 1000,
              },
            },
          );
          Logger.log(
            `Added job ${job.title} to the processing queue`,
            'JobService',
          );
        } catch (error) {
          Logger.error(`~ ${error.message}`);
        }
      }
    } catch (error) {
      Logger.error(`~ ${error.message}`);
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
        title: title.toLowerCase(),
        location: location.area.map((area) => area.toLowerCase()),
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
          await this.jobQueue.add(
            'processJob',
            {
              description: newJob.description,
              id: newJob.id,
              adzuna_id: newJob.adzuna_id,
            },
            {
              timeout: 10000,
              attempts: 3,
              backoff: {
                type: 'exponential',
                delay: 1000,
              },
            },
          );
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
