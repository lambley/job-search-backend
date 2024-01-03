import { TestingModule, Test } from '@nestjs/testing';
import { CacheService } from '../cache.service';
import { JobDbResponse } from 'src/job/types/job.interface';

describe('CacheService', () => {
  const data: JobDbResponse = {
    id: 1234,
    adzuna_id: '1234',
    title: 'test',
    location: ['test'],
    description: 'test',
    created: 'test',
    company: 'test',
    salary_min: 1234,
    salary_max: 1234,
    category: 'test',
  };

  let service: CacheService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'CacheKeyPrefix',
          useValue: 'test',
        },
        {
          provide: 'CacheKeySuffix',
          useValue: 'test',
        },
        {
          provide: 'TTL',
          useValue: 1000,
        },
        CacheService,
      ],
    }).compile();

    service = module.get<CacheService>(CacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('test instance', () => {
    it('should have a cache property', () => {
      expect(service.cache).toBeDefined();
    });

    it('should have a key property', () => {
      expect(service.key).toBe('test-test');
    });
  });

  describe('test instance with JobDbResponse data', () => {
    beforeEach(() => {
      service.setCache<JobDbResponse>(data);
    });

    it('should have cached object', () => {
      const cachedObject = service.getCache<JobDbResponse>();
      expect(cachedObject).toBeInstanceOf(Object);
      expect(cachedObject.id).toBe(1234);
    });

    it('should be possible to set a new cached object', () => {
      const newData: JobDbResponse = { ...data, id: 9999, title: 'new data' };
      service.setCache<JobDbResponse>(newData);

      const cachedObject = service.getCache<JobDbResponse>();
      expect(cachedObject).toBeInstanceOf(Object);
      expect(cachedObject.id).toBe(9999);
    });

    it('should be deletable', () => {
      service.deleteCache(service.key);
      const cachedObject = service.getCache<JobDbResponse>();
      expect(cachedObject).toBeUndefined();
    });
  });

  describe('test instance with JobDbResponse[] data', () => {
    const arrayData: JobDbResponse[] = [{ ...data }, { ...data }, { ...data }];

    beforeEach(() => {
      service.setCache<JobDbResponse[]>(arrayData);
    });

    it('should have cached array', () => {
      const cachedArray = service.getCache<JobDbResponse[]>();
      expect(cachedArray).toBeInstanceOf(Array);
      expect(cachedArray.length).toBe(3);
    });

    it('should be possible to set a new cached array', () => {
      const newData: JobDbResponse[] = [
        { ...data, id: 9999, title: 'new data' },
      ];
      service.setCache<JobDbResponse[]>(newData);

      const cachedArray = service.getCache<JobDbResponse[]>();
      expect(cachedArray).toBeInstanceOf(Array);
      expect(cachedArray.length).toBe(1);
      expect(cachedArray[0].id).toBe(9999);
    });

    it('should be deletable', () => {
      service.deleteCache(service.key);
      const cachedArray = service.getCache<JobDbResponse[]>();
      expect(cachedArray).toBeUndefined();
    });
  });
});
