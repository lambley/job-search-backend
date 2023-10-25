import { Test, TestingModule } from '@nestjs/testing';
import { JobConsumerService } from '../job-consumer.service';
import { JobProcessorService } from '../../job-processor/job-processor.service';
import { PrismaJobRepository } from '../../job/prisma-job.repository';
import { mockPrismaJobRepository } from '../../../test/mocks/mockPrismaRepository';

describe('JobConsumerService', () => {
  let service: JobConsumerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobConsumerService, JobProcessorService, PrismaJobRepository],
    })
      .overrideProvider(PrismaJobRepository)
      .useValue(mockPrismaJobRepository)
      .compile();

    service = module.get<JobConsumerService>(JobConsumerService);
  })

  describe('processJob', () => {
    it('should be defined', () => {
      expect(service.processJob).toBeDefined();
    });
  });
});
