import { Test, TestingModule } from '@nestjs/testing';
import { PrismaJobRepository } from '../../repositories/prisma-job.repository';
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

  it('should find a job by id', async () => {
    const jobSpy = jest
      .spyOn(service, 'findById')
      .mockResolvedValue(mockDbResponseJob);

    const foundJob: JobDbResponse = await service.findById('1');

    expect(jobSpy).toHaveBeenCalledTimes(1);
    expect(foundJob).toEqual(mockDbResponseJob);
  });

  it('should find a job by adzuna_id', async () => {
    const jobSpy = jest
      .spyOn(service, 'findByAdzunaId')
      .mockResolvedValue(mockDbResponseJob);

    const foundJob: JobDbResponse = await service.findByAdzunaId({
      where: { adzuna_id: 'adzuna_id' },
    });

    expect(jobSpy).toHaveBeenCalledTimes(1);
    expect(foundJob).toEqual(mockDbResponseJob);
  });

  it('should find all jobs', async () => {
    const jobSpy = jest
      .spyOn(service, 'findAll')
      .mockResolvedValue([mockDbResponseJob]);

    const foundJobs: JobDbResponse[] = await service.findAll();

    expect(jobSpy).toHaveBeenCalledTimes(1);
    expect(foundJobs).toEqual([mockDbResponseJob]);
  });

  it('should update a job by id', async () => {
    const jobSpy = jest
      .spyOn(service, 'updateById')
      .mockResolvedValue(mockDbResponseJob);

    const updatedJob: JobDbResponse = await service.updateById('1', {
      title: 'updated title',
    });

    expect(jobSpy).toHaveBeenCalledTimes(1);
    expect(updatedJob).toEqual(mockDbResponseJob);
  });

  it('should delete a job by id', async () => {
    const jobSpy = jest
      .spyOn(service, 'deleteById')
      .mockResolvedValue(mockDbResponseJob);

    const deletedJob: JobDbResponse = await service.deleteById('1');

    expect(jobSpy).toHaveBeenCalledTimes(1);
    expect(deletedJob).toEqual(mockDbResponseJob);
  });

  it('should get keywords by id', async () => {
    const jobSpy = jest
      .spyOn(service, 'getKeywords')
      .mockResolvedValue(['keyword']);

    const keywords: string[] = await service.getKeywords('1');

    expect(jobSpy).toHaveBeenCalledTimes(1);
    expect(keywords).toEqual(['keyword']);
  });
});
