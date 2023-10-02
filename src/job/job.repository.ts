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
  findAll(): Promise<Job[]>;
  updateById(id: string, data: Partial<Job>): Promise<Job | null>;
  deleteById(id: string): Promise<Job | null>;
}
