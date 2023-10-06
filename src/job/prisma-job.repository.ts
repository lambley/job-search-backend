import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Job } from '@prisma/client';
import { JobDBCreateRequest } from './types/job.interface';
import { JobRepository } from './job.repository';

type findUniqueArgs = {
  where: {
    adzuna_id: string;
  };
};

@Injectable()
export class PrismaJobRepository implements JobRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: JobDBCreateRequest): Promise<Job> {
    return this.prisma.job.create({
      data,
    });
  }

  async findById(id: string): Promise<Job | null> {
    return this.prisma.job.findUnique({
      where: { id: parseInt(id) },
    });
  }

  async findByAdzunaId(data: findUniqueArgs): Promise<Job | null> {
    return this.prisma.job.findUnique(data);
  }

  async findAll(): Promise<Job[]> {
    return this.prisma.job.findMany();
  }

  async updateById(id: string, data: Partial<Job>): Promise<Job | null> {
    return this.prisma.job.update({
      where: { id: parseInt(id) },
      data,
    });
  }

  async deleteById(id: string): Promise<Job | null> {
    return this.prisma.job.delete({
      where: { id: parseInt(id) },
    });
  }

  async getKeywords(id: string): Promise<string[]> {
    const job = await this.prisma.job.findUnique({
      where: { id: parseInt(id) },
    });

    return job.processed_keywords || [];
  }

  async saveKeywords(id: string, keywords: string[]): Promise<void> {
    await this.prisma.job.update({
      where: { id: parseInt(id) },
      data: {
        processed_keywords: {
          set: keywords,
        },
      },
    });
  }
}
