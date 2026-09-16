import { useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import ArrowLeftBar from '@/src/components/Bar/ArrowLeftBar';
import ProgressBar from '@/src/components/Bar/ProgressBar';
import { BottomCTA } from '@/src/components/Button/BottomCTA';
import { CTAContainer } from '@/src/components/Layout/CTAContainer';
import { ScreenLayout } from '@/src/components/Layout/ScreenLayout';
import { Typography } from '@/src/components/Typography/Typography';
import { colors } from '@/src/constants/colors';
import { getTags } from '@/src/api/user';
import { useOnboardingStore } from '@/src/store/onboardingStore';
import { useNavigateOnce } from '@/src/hooks/useNavigateOnce';

const GROUP_LABELS: Record<string, string> = {
  MOOD: '선호하는 분위기',
  INTENSITY: '나에게 맞는 텐션',
  PURPOSE: '참여 목적',
  DURATION: '가능한 참여 기간',
  SIZE: '편하게 느끼는 인원',
};

const GROUP_ORDER = ['MOOD', 'INTENSITY', 'PURPOSE', 'DURATION', 'SIZE'];

export default function OnboardingStep4() {
  const router = useRouter();
  const navigateOnce = useNavigateOnce();
  const { setPreferenceTagIds, preferenceTagIds } = useOnboardingStore();
  const [selectedTagIds, setSelectedTagIds] = useState<Set<number>>(new Set(preferenceTagIds));

  const {
    data: tags = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['tags', 'PREFERENCE_TAG'],
    queryFn: () => getTags('PREFERENCE_TAG'),
  });

  const tagsByGroup = useMemo(() => {
    const map: Record<string, typeof tags> = {};
    tags.forEach((tag) => {
      const group = tag.tagGroupType ?? 'ETC';
      if (!map[group]) map[group] = [];
      map[group].push(tag);
    });
    return map;
  }, [tags]);

  const groups = useMemo(
    () => GROUP_ORDER.filter((g) => (tagsByGroup[g]?.length ?? 0) > 0),
    [tagsByGroup],
  );

  const toggleTag = (id: number) => {
    setSelectedTagIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < 8) {
        next.add(id);
      }
      return next;
    });
  };

  const allCategoriesSelected = useMemo(
    () =>
      groups.every((group) => (tagsByGroup[group] ?? []).some((tag) => selectedTagIds.has(tag.id))),
    [groups, selectedTagIds, tagsByGroup],
  );

  return (
    <ScreenLayout style={styles.container}>
      <View style={styles.progressContainer}>
        <ProgressBar step={3} />
      </View>
      <ArrowLeftBar onPress={() => router.back()} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerBlock}>
          <Typography size="xxxl" weight="semiBold">
            {'어떤 유형의\n활동이 끌리나요?'}
          </Typography>
          <Typography size="md" style={styles.subtitle}>
            최대 8개까지 선택해주세요.
          </Typography>
        </View>

        {isLoading ? (
          <ActivityIndicator color={colors.text.secondary} />
        ) : isError ? (
          <View style={styles.errorContainer}>
            <Typography size="md" style={styles.errorText}>
              데이터를 불러오지 못했어요.
            </Typography>
            <TouchableOpacity onPress={() => refetch()} style={styles.retryButton}>
              <Typography size="md" weight="semiBold">
                다시 시도
              </Typography>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.sectionsContainer}>
            {groups.map((group) => (
              <View key={group} style={styles.section}>
                <View style={styles.sectionLabelRow}>
                  <Typography size="md" weight="medium" style={styles.sectionLabel}>
                    {GROUP_LABELS[group]}
                  </Typography>
                  <Typography size="sm" weight="medium" color="tertiary">
                    (1개 이상)
                  </Typography>
                </View>
                <View style={styles.chipsRow}>
                  {tagsByGroup[group].map((tag) => {
                    const isSelected = selectedTagIds.has(tag.id);
                    return (
                      <TouchableOpacity
                        key={tag.id}
                        activeOpacity={0.7}
                        style={[styles.chip, isSelected && styles.chipSelected]}
                        onPress={() => toggleTag(tag.id)}
                      >
                        <Typography
                          size="lg"
                          weight="medium"
                          style={isSelected ? styles.chipTextSelected : styles.chipText}
                        >
                          {tag.name}
                        </Typography>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <CTAContainer style={styles.cta}>
        <BottomCTA
          label="다음"
          onPress={() => {
            setPreferenceTagIds(Array.from(selectedTagIds));
            navigateOnce('/onboarding/step5');
          }}
          variant="dark"
          disabled={!allCategoriesSelected}
        />
      </CTAContainer>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.neutral.white },
  progressContainer: { paddingHorizontal: 20, paddingTop: 9, paddingBottom: 7 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 99,
    gap: 40,
  },
  headerBlock: {
    gap: 10,
  },
  subtitle: {
    color: colors.text.secondary,
    lineHeight: 20,
  },
  sectionsContainer: {
    gap: 32,
  },
  section: {
    gap: 16,
  },
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  sectionLabel: {
    color: colors.text.secondary,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  chip: {
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 7,
    backgroundColor: colors.neutral.surface,
  },
  chipSelected: {
    backgroundColor: colors.primary.main,
  },
  chipText: {
    color: colors.text.tertiary,
  },
  chipTextSelected: {
    color: colors.text.primary,
  },
  cta: { paddingHorizontal: 20, paddingTop: 16 },
  errorContainer: { alignItems: 'center', gap: 12, paddingTop: 20 },
  errorText: { color: colors.text.secondary },
  retryButton: { paddingHorizontal: 20, paddingVertical: 8 },
});
