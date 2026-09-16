import { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { ScreenLayout } from '@/src/components/Layout/ScreenLayout';
import { Loading } from '@/src/components/Loading/Loading';
import CardStack from '@/src/components/Card/CardStack';
import { Typography } from '@/src/components/Typography/Typography';
import { getPersonalizationActivities } from '@/src/api/activities';
import { getCustomPageData } from '@/src/api/pages';
import { getTagVariant } from '@/src/utils/tagVariant';
import { getDaysLeftFromDate } from '@/src/utils/activity';
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

  const errorMessage = (() => {
    if (!isError) return null;
    const err = error as AxiosError;
    if (err.response?.status === 401) return '로그인 시간이 만료되었어요. 다시 로그인해주세요.';
    if (err.message?.includes('Network Error') || err.code === 'ERR_NETWORK')
      return '네트워크 연결을 확인해주세요.';
    return '추천 활동을 불러오지 못했어요. 다시 시도해주세요.';
  })();

  const isRetriable = isError && (error as AxiosError)?.response?.status !== 401;

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
            <Typography size="sm" weight="medium" color="secondary" style={styles.errorText}>
              {errorMessage}
            </Typography>
            {isRetriable && (
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => refetch()}
                activeOpacity={0.7}
              >
                <Typography size="sm" weight="medium" color="secondary">
                  다시 시도
                </Typography>
              </TouchableOpacity>
            )}
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
  retryButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
});
