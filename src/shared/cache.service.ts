import { Injectable, Inject } from '@nestjs/common';
import * as NodeCache from 'node-cache';

@Injectable()
export class CacheService {
  public cache: NodeCache;
  public key: string;

  constructor(
    @Inject('CacheKeyPrefix') private readonly cacheKeyPrefix: string,
    @Inject('CacheKeySuffix') private readonly cacheKeySuffix: string,
    @Inject('TTL') private readonly ttl: number,
  ) {
    this.cache = new NodeCache({ stdTTL: 3600 }); // 1 hour

    this.cacheKeyPrefix = cacheKeyPrefix;
    this.cacheKeySuffix = cacheKeySuffix;
    this.ttl = ttl;

    this.key = this.generateCacheKey();
  }

  private generateCacheKey(): string {
    if (this.cacheKeySuffix === '') {
      return this.cacheKeyPrefix;
    } else {
      return `${this.cacheKeyPrefix}-${this.cacheKeySuffix}`;
    }
  }

  public getCache<T>(): T | undefined {
    return this.cache.get(this.key) as T;
  }

  public setCache<T>(data: T): boolean {
    return this.cache.set(this.key, data, this.ttl);
  }

  public deleteCache(key: string): boolean {
    try {
      this.cache.del(key);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
