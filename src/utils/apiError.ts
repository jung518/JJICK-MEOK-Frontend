import type { AxiosError } from 'axios';
import type { ApiErrorData } from '@/src/types/api';

export function resolveErrorMessage(
  error: AxiosError<ApiErrorData> | undefined,
  messagesByCode: Record<string, string>,
  fallbackMessage: string,
): string {
  const code = error?.response?.data?.code;
  return (code && messagesByCode[code]) || fallbackMessage;
}
