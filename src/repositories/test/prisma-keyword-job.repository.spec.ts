import { Test, TestingModule } from '@nestjs/testing';
import { PrismaKeywordJobRepository } from '../prisma-keyword-job.repository';
import { PrismaService } from '../../prisma.service';
import {
  KeywordJobRequest,
  KeywordJobCreateRequest,
} from '../../job-processor/types/job-processor.interface';
import { KeywordJob, KeywordJobStatus } from '@prisma/client';

const mockCreateKeywordJob: KeywordJobRequest = {
  description: 'description',
  adzuna_id: '1234',
};

const mockDbRequestKeywordJob: KeywordJobCreateRequest = {
  ...mockCreateKeywordJob,
  status: KeywordJobStatus.PENDING,
};

const mockDbResponseKeywordJob: KeywordJob = {
  ...mockDbRequestKeywordJob,
  id: 1,
  jobId: null,
};

describe('PrismaKeywordJobRepository', () => {
  let service: PrismaKeywordJobRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaKeywordJobRepository, PrismaService],
    }).compile();

    service = module.get<PrismaKeywordJobRepository>(
      PrismaKeywordJobRepository,
    );
  });

  it('should create a keyword job', async () => {
    const keywordJobSpy = jest
      .spyOn(service, 'create')
      .mockResolvedValue(mockDbResponseKeywordJob);

    const createdKeywordJob: KeywordJob =
      await service.create(mockCreateKeywordJob);

    expect(keywordJobSpy).toHaveBeenCalledTimes(1);
    expect(createdKeywordJob).toEqual(mockDbResponseKeywordJob);
  });

  it('should find all keyword jobs', async () => {
    const keywordJobSpy = jest
      .spyOn(service, 'findAllKeywordJobs')
      .mockResolvedValue([mockDbResponseKeywordJob]);

    const keywordJobs: KeywordJob[] = await service.findAllKeywordJobs();

    expect(keywordJobSpy).toHaveBeenCalledTimes(1);
    expect(keywordJobs).toEqual([mockDbResponseKeywordJob]);
  });

  it('should find all keyword jobs by status', async () => {
    const keywordJobSpy = jest
      .spyOn(service, 'findAllKeywordJobsByStatus')
      .mockResolvedValue([mockDbResponseKeywordJob]);

    const keywordJobs: KeywordJob[] =
      await service.findAllKeywordJobsByStatus('status');

    expect(keywordJobSpy).toHaveBeenCalledTimes(1);
    expect(keywordJobs).toEqual([mockDbResponseKeywordJob]);
  });

  it('should update keyword job status by id', async () => {
    const keywordJobSpy = jest
      .spyOn(service, 'updateStatusById')
      .mockResolvedValue(mockDbResponseKeywordJob);

    const keywordJob: KeywordJob = await service.updateStatusById(
      'adzuna_id',
      'status',
    );

    expect(keywordJobSpy).toHaveBeenCalledTimes(1);
    expect(keywordJob).toEqual(mockDbResponseKeywordJob);
  });
});
