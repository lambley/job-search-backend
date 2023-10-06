import { Test, TestingModule } from '@nestjs/testing';
import { JobController } from '../job.controller';
import { JobService } from '../job.service';
import { JobProcessorService } from '../../job-processor/job-processor.service';
import {
  jobResultArrayFactory,
  jobResultFactory,
} from './factories/jobFactory';
import { ConfigService } from '@nestjs/config';
import { PrismaJobRepository } from '../prisma-job.repository';
import { mockPrismaJobRepository } from './mocks/mockPrismaRepository';

describe('JobController', () => {
  let jobController: JobController;
  let jobService: JobService;
  let jobProcessorService: JobProcessorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobController],
      providers: [
        JobService,
        JobProcessorService,
        ConfigService,
        PrismaJobRepository,
      ],
    })
      .overrideProvider(PrismaJobRepository)
      .useValue(mockPrismaJobRepository)
      .compile();

    jobController = module.get<JobController>(JobController);
    jobService = module.get<JobService>(JobService);
    jobProcessorService = module.get<JobProcessorService>(JobProcessorService);
  });

  describe('getJobs', () => {
    it('should return an array of job responses', async () => {
      const query = {
        results_per_page: 10,
        what: 'keyword',
        where: 'location',
      };
      const expectedResponse = jobResultArrayFactory(10);

      jest.spyOn(jobService, 'getJobs').mockResolvedValue(expectedResponse);

      const result = await jobController.getJobs(query);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('getJob', () => {
    it('should return a job response by ID', async () => {
      const mockResponse = jobResultFactory();
      const adzunaId = '1234567890';

      jest.spyOn(jobService, 'getJob').mockResolvedValue(mockResponse);

      const result = await jobController.getJob(adzunaId);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('processJob', () => {
    it('should process a job description', async () => {
      const jobData = { description: 'Job description here' };

      jest
        .spyOn(jobProcessorService, 'processJobDescription')
        .mockResolvedValue([jobData.description]);

      await jobController.processJob(jobData);
      expect(jobProcessorService.processJobDescription).toHaveBeenCalledWith(
        jobData.description,
      );
    });
  });
});
