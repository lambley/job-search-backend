import { Controller, Get, Query, Param } from '@nestjs/common';
import { JobService } from './job.service';
import { JobResponse, JobDbResponse } from './types/job.interface';

@Controller('api/v1')
export class JobController {
  constructor(private readonly jobService: JobService) {}

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
}
