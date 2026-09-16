import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ApiErrorData } from '@/src/types/api';
import ArrowLeftBar from '@/src/components/Bar/ArrowLeftBar';
import GenderButton from '@/src/components/Button/GenderButton';
import { BottomCTA } from '@/src/components/Button/BottomCTA';
import Checkbox from '@/src/components/Icon/Checkbox';
import { SelectField } from '@/src/components/Input/SelectField';
import { TextField } from '@/src/components/Input/TextField';
import { CTAContainer } from '@/src/components/Layout/CTAContainer';
import { ScreenLayout } from '@/src/components/Layout/ScreenLayout';
import { Typography } from '@/src/components/Typography/Typography';
import ProgressBar from '@/src/components/Bar/ProgressBar';
import { colors } from '@/src/constants/colors';
import { spacing } from '@/src/constants/spacing';
import { postCreateProfile } from '@/src/api/user';
import { useOnboardingStore } from '@/src/store/onboardingStore';
import { useAuthStore } from '@/src/store/authStore';
import { useNavigateOnce } from '@/src/hooks/useNavigateOnce';

type Gender = '남성' | '여성' | '선택 안함';

const STATUS_OPTIONS = [
  '대학생이에요',
  '직장인이에요',
  '취업/진로를 준비 중이에요',
  '프리랜서/자유롭게 일하고 있어요',
  '기타',
];

const GENDER_MAP = { 남성: 'MALE', 여성: 'FEMALE', '선택 안함': 'NONE' } as const;
const STATUS_MAP = {
  대학생이에요: 'STUDENT',
  직장인이에요: 'WORKER',
  '취업/진로를 준비 중이에요': 'JOB_SEEKER',
  '프리랜서/자유롭게 일하고 있어요': 'FREELANCER',
  기타: 'ETC',
} as const;

export default function ProfileSetupScreen() {
  const router = useRouter();
  const navigateOnce = useNavigateOnce();
  const canGoBack = router.canGoBack();
  const saveNickname = useOnboardingStore((s) => s.setNickname);
  const setRegistrationStatus = useAuthStore((s) => s.setRegistrationStatus);

  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState<Gender | null>(null);
  const [birthDate, setBirthDate] = useState('');
  const [status, setStatus] = useState('');
  const [serviceAgree, setServiceAgree] = useState(false);
  const [marketingAgree, setMarketingAgree] = useState(false);
  const [formError, setFormError] = useState('');

  const allAgree = serviceAgree && marketingAgree;

  const toggleAll = () => {
    const next = !allAgree;
    setServiceAgree(next);
    setMarketingAgree(next);
  };

  const handleBirthdayChange = (text: string) => {
    setBirthDate(text.replace(/\D/g, ''));
  };

  const parseBirthDate = (value: string): Date | null => {
    if (value.length !== 8) return null;
    const year = parseInt(value.slice(0, 4), 10);
    const month = parseInt(value.slice(4, 6), 10);
    const day = parseInt(value.slice(6, 8), 10);
    if (month < 1 || month > 12) return null;
    if (day < 1 || day > 31) return null;
    const date = new Date(year, month - 1, day);
    if (date.getMonth() !== month - 1 || date.getDate() !== day) return null;
    if (date > new Date()) return null;
    if (year < 1900 || year > new Date().getFullYear()) return null;
    return date;
  };

  const getAge = (birth: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const getBirthdayError = (
    length: number,
    parsed: Date | null,
    ageValid: boolean,
  ): string | undefined => {
    if (length !== 8) return undefined;
    if (parsed === null) return '존재하지 않은 날짜입니다.';
    if (!ageValid) return '찍먹은 만 14세 이상부터 만 59세 이하까지 가입할 수 있습니다.';
    return undefined;
  };

  const isNicknameValid = nickname.length >= 2 && nickname.length <= 20;
  const nicknameError =
    nickname.length > 0 && nickname.length < 2 ? '2자 이상 입력해주세요.' : undefined;

  const parsedBirth = birthDate.length === 8 ? parseBirthDate(birthDate) : null;
  const age = parsedBirth ? getAge(parsedBirth) : null;
  const isAgeValid = age !== null && age >= 14 && age <= 59;
  const isBirthdayValid = parsedBirth !== null && isAgeValid;

  const birthdayError = getBirthdayError(birthDate.length, parsedBirth, isAgeValid);

  const isFormValid =
    isNicknameValid && isBirthdayValid && gender !== null && status !== '' && serviceAgree;

  const { mutate: createProfile, isPending } = useMutation({
    mutationFn: () => {
      const formatted = `${parsedBirth!.getFullYear()}-${String(parsedBirth!.getMonth() + 1).padStart(2, '0')}-${String(parsedBirth!.getDate()).padStart(2, '0')}`;
      return postCreateProfile({
        nickname,
        birthDate: formatted,
        gender: GENDER_MAP[gender!],
        status: STATUS_MAP[status as keyof typeof STATUS_MAP],
        serviceTermsAgreed: serviceAgree,
        privacyPolicyAgreed: serviceAgree,
        marketingAgreed: marketingAgree,
      });
    },
    onSuccess: (profile) => {
      setFormError('');
      setRegistrationStatus(profile.registrationStatus);
      saveNickname(nickname);
      router.replace('/(auth)/signup-complete');
    },
    onError: (error: AxiosError<ApiErrorData>) => {
      console.error('프로필 생성 실패', error);
      const message = error?.response?.data?.message;
      setFormError(message || '프로필 생성에 실패했어요. 다시 시도해주세요.');
    },
  });

  return (
    <ScreenLayout withKeyboard style={styles.container}>
      <ArrowLeftBar onPress={() => router.back()} title="프로필 설정" showBack={canGoBack} />
      <View style={styles.progressWrapper}>
        <ProgressBar step={3} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View style={styles.section}>
          <Typography size="lg" weight="medium" style={styles.label}>
            닉네임
          </Typography>
          <TextField
            placeholder="닉네임을 입력해주세요"
            value={nickname}
            onChangeText={(text) => {
              setNickname(text);
              setFormError('');
            }}
            helperText="2자 이상 20자 이하로 입력해 주세요"
            errorMessage={nicknameError}
            maxLength={20}
          />
        </View>

        <View style={styles.section}>
          <Typography size="lg" weight="medium" style={styles.label}>
            성별
          </Typography>
          <View style={styles.genderRow}>
            {(['남성', '여성', '선택 안함'] as Gender[]).map((g) => (
              <GenderButton
                key={g}
                label={g}
                selected={gender === g}
                onPress={() => setGender(g)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Typography size="lg" weight="medium" style={styles.label}>
            생년월일
          </Typography>
          <TextField
            placeholder="예) 20010101"
            value={birthDate}
            onChangeText={handleBirthdayChange}
            keyboardType="numeric"
            maxLength={8}
            errorMessage={birthdayError}
          />
        </View>

        <View style={styles.section}>
          <Typography size="lg" weight="medium" style={styles.label}>
            현재 어떤 상태이신가요?
          </Typography>
          <SelectField
            options={STATUS_OPTIONS}
            value={status || undefined}
            placeholder="선택하세요"
            onChange={setStatus}
          />
        </View>

        <View style={styles.agreeBox}>
          <View style={styles.agreeTopSection}>
            <TouchableOpacity style={styles.agreeRow} onPress={toggleAll} activeOpacity={0.7}>
              <Checkbox checked={allAgree} readOnly />
              <Typography size="lg" style={styles.agreeAllText}>
                전체 동의
              </Typography>
            </TouchableOpacity>
            <View style={styles.agreeDivider} />
          </View>

          <View style={styles.agreeSubItems}>
            <View style={styles.agreeRow}>
              <TouchableOpacity onPress={() => setServiceAgree((v) => !v)} activeOpacity={0.7}>
                <Checkbox checked={serviceAgree} readOnly />
              </TouchableOpacity>
              <Text style={styles.agreeItemText}>
                <Text onPress={() => navigateOnce('/terms/service')} style={styles.agreeUnderline}>
                  서비스 이용약관
                </Text>
                <Text> 및 </Text>
                <Text onPress={() => navigateOnce('/terms/privacy')} style={styles.agreeUnderline}>
                  개인정보 취급 방침
                </Text>
                <Text> 동의</Text>
              </Text>
            </View>

            <View style={styles.agreeRow}>
              <TouchableOpacity onPress={() => setMarketingAgree((v) => !v)} activeOpacity={0.7}>
                <Checkbox checked={marketingAgree} readOnly />
              </TouchableOpacity>
              <Text style={styles.agreeItemText}>
                <Text
                  onPress={() => navigateOnce('/terms/marketing')}
                  style={styles.agreeUnderline}
                >
                  마케팅 정보 수신 동의
                </Text>
                <Text> (선택)</Text>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <CTAContainer style={styles.cta}>
        {formError ? (
          <Typography size="sm" color="error" style={styles.errorText}>
            {formError}
          </Typography>
        ) : null}
        <BottomCTA
          label="다음"
          onPress={() => createProfile()}
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
  progressWrapper: {
    paddingHorizontal: spacing.xl,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.lg,
    gap: 30,
  },
  section: {
    gap: 9,
  },
  label: {
    lineHeight: 24,
  },
  genderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 19,
  },
  agreeBox: {
    marginTop: 65,
    paddingTop: 33,
    paddingBottom: 33,
    paddingLeft: 17,
    paddingRight: 48,
    gap: 10,
    borderRadius: 10,
    backgroundColor: colors.neutral.surface,
  },
  agreeTopSection: {
    gap: 27,
  },
  agreeDivider: {
    height: 2,
    backgroundColor: colors.border.light,
  },
  agreeSubItems: {
    gap: 9,
  },
  agreeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  agreeAllText: {
    color: colors.text.primary,
    lineHeight: 24,
  },
  agreeItemText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 12,
    lineHeight: 20,
    color: colors.text.primary,
  },
  agreeUnderline: {
    textDecorationLine: 'underline',
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
