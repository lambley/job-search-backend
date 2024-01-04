import { Injectable, Inject } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import * as NodeCache from 'node-cache';

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
    this.caches.set(cacheKey, newCache);

    // add cacheKey to cacheKeys
    this.cacheKeys.push(cacheKey);
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
    return this.caches.get(cacheKey) as T;
  }

  public setCache(cacheKey: string, data: any): void {
    this.caches.set(cacheKey, data);
  }

  public deleteCache(cacheKey: string): boolean {
    if (this.cacheKeys.includes(cacheKey)) {
      try {
        this.caches.delete(cacheKey);
        this.cacheKeys = this.cacheKeys.filter((key) => key !== cacheKey);
        return true;
      } catch (error) {
        Logger.log(`Error deleting cache with key ${cacheKey}: ${error}`);
        return false;
      }
    } else {
      Logger.log(`Cache with key ${cacheKey} does not exist`);
      return false;
    }
  }

  public clearAllCaches(): void {
    this.caches.clear();
    this.cacheKeys = [];
  }
}
