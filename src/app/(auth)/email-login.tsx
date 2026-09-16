import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import ArrowLeftBar from '@/src/components/Bar/ArrowLeftBar';
import { BottomCTA } from '@/src/components/Button/BottomCTA';
import { CTAContainer } from '@/src/components/Layout/CTAContainer';
import { ScreenLayout } from '@/src/components/Layout/ScreenLayout';
import { TextField } from '@/src/components/Input/TextField';
import { Typography } from '@/src/components/Typography/Typography';
import { colors } from '@/src/constants/colors';
import { spacing } from '@/src/constants/spacing';
import { postLogin } from '@/src/api/auth';
import { tokenStorage } from '@/src/lib/secureStore';
import { useAuthStore } from '@/src/store/authStore';
import { useNavigateOnce } from '@/src/hooks/useNavigateOnce';
import { getPostAuthRoute } from '@/src/lib/postAuthRoute';
import type { ApiErrorData } from '@/src/types/api';
import { resolveErrorMessage } from '@/src/utils/apiError';

const isValidEmail = (value: string): boolean => {
  if (/[ㄱ-ㆎ가-힣]/.test(value)) return false;
  if (/\s/.test(value)) return false;
  const atIndex = value.indexOf('@');
  if (atIndex <= 0) return false;
  const domain = value.slice(atIndex + 1);
  if (!domain) return false;
  const dotIndex = domain.indexOf('.');
  if (dotIndex <= 0) return false;
  return domain.slice(dotIndex + 1).length > 0;
};

export default function EmailLoginScreen() {
  const router = useRouter();
  const navigateOnce = useNavigateOnce();
  const { setToken, setRegistrationStatus } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [loginError, setLoginError] = useState('');

  const emailValid = isValidEmail(email);
  const isFormValid = emailValid && password.length > 0;

  const emailError = emailTouched
    ? email.length === 0
      ? '이메일을 입력해주세요.'
      : !emailValid
        ? '올바른 이메일 형식으로 입력해주세요.'
        : undefined
    : undefined;

  const passwordError =
    passwordTouched && password.length === 0 ? '비밀번호를 입력해주세요.' : undefined;

  const { mutate: login, isPending } = useMutation({
    mutationFn: () => postLogin(email, password),
    onSuccess: async ({ accessToken, refreshToken, registrationStatus }) => {
      await Promise.all([
        tokenStorage.saveAccessToken(accessToken),
        tokenStorage.saveRefreshToken(refreshToken),
      ]);
      setToken(accessToken);
      setRegistrationStatus(registrationStatus);
      router.replace(getPostAuthRoute(registrationStatus));
    },
    onError: (error: AxiosError<ApiErrorData>) => {
      console.error('[email-login] login error:', error?.response?.data ?? error);
      setLoginError(
        resolveErrorMessage(
          error,
          {
            INVALID_LOGIN: '이메일 또는 비밀번호가 올바르지 않습니다.',
            USER_INACTIVE: '사용할 수 없는 계정입니다.',
          },
          '로그인에 실패했습니다. 다시 시도해주세요.',
        ),
      );
    },
  });

  return (
    <ScreenLayout withKeyboard style={styles.container}>
      <ArrowLeftBar onPress={() => router.back()} title="이메일로 로그인" />

      <View style={styles.content}>
        <View style={styles.form}>
          <View style={styles.fieldGroup}>
            <Typography size="lg" weight="medium">
              이메일
            </Typography>
            <TextField
              placeholder="이메일을 입력해주세요."
              value={email}
              onChangeText={setEmail}
              onBlur={() => setEmailTouched(true)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              errorMessage={emailError}
            />
          </View>
          <View style={styles.fieldGroup}>
            <Typography size="lg" weight="medium">
              비밀번호
            </Typography>
            <TextField
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              onBlur={() => setPasswordTouched(true)}
              secureText
              errorMessage={passwordError}
            />
            <TouchableOpacity
              onPress={() => navigateOnce('/(auth)/find-password')}
              activeOpacity={0.7}
              style={styles.forgotPassword}
            >
              <Typography size="sm" weight="medium" style={styles.forgotPasswordText}>
                비밀번호 찾기
              </Typography>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.signupSection}>
          <Typography size="sm" color="secondary">
            아직 계정이 없나요?
          </Typography>
          <TouchableOpacity onPress={() => navigateOnce('/(auth)/signup')} activeOpacity={0.7}>
            <Typography size="md" weight="semiBold" style={styles.signupLink}>
              이메일로 회원가입
            </Typography>
          </TouchableOpacity>
        </View>
      </View>

      <CTAContainer style={styles.cta}>
        {loginError ? (
          <Typography size="sm" color="error" style={styles.loginError}>
            {loginError}
          </Typography>
        ) : null}
        <BottomCTA
          label="로그인"
          onPress={() => login()}
          variant="dark"
          disabled={!isFormValid || isPending}
        />
      </CTAContainer>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: 63,
  },
  form: {
    gap: 35,
  },
  fieldGroup: {
    gap: 9,
  },
  signupSection: {
    alignItems: 'center',
    gap: 4,
    marginTop: 40,
  },
  signupLink: {
    textDecorationLine: 'underline',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    textDecorationLine: 'underline',
  },
  cta: {
    paddingHorizontal: spacing.xl,
    paddingTop: 16,
    gap: spacing.md,
  },
  loginError: {
    textAlign: 'center',
  },
});
