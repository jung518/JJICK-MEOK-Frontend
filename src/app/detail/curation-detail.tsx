import { Text, View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ScreenLayout } from '@/src/components/Layout/ScreenLayout';
import { Loading } from '@/src/components/Loading/Loading';
import ArrowLeftBar from '@/src/components/Bar/ArrowLeftBar';
import ChipBadge from '@/src/components/Chip/ChipBadge';
import CurationDetailCard from '@/src/components/Card/CurationDetailCard';
import BottomNavigation from '@/src/components/Nav/BottomNavigation';
import type { TabKey } from '@/src/components/Nav/BottomNav';
import { colors } from '@/src/constants/colors';
import { useNavigateOnce } from '@/src/hooks/useNavigateOnce';
import { getCurationDetailPageData } from '@/src/api/pages';
import { assignUniqueVariants } from '@/src/utils/tagVariant';
import { formatDday, getActivityTypeLabel } from '@/src/utils/activity';
import { useApiErrorMessage } from '@/src/hooks/useApiErrorMessage';
import { ErrorBox } from '@/src/components/EmptyState/ErrorBox';
import { TwoColumnGrid } from '@/src/components/Layout/TwoColumnGrid';

const TAB_TO_ROUTE: Record<TabKey, string> = {
  home: '/home',
  category: '/category',
  personalize: '/custom',
  heart: '/wishlist',
  my: '/mypage',
};

export default function CurationDetailScreen() {
  const router = useRouter();
  const navigateOnce = useNavigateOnce();
  const insets = useSafeAreaInsets();
  const { curationKey } = useLocalSearchParams<{ curationKey?: string }>();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['curation-detail', curationKey],
    queryFn: ({ pageParam }) => getCurationDetailPageData(curationKey!, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.nextPage : undefined),
    enabled: !!curationKey,
  });

  const curationData = data?.pages[0];

  const hasError = isError || !curationKey;

  const apiError = useApiErrorMessage(isError, error, '큐레이션 정보를 불러오지 못했어요. 다시 시도해주세요.');
  const errorMessage = !curationKey ? '큐레이션 정보를 찾을 수 없어요.' : apiError.message;
  const isRetriable = hasError && !!curationKey && apiError.isRetriable;

  const retry = () => {
    refetch();
  };

  const tags = assignUniqueVariants((curationData?.hashtags ?? []).slice(0, 2));
  const allActivities = data?.pages.flatMap((p) => p.activities) ?? [];
  const uniqueActivities = Array.from(new Map(allActivities.map((a) => [a.id, a])).values());
  const curationActivities = uniqueActivities.map((activity) => ({
    id: activity.id,
    category: getActivityTypeLabel(activity.activityType),
    dday: formatDday(activity.deadline),
    title: activity.title,
    thumbnailUrl: activity.thumbnailUrl,
    initialSaved: activity.liked,
  }));

  return (
    <ScreenLayout style={{ backgroundColor: colors.neutral.white, paddingTop: insets.top }}>
      <ArrowLeftBar onPress={() => router.back()} />
      {hasError ? (
        <View style={styles.errorBox}>
          <ErrorBox message={errorMessage!} onRetry={isRetriable ? retry : undefined} />
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          scrollEventThrottle={16}
          onScroll={(e) => {
            const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
            const isNearBottom =
              layoutMeasurement.height + contentOffset.y >= contentSize.height - 200;
            if (isNearBottom && hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
        >
          <View style={styles.titleBlock}>
            <Text style={styles.title}>{curationData?.title ?? ''}</Text>
            <Text style={styles.subtitle}>{curationData?.subtitle ?? ''}</Text>
          </View>
          <View style={styles.tagsRow}>
            {tags.map((tag) => (
              <ChipBadge key={tag.label} label={tag.label} variant={tag.variant} />
            ))}
          </View>
          <View style={styles.listContent}>
            {isLoading ? (
              <View style={styles.loadingBox}>
                <Loading />
              </View>
            ) : (
              <TwoColumnGrid
                items={curationActivities}
                keyExtractor={(activity) => activity.id}
                style={styles.grid}
                renderItem={(activity) => (
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => navigateOnce(`/detail/${activity.id}`)}
                  >
                    <CurationDetailCard
                      activityId={activity.id}
                      category={activity.category}
                      dday={activity.dday}
                      title={activity.title}
                      thumbnailUrl={activity.thumbnailUrl}
                      initialSaved={activity.initialSaved}
                    />
                  </TouchableOpacity>
                )}
              />
            )}
            {isFetchingNextPage && (
              <View style={styles.nextPageLoadingBox}>
                <Loading />
              </View>
            )}
          </View>
        </ScrollView>
      )}
      <View style={styles.navWrapper}>
        <BottomNavigation
          activeTab="home"
          onTabChange={(tab: TabKey) => navigateOnce(TAB_TO_ROUTE[tab])}
        />
        <View style={[styles.navBottomFiller, { height: Math.max(insets.bottom, 25) }]} />
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  titleBlock: {
    gap: 7,
    paddingHorizontal: 20,
    marginTop: 17,
  },
  title: {
    color: '#222',
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 24,
    letterSpacing: -0.48,
  },
  subtitle: {
    color: '#666',
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    letterSpacing: -0.28,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    marginTop: 14,
  },
  listContent: {
    paddingBottom: 140,
  },
  loadingBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  nextPageLoadingBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
  errorBox: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 16,
  },
  grid: {
    gap: 22,
    paddingTop: 27,
    paddingHorizontal: 26,
  },
  navWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  navBottomFiller: {
    backgroundColor: colors.neutral.white,
  },
});
