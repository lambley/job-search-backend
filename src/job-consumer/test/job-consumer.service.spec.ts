import { Test, TestingModule } from '@nestjs/testing';
import { JobConsumerService } from '../job-consumer.service';
import { JobProcessorService } from '../../job-processor/job-processor.service';
import { PrismaJobRepository } from '../../repositories/prisma-job.repository';
import { mockPrismaJobRepository } from '../../../test/mocks/mockPrismaJobRepository';

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
  });

  describe('processJob', () => {
    it('should be defined', () => {
      expect(service.processJob).toBeDefined();
    });

    it('should call jobProcessorService.processJobDescription', async () => {
      const spy = jest.spyOn(
        service['jobProcessorService'],
        'processJobDescription',
      );
      await service.processJob({
        description: 'test',
        id: '1',
        adzuna_id: 'test',
      });
      expect(spy).toHaveBeenCalled();

      expect(spy).toHaveBeenCalledWith({
        description: 'test',
        id: '1',
        adzuna_id: 'test',
      });
    });
  });
});
