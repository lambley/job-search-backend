import { Test, TestingModule } from '@nestjs/testing';
import { JobProcessorModule } from '../job-processor.module';
import { JobProcessorService } from '../../job-processor/job-processor.service';
import { PrismaJobRepository } from '../../repositories/prisma-job.repository';
import { mockPrismaJobRepository } from '../../../test/mocks/mockPrismaJobRepository';
import { PrismaService } from '../../prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from '../../../config/configuration';
import { getQueueToken } from '@nestjs/bull';

const mockQueue = {
  add: jest.fn(),
};

describe('JobProcessorModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        JobProcessorModule,
        ConfigModule.forRoot({
          envFilePath: ['.env'],
          load: [config],
          isGlobal: true,
        }),
      ],
      providers: [
        JobProcessorService,
        ConfigService,
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

  it('should be defined', async () => {
    expect(module).toBeDefined();
  });

  describe('imports', () => {
    it('should import BullModule', () => {
      const bullQueue = module.get(getQueueToken('jobQueue'));
      expect(bullQueue).toBeDefined();
    });
  });

  describe('providers', () => {
    it('should provide JobProcessorService', () => {
      const service = module.get<JobProcessorService>(JobProcessorService);
      expect(service).toBeDefined();
    });

    it('should provide PrismaJobRepository', () => {
      const service = module.get<PrismaJobRepository>(PrismaJobRepository);
      expect(service).toBeDefined();
    });

    it('should provide PrismaService', () => {
      const service = module.get<PrismaService>(PrismaService);
      expect(service).toBeDefined();
    });
  });

  describe('exports', () => {
    it('should export JobProcessorService', () => {
      const service = module.get<JobProcessorService>(JobProcessorService);
      expect(service).toBeDefined();
    });

    it('should export BullModule', () => {
      const bullQueue = module.get(getQueueToken('jobQueue'));
      expect(bullQueue).toBeDefined();
    });
  });
});
