import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { postHandoff } from '@/src/api/auth';
import { tokenStorage } from '@/src/lib/secureStore';
import { useAuthStore } from '@/src/store/authStore';
import { getOAuthRedirectUri } from '@/src/lib/oauthRedirect';
import { getPostAuthRoute } from '@/src/lib/postAuthRoute';

type OAuthProvider = 'google' | 'kakao' | 'naver';

export const useOAuthLogin = (provider: OAuthProvider) => {
  const router = useRouter();
  const { setToken, setRegistrationStatus } = useAuthStore();
  const authUrlBase = `${process.env.EXPO_PUBLIC_API_URL}/oauth/${provider}/login`;

  const login = async () => {
    const redirectUri = getOAuthRedirectUri(provider);
    const authUrl = Platform.OS === 'web' ? `${authUrlBase}?platform=web` : authUrlBase;
    const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);
    if (result.type !== 'success') return;

    const { queryParams } = Linking.parse(result.url);
    const handoffToken = queryParams?.handoffToken as string;
    if (!handoffToken) return;

    try {
      const { accessToken, refreshToken, registrationStatus } = await postHandoff(handoffToken);
      await Promise.all([
        tokenStorage.saveAccessToken(accessToken),
        tokenStorage.saveRefreshToken(refreshToken),
      ]);
      setToken(accessToken);
      setRegistrationStatus(registrationStatus);
      router.replace(getPostAuthRoute(registrationStatus));
    } catch (error: any) {
      console.error(`[useOAuthLogin:${provider}] error:`, error?.response?.data ?? error);
    }
  };

  return { login };
};
