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

  @Get('/jobs/:id')
  async getJob(@Param('id') id: string): Promise<JobDbResponse> {
    return this.jobService.getJob(id);
  }

  @Post('process')
  async processJob(@Body() jobData: { description: string }): Promise<void> {
    // Add the job description to the processing queue
    await this.jobProcessorService.processJobDescription(jobData.description);
  }
}
