import { Job } from '@prisma/client';

type findUniqueArgs = {
  where: {
    adzuna_id: string;
  };
};

export interface JobRepository {
  create(data: Partial<Job>): Promise<Job>;
  findById(id: string): Promise<Job | null>;
  findByAdzunaId(data: findUniqueArgs): Promise<Job | null>;
  findByTitleAndLocation(
    title: string,
    location: string,
    take: number,
  ): Promise<Job[]>;
  findAll(): Promise<Job[]>;
  findRecent(take: number): Promise<Job[]>;
  updateById(id: string, data: Partial<Job>): Promise<Job | null>;
  deleteById(id: string): Promise<Job | null>;
  getKeywords(id: string): Promise<string[]>;
  saveKeywords(id: string, keywords: string[]): Promise<void>;
  findByTitle(title: string): Promise<Job[]>;
}
