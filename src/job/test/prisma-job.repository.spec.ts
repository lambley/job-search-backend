import { Test, TestingModule } from '@nestjs/testing';
import { PrismaJobRepository } from '../prisma-job.repository';
import { PrismaService } from '../../prisma.service';
import { JobDBCreateRequest, JobDbResponse } from '../types/job.interface';

const mockCreateJob: JobDBCreateRequest = {
  adzuna_id: 'adzuna_id',
  title: 'title',
  location: ['location'],
  description: 'description',
  created: 'created',
  company: 'company',
  salary_min: 0,
  salary_max: 0,
  contract_type: 'contract_type',
  category: 'category',
};

const mockDbResponseJob = {
  id: 1,
  adzuna_id: 'adzuna_id',
  title: 'title',
  location: ['location'],
  description: 'description',
  created: 'created',
  company: 'company',
  salary_min: 0,
  salary_max: 0,
  contract_type: 'contract_type',
  category: 'category',
  message: 'message',
  processed_keywords: ['processed_keywords'],
};

describe('PrismaJobRepository', () => {
  let service: PrismaJobRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaJobRepository, PrismaService],
    }).compile();

    service = module.get<PrismaJobRepository>(PrismaJobRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a job', async () => {
    const jobSpy = jest
      .spyOn(service, 'create')
      .mockResolvedValue(mockDbResponseJob);

    const createdJob: JobDbResponse = await service.create(mockCreateJob);

    expect(jobSpy).toHaveBeenCalledTimes(1);
    expect(createdJob).toEqual(mockDbResponseJob);
  });

  it('should find a job by id', async () => {});

  it('should find a job by adzuna_id', async () => {});

  it('should find all jobs', async () => {});

  it('should update a job by id', async () => {});

  it('should delete a job by id', async () => {});

  it('should get keywords by id', async () => {});
});