import { Test, TestingModule } from '@nestjs/testing';
import { JobConsumerProcessor } from '../job-consumer.processor';
import { JobProcessorService } from '../../job-processor/job-processor.service';
import { PrismaKeywordJobRepository } from '../../repositories/prisma-keyword-job.repository';
import { mockPrismaKeywordJobRepository } from '../../../test/mocks/mockPrismaKeywordJobRepository';
import { QueueJobData } from '../../types/job-process-data';

describe('JobConsumerProcessor', () => {
  let jobConsumerProcessor: JobConsumerProcessor;
  let jobProcessorService: JobProcessorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobConsumerProcessor,
        {
          provide: JobProcessorService,
          useValue: {
            processJobDescription: jest.fn(),
            saveKeywordsToDatabase: jest.fn(),
          },
        },
        PrismaKeywordJobRepository,
      ],
    })
      .overrideProvider(PrismaKeywordJobRepository)
      .useValue(mockPrismaKeywordJobRepository)
      .compile();

    jobConsumerProcessor =
      module.get<JobConsumerProcessor>(JobConsumerProcessor);
    jobProcessorService = module.get<JobProcessorService>(JobProcessorService);
  });

  it('should handle processJob', async () => {
    const data: QueueJobData = {
      name: 'testQueue',
      data: {
        description: 'Test Description',
        id: '1',
        adzuna_id: '123',
      },
      opts: {
        attempts: 3,
        delay: 1000,
        timestamp: 1234567890,
      },
      timestamp: 1234567890,
      delay: 1000,
      priority: 1,
    };

    const processJobDescriptionMock = jest
      .fn()
      .mockResolvedValue(['keyword1', 'keyword2']);

    jobProcessorService.processJobDescription = processJobDescriptionMock;

    await jobConsumerProcessor.handleProcessJob(data);

    expect(jobProcessorService.processJobDescription).toHaveBeenCalledWith({
      description: 'Test Description',
      id: '1',
      adzuna_id: '123',
    });

    expect(jobProcessorService.saveKeywordsToDatabase).toHaveBeenCalledWith(
      '1',
      ['keyword1', 'keyword2'],
    );
  });
});
