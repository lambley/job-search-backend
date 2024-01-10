import { Test, TestingModule } from '@nestjs/testing';
import { JobService } from '../job.service';
import { ConfigService } from '@nestjs/config';
import { CacheService } from '../../shared/cache.service';
import {
  jobResultArrayFactory,
  jobResultFactory,
  jobDbResultsFactory,
} from './factories/jobFactory';
import axios from 'axios';
import { Logger } from '@nestjs/common';
import { PrismaJobRepository } from '../../repositories/prisma-job.repository';
import { mockPrismaJobRepository } from '../../../test/mocks/mockPrismaJobRepository';
import { getQueueToken } from '@nestjs/bull';

jest.mock('axios');

const mockQueue = {
  add: jest.fn(),
};

const params = {
  results_per_page: 10,
  what: 'developer',
  where: 'london',
};

describe('JobService', () => {
  let service: JobService;
  let cacheService: CacheService;

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
        {
          provide: CacheService,
          useFactory: () => ({
            createCache: jest.fn(),
            getAllCaches: jest.fn(),
            getAllCacheKeys: jest.fn(),
            getCache: jest.fn(),
            setCache: jest.fn(),
            deleteCache: jest.fn(),
            clearCache: jest.fn(),
          }),
        },
      ],
    })
      .overrideProvider(PrismaJobRepository)
      .useValue(mockPrismaJobRepository)
      .compile();

    service = module.get<JobService>(JobService);
    cacheService = module.get<CacheService>(CacheService);

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

      cacheService.getCache = jest.fn().mockReturnValue(mockCacheResponse);

      await service.getJobs(params);

      expect(cacheService.getCache).toHaveBeenCalledWith('getJobs');
      expect(cacheService.getCache).toHaveBeenCalledTimes(1);
      expect(cacheService.getCache).toHaveReturnedWith(mockCacheResponse);
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

    describe('getAllJobs - getJobs when no params are passed', () => {
      it('should get all jobs from the database', async () => {
        const mockDbResponse = jobDbResultsFactory(30);

        mockPrismaJobRepository.findAll.mockResolvedValue(mockDbResponse);

        const result = await service.getAllJobs();

        expect(mockPrismaJobRepository.findAll).toHaveBeenCalledWith();
        expect(mockPrismaJobRepository.findAll).toHaveBeenCalledTimes(1);
        expect(result).toBeInstanceOf(Array);
        expect(result.length).toEqual(30);
      });

      it('should log the number of jobs found', async () => {
        const mockDbResponse = jobDbResultsFactory(30);

        mockPrismaJobRepository.findAll.mockResolvedValue(mockDbResponse);

        const loggerSpy = jest.spyOn(Logger, 'log');

        const result = await service.getAllJobs();

        expect(mockPrismaJobRepository.findAll).toHaveBeenCalledWith();
        expect(mockPrismaJobRepository.findAll).toHaveBeenCalledTimes(1);
        expect(result).toBeInstanceOf(Array);
        expect(result.length).toEqual(30);

        expect(loggerSpy).toHaveBeenCalledWith(
          `${result.length} job(s) found`,
          'JobService',
        );
      });

      it('should log an error message if the database call fails', async () => {
        mockPrismaJobRepository.findAll.mockRejectedValue(
          new Error('Database Error'),
        );

        const loggerSpy = jest.spyOn(Logger, 'error');

        const result = await service.getAllJobs();

        expect(mockPrismaJobRepository.findAll).toHaveBeenCalledWith();
        expect(mockPrismaJobRepository.findAll).toHaveBeenCalledTimes(1);

        expect(result).toBeInstanceOf(Array);
        expect(result.length).toEqual(0);

        expect(loggerSpy).toHaveBeenCalledWith(`~ Database Error`);
      });

      it('should cache the jobs for 1 hour', async () => {
        const mockDbResponse = jobDbResultsFactory(2);

        mockPrismaJobRepository.findAll.mockResolvedValue(mockDbResponse);

        const result = await service.getAllJobs();

        expect(mockPrismaJobRepository.findAll).toHaveBeenCalledWith();
        expect(mockPrismaJobRepository.findAll).toHaveBeenCalledTimes(1);
        expect(result).toBeInstanceOf(Array);
        expect(result.length).toEqual(2);

        expect(cacheService.setCache).toHaveBeenCalledWith(
          `getAllJobs`,
          mockDbResponse,
        );
      });
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

    describe('when limit is not passed', () => {
      it('should return an array of keywords of default length', async () => {
        const mockCacheResponse = mockResponse.slice(0, defaultLimit);

        cacheService.getCache = jest.fn().mockReturnValue(mockCacheResponse);

        const result = await service.getTopKeywords();

        expect(cacheService.getCache).toHaveBeenCalledWith(
          `getTopKeywords-${defaultLimit}`,
        );
        expect(cacheService.getCache).toHaveBeenCalledTimes(1);
        expect(cacheService.getCache).toHaveReturnedWith(mockCacheResponse);

        expect(result).toBeInstanceOf(Array);
        expect(result.length).toEqual(defaultLimit);
      });
    });
    describe('when limit is passed', () => {
      it('should return an array of keywords of specified length', async () => {
        const mockCacheResponse = mockResponse.slice(0, limit);

        cacheService.getCache = jest.fn().mockReturnValue(mockCacheResponse);

        const result = await service.getTopKeywords(limit);

        expect(cacheService.getCache).toHaveBeenCalledWith(
          `getTopKeywords-${limit}`,
        );
        expect(cacheService.getCache).toHaveBeenCalledTimes(1);
        expect(cacheService.getCache).toHaveReturnedWith(mockCacheResponse);

        expect(result).toBeInstanceOf(Array);
        expect(result.length).toEqual(limit);
      });
    });

    describe('when force_update is not passed', () => {
      it('should return an array of keywords from the cache', async () => {
        const mockCacheResponse = mockResponse.slice(0, limit);

        cacheService.getCache = jest.fn().mockReturnValue(mockCacheResponse);

        const result = await service.getTopKeywords(limit);

        expect(cacheService.getCache).toHaveBeenCalledWith(
          `getTopKeywords-${limit}`,
        );
        expect(cacheService.getCache).toHaveBeenCalledTimes(1);
        expect(cacheService.getCache).toHaveReturnedWith(mockCacheResponse);

        expect(result).toBeInstanceOf(Array);
        expect(result.length).toEqual(limit);
      });

      it('should return an array of keywords from the database if not in the cache', async () => {
        const mockDbResponse = jobDbResultsFactory(limit);

        mockPrismaJobRepository.findAll.mockResolvedValue(mockDbResponse);

        const result = await service.getTopKeywords(limit);

        expect(mockPrismaJobRepository.findAll).toHaveBeenCalledWith();
        expect(mockPrismaJobRepository.findAll).toHaveBeenCalledTimes(1);

        expect(result).toBeInstanceOf(Array);
        expect(result.length).toEqual(limit);
      });
    });

    describe('when force_update is passed', () => {
      it('should return an array of keywords from the database', async () => {
        const mockDbResponse = jobDbResultsFactory(limit);

        mockPrismaJobRepository.findAll.mockResolvedValue(mockDbResponse);

        const result = await service.getTopKeywords(limit, 'true');

        expect(mockPrismaJobRepository.findAll).toHaveBeenCalledWith();
        expect(mockPrismaJobRepository.findAll).toHaveBeenCalledTimes(1);

        expect(result).toBeInstanceOf(Array);
        expect(result.length).toEqual(limit);
      });
    });
  });
});
