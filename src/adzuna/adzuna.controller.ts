import { Controller, Get, Query } from '@nestjs/common';
import { AdzunaService } from './adzuna.service';
import { AdzunaJob } from './types/adzuna.interface';

@Controller('api/v1')
export class AdzunaController {
  constructor(private readonly adzunaService: AdzunaService) {}

  @Get('/jobs')
  async getJobs(
    @Query() query: { results_per_page: number; what: string; where: string },
  ): Promise<AdzunaJob[]> {
    const { results_per_page, what, where } = query;

    const encodedWhat = encodeURIComponent(what);
    const encodedWhere = encodeURIComponent(where);

    return this.adzunaService.getJobs({
      results_per_page: results_per_page,
      what: encodedWhat,
      where: encodedWhere,
    });
  }

  @Get('/jobs/:id')
  async getJob(@Query() query: { id: string }): Promise<AdzunaJob> {
    const { id } = query;

    return this.adzunaService.getJob(id);
  }
}
