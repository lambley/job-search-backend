import { TestingModule, Test } from '@nestjs/testing';
import { CacheModule } from '../cache.module';
import { CacheService } from '../cache.service';

describe('CacheModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [CacheModule.forRoot('test', 'test', 1000)],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  describe('CacheModule providers', () => {
    it('should provide the CacheService', () => {
      const service = module.get<CacheService>(CacheService);
      expect(service).toBeDefined();
      expect(service).toBeInstanceOf(CacheService);
    });

    it('should provide the CacheKeyPrefix', () => {
      const service = module.get('CacheKeyPrefix');
      expect(service).toBeDefined();
    });

    it('should provide the CacheKeySuffix', () => {
      const service = module.get('CacheKeySuffix');
      expect(service).toBeDefined();
    });

    it('should provide the TTL', () => {
      const service = module.get('TTL');
      expect(service).toBeDefined();
    });
  });
});
