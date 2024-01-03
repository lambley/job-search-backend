import { Module, DynamicModule } from '@nestjs/common';
import { CacheService } from './cache.service';

@Module({
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {
  static forRoot(
    cacheKeyPrefix: string,
    cacheKeySuffix: string,
    ttl: number,
  ): DynamicModule {
    return {
      module: CacheModule,
      providers: [
        {
          provide: 'CacheKeyPrefix',
          useValue: cacheKeyPrefix,
        },
        {
          provide: 'CacheKeySuffix',
          useValue: cacheKeySuffix,
        },
        {
          provide: 'TTL',
          useValue: ttl,
        },
      ],
      exports: [CacheService],
    };
  }
}
