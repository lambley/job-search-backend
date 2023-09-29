import { Test, TestingModule } from '@nestjs/testing';
import { AdzunaService } from './adzuna.service';

describe('AdzunaService', () => {
  let service: AdzunaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdzunaService],
    }).compile();

    service = module.get<AdzunaService>(AdzunaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of jobs', async () => {
    const result = await service.getJobs({
      results_per_page: 5,
      what: 'javascript developer',
      where: 'london',
    });

    expect(result).toBeInstanceOf(Array);
    expect(result.length).toEqual(5);
  });
});
