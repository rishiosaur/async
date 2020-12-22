import { useEffect, useState } from 'react';

export type DependencyList = readonly any[];
export type AsyncEffect<T> = (mounted: boolean) => Promise<T> | T;
export type CleanupFunc<T> = (result: T | undefined) => void;

export function useAsyncEffect<T>(
  effect: AsyncEffect<T>,
  dependencies?: DependencyList
): void;
export function useAsyncEffect<T>(
  effect: AsyncEffect<T>,
  cleanup?: CleanupFunc<T>,
  dependencies?: DependencyList
): void;
export function useAsyncEffect<T>(
  effect: AsyncEffect<T>,
  cleanup?: CleanupFunc<T> | DependencyList,
  dependencies?: DependencyList
): void {
  // Has cleanup function
  const hasCleanup = typeof cleanup === 'function';
  const deps = hasCleanup
    ? dependencies?.concat(cleanup) || [cleanup]
    : ((cleanup as unknown) as DependencyList) || [];
  const [mounted, setMounted] = useState(false);
  const [result, setResult] = useState<T>();
  useEffect(() => {
    setMounted(true);

    Promise.resolve(effect(mounted))
      .then(setResult)
      .catch((e) => {
        throw e;
      });

    return () => {
      setMounted(false);

      if (hasCleanup) {
        ((cleanup as unknown) as CleanupFunc<T>)(result);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
