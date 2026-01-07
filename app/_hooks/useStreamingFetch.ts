import { useCallback, useRef } from 'react';

const decoder = new TextDecoder();

export interface UseStreamingFetchConfig {
  url: string;
  method?: string;
  headers?: Record<string, string>;
  onStart?: () => void;
  onChunk?: (chunk: string) => void;
  onDone?: () => void;
  onError?: (error: string) => void;
}

export interface UseStreamingFetchReturn {
  send: <TRequest = any>(body: TRequest) => Promise<void>;
  cancel: () => void;
  isActive: () => boolean;
}

export function useStreamingFetch(config: UseStreamingFetchConfig): UseStreamingFetchReturn {
  const abortControllerRef = useRef<AbortController | null>(null);

  const send = useCallback(async <TRequest = any>(body: TRequest) => {
    // Prevent sending multiple requests at the same time
    if (abortControllerRef.current) {
      abortControllerRef.current = null;
      return;
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(config.url, {
        signal: abortControllerRef.current.signal,
        method: config.method || 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...config.headers,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('No response body received');
      }

      config.onStart?.();

      const reader = response.body.getReader();

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          abortControllerRef.current = null;
          config.onDone?.();
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        config.onChunk?.(chunk);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          // Request was cancelled, don't call onError
          abortControllerRef.current = null;
          return;
        }
        config.onError?.(err.message || 'Failed to send request. Please try again.');
      } else {
        config.onError?.('An unexpected error occurred. Please try again.');
      }
      abortControllerRef.current = null;
      config.onDone?.();
    }
  }, [config]);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const isActive = useCallback(() => {
    return abortControllerRef.current !== null;
  }, []);

  return { send, cancel, isActive };
}

