import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import {
  JobResponse,
  JobDBCreateRequest,
  JobDbResponse,
} from './types/job.interface';
import { Logger } from '@nestjs/common';

interface getJobsParams {
  results_per_page: number;
  what: string;
  where: string;
}

@Injectable()
export class JobService {
  constructor(private configService: ConfigService) {}

  app_id = this.configService.get<string>('ADZUNA_APP_ID');
  app_key = this.configService.get<string>('ADZUNA_API_KEY');

  async getJobs(params: getJobsParams): Promise<JobResponse[]> {
    const { results_per_page, what, where } = params;

    try {
      const apiUrl = `https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=${this.app_id}&app_key=${this.app_key}&results_per_page=${results_per_page}&what=${what}&where=${where}&content-type=application/json`;

      const response = await axios.get<{ results: JobResponse[] }>(apiUrl);

      const jobListings: Job[] = response.data.results;
      Logger.log(`${jobListings.length} job(s) found`, 'JobService');

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
      return jobListings;
    } catch (error) {
      Logger.error(`~ ${error.message}`);
      return [];
    }
  }

  async getJob(id: string): Promise<Job> {
    // TODO: try catch block to search database of jobs (not Adzuna API, a database for this app)
    try {
      const apiUrl = `https://api.adzuna.com/v1/api/jobs/gb/details/${id}?app_id=${this.app_id}&app_key=${this.app_key}&content-type=application/json`;
      const response = await axios.get<Job>(apiUrl);
      const jobListing: Job = response.data;
      Logger.log(`Job found`, 'JobService');
      return jobListing;
    } catch (error) {
      Logger.error(`~ ${error.message}`);
      return null;
    }
  }
}
