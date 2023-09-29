import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { AdzunaJob } from './adzuna.interface';

interface getJobsParams {
  results_per_page: number;
  what: string;
  where: string;
}

@Injectable()
export class AdzunaService {
  async getJobs(params: getJobsParams): Promise<AdzunaJob[]> {
    const app_id = '7c0ba6e4';
    const app_key = '7f17e40d994de3237cc0e26b47de5372';
    const { results_per_page, what, where } = params;

    const encodedWhat = encodeURIComponent(what);
    const encodedWhere = encodeURIComponent(where);

    try {
      const apiUrl = `https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=${app_id}&app_key=${app_key}&results_per_page=${results_per_page}&what=${encodedWhat}&where=${encodedWhere}&content-type=application/json`;

      const response = await axios.get<{ results: AdzunaJob[] }>(apiUrl);

      const jobListings: AdzunaJob[] = response.data.results;

      return jobListings;
    } catch (error) {
      console.error(error);
    }
  }
}
