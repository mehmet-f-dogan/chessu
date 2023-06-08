import { LRUCache } from "lru-cache";
import lodash from "lodash-es";

const DEFAULT_CACHE_LIFETIME = 5 * 60 * 1000;
const DEFAULT_CACHE_SIZE = 1000;

export function wrapFunctionWithSelectiveCache<Type>(
  lockInData: Type,
  func: (args: any) => Promise<Type> | Type,
  cacheSize?: number,
  cacheLifetime?: number
) {
  const cache = new LRUCache<string, boolean>({
    max: cacheSize ?? DEFAULT_CACHE_SIZE,
    ttl: cacheLifetime ?? DEFAULT_CACHE_LIFETIME,
    ttlResolution: cacheLifetime ?? DEFAULT_CACHE_LIFETIME,
    allowStale: true,
    updateAgeOnHas: true,
  });

  async function cachedFunctionCall(args: any) {
    const cacheKey = JSON.stringify(args);
    const cachedResult = cache.has(cacheKey);

    if (cachedResult) {
      return lockInData;
    }

    const result = await func(args);

    if (lodash.isEqual(lockInData, result))
      cache.set(cacheKey, true);

    return result;
  }

  return cachedFunctionCall;
}
