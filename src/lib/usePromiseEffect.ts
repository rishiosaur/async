import { useState } from 'react';
import { useAsyncEffect, AsyncEffect, DependencyList } from './useAsyncEffect';

/**
 * Possible states of the Promise effect used in [[usePromiseEffect]].
 * @template T Return type of the effect response.
 */
export type PromiseEffectState<T> =
  | { status: 'pending'; value: null; error: null }
  | { status: 'fulfilled'; value: T; error: null }
  | { status: 'rejected'; value: null; error: Error };

/**
 * A Promise effect that builds on [[useAsyncEffect]] with state management built in.
 *
 * @export
 * @template T Result of [[effect]]
 * @param {AsyncEffect<T>} effect The Asynchronous effect that returns `Promise<T>`
 * @param {DependencyList} [deps] Dependency array.
 * @returns {((boolean | Error | T | null)[])} States of the promise at any given time.
 * @example
 * ```typescript
 *  // In a component
 *  const [value, loading, err] = usePromiseEffect(() =>
      fetch("https://jsonplaceholder.typicode.com/todos/1").then((response) =>
        response.json()
      ) // Catching is automatically supported, and can be accessed through `err`.
    );
 * ```
 */
export function usePromiseEffect<T>(
  effect: AsyncEffect<T>,
  deps?: DependencyList
): [T | null, boolean, Error | null] {
  const [{ status, value, error }, setPromiseState] = useState<
    PromiseEffectState<T>
  >({
    status: 'pending',
    value: null,
    error: null,
  });

  useAsyncEffect(async (mounted) => {
    effect(mounted)
      .then((value) =>
        setPromiseState({
          status: 'fulfilled',
          value,
          error: null,
        })
      )
      .catch((error) =>
        setPromiseState({ status: 'rejected', value: null, error })
      );
  }, deps || []);

  return [value, status === 'pending', error];
}
