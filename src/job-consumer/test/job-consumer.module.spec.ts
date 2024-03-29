import { Test, TestingModule } from '@nestjs/testing';
import { JobConsumerModule } from '../job-consumer.module';
import { JobProcessorModule } from '../../job-processor/job-processor.module';
import { PrismaKeywordJobRepository } from '../../repositories/prisma-keyword-job.repository';
import { PrismaService } from '../../prisma.service';
import { JobConsumerService } from '../job-consumer.service';
import { JobConsumerProcessor } from '../job-consumer.processor';

describe('JobConsumerModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [JobConsumerModule, JobProcessorModule],
      providers: [
        JobConsumerService,
        JobConsumerProcessor,
        PrismaKeywordJobRepository,
        PrismaService,
      ],
    }).compile();
  });

  describe('imports', () => {
    it('should import JobProcessorModule', () => {
      const jobProcessorModule = module.get(JobConsumerModule);
      expect(jobProcessorModule).toBeDefined();
    });

    it('should import JobConsumerModule', () => {
      const jobConsumerModule = module.get(JobProcessorModule);
      expect(jobConsumerModule).toBeDefined();
    });
  });

  describe('providers', () => {
    it('should provide JobConsumerService', () => {
      const service = module.get(JobConsumerModule);
      expect(service).toBeDefined();
    });

    it('should provide JobConsumerProcessor', () => {
      const service = module.get(JobConsumerProcessor);
      expect(service).toBeDefined();
    });
  });
});
