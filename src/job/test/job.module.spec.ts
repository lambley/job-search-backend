import { Test, TestingModule } from '@nestjs/testing';
import { JobModule } from '../job.module';
import { JobController } from '../job.controller';
import { JobService } from '../job.service';
import { PrismaJobRepository } from '../prisma-job.repository';
import { mockPrismaJobRepository } from './mocks/mockPrismaRepository';
import { JobProcessorService } from '../../job-processor/job-processor.service';
import { PrismaService } from '../../prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from '../../../config/configuration';
import { getQueueToken } from '@nestjs/bull';

const mockQueue = {
  add: jest.fn(),
};

describe('JobModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        JobModule,
        ConfigModule.forRoot({
          envFilePath: ['.env'],
          load: [config],
          isGlobal: true,
        }),
      ],
      controllers: [JobController],
      providers: [
        JobService,
        ConfigService,
        JobProcessorService,
        PrismaService,
        PrismaJobRepository,
        {
          provide: getQueueToken('jobQueue'),
          useValue: mockQueue,
        },
      ],
    })
      .overrideProvider(PrismaJobRepository)
      .useValue(mockPrismaJobRepository)
      .compile();
  });
  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  describe('JobModule imports', () => {
    it('should import the JobProcessorModule', () => {
      const service = module.get<JobProcessorService>(JobProcessorService);
      expect(service).toBeDefined();
    });

    it('should import the BullModule', () => {
      const bullQueue = module.get(getQueueToken('jobQueue'));
      expect(bullQueue).toBeDefined();
    });
  });

  describe('JobModule providers', () => {
    it('should provide the JobController', () => {
      const controller = module.get<JobController>(JobController);
      expect(controller).toBeDefined();
    });

    it('should provide the JobService', () => {
      const service = module.get<JobService>(JobService);
      expect(service).toBeDefined();
    });

    it('should provide the PrismaServices', () => {
      const service = module.get<PrismaService>(PrismaService);
      expect(service).toBeDefined();

      const repository = module.get<PrismaJobRepository>(PrismaJobRepository);
      expect(repository).toBeDefined();
    });

    it('should provide the JobProcessorService', () => {
      const service = module.get<JobProcessorService>(JobProcessorService);
      expect(service).toBeDefined();
    });
  });

  describe('JobModule exports', () => {
    it('should export the JobService', () => {
      const service = module.get<JobService>(JobService);
      expect(service).toBeDefined();
    });
  });
});
