import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Logo from '@/src/components/Logo/Logo';
import { useAuthStore } from '@/src/store/authStore';
import { getPostAuthRoute } from '@/src/lib/postAuthRoute';

export default function SplashScreen() {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  const registrationStatus = useAuthStore((s) => s.registrationStatus);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!accessToken) {
        router.replace('/(auth)/login');
      } else {
        // registrationStatus가 'ONBOARDING_COMPLETED'이거나(정상 완료), 캐시가 없는
        // 이전 세션(null)인 경우 — 둘 다 홈으로 보내는 게 안전한 기본값이다.
        router.replace(getPostAuthRoute(registrationStatus));
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [router, accessToken, registrationStatus]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ gestureEnabled: false }} />
      <View style={styles.logoWrapper}>
        <Logo variant="LOGO_FINAL" width={202} height={202} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  logoWrapper: {
    position: 'absolute',
    top: 143,
    left: 0,
    right: 10,
    alignItems: 'center',
  },
});
