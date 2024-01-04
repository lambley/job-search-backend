import { TestingModule, Test } from '@nestjs/testing';
import { CacheService } from '../cache.service';
import { JobDbResponse } from 'src/job/types/job.interface';
import NodeCache from 'node-cache';

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

  describe('single test cache', () => {
    beforeEach(() => {
      service.createCache('test');
      service.setCache('test', data);
    });

    afterAll(() => {
      service.clearAllCaches();
    });

    it('should have a caches property', () => {
      expect(service.getAllCaches()).toBeInstanceOf(Map<string, NodeCache>);
    });

    it('should have a keys property', () => {
      const lastKey = service.getAllCacheKeys().at(-1);
      expect(lastKey).toBe('test');
    });

    it('should have a getCache method', () => {
      const cache = service.getCache('test');
      expect(cache).toBe(data);
    });

    describe('setting caches', () => {
      it('should be possible to overwrite a cache', () => {
        const newData = { ...data, title: 'new test' };
        service.setCache('test', newData);
        const cache = service.getCache('test');
        expect(cache).toBe(newData);
      });

      it('should be possible to add a new cache', () => {
        service.createCache('test2');
        service.setCache('test2', data);
        const cache = service.getCache('test2');
        expect(cache).toBe(data);
      });
    });

    describe('deleting caches', () => {
      it('should be possible to delete a cache', () => {
        const deleted = service.deleteCache('test');
        expect(deleted).toBe(true);
      });

      it('there should be one less cache after deleting a cache', () => {
        const totalCaches = service.getAllCaches().size;
        const totalCacheKeys = service.getAllCacheKeys().length;

        service.deleteCache('test');

        const newTotalCaches = service.getAllCaches().size;
        const newTotalCacheKeys = service.getAllCacheKeys().length;

        expect(newTotalCaches).toBe(totalCaches - 1);
        expect(newTotalCacheKeys).toBe(totalCacheKeys - 1);
      });
    });

    it('should be possible to clear all caches', () => {
      service.clearAllCaches();
      expect(service.getAllCacheKeys().length).toBe(0);
      expect(service.getAllCaches().size).toBe(0);
    });
  });
});
