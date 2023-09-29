import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AdzunaService {
  async getJobs() {
    const app_id = '7c0ba6e4';
    const app_key = '7f17e40d994de3237cc0e26b47de5372';
    const results_per_page = 5;
    // 'what' search terms are URL encoded and separated by %20
    const what = 'javascript%20developer';
    const where = 'london';

    const response = await axios.get(
      `https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=${app_id}&app_key=${app_key}&results_per_page=${results_per_page}&what=${what}&where=${where}&content-type=application/json`,
    );

    return response.data.results;
  }
}
