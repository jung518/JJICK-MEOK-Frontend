import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import ArrowLeftBar from '@/src/components/Bar/ArrowLeftBar';
import { postPasswordReset } from '@/src/api/auth';
import { BottomCTA } from '@/src/components/Button/BottomCTA';
import { CTAContainer } from '@/src/components/Layout/CTAContainer';
import { ScreenLayout } from '@/src/components/Layout/ScreenLayout';
import { TextField } from '@/src/components/Input/TextField';
import { Typography } from '@/src/components/Typography/Typography';
import ProgressBar from '@/src/components/Bar/ProgressBar';
import { colors } from '@/src/constants/colors';
import { spacing } from '@/src/constants/spacing';

const CONDITIONS = [
  { key: 'length', label: '8자 이상', check: (pw: string) => pw.length >= 8 },
  { key: 'letter', label: '영문 포함', check: (pw: string) => /[a-zA-Z]/.test(pw) },
  { key: 'number', label: '숫자 포함', check: (pw: string) => /[0-9]/.test(pw) },
  { key: 'special', label: '특수문자 포함', check: (pw: string) => /[^a-zA-Z0-9]/.test(pw) },
] as const;

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { resetToken } = useLocalSearchParams<{ resetToken: string }>();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);
  const [serverError, setServerError] = useState<string | undefined>();

  const conditionsMet = CONDITIONS.map((condition) => condition.check(password));
  const allMet = conditionsMet.every(Boolean);
  const passwordsMatch = password.length > 0 && password === confirm;
  const isComplete = allMet && passwordsMatch;

  const failedLabels = CONDITIONS.filter((_, i) => !conditionsMet[i]).map(
    (condition) => condition.label,
  );
  const passwordError =
    serverError ??
    (passwordTouched && password.length > 0 && !allMet
      ? failedLabels.join(', ') + '이 필요해요.'
      : undefined);

  const confirmError =
    confirmTouched && confirm.length > 0 && !passwordsMatch
      ? '비밀번호가 일치하지 않아요.'
      : undefined;

  const { mutate: resetPassword, isPending } = useMutation({
    mutationFn: () => postPasswordReset(resetToken, password, confirm),
    onSuccess: () => {
      router.replace('/(auth)/login');
    },
    onError: (error: any) => {
      const code = error?.response?.data?.code;
      if (code === 'PASSWORD_SAME_AS_OLD') {
        setServerError('기존 비밀번호와 동일한 비밀번호로 변경할 수 없어요.');
      } else {
        setServerError('비밀번호 재설정에 실패했어요. 다시 시도해주세요.');
      }
    },
  });

  return (
    <ScreenLayout withKeyboard style={styles.container}>
      <ArrowLeftBar onPress={() => router.back()} title="비밀번호 재설정" />
      <View style={styles.progressWrapper}>
        <ProgressBar step={2} />
      </View>

      <View style={styles.content}>
        <Typography size="xxl" weight="semiBold" style={styles.title}>
          새로운 비밀번호를 입력해주세요
        </Typography>

        <View style={styles.fields}>
          <View style={styles.fieldGroup}>
            <Typography size="lg" weight="medium">
              새 비밀번호
            </Typography>
            <Typography size="sm" weight="medium" color="tertiary">
              영문・숫자・특수기호 8자 이상
            </Typography>
            <TextField
              placeholder="••••••••"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setServerError(undefined);
              }}
              onBlur={() => setPasswordTouched(true)}
              secureText
              errorMessage={passwordError}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Typography size="lg" weight="medium">
              새 비밀번호 확인
            </Typography>
            <TextField
              placeholder="비밀번호를 다시 입력해주세요"
              value={confirm}
              onChangeText={setConfirm}
              onBlur={() => setConfirmTouched(true)}
              secureText
              errorMessage={confirmError}
            />
          </View>
        </View>
      </View>

      <CTAContainer style={styles.cta}>
        <BottomCTA
          label="완료"
          onPress={() => resetPassword()}
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
    marginBottom: 40,
  },
  fields: {
    gap: 35,
  },
  fieldGroup: {
    gap: 6,
  },
  cta: {
    paddingHorizontal: spacing.xl,
    paddingTop: 16,
  },
});
