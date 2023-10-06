import { Test, TestingModule } from '@nestjs/testing';
import { JobService } from '../job.service';
import { ConfigService } from '@nestjs/config';
import {
  jobResultArrayFactory,
  jobResultFactory,
} from './factories/jobFactory';
import axios from 'axios';
import { Logger } from '@nestjs/common';
import { PrismaJobRepository } from '../prisma-job.repository';
import { mockPrismaJobRepository } from './mocks/mockPrismaRepository';

jest.mock('axios');

const params = {
  results_per_page: 10,
  what: 'developer',
  where: 'london',
};

describe('JobService', () => {
  let service: JobService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobService, ConfigService, PrismaJobRepository],
    })
      .overrideProvider(PrismaJobRepository)
      .useValue(mockPrismaJobRepository)
      .compile();

    service = module.get<JobService>(JobService);

    jest.clearAllMocks();
  });

  describe('getJobs', () => {
    it('should be defined', () => {
      expect(service.getJobs).toBeDefined();
    });

    it('should return an array of jobs', async () => {
      const mockResponse = {
        data: {
          results: jobResultArrayFactory(5),
        },
      };
      (axios.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await service.getJobs(params);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toEqual(5);
    });

    it('should log the number of jobs found', async () => {
      const mockResponse = {
        data: {
          results: jobResultArrayFactory(5),
        },
      };
      (axios.get as jest.Mock).mockResolvedValue(mockResponse);

      const loggerSpy = jest.spyOn(Logger, 'log');

      const result = await service.getJobs(params);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toEqual(5);

      expect(loggerSpy).toHaveBeenCalledWith(
        `${result.length} job(s) found`,
        'JobService',
      );
    });

    it('should log an error message if the API call fails', async () => {
      (axios.get as jest.Mock).mockRejectedValue(new Error('API Error'));

      const loggerSpy = jest.spyOn(Logger, 'error');

      const result = await service.getJobs(params);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toEqual(0);

      expect(loggerSpy).toHaveBeenCalledWith(`~ API Error`);
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

      await service.getJob('1234567890');

      expect(mockPrismaJobRepository.findByAdzunaId).toHaveBeenCalledWith({
        where: { adzuna_id: '1234567890' },
      });
      expect(mockPrismaJobRepository.findByAdzunaId).toHaveBeenCalledTimes(1);
    });

    it('should log an error message if the API call fails', async () => {
      mockPrismaJobRepository.findByAdzunaId.mockRejectedValue(
        new Error('Database Error'),
      );
      const result = await service.getJob('1');

      expect(result.message).toEqual('Job with id 1 not found');
    });
  });
});
