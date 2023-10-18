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
import { mockPrismaJobRepository } from '../../../test/mocks/mockPrismaRepository';
import { getQueueToken } from '@nestjs/bull';
import { ResponseDTO } from '../dto/response.dto';

const mockQueue = {
  add: jest.fn(),
};

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
        {
          provide: getQueueToken('jobQueue'),
          useValue: mockQueue,
        },
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
      const response = jobResultArrayFactory(10);

      const expectedResponse = new ResponseDTO(response, response.length);

      jest.spyOn(jobService, 'getJobs').mockResolvedValue(response);

      const result = await jobController.getJobs(query);
      expect(result).toEqual(expectedResponse);
    });

    it('should return a response with a count of 0 if no jobs are found', async () => {
      const query = {
        results_per_page: 10,
        what: 'keyword',
        where: 'location',
      };
      const response = [];

      const expectedResponse = new ResponseDTO(response, response.length);

      jest.spyOn(jobService, 'getJobs').mockResolvedValue(response);

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

  // describe('processJob', () => {
  //   it('should process a job description', async () => {
  //     const jobData = { description: 'Job description here' };

  //     jest
  //       .spyOn(jobProcessorService, 'processJobDescription')
  //       .mockResolvedValue([jobData.description]);

  //     await jobController.processJob(jobData);
  //     expect(jobProcessorService.processJobDescription).toHaveBeenCalledWith(
  //       jobData.description,
  //     );
  //   });
  // });
});
