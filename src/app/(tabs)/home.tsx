import { useState, useMemo, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  PanResponder,
  Dimensions,
} from 'react-native';
import { Loading } from '@/src/components/Loading/Loading';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { ScreenLayout } from '@/src/components/Layout/ScreenLayout';
import TopNav from '@/src/components/Nav/TopNav';
import Program from '@/assets/images/Program.svg';
import OneDay from '@/assets/images/OneDay.svg';
import Event from '@/assets/images/Event.svg';
import Club from '@/assets/images/Club.svg';
import RecommendationCard from '@/src/components/Card/RecommendationCard';
import RankingCard from '@/src/components/Card/RankingCard';
import Curation from '@/src/components/Card/Curation';
import Indicator from '@/src/components/Indicator/Indicator';
import { getTags } from '@/src/api/user';
import { getHomeData } from '@/src/api/pages';
import { getActivityTypeLabel, isNotExpired } from '@/src/utils/activity';
import { useApiErrorMessage } from '@/src/hooks/useApiErrorMessage';
import { ErrorBox } from '@/src/components/EmptyState/ErrorBox';
import { colors } from '@/src/constants/colors';
import { useNavigateOnce } from '@/src/hooks/useNavigateOnce';
import { assignUniqueVariants } from '@/src/utils/tagVariant';
import { CURATION_KEY_BY_TITLE } from '@/src/constants/curationThemes';
import type { Activity, CurationThemeCard } from '@/src/types/activities';

const SCREEN_WIDTH = Math.min(Dimensions.get('window').width, 430);
const CURATION_ITEM_WIDTH = SCREEN_WIDTH * (211 / 375);

const RANKING_PAGE_SIZE = 3;
const RANKING_CARD_HEIGHT = 72;
const RANKING_CARD_GAP = 27; // 카드-구분선-카드: 13 + 1(선) + 13
const RANKING_PAGE_PADDING_TOP = 0;
const RANKING_PAGE_PADDING_BOTTOM = 22;
const RANKING_PAGE_HEIGHT =
  RANKING_PAGE_PADDING_TOP +
  RANKING_PAGE_PADDING_BOTTOM +
  RANKING_PAGE_SIZE * RANKING_CARD_HEIGHT +
  (RANKING_PAGE_SIZE - 1) * RANKING_CARD_GAP;

function chunk<T>(items: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < items.length; i += size) result.push(items.slice(i, i + size));
  return result;
}

function toCurationActivity(item: CurationThemeCard): Activity {
  return {
    id: item.title,
    title: item.title,
    days: 0,
    tags: assignUniqueVariants(
      (item.hashtags ?? []).slice(0, 2).map((tag) => (tag.startsWith('#') ? tag.slice(1) : tag)),
    ).map(({ label, variant }) => ({ label, type: variant })),
    imageUrl: item.thumbnailUrl,
  };
}

type IconConfig = {
  Svg: React.ComponentType<{ width?: number; height?: number; style?: object }>;
  label: string;
  route: string;
};

const ICON_CONFIG: Record<string, IconConfig> = {
  프로그램: { Svg: Program, label: '프로그램', route: '/activity-categories/program' },
  원데이: { Svg: OneDay, label: '원데이', route: '/activity-categories/oneday' },
  '행사·강연': { Svg: Event, label: '행사·강연', route: '/activity-categories/festival' },
  동아리: { Svg: Club, label: '동아리', route: '/activity-categories/club' },
};

const DEFAULT_ICONS: IconConfig[] = [
  { Svg: Program, label: '프로그램', route: '/activity-categories/program' },
  { Svg: OneDay, label: '원데이', route: '/activity-categories/oneday' },
  { Svg: Event, label: '행사·강연', route: '/activity-categories/festival' },
  { Svg: Club, label: '동아리', route: '/activity-categories/club' },
];

const PULL_THRESHOLD = 60;

export default function HomeScreen() {
  const navigateOnce = useNavigateOnce();
  const insets = useSafeAreaInsets();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [rankPageIndex, setRankPageIndex] = useState(0);
  const scrollYRef = useRef(0);
  const isRefreshingRef = useRef(false);
  const refetchRef = useRef<() => Promise<any>>(() => Promise.resolve());

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: (_, { dy, dx }) =>
        scrollYRef.current <= 0 && dy > 8 && dy > Math.abs(dx) * 2,
      onPanResponderRelease: (_, { dy }) => {
        if (dy * 0.4 >= PULL_THRESHOLD && !isRefreshingRef.current) {
          isRefreshingRef.current = true;
          setIsRefreshing(true);
          refetchRef.current().finally(() => {
            isRefreshingRef.current = false;
            setIsRefreshing(false);
          });
        }
      },
      onPanResponderTerminate: () => {},
    }),
  ).current;

  const {
    data: homeData,
    refetch,
    isError,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['home'],
    queryFn: () => getHomeData(),
  });

  const { data: tagsData } = useQuery({
    queryKey: ['tags', 'ACTIVITY_CATEGORY'],
    queryFn: () => getTags('ACTIVITY_CATEGORY'),
  });

  const icons = useMemo(() => {
    if (!tagsData || tagsData.length === 0) return DEFAULT_ICONS;
    const availableNames = new Set(tagsData.map((tag) => tag.name));
    const mapped = Object.keys(ICON_CONFIG)
      .filter((name) => availableNames.has(name))
      .map((name) => ICON_CONFIG[name]);
    return mapped.length > 0 ? mapped : DEFAULT_ICONS;
  }, [tagsData]);

  const featured = homeData?.featured.activities ?? [];
  const recommended = (homeData?.expandedRecommendation.activities ?? []).filter((a) =>
    isNotExpired(a.deadline),
  );
  // 인기 활동은 백엔드가 정렬해서 내려주므로 프론트에서 재정렬하지 않는다.
  const displayCards = (homeData?.popular.activities ?? []).filter((a) => isNotExpired(a.deadline));
  const rankingPageCount = Math.ceil(displayCards.length / RANKING_PAGE_SIZE);

  refetchRef.current = refetch;

  const { message: homeErrorMessage, isSessionExpired } = useApiErrorMessage(
    isError,
    error,
    '홈 화면을 불러오지 못했어요. 다시 시도해주세요.',
  );

  const nickname = homeData?.user?.nickname ?? '';
  const curationActivities = featured.map(toCurationActivity);

  return (
    <ScreenLayout style={{ backgroundColor: '#FFF' }}>
      <View style={[styles.topNavWrapper, { paddingTop: insets.top }]}>
        <TopNav onSearchPress={() => navigateOnce('/search')} />
      </View>
      <View style={{ flex: 1 }} {...panResponder.panHandlers}>
        {isRefreshing && (
          <View style={styles.loadingArea}>
            <Loading />
          </View>
        )}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          onScroll={(e) => {
            scrollYRef.current = e.nativeEvent.contentOffset.y;
          }}
          scrollEventThrottle={16}
        >
          <View style={styles.pickSection}>
            <Text style={styles.pickTitle}>{nickname}님을 위한 찍먹 PICK</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.curationSection}
            >
              {curationActivities.map((activity) => {
                const curationKey = CURATION_KEY_BY_TITLE[activity.title];
                return (
                  <View key={activity.id} style={styles.curationItem}>
                    <Curation
                      activity={activity}
                      curationKey={curationKey}
                      onPress={() =>
                        curationKey &&
                        navigateOnce(`/detail/curation-detail?curationKey=${curationKey}`)
                      }
                    />
                  </View>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.iconSection}>
            <View style={styles.iconRow}>
              {icons.map(({ Svg, label, route }) => (
                <TouchableOpacity
                  key={label}
                  style={styles.iconItem}
                  activeOpacity={0.7}
                  onPress={() => navigateOnce(route)}
                >
                  <View style={styles.iconContainer}>
                    <Svg width={44} height={45} style={{ flexShrink: 0 }} />
                  </View>
                  <Text style={styles.iconLabel}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.contentSheet}>
            {(isError || displayCards.length > 0) && (
              <View style={styles.popularSection}>
                <View style={styles.popularRow}>
                  <Text style={styles.popularTitle}>인기 활동</Text>
                </View>
                {isError ? (
                  <View style={styles.errorBox}>
                    <ErrorBox
                      message={homeErrorMessage!}
                      onRetry={!isSessionExpired ? refetch : undefined}
                      size="md"
                      color="primary"
                      retrySize="md"
                      retryColor="primary"
                      retryBorderColor={colors.border.active}
                    />
                  </View>
                ) : (
                  <>
                    <ScrollView
                      horizontal
                      pagingEnabled
                      showsHorizontalScrollIndicator={false}
                      style={styles.rankingPageScroll}
                      scrollEventThrottle={16}
                      onScroll={(e) => {
                        const page = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
                        setRankPageIndex(page);
                      }}
                    >
                      {chunk(displayCards, RANKING_PAGE_SIZE).map((page, pageIndex) => (
                        <View key={pageIndex} style={[styles.rankingPage, { width: SCREEN_WIDTH }]}>
                          {page.map((activity, i) => (
                            <View key={activity.id} style={{ alignSelf: 'stretch' }}>
                              <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => navigateOnce(`/detail/${activity.id}`)}
                              >
                                <RankingCard
                                  rank={pageIndex * RANKING_PAGE_SIZE + i + 1}
                                  category={getActivityTypeLabel(activity.activityType)}
                                  title={activity.title}
                                  showAD={activity.isAd}
                                  deadline={activity.deadline}
                                  thumbnailUrl={activity.thumbnailUrl}
                                />
                              </TouchableOpacity>
                              {i < page.length - 1 && (
                                <View style={styles.cardDividerRow}>
                                  <View style={styles.cardDivider} />
                                </View>
                              )}
                            </View>
                          ))}
                        </View>
                      ))}
                    </ScrollView>
                    {rankingPageCount > 1 && (
                      <Indicator count={rankingPageCount} activeIndex={rankPageIndex} />
                    )}
                  </>
                )}
              </View>
            )}

            <View style={styles.recommendSection}>
              <View style={styles.recommendHeader}>
                <Text style={styles.recommendTitle}>내 취향 넓혀보기</Text>
                <Text style={styles.recommendSubtitle}>
                  평소 관심 없던 활동도 가볍게 찍먹해봐요
                </Text>
              </View>
              {isError ? (
                <View style={styles.recommendErrorBox}>
                  <ErrorBox
                    message={homeErrorMessage!}
                    onRetry={!isSessionExpired ? refetch : undefined}
                    size="md"
                    color="primary"
                    retrySize="md"
                    retryColor="primary"
                    retryBorderColor={colors.border.active}
                  />
                </View>
              ) : isLoading && !isRefreshing ? (
                <View style={styles.recommendErrorBox}>
                  <Loading />
                </View>
              ) : recommended.length === 0 ? (
                <View style={styles.recommendErrorBox}>
                  <Text style={styles.errorText}>아직 추천할 활동이 부족해요.</Text>
                </View>
              ) : (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.cardsContainer}
                >
                  {recommended.map((activity) => (
                    <TouchableOpacity
                      key={activity.id}
                      activeOpacity={0.7}
                      onPress={() => navigateOnce(`/detail/${activity.id}`)}
                    >
                      <RecommendationCard
                        category={getActivityTypeLabel(activity.activityType)}
                        title={activity.title}
                        hashtags={activity.hashtags}
                        deadline={activity.deadline}
                        thumbnailUrl={activity.thumbnailUrl}
                      />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
            <View style={styles.bottomSpacer} />
          </View>
        </ScrollView>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  topNavWrapper: {
    backgroundColor: '#FFF',
  },
  bottomSpacer: {
    height: 25,
    alignSelf: 'stretch',
    backgroundColor: '#FFF',
  },
  loadingArea: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#FFF',
  },
  scrollContent: {
    paddingBottom: 140,
  },
  pickSection: {
    gap: 18,
    marginTop: 18,
    marginBottom: 15,
  },
  pickTitle: {
    color: '#222',
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.36,
    marginLeft: 20,
  },
  curationSection: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
  },
  curationItem: {
    width: CURATION_ITEM_WIDTH,
  },
  iconSection: {
    backgroundColor: '#FFF',
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 33,
  },
  iconItem: {
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    width: 52,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 26,
    backgroundColor: '#F5F5F5',
  },
  iconLabel: {
    color: '#222',
    textAlign: 'center',
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
  },
  contentSheet: {
    backgroundColor: '#FFF',
    flexGrow: 1,
  },
  recommendSection: {
    gap: 17,
    marginTop: 50,
    alignSelf: 'stretch',
  },
  recommendHeader: {
    gap: 7,
    marginLeft: 20,
  },
  recommendTitle: {
    color: '#222',
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.36,
  },
  recommendSubtitle: {
    color: '#666',
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: -0.28,
  },
  cardsContainer: {
    gap: 12,
    paddingHorizontal: 20,
  },
  popularSection: {
    flexDirection: 'column',
    alignSelf: 'stretch',
    paddingTop: 53,
    gap: 18,
  },
  popularRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
  },
  popularTitle: {
    color: '#222',
    textAlign: 'center',
    fontFamily: 'Pretendard-SemiBold',
    fontWeight: '600',
    fontSize: 18,
    letterSpacing: -0.36,
    marginLeft: 20,
  },
  recommendErrorBox: {
    marginHorizontal: 20,
    borderRadius: 14,
    paddingVertical: 36,
    paddingHorizontal: 28,
    alignItems: 'center',
    gap: 16,
  },
  errorBox: {
    marginHorizontal: 20,
    marginBottom: 40,
    borderRadius: 14,
    paddingVertical: 36,
    paddingHorizontal: 28,
    alignItems: 'center',
    gap: 16,
  },
  errorText: {
    color: '#222',
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    textAlign: 'center',
  },
  rankingPageScroll: {
    height: RANKING_PAGE_HEIGHT,
  },
  rankingPage: {
    paddingTop: RANKING_PAGE_PADDING_TOP,
    paddingRight: 29,
    paddingBottom: RANKING_PAGE_PADDING_BOTTOM,
    paddingLeft: 28,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  cardDividerRow: {
    height: RANKING_CARD_GAP,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardDivider: {
    width: '100%',
    height: 1,
    backgroundColor: '#EAEAEA',
  },
});
