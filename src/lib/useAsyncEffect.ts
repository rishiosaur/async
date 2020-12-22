import { useEffect, useState } from 'react';

/**
 * Dependency list for effects.
 */
export type DependencyList = readonly any[];

/**
 * An asynchronous effect that may return something.
 * @template T Type that the effect returns. Note: in a lot of cases, when used with [[useAsyncEffect]], this can be `void`.
 */
export type AsyncEffect<T> = (mounted: boolean) => Promise<T>;

/**
 * Cleanup function used on destruction of component (on unmount).
 * @template T Type that the original effect returns (may be undefined, in the case that T is `void`).
 */
export type CleanupFunc<T> = (result: T | undefined) => void;

/**
 * Base Asynchronous Effect Hook.
 *
 * @export
 * @template T Result of your effect.
 * @param {AsyncEffect<T>} effect An effect function that returns `Promise<T>`. Accepts argument of `mounted`.
 * @param {DependencyList} [dependencies] Dependency array for hooks (taken from React)
 */
export function useAsyncEffect<T>(
  effect: AsyncEffect<T>,
  dependencies?: DependencyList
): void;
/**
 * Asynchronous Effect Hook with support for a cleanup callback.
 *
 * @export
 * @template T Result of your effect.
 * @param {AsyncEffect<T>} effect An effect function that returns `Promise<T>`. Accepts argument of `mounted`
 * @param {CleanupFunc<T>} [cleanup] A cleanup effect run after the component dismounts. Takes in result of effect (if any)
 * @param {DependencyList} [dependencies] Dependency array for hooks (taken from React)
 */
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
  // eslint-disable-next-line no-nested-ternary
  const deps = hasCleanup
    ? dependencies
      ? dependencies.concat(cleanup)
      : [cleanup]
    : ((cleanup as unknown) as DependencyList) || [];

  const [mounted, setMounted] = useState(false);
  const [result, setResult] = useState<T>();

  useEffect(() => {
    setMounted(true);

    Promise.resolve(effect(mounted)).then(setResult);

    return () => {
      setMounted(false);

      if (hasCleanup) {
        ((cleanup as unknown) as CleanupFunc<T>)(result);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
