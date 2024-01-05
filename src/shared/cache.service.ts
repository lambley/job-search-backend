import { Injectable, Inject } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import * as NodeCache from 'node-cache';

/*
CacheService is a wrapper around the node-cache library. It provides a way to create multiple caches

Each cache is stored in a Map with a key of the cacheKeyPrefix + cacheKey. The cacheKeyPrefix is unique to the service that uses the cache and intended to be unique for the method that uses that cache.

e.g. the JobService uses the cacheKeyPrefix 'job' and the method that uses the cache is 'getJobs'. The cacheKeyPrefix and cacheKey are combined to create the key 'job-getJobs' which is used to store the cache in the Map.

Cache keys can be more granular e.g. 'job-getJobs-1' and 'job-getJobs-2' if the method has multiple cacheable results. But for now the numbering is handled by the JobService, rather than the CacheService.
*/
@Injectable()
export class CacheService {
  private caches: Map<string, NodeCache>;
  private cacheKeys: string[];

  constructor(
    @Inject('CacheKeyPrefix') private readonly cacheKeyPrefix: string,
    @Inject('TTL') private readonly ttl: number,
  ) {
    this.caches = new Map<string, NodeCache>();
    this.cacheKeys = new Array<string>();

    this.cacheKeyPrefix = cacheKeyPrefix;
    this.ttl = ttl;
  }

  public createCache(cacheKey: string): void {
    const newCache = new NodeCache({ stdTTL: this.ttl });
    const key = `${this.cacheKeyPrefix}-${cacheKey}`;
    this.caches.set(key, newCache);

    // add key to cacheKeys
    this.cacheKeys.push(key);
    // remove duplicates from cacheKeys
    this.cacheKeys = [...new Set(this.cacheKeys)];
  }

  public getAllCaches(): Map<string, NodeCache> {
    return this.caches;
  }

  public getAllCacheKeys(): string[] {
    return this.cacheKeys;
  }

  public getCache<T>(cacheKey: string): T | undefined {
    const key = `${this.cacheKeyPrefix}-${cacheKey}`;
    return this.caches.get(key) as T;
  }

  public setCache(cacheKey: string, data: any): void {
    const key = `${this.cacheKeyPrefix}-${cacheKey}`;

    if (!this.caches.has(key)) this.createCache(cacheKey);

    this.caches.set(key, data);
  }

  public deleteCache(cacheKey: string): boolean {
    const key = `${this.cacheKeyPrefix}-${cacheKey}`;
    if (this.cacheKeys.includes(key)) {
      try {
        this.caches.delete(key);
        this.cacheKeys = this.cacheKeys.filter((cacheKey) => cacheKey !== key);
        return true;
      } catch (error) {
        Logger.log(`Error deleting cache with key ${key}: ${error}`);
        return false;
      }
    } else {
      Logger.log(`Cache with key ${key} does not exist`);
      return false;
    }
  }

  public clearCache(cacheKey: string): boolean {
    const key = `${this.cacheKeyPrefix}-${cacheKey}`;
    try {
      this.caches.set(key, undefined);
      return true;
    } catch (error) {
      Logger.log(`Error clearing cache with key ${key}: ${error}`);
      return false;
    }
  }

  public clearAllCaches(): void {
    this.caches.clear();
    this.cacheKeys = [];
  }
}
