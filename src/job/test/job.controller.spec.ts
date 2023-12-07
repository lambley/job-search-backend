import { Test, TestingModule } from '@nestjs/testing';
import { JobController } from '../job.controller';
import { JobService } from '../job.service';
import { JobProcessorService } from '../../job-processor/job-processor.service';
import {
  jobResultArrayFactory,
  jobResultFactory,
  jobDbResultsFactory,
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
  });

  describe('refreshJobs', () => {
    it('should return an array of job responses', async () => {
      const query = {
        results_per_page: 10,
        what: 'keyword',
        where: 'location',
      };
      const response = jobResultArrayFactory(10);

      const expectedResponse = new ResponseDTO(response, response.length);

      jest.spyOn(jobService, 'refreshJobs').mockResolvedValue(response);

      const result = await jobController.refreshJobs(query);
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

      jest.spyOn(jobService, 'refreshJobs').mockResolvedValue(response);

      const result = await jobController.refreshJobs(query);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('getJobs', () => {
    describe('when query params are present', () => {
      let query;

      beforeEach(() => {
        query = {
          results_per_page: 10,
          what: 'keyword',
          where: 'location',
          force_update: 'false',
        };
      });

      afterEach(() => {
        query = null;
      });

      describe('when force_update is false', () => {
        it('should return an array of job responses', async () => {
          const response = jobDbResultsFactory(10);

          const expectedResponse = new ResponseDTO(response, response.length);

          jest.spyOn(jobService, 'getJobs').mockResolvedValue(response);

          const result = await jobController.getJobs(query);
          expect(result).toEqual(expectedResponse);
        });

        it('should return a response with a count of 0 if no jobs are found', async () => {
          const response = [];

          const expectedResponse = new ResponseDTO(response, response.length);

          jest.spyOn(jobService, 'getJobs').mockResolvedValue(response);

          const result = await jobController.getJobs(query);
          expect(result).toEqual(expectedResponse);
        });
      });

      describe('when force_update is true', () => {
        it('should return an array of job responses', async () => {
          query.force_update = 'true';
          const response = jobDbResultsFactory(10);

          const expectedResponse = new ResponseDTO(response, response.length);

          jest.spyOn(jobService, 'getJobs').mockResolvedValue(response);

          const result = await jobController.getJobs(query);

          expect(result).toEqual(expectedResponse);
        });

        it('should return a response with a count of 0 if no jobs are found', async () => {
          query.force_update = 'true';
          const response = [];

          const expectedResponse = new ResponseDTO(response, response.length);

          jest.spyOn(jobService, 'getJobs').mockResolvedValue(response);

          const result = await jobController.getJobs(query);
          expect(result).toEqual(expectedResponse);
        });
      });
    });

    describe('when query params are not present', () => {
      let query;

      beforeEach(() => {
        query = {
          force_update: 'false',
        };
      });

      afterEach(() => {
        query = null;
      });

      describe('when force_update is false', () => {
        it('should return an array of job responses', async () => {
          const response = jobDbResultsFactory(10);

          const expectedResponse = new ResponseDTO(response, response.length);

          jest.spyOn(jobService, 'getAllJobs').mockResolvedValue(response);

          const result = await jobController.getJobs(query);
          expect(result).toEqual(expectedResponse);
        });

        it('should return a response with a count of 0 if no jobs are found', async () => {
          const response = [];

          const expectedResponse = new ResponseDTO(response, response.length);

          jest.spyOn(jobService, 'getAllJobs').mockResolvedValue(response);

          const result = await jobController.getJobs(query);
          expect(result).toEqual(expectedResponse);
        });
      });

      describe('when force_update is true', () => {
        it('should return an array of job responses', async () => {
          query.force_update = 'true';
          const response = jobDbResultsFactory(10);

          const expectedResponse = new ResponseDTO(response, response.length);

          jest.spyOn(jobService, 'getAllJobs').mockResolvedValue(response);

          const result = await jobController.getJobs(query);
          expect(result).toEqual(expectedResponse);
        });

        it('should return a response with a count of 0 if no jobs are found', async () => {
          query.force_update = 'true';
          const response = [];

          const expectedResponse = new ResponseDTO(response, response.length);

          jest.spyOn(jobService, 'getAllJobs').mockResolvedValue(response);

          const result = await jobController.getJobs(query);
          expect(result).toEqual(expectedResponse);
        });
      });
    });
  });

  describe('getJobsByTitle', () => {
    it('should return an array of job responses', async () => {
      const mockResponse = jobDbResultsFactory(10);
      const title = 'Software Engineer';

      const expectedResponse = new ResponseDTO(
        mockResponse,
        mockResponse.length,
      );

      jest.spyOn(jobService, 'getJobsByTitle').mockResolvedValue(mockResponse);

      const result = await jobController.getJobsByTitle(title);
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

  describe('getJobKeywords', () => {
    it('should return an array of keywords for a job by ID', async () => {
      const mockResponse = ['keyword1', 'keyword2', 'keyword3'];
      const id = '1234567890';

      const expectedResponse = new ResponseDTO(
        mockResponse,
        mockResponse.length,
      );

      jest.spyOn(jobService, 'getJobKeywords').mockResolvedValue(mockResponse);

      const result = await jobController.getJobKeywords(id);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('getTopKeywords', () => {
    let mockResponse, limit, defaultLimit;

    beforeEach(() => {
      mockResponse = [
        'keyword1',
        'keyword2',
        'keyword3',
        'keyword4',
        'keyword5',
        'keyword6',
        'keyword7',
        'keyword8',
        'keyword9',
        'keyword10',
        'keyword11',
      ];
      limit = 5;
      defaultLimit = 10;
    });

    afterEach(() => {
      mockResponse = null;
    });
    describe('when limit is not present', () => {
      it('should return an array of keywords of default length', async () => {
        const expectedResponse = new ResponseDTO(
          mockResponse.slice(0, defaultLimit),
          defaultLimit,
        );

        jest
          .spyOn(jobService, 'getTopKeywords')
          .mockResolvedValue(mockResponse.slice(0, defaultLimit));

        const result = await jobController.getTopKeywords({});

        expect(result).toEqual(expectedResponse);
        expect(jobService.getTopKeywords).toHaveBeenCalledWith(
          defaultLimit,
          'false',
        );
        expect(result.data.length).toEqual(defaultLimit);
      });
    });

    describe('when limit is present', () => {
      it('should return an array of keywords of specified length', async () => {
        const expectedResponse = new ResponseDTO(
          mockResponse.slice(0, limit),
          limit,
        );

        jest
          .spyOn(jobService, 'getTopKeywords')
          .mockResolvedValue(mockResponse.slice(0, limit));

        const result = await jobController.getTopKeywords({ limit: limit });
        expect(result).toEqual(expectedResponse);
        expect(jobService.getTopKeywords).toHaveBeenCalledWith(limit, 'false');
        expect(result.data.length).toEqual(limit);
      });
    });

    describe('when force_update is false', () => {
      it('should return an array of keywords of default length', async () => {
        const expectedResponse = new ResponseDTO(
          mockResponse.slice(0, defaultLimit),
          defaultLimit,
        );

        jest
          .spyOn(jobService, 'getTopKeywords')
          .mockResolvedValue(mockResponse.slice(0, defaultLimit));

        const result = await jobController.getTopKeywords({
          force_update: 'false',
        });
        expect(result).toEqual(expectedResponse);
        expect(jobService.getTopKeywords).toHaveBeenCalledWith(
          defaultLimit,
          'false',
        );
        expect(result.data.length).toEqual(defaultLimit);
      });

      it('should return an array of keywords of specified length', async () => {
        const expectedResponse = new ResponseDTO(
          mockResponse.slice(0, limit),
          limit,
        );

        jest
          .spyOn(jobService, 'getTopKeywords')
          .mockResolvedValue(mockResponse.slice(0, limit));

        const result = await jobController.getTopKeywords({
          limit: limit,
          force_update: 'false',
        });
        expect(result).toEqual(expectedResponse);
        expect(jobService.getTopKeywords).toHaveBeenCalledWith(limit, 'false');
        expect(result.data.length).toEqual(limit);
      });
    });

    describe('when force_update is true', () => {
      it('should return an array of keywords of default length', async () => {
        const expectedResponse = new ResponseDTO(
          mockResponse.slice(0, defaultLimit),
          defaultLimit,
        );

        jest
          .spyOn(jobService, 'getTopKeywords')
          .mockResolvedValue(mockResponse.slice(0, defaultLimit));

        const result = await jobController.getTopKeywords({
          force_update: 'true',
        });
        expect(result).toEqual(expectedResponse);
        expect(jobService.getTopKeywords).toHaveBeenCalledWith(
          defaultLimit,
          'true',
        );
        expect(result.data.length).toEqual(defaultLimit);
      });

      it('should return an array of keywords of specified length', async () => {
        const expectedResponse = new ResponseDTO(
          mockResponse.slice(0, limit),
          limit,
        );

        jest
          .spyOn(jobService, 'getTopKeywords')
          .mockResolvedValue(mockResponse.slice(0, limit));

        const result = await jobController.getTopKeywords({
          limit: limit,
          force_update: 'true',
        });
        expect(result).toEqual(expectedResponse);
        expect(jobService.getTopKeywords).toHaveBeenCalledWith(limit, 'true');
        expect(result.data.length).toEqual(limit);
      });
    });
  });
});
