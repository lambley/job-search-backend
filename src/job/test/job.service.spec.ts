import { Test, TestingModule } from '@nestjs/testing';
import { JobService } from '../job.service';
import { ConfigService } from '@nestjs/config';
import {
  jobResultArrayFactory,
  jobResultFactory,
  jobDbResultsFactory,
} from './factories/jobFactory';
import axios from 'axios';
import { Logger } from '@nestjs/common';
import { PrismaJobRepository } from '../prisma-job.repository';
import { mockPrismaJobRepository } from '../../../test/mocks/mockPrismaRepository';
import { getQueueToken } from '@nestjs/bull';

jest.mock('axios');

const mockQueue = {
  add: jest.fn(),
};

jest.mock('node-cache', () => {
  return jest.fn().mockImplementation(() => {
    return {
      get: jest.fn(),
      set: jest.fn(),
    };
  });
});

const params = {
  results_per_page: 10,
  what: 'developer',
  where: 'london',
};

describe('JobService', () => {
  let service: JobService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobService,
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

    service = module.get<JobService>(JobService);

    jest.clearAllMocks();
  });

  describe('refreshJobs', () => {
    it('should be defined', () => {
      expect(service.refreshJobs).toBeDefined();
    });

    it('should return an array of jobs', async () => {
      const mockResponse = {
        data: {
          results: jobResultArrayFactory(params.results_per_page),
        },
      };
      (axios.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await service.refreshJobs(params);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toEqual(params.results_per_page);
    });

    it('should log the number of jobs found', async () => {
      const mockResponse = {
        data: {
          results: jobResultArrayFactory(params.results_per_page),
        },
      };
      (axios.get as jest.Mock).mockResolvedValue(mockResponse);

      const loggerSpy = jest.spyOn(Logger, 'log');

      const result = await service.refreshJobs(params);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toEqual(params.results_per_page);

      expect(loggerSpy).toHaveBeenCalledWith(
        `${result.length} job(s) found`,
        'JobService',
      );
    });

    it('should log an error message if the API call fails', async () => {
      (axios.get as jest.Mock).mockRejectedValue(new Error('API Error'));

      const loggerSpy = jest.spyOn(Logger, 'error');

      const result = await service.refreshJobs(params);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toEqual(0);

      expect(loggerSpy).toHaveBeenCalledWith(`~ API Error`);
    });

    it('should save the jobs to the database', async () => {
      const mockResponse = {
        data: {
          results: jobResultArrayFactory(params.results_per_page),
        },
      };
      (axios.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await service.refreshJobs(params);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toEqual(params.results_per_page);

      expect(mockPrismaJobRepository.create).toHaveBeenCalledTimes(
        params.results_per_page,
      );
    });
  });

  describe('getJobs', () => {
    it('should get jobs from the cache if available', async () => {
      const mockCacheResponse = jobResultArrayFactory(params.results_per_page);

      service.cache.get = jest.fn().mockReturnValue(mockCacheResponse);

      await service.getJobs(params);

      expect(service.cache.get).toHaveBeenCalledWith(
        `getJobs-${params.results_per_page}-${params.what}-${params.where}`,
      );
      expect(service.cache.get).toHaveBeenCalledTimes(1);
      expect(service.cache.get).toHaveReturnedWith(mockCacheResponse);
    });

    it('should fetch jobs from the database if not in the cache', async () => {
      const mockDbResponse = jobDbResultsFactory(params.results_per_page);

      mockPrismaJobRepository.findByTitleAndLocation.mockResolvedValue(
        mockDbResponse,
      );

      const result = await service.getJobs(params);

      expect(
        mockPrismaJobRepository.findByTitleAndLocation,
      ).toHaveBeenCalledWith(
        params.what,
        params.where,
        params.results_per_page,
      );

      expect(
        mockPrismaJobRepository.findByTitleAndLocation,
      ).toHaveBeenCalledTimes(1);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toEqual(params.results_per_page);
    });

    describe('getJobs logging', () => {
      it('should log the number of jobs found', async () => {
        const mockDbResponse = jobDbResultsFactory(params.results_per_page);

        mockPrismaJobRepository.findByTitleAndLocation.mockResolvedValue(
          mockDbResponse,
        );

        const loggerSpy = jest.spyOn(Logger, 'log');

        const result = await service.getJobs(params);

        expect(
          mockPrismaJobRepository.findByTitleAndLocation,
        ).toHaveBeenCalledWith(
          params.what,
          params.where,
          params.results_per_page,
        );

        expect(
          mockPrismaJobRepository.findByTitleAndLocation,
        ).toHaveBeenCalledTimes(1);

        expect(result).toBeInstanceOf(Array);
        expect(result.length).toEqual(params.results_per_page);

        expect(loggerSpy).toHaveBeenCalledWith(
          `${result.length} job(s) found`,
          'JobService',
        );
      });

      it('should log an error message if the database call fails', async () => {
        mockPrismaJobRepository.findByTitleAndLocation.mockRejectedValue(
          new Error('Database Error'),
        );

        const loggerSpy = jest.spyOn(Logger, 'error');

        const result = await service.getJobs(params);

        expect(
          mockPrismaJobRepository.findByTitleAndLocation,
        ).toHaveBeenCalledWith(
          params.what,
          params.where,
          params.results_per_page,
        );

        expect(
          mockPrismaJobRepository.findByTitleAndLocation,
        ).toHaveBeenCalledTimes(1);

        expect(result).toBeInstanceOf(Array);
        expect(result.length).toEqual(0);

        expect(loggerSpy).toHaveBeenCalledWith(`~ Database Error`);
      });
    });
  });

  describe('getJob', () => {
    it('should be defined', () => {
      expect(service.getJob).toBeDefined();
    });

    it('should return a job', async () => {
      const mockDbResponse = {
        data: jobResultFactory(),
      };
      mockPrismaJobRepository.findByAdzunaId.mockResolvedValue(mockDbResponse);

      const result = await service.getJob('1234567890');

      expect(mockPrismaJobRepository.findByAdzunaId).toHaveBeenCalledWith({
        where: { adzuna_id: '1234567890' },
      });
      expect(mockPrismaJobRepository.findByAdzunaId).toHaveBeenCalledTimes(1);

      expect(result).toBeInstanceOf(Object);
      expect(result['data']).toHaveProperty('id');
      expect(result['data']['id']).toEqual(1);
    });

    it('should log an error message if the API call fails', async () => {
      mockPrismaJobRepository.findByAdzunaId.mockRejectedValue(
        new Error('Database Error'),
      );
      const result = await service.getJob('1');

      expect(result.message).toEqual('Job with id 1 not found');
    });

    it('should log an error message if the database call fails', async () => {
      mockPrismaJobRepository.findByAdzunaId.mockRejectedValue(
        new Error('Database Error'),
      );

      const loggerSpy = jest.spyOn(Logger, 'error');

      const result = await service.getJob('1');

      expect(mockPrismaJobRepository.findByAdzunaId).toHaveBeenCalledWith({
        where: { adzuna_id: '1' },
      });
      expect(mockPrismaJobRepository.findByAdzunaId).toHaveBeenCalledTimes(1);

      expect(result).toBeInstanceOf(Object);
      expect(result['message']).toEqual('Job with id 1 not found');

      expect(loggerSpy).toHaveBeenCalledWith(`~ Database Error`);
    });
  });

  describe('getJobKeywords', () => {
    it('should be defined', () => {
      expect(service.getJobKeywords).toBeDefined();
    });

    it('should return an array of keywords', async () => {
      const mockDbResponse = jobResultFactory();

      mockPrismaJobRepository.findById.mockResolvedValue(mockDbResponse);

      const result = await service.getJobKeywords('1');

      expect(mockPrismaJobRepository.findById).toHaveBeenCalledWith('1');
      expect(mockPrismaJobRepository.findById).toHaveBeenCalledTimes(1);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toEqual(2);
    });

    it('should log an error message if the database call fails', async () => {
      mockPrismaJobRepository.findById.mockRejectedValue(
        new Error('Database Error'),
      );

      const loggerSpy = jest.spyOn(Logger, 'error');

      const result = await service.getJobKeywords('1');

      expect(mockPrismaJobRepository.findById).toHaveBeenCalledWith('1');
      expect(mockPrismaJobRepository.findById).toHaveBeenCalledTimes(1);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toEqual(0);

      expect(loggerSpy).toHaveBeenCalledWith(`~ Database Error`);
    });
  });

  describe('getJobsByTitle', () => {
    it('should return an array of jobs', async () => {
      const mockDbResponse = jobDbResultsFactory(params.results_per_page);

      mockPrismaJobRepository.findByTitle.mockResolvedValue(mockDbResponse);

      const result = await service.getJobsByTitle(params.what);

      expect(mockPrismaJobRepository.findByTitle).toHaveBeenCalledWith(
        params.what,
      );
      expect(mockPrismaJobRepository.findByTitle).toHaveBeenCalledTimes(1);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toEqual(params.results_per_page);
    });
  });
});
