import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { JobService } from './job.service';
import { JobResponse, JobDbResponse } from './types/job.interface';
import { JobProcessorService } from '../job-processor/job-processor.service';

@Controller('api/v1')
export class JobController {
  constructor(
    private readonly jobService: JobService,
    private readonly jobProcessorService: JobProcessorService,
  ) {}

  @Get('/jobs')
  async getJobs(
    @Query() query: { results_per_page: number; what: string; where: string },
  ): Promise<JobResponse[]> {
    const { results_per_page, what, where } = query;

    const encodedWhat = encodeURIComponent(what);
    const encodedWhere = encodeURIComponent(where);

    return this.jobService.getJobs({
      results_per_page: results_per_page,
      what: encodedWhat,
      where: encodedWhere,
    });
  }

  @Get('/jobs/:adzuna_id')
  async getJob(@Param('adzuna_id') adzuna_id: string): Promise<JobDbResponse> {
    return this.jobService.getJob(adzuna_id);
  }

  @Get('/jobs/:id/keywords')
  async getJobKeywords(@Param('id') id: string): Promise<string[]> {
    return this.jobService.getJobKeywords(id);
  }

  // @Post('process')
  // async processJob(@Body() jobData: { description: string }): Promise<void> {
  //   // Add the job description to the processing queue
  //   await this.jobProcessorService.processJobDescription(jobData.description);
  // }
}
