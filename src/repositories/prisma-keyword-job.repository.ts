import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { KeywordJob, KeywordJobStatus } from '@prisma/client';
import {
  KeywordJobCreateRequest,
  KeywordJobRequest,
} from '../job-processor/types/job-processor.interface';
import { KeywordJobRepository } from './keyword-job.repository';

@Injectable()
export class PrismaKeywordJobRepository implements KeywordJobRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: KeywordJobRequest): Promise<KeywordJob> {
    const keywordJob: KeywordJobCreateRequest = {
      ...data,
      status: KeywordJobStatus.PENDING,
    };
    return this.prisma.keywordJob.create({
      data: keywordJob,
    });
  }

  async findAllKeywordJobs(): Promise<KeywordJob[]> {
    return this.prisma.keywordJob.findMany();
  }

  async findAllKeywordJobsByStatus(status: string): Promise<KeywordJob[]> {
    this.checkStatus(status);

    return this.prisma.keywordJob.findMany({
      where: {
        status: status as KeywordJobStatus,
      },
    });
  }

  async updateStatusById(
    adzuna_id: string,
    status: string,
  ): Promise<KeywordJob | null> {
    this.checkStatus(status);

    return this.prisma.keywordJob.update({
      where: {
        adzuna_id,
      },
      data: {
        status: status as KeywordJobStatus,
      },
    });
  }

  // throw error if status is not valid
  private checkStatus(status: string): void {
    const statusValues = Object.values(KeywordJobStatus);

    if (!statusValues.includes(status as KeywordJobStatus)) {
      throw new Error(`Invalid status: ${status}`);
    }
  }
}
