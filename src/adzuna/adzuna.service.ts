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

  async getJobs(params: getJobsParams): Promise<AdzunaJob[]> {
    const app_id = this.configService.get<string>('ADZUNA_APP_ID');
    const app_key = this.configService.get<string>('ADZUNA_API_KEY');
    const { results_per_page, what, where } = params;

    try {
      const apiUrl = `https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=${app_id}&app_key=${app_key}&results_per_page=${results_per_page}&what=${what}&where=${where}&content-type=application/json`;

      const response = await axios.get<{ results: AdzunaJob[] }>(apiUrl);

      const jobListings: AdzunaJob[] = response.data.results;
      Logger.log(`${jobListings.length} jobs found`, 'AdzunaJobService');

      return jobListings;
    } catch (error) {
      console.error('error:', error.message);
      Logger.log(`~ ${error.message}`);
    }
  }
}
