import axios from 'axios';

type ApiErrorMessage = {
  message: string | null;
  isRetriable: boolean;
  isSessionExpired: boolean;
};

export function useApiErrorMessage(
  isError: boolean,
  error: unknown,
  fallbackMessage: string,
): ApiErrorMessage {
  if (!isError) return { message: null, isRetriable: false, isSessionExpired: false };

  const isSessionExpired = axios.isAxiosError(error) && error.response?.status === 401;
  const isNetworkError = axios.isAxiosError(error) && !error.response;
  const message = isSessionExpired
    ? '로그인 시간이 만료되었어요. 다시 로그인해주세요.'
    : isNetworkError
      ? '네트워크 연결을 확인해주세요.'
      : fallbackMessage;

  return { message, isRetriable: !isSessionExpired, isSessionExpired };
}
