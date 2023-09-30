import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { AdzunaJob } from './types/adzuna.interface';
import { Logger } from '@nestjs/common';

interface getJobsParams {
  results_per_page: number;
  what: string;
  where: string;
}

@Injectable()
export class AdzunaService {
  constructor(private configService: ConfigService) {}

  app_id = this.configService.get<string>('ADZUNA_APP_ID');
  app_key = this.configService.get<string>('ADZUNA_API_KEY');

  async getJobs(params: getJobsParams): Promise<AdzunaJob[]> {
    const { results_per_page, what, where } = params;

    try {
      const apiUrl = `https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=${this.app_id}&app_key=${this.app_key}&results_per_page=${results_per_page}&what=${what}&where=${where}&content-type=application/json`;

      const response = await axios.get<{ results: AdzunaJob[] }>(apiUrl);

      const jobListings: AdzunaJob[] = response.data.results;
      Logger.log(`${jobListings.length} jobs found`, 'AdzunaJobService');

      return jobListings;
    } catch (error) {
      Logger.error(`~ ${error.message}`);
      return [];
    }
  }

  async getJob(id: string): Promise<AdzunaJob> {
    // TODO: try catch block to search database of jobs (not Adzuna API, a database for this app)
    try {
      const apiUrl = `https://api.adzuna.com/v1/api/jobs/gb/details/${id}?app_id=${this.app_id}&app_key=${this.app_key}&content-type=application/json`;
      const response = await axios.get<AdzunaJob>(apiUrl);
      const jobListing: AdzunaJob = response.data;
      Logger.log(`Job found`, 'AdzunaJobService');
      return jobListing;
    } catch (error) {
      Logger.error(`~ ${error.message}`);
      return null;
    }
  }
}
