import { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { ScreenLayout } from '@/src/components/Layout/ScreenLayout';
import { Loading } from '@/src/components/Loading/Loading';
import CardStack from '@/src/components/Card/CardStack';
import { Typography } from '@/src/components/Typography/Typography';
import { getPersonalizationActivities } from '@/src/api/activities';
import { getCustomPageData } from '@/src/api/pages';
import { getTagVariant } from '@/src/utils/tagVariant';
import { getDaysLeftFromDate } from '@/src/utils/activity';
import { useApiErrorMessage } from '@/src/hooks/useApiErrorMessage';
import { ErrorBox } from '@/src/components/EmptyState/ErrorBox';
import { colors } from '@/src/constants/colors';
import { useNavigateOnce } from '@/src/hooks/useNavigateOnce';
import type { Activity } from '@/src/types/activities';
import type { PersonalizationActivity } from '@/src/types/activities';

function pickRandomTags(tags: string[], count: number): string[] {
  const shuffled = [...tags].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function toActivity(item: PersonalizationActivity): Activity {
  const daysLeft = getDaysLeftFromDate(item.recruitEndAt);
  return {
    id: String(item.id),
    title: item.title,
    days: Math.max(0, daysLeft),
    tags: pickRandomTags(item.tags ?? [], 3).map((tag, i) => {
      const label = tag.startsWith('#') ? tag.slice(1) : tag;
      return { label, type: getTagVariant(label, i) };
    }),
    imageUrl: item.thumbnailUrl,
    favoriteId: item.activityFavoriteId ?? undefined,
    personalizationScore: item.personalizationScore,
  };
}

export default function CustomScreen() {
  const insets = useSafeAreaInsets();
  const navigateOnce = useNavigateOnce();

  const { data: pageData } = useQuery({
    queryKey: ['pages', 'custom'],
    queryFn: () => getCustomPageData(),
  });

  const {
    data: rawActivities,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['personalization-activities'],
    queryFn: getPersonalizationActivities,
  });

  const activities = useMemo<Activity[]>(
    () =>
      (rawActivities ?? [])
        .filter((item) => getDaysLeftFromDate(item.recruitEndAt) >= 0)
        .map(toActivity),
    [rawActivities],
  );
  const nickname = pageData?.nickname ?? '';

  const { message: errorMessage, isRetriable } = useApiErrorMessage(
    isError,
    error,
    '추천 활동을 불러오지 못했어요. 다시 시도해주세요.',
  );

  const handlePressCard = (activity: Activity) => {
    navigateOnce(`/detail/${activity.id}`);
  };

  return (
    <ScreenLayout style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.bar}>
        <Text style={styles.barText}>
          {nickname ? `${nickname}님 취향에 맞춰 골라봤어요!` : ' '}
        </Text>
      </View>

      <View style={styles.cardArea}>
        {isLoading ? (
          <Loading />
        ) : errorMessage ? (
          <View style={styles.messageBox}>
            <ErrorBox message={errorMessage} onRetry={isRetriable ? () => refetch() : undefined} />
          </View>
        ) : activities.length === 0 ? (
          <View style={styles.messageBox}>
            <Typography size="sm" weight="medium" color="secondary" style={styles.errorText}>
              추천 데이터가 없어요
            </Typography>
          </View>
        ) : (
          <CardStack activities={activities} onPressCard={handlePressCard} />
        )}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#FFFFFF',
  },
  bar: {
    height: 60,
    paddingHorizontal: 22,
    paddingVertical: 17,
    justifyContent: 'center',
  },
  barText: {
    fontFamily: 'Pretendard-SemiBold',
    fontWeight: '600',
    fontSize: 22,
    color: colors.text.primary,
  },
  cardArea: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 52,
  },
  messageBox: {
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 16,
  },
  errorText: {
    textAlign: 'center',
  },
});
