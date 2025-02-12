import { Cacheable } from 'cacheable';
export declare class CacheService {
    private readonly cache;
    constructor(cache: Cacheable);
    get<T>(key: string): Promise<T>;
    set<T>(key: string, value: T, ttl?: number | string): Promise<void>;
    delete(key: string): Promise<void>;
}
