import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import ArrowLeftBar from '@/src/components/Bar/ArrowLeftBar';
import { BottomCTA } from '@/src/components/Button/BottomCTA';
import { CTAContainer } from '@/src/components/Layout/CTAContainer';
import { ScreenLayout } from '@/src/components/Layout/ScreenLayout';
import { TextField } from '@/src/components/Input/TextField';
import { Typography } from '@/src/components/Typography/Typography';
import ProgressBar from '@/src/components/Bar/ProgressBar';
import { colors } from '@/src/constants/colors';
import { spacing } from '@/src/constants/spacing';
import { postLogin, postSignup } from '@/src/api/auth';
import { tokenStorage } from '@/src/lib/secureStore';
import { useAuthStore } from '@/src/store/authStore';
import { useNavigateOnce } from '@/src/hooks/useNavigateOnce';
import type { ApiErrorData } from '@/src/types/api';
import { resolveErrorMessage } from '@/src/utils/apiError';

const CONDITIONS = [
  { key: 'length', label: '8자 이상', check: (pw: string) => pw.length >= 8 },
  { key: 'letter', label: '영문 포함', check: (pw: string) => /[a-zA-Z]/.test(pw) },
  { key: 'number', label: '숫자 포함', check: (pw: string) => /[0-9]/.test(pw) },
  { key: 'special', label: '특수문자 포함', check: (pw: string) => /[^a-zA-Z0-9]/.test(pw) },
] as const;

export default function PasswordScreen() {
  const router = useRouter();
  const navigateOnce = useNavigateOnce();
  const { email } = useLocalSearchParams<{ email: string }>();
  const { setToken, setRegistrationStatus } = useAuthStore();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [completed, setCompleted] = useState(false);

  const conditionsMet = CONDITIONS.map((condition) => condition.check(password));
  const allMet = conditionsMet.every(Boolean);
  const passwordsMatch = password.length > 0 && password === confirm;
  const isComplete = allMet && passwordsMatch;

  const failedLabels = CONDITIONS.filter((_, i) => !conditionsMet[i]).map(
    (condition) => condition.label,
  );
  const passwordError =
    passwordTouched && password.length > 0 && !allMet
      ? failedLabels.join(', ') + '이 필요해요.'
      : undefined;
  const confirmError =
    confirm.length > 0 && !passwordsMatch ? '비밀번호가 일치하지 않아요.' : undefined;

  const { mutate: signup, isPending } = useMutation({
    mutationFn: async () => {
      await postSignup(email ?? '', password);
      const { accessToken, refreshToken, registrationStatus } = await postLogin(
        email ?? '',
        password,
      );
      await Promise.all([
        tokenStorage.saveAccessToken(accessToken),
        tokenStorage.saveRefreshToken(refreshToken),
      ]);
      setToken(accessToken);
      setRegistrationStatus(registrationStatus);
    },
    onSuccess: () => {
      // navigateOnce only debounces for 600ms, so a re-tap of the CTA after that window would
      // fire signup() again; `completed` makes a later tap just retry navigation instead.
      setCompleted(true);
      navigateOnce('/(auth)/profile-setup');
    },
    onError: (error: AxiosError<ApiErrorData>) => {
      console.error('[password] signup error:', error?.response?.data ?? error);
      setSignupError(
        resolveErrorMessage(
          error,
          { EMAIL_ALREADY_EXISTS: '이미 가입된 이메일입니다.' },
          '회원가입에 실패했습니다. 다시 시도해주세요.',
        ),
      );
    },
  });

  return (
    <ScreenLayout withKeyboard style={styles.container}>
      <ArrowLeftBar onPress={() => router.back()} title="비밀번호 만들기" />
      <View style={styles.progressWrapper}>
        <ProgressBar step={2} />
      </View>

      <View style={styles.content}>
        <Typography size="xxl" weight="semiBold" style={styles.title}>
          비밀번호를 입력해주세요
        </Typography>

        <View style={styles.fields}>
          <View style={styles.passwordFieldGroup}>
            <Typography size="lg" weight="medium" style={styles.label}>
              비밀번호
            </Typography>
            <Typography size="sm" weight="medium" color="tertiary" style={styles.hint}>
              영문・숫자・특수기호 8자 이상
            </Typography>
            <TextField
              placeholder="비밀번호를 입력해주세요."
              value={password}
              onChangeText={setPassword}
              onBlur={() => setPasswordTouched(true)}
              secureText
              errorMessage={passwordError}
            />
          </View>

          <View style={styles.confirmFieldGroup}>
            <Typography size="lg" weight="medium" style={styles.label}>
              비밀번호 확인
            </Typography>
            <TextField
              placeholder="비밀번호를 다시 입력해주세요"
              value={confirm}
              onChangeText={setConfirm}
              secureText
              errorMessage={confirmError}
            />
          </View>
        </View>
      </View>

      <CTAContainer style={styles.cta}>
        {signupError ? (
          <Typography size="sm" color="error" style={styles.errorText}>
            {signupError}
          </Typography>
        ) : null}
        <BottomCTA
          label="회원가입 완료"
          onPress={() => (completed ? navigateOnce('/(auth)/profile-setup') : signup())}
          variant="dark"
          disabled={!isComplete || isPending}
        />
      </CTAContainer>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral.white,
  },
  progressWrapper: {
    paddingHorizontal: spacing.xl,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: 38,
  },
  title: {
    marginBottom: 30,
  },
  fields: {
    gap: 40,
  },
  passwordFieldGroup: {
    gap: 0,
  },
  confirmFieldGroup: {
    gap: 15,
  },
  label: {
    marginBottom: 9,
  },
  hint: {
    marginBottom: 13,
  },
  cta: {
    paddingHorizontal: spacing.xl,
    paddingTop: 16,
    gap: spacing.sm,
  },
  errorText: {
    textAlign: 'center',
  },
});
