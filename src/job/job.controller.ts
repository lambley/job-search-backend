import { Controller, Get, Query, Param } from '@nestjs/common';
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
    @Query() query: { results_per_page: number; what: string; where: string },
  ): Promise<ResponseDTO<JobDbResponse>> {
    const { results_per_page, what, where } = query;

    if (
      results_per_page !== undefined &&
      what !== undefined &&
      where !== undefined
    ) {
      // If all params are present, go to getJobs method
      const jobs = await this.jobService.getJobs({
        results_per_page,
        what,
        where,
      });
      const response = new ResponseDTO(jobs, jobs.length);
      return response;
    } else {
      // If no params are present, go to getAllJobs method or any other method you want to use
      const allJobs = await this.jobService.getAllJobs();
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

  @Get('jobs-top-keywords')
  async getTopKeywords(): Promise<ResponseDTO<string>> {
    const keywords = await this.jobService.getTopKeywords();
    const count = keywords.length;

    const response = new ResponseDTO(keywords, count);
    return response;
  }
}
