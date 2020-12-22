import { useState } from 'react';
import { useAsyncEffect, AsyncEffect, DependencyList } from './useAsyncEffect';

interface PromiseState {
  status: string;
  value: unknown;
  error: unknown;
}
type PromiseEffectState<T> =
  | { status: 'pending'; value: null; error: null }
  | { status: 'fulfilled'; value: T; error: null }
  | { status: 'rejected'; value: null; error: Error };

export function usePromiseEffect<T>(
  effect: AsyncEffect<T>,
  deps?: DependencyList
): (boolean | Error | T | null)[] {
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
