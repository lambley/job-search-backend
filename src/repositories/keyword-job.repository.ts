import { KeywordJob } from '@prisma/client';
import { KeywordJobCreateRequest } from '../job-processor/types/job-processor.interface';

/*

  KeywordJobRepository

  At the moment, it's only necessary to store the adzuna_id and description of a job - no need to create a relationship with the Job entity.

  Only need to create, find all, and update status by id.

*/

export interface KeywordJobRepository {
  create(data: KeywordJobCreateRequest): Promise<KeywordJob>;
  findAllKeywordJobs(): Promise<KeywordJob[]>;
  findAllKeywordJobsByStatus(status: string): Promise<KeywordJob[]>;
  updateStatusById(
    adzuna_id: string,
    status: string,
  ): Promise<KeywordJob | null>;
}
