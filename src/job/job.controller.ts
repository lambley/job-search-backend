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

  @Get('/jobs')
  async getJobs(
    @Query() query: { results_per_page: number; what: string; where: string },
  ): Promise<ResponseDTO<JobResponse>> {
    const { results_per_page, what, where } = query;

    const encodedWhat = encodeURIComponent(what);
    const encodedWhere = encodeURIComponent(where);

    const jobs = await this.jobService.getJobs({
      results_per_page: results_per_page,
      what: encodedWhat,
      where: encodedWhere,
    });

    const count = jobs.length;

    const response = new ResponseDTO(jobs, count);

    return response;
  }

  @Get('/jobs/title')
  async getJobsByTitle(
    @Query('title') title: string,
  ): Promise<JobDbResponse[]> {
    return this.jobService.getJobsByTitle(title);
  }

  @Get('/jobs/:adzuna_id')
  async getJob(@Param('adzuna_id') adzuna_id: string): Promise<JobDbResponse> {
    return this.jobService.getJob(adzuna_id);
  }

  @Get('/jobs/:id/keywords')
  async getJobKeywords(@Param('id') id: string): Promise<string[]> {
    return this.jobService.getJobKeywords(id);
  }
}
