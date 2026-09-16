import { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ApiErrorData } from '@/src/types/api';
import { resolveErrorMessage } from '@/src/utils/apiError';
import ArrowLeftBar from '@/src/components/Bar/ArrowLeftBar';
import { BottomCTA } from '@/src/components/Button/BottomCTA';
import { CTAContainer } from '@/src/components/Layout/CTAContainer';
import { ScreenLayout } from '@/src/components/Layout/ScreenLayout';
import { TextField } from '@/src/components/Input/TextField';
import { Typography } from '@/src/components/Typography/Typography';
import VerificationButton, { VerificationStatus } from '@/src/components/Button/VerificationButton';
import ProgressBar from '@/src/components/Bar/ProgressBar';
import { colors } from '@/src/constants/colors';
import { spacing } from '@/src/constants/spacing';
import { typography } from '@/src/constants/typography';
import { postPasswordResetSendCode, postPasswordResetVerifyCode } from '@/src/api/auth';
import { useNavigateOnce } from '@/src/hooks/useNavigateOnce';

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

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

type Step = 'email' | 'verify';

export default function FindPasswordScreen() {
  const router = useRouter();
  const navigateOnce = useNavigateOnce();

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [serverError, setServerError] = useState('');
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const emailValid = isValidEmail(email);
  const isExpired = step === 'verify' && timeLeft === 0;
  const canNext = step === 'verify' && code.length === 6 && !isExpired;

  const emailError =
    (emailTouched && email.length > 0 && !emailValid
      ? '올바른 이메일 형식으로 입력해주세요.'
      : serverError) || undefined;

  const startTimer = useCallback((duration: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeLeft(duration);
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (isExpired) {
      setCodeError('유효시간이 만료되었습니다. 다시 시도해주세요.');
    }
  }, [isExpired]);

  const { mutate: sendCode, isPending: isSending } = useMutation({
    mutationFn: () => postPasswordResetSendCode(email),
    onSuccess: (response) => {
      setServerError('');
      setCode('');
      setCodeError('');
      startTimer(response.expiresIn);
      setStep('verify');
    },
    onError: (error: AxiosError<ApiErrorData>) => {
      setServerError(
        resolveErrorMessage(
          error,
          { USER_NOT_FOUND: '가입되지 않은 이메일이에요.' },
          '인증번호 발송에 실패했습니다. 다시 시도해주세요.',
        ),
      );
    },
  });

  const { mutate: resendCode, isPending: isResending } = useMutation({
    mutationFn: () => postPasswordResetSendCode(email),
    onSuccess: (response) => {
      setCode('');
      setCodeError('');
      startTimer(response.expiresIn);
    },
    onError: (error: AxiosError<ApiErrorData>) => {
      setCodeError(
        resolveErrorMessage(
          error,
          { EMAIL_CODE_RATE_LIMITED: '잠시 후 다시 시도해주세요.' },
          '재전송에 실패했습니다.',
        ),
      );
    },
  });

  const { mutate: verifyCode, isPending: isVerifying } = useMutation({
    mutationFn: () => postPasswordResetVerifyCode(email, code),
    onSuccess: (response) => {
      navigateOnce({
        pathname: '/(auth)/reset-password',
        params: { resetToken: response.resetToken },
      });
    },
    onError: (error: AxiosError<ApiErrorData>) => {
      setCodeError(
        resolveErrorMessage(
          error,
          {
            INVALID_EMAIL_CODE: '인증번호가 올바르지 않습니다.',
            EMAIL_CODE_EXPIRED: '유효시간이 만료되었습니다. 다시 시도해주세요.',
          },
          '인증에 실패했습니다. 다시 시도해주세요.',
        ),
      );
    },
  });

  const verificationStatus: VerificationStatus =
    isSending || isResending
      ? 'disabled'
      : step === 'verify'
        ? 'resend'
        : emailValid
          ? 'enabled'
          : 'disabled';

  return (
    <ScreenLayout withKeyboard style={styles.container}>
      <ArrowLeftBar onPress={() => router.back()} title="비밀번호 찾기" />
      <View style={styles.progressWrapper}>
        <ProgressBar step={1} />
      </View>

      <View style={styles.content}>
        <Typography size="xxl" weight="semiBold" style={styles.title}>
          가입한 이메일을 입력해 주세요
        </Typography>

        <View style={styles.fields}>
          <TextField
            placeholder="user@example.com"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setServerError('');
            }}
            onBlur={() => setEmailTouched(true)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={step === 'email'}
            errorMessage={emailError}
            rightElement={
              <VerificationButton
                status={verificationStatus}
                onPress={step === 'email' ? () => sendCode() : () => resendCode()}
              />
            }
          />

          {step === 'verify' && (
            <TextField
              placeholder="인증번호 6자리를 입력해주세요"
              value={code}
              onChangeText={(text) => {
                setCode(text);
                if (!isExpired) setCodeError('');
              }}
              keyboardType="number-pad"
              maxLength={6}
              errorMessage={codeError || undefined}
              rightElement={<Text style={styles.timer}>{formatTime(timeLeft)}</Text>}
            />
          )}
        </View>
      </View>

      <CTAContainer style={styles.cta}>
        <BottomCTA
          label="다음"
          onPress={() => verifyCode()}
          variant="dark"
          disabled={!canNext || isVerifying}
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
    paddingTop: 38,
  },
  title: {
    marginBottom: 34,
  },
  fields: {
    gap: 13,
  },
  progressWrapper: {
    paddingHorizontal: spacing.xl,
  },
  cta: {
    paddingHorizontal: spacing.xl,
    paddingTop: 16,
  },
  timer: {
    fontFamily: typography.family.base,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    color: colors.text.error,
  },
});
