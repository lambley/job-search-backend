import { Test, TestingModule } from '@nestjs/testing';
import { AdzunaService } from '../adzuna.service';
import { ConfigService } from '@nestjs/config';
import { AdzunaJob } from '../types/adzuna.interface';
import axios from 'axios';
import { Logger } from '@nestjs/common';

jest.mock('axios');

const adzunaResultsFactory = (count: number): AdzunaJob[] => {
  const results: AdzunaJob[] = [];

  for (let i = 0; i < count; i++) {
    results.push({
      salary_min: 10000,
      longitude: 0.0,
      location: {
        area: ['London'],
        display_name: 'London',
      },
      salary_is_predicted: 0,
      description: 'A job description',
      created: '2021-01-01T00:00:00Z',
      latitude: 0.0,
      redirect_url: 'https://www.example.com',
      title: 'Job Title',
      category: {
        label: 'IT Jobs',
        tag: 'it-jobs',
      },
      id: '1234567890',
      salary_max: 100000,
      company: {
        display_name: 'Company Name',
      },
      contract_type: 'full-time',
    });
  }

  return results;
};

const params = {
  results_per_page: 10,
  what: 'developer',
  where: 'london',
};

describe('AdzunaService', () => {
  let service: AdzunaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdzunaService, ConfigService],
    }).compile();

    service = module.get<AdzunaService>(AdzunaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of jobs', async () => {
    const mockResponse = {
      data: {
        results: adzunaResultsFactory(5),
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
        results: adzunaResultsFactory(5),
      },
    };
    (axios.get as jest.Mock).mockResolvedValue(mockResponse);

    const loggerSpy = jest.spyOn(Logger, 'log');

    const result = await service.getJobs(params);

    expect(result).toBeInstanceOf(Array);
    expect(result.length).toEqual(5);

    expect(loggerSpy).toHaveBeenCalledWith(
      `${result.length} jobs found`,
      'AdzunaJobService',
    );
  });

  it('should log an error message if the API call fails', async () => {
    (axios.get as jest.Mock).mockRejectedValue(new Error('API Error'));

    const loggerSpy = jest.spyOn(Logger, 'error');

    const result = await service.getJobs(params);

    console.log('result:', result);
    console.log('loggerSpy.mock.calls:', loggerSpy.mock.calls);

    expect(result).toBeInstanceOf(Array);
    expect(result.length).toEqual(0);

    expect(loggerSpy).toHaveBeenCalledWith(`~ API Error`);
  });
});
