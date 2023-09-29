import { Controller, Get, Query } from '@nestjs/common';
import { AdzunaService } from './adzuna.service';
import { AdzunaJob } from './types/adzuna.interface';

@Controller('adzuna')
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
}
