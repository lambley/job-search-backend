import {
  Controller,
  Get,
  Query,
  Param,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { JobService } from './job.service';
import { JobResponse, JobDbResponse } from './types/job.interface';
import { JobProcessorService } from '../job-processor/job-processor.service';
import { ResponseDTO } from './dto/response.dto';

@Controller('api/v1')
export class JobController {
  constructor(
    private readonly jobService: JobService,
    private readonly jobProcessorService: JobProcessorService,
  ) {}

  @Get('/jobs/refresh')
  async refreshJobs(
    @Query() query: { results_per_page: number; what: string; where: string },
  ): Promise<ResponseDTO<JobResponse>> {
    const { results_per_page, what, where } = query;

    const encodedWhat = encodeURIComponent(what);
    const encodedWhere = encodeURIComponent(where);

    const jobs = await this.jobService.refreshJobs({
      results_per_page: results_per_page,
      what: encodedWhat,
      where: encodedWhere,
    });

    const count = jobs.length;

    const response = new ResponseDTO(jobs, count);

    return response;
  }

  @Get('/jobs')
  async getJobs(
    @Query()
    query: {
      results_per_page: number;
      what: string;
      where: string;
      force_update: string;
    },
  ): Promise<ResponseDTO<JobDbResponse>> {
    const { results_per_page, what, where } = query;
    let { force_update } = query;

    // Set force_update to false if not present
    if (force_update === undefined) {
      force_update = 'false';
    }

    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) {
        query[key] = value;
      } else {
        delete query[key];
      }
    }

    if (
      results_per_page !== undefined &&
      what !== undefined &&
      where !== undefined
    ) {
      // If all params are present, go to getJobs method
      const jobs = await this.jobService.getJobs(query);
      const response = new ResponseDTO(jobs, jobs.length);
      return response;
    } else if (results_per_page !== undefined) {
      // if only results_per_page is present, go to recentJobs method
      const jobs = await this.jobService.recentJobs(
        results_per_page,
        force_update,
      );
      const response = new ResponseDTO(jobs, jobs.length);
      return response;
    } else {
      // If no params are present, go to getAllJobs method or any other method you want to use
      const allJobs = await this.jobService.getAllJobs(force_update);
      const response = new ResponseDTO(allJobs, allJobs.length);
      return response;
    }
  }

  @Get('/jobs/title')
  async getJobsByTitle(
    @Query('title') title: string,
  ): Promise<ResponseDTO<JobDbResponse>> {
    const jobs = await this.jobService.getJobsByTitle(title);
    const count = jobs.length;

    const response = new ResponseDTO(jobs, count);
    return response;
  }

  @Get('jobs/top-keywords')
  async getTopKeywords(
    @Query() query: { limit?: number; force_update?: string },
  ): Promise<ResponseDTO<string>> {
    let { limit, force_update } = query;

    if (limit === undefined) {
      limit = 10;
    }

    if (force_update === undefined) {
      force_update = 'false';
    }

    const keywords = await this.jobService.getTopKeywords(limit, force_update);
    const count = keywords.length;

    const response = new ResponseDTO(keywords, count);
    return response;
  }

  // should only be used when the keywords lists are updated
  @Get('jobs/reprocess-keywords')
  async reprocessKeywords(): Promise<{ message: string }> {
    // check if redis is running
    const queueStatus = await this.jobService.getQueueStatus();

    if (queueStatus.jobsCount === 0 || queueStatus.jobsCount === undefined) {
      // if redis is not running, return a failure response
      throw new HttpException(
        'Job reprocessing failed - queue is down',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      await this.jobService.reprocessKeywords();
      return { message: 'Job reprocessing completed successfully' };
    } catch (error) {
      // If an error occurs during job reprocessing, return a failure response
      throw new HttpException(
        'Job reprocessing failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/jobs/:adzuna_id')
  async getJob(@Param('adzuna_id') adzuna_id: string): Promise<JobDbResponse> {
    return this.jobService.getJob(adzuna_id);
  }

  @Get('/jobs/:id/keywords')
  async getJobKeywords(@Param('id') id: string): Promise<ResponseDTO<string>> {
    const keywords = await this.jobService.getJobKeywords(id);
    const count = keywords.length;

    const response = new ResponseDTO(keywords, count);
    return response;
  }
}
