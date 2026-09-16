import { useState, useCallback, useMemo, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
  TouchableOpacity,
  PanResponder,
} from 'react-native';
import { Loading } from '@/src/components/Loading/Loading';
import { useRouter, useFocusEffect } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ScreenLayout } from '@/src/components/Layout/ScreenLayout';
import { Dropdown } from '@/src/components/Filter/Dropdown';
import CategoryFilter from '@/src/components/Modal/CategoryFilter';
import { colors } from '@/src/constants/colors';
import { getTags } from '@/src/api/user';
import CategoryBar from '@/src/components/Bar/CategoryBar';
import ArrowLeftBar from '@/src/components/Bar/ArrowLeftBar';
import { Typography } from '@/src/components/Typography/Typography';
import CardSaved from '@/src/components/Card/CardSaved';
import { getFavoritesPageData } from '@/src/api/pages';
import type { HomeActivity } from '@/src/types/activities';
import { assignUniqueVariants, pickDiverseTags } from '@/src/utils/tagVariant';
import {
  ACTIVITY_TYPE_LABEL,
  formatDday,
  getActivityTypeLabel,
  isNotExpired,
} from '@/src/utils/activity';
import { useNavigateOnce } from '@/src/hooks/useNavigateOnce';

const SORT_MAP: Record<string, 'saved' | 'deadline'> = {
  담은순: 'saved',
  마감순: 'deadline',
};

const PULL_THRESHOLD = 60;

export default function ProgramListScreen() {
  const router = useRouter();
  const navigateOnce = useNavigateOnce();
  const [selectedTab, setSelectedTab] = useState('전체');
  const [selectedSort, setSelectedSort] = useState('담은순');
  const [showSortSheet, setShowSortSheet] = useState(false);
  const [removedIds, setRemovedIds] = useState<Set<number>>(new Set());
  const [isRefreshing, setIsRefreshing] = useState(false);
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
          setRemovedIds(new Set());
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
    data: rawActivities = [],
    refetch,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['favorites-page'],
    queryFn: async () => {
      const { activities } = await getFavoritesPageData();
      return activities;
    },
  });
  refetchRef.current = refetch;

  const activities = useMemo(() => {
    if (SORT_MAP[selectedSort] === 'deadline') {
      return [...rawActivities].sort((a, b) => a.deadline - b.deadline);
    }
    return rawActivities;
  }, [rawActivities, selectedSort]);

  const { data: tagsData } = useQuery({
    queryKey: ['tags', 'ACTIVITY_CATEGORY'],
    queryFn: () => getTags('ACTIVITY_CATEGORY'),
  });

  const tabOptions = useMemo(() => {
    if (!tagsData) return ['전체'];
    const availableNames = new Set(tagsData.map((t) => t.name));
    const ordered = Object.values(ACTIVITY_TYPE_LABEL).filter((name) => availableNames.has(name));
    return ['전체', ...ordered];
  }, [tagsData]);

  useFocusEffect(
    useCallback(() => {
      setSelectedTab('전체');
      setSelectedSort('담은순');
      setRemovedIds(new Set());
    }, []),
  );

  const filteredActivities = activities.filter((activity: HomeActivity) => {
    if (removedIds.has(activity.id)) return false;
    if (!isNotExpired(activity.deadline)) return false;
    if (selectedTab === '전체') return true;
    return getActivityTypeLabel(activity.activityType) === selectedTab;
  });

  const handleRemove = (activityId: number) => {
    setRemovedIds((prev) => new Set(prev).add(activityId));
  };

  return (
    <ScreenLayout style={{ backgroundColor: colors.neutral.white }}>
      <View style={styles.appBar}>
        <ArrowLeftBar onPress={() => router.back()} />
        <View style={styles.appBarTitle} pointerEvents="none">
          <Typography size="xl" weight="semiBold">
            찜
          </Typography>
        </View>
      </View>
      <CategoryBar
        tabs={tabOptions}
        selected={selectedTab}
        onSelect={setSelectedTab}
        gap={15}
        paddingHorizontal={26}
      />
      <View style={styles.scrollView} {...panResponder.panHandlers}>
        {isRefreshing && (
          <View style={styles.loadingArea}>
            <Loading />
          </View>
        )}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          onScroll={(e) => {
            scrollYRef.current = e.nativeEvent.contentOffset.y;
          }}
          scrollEventThrottle={16}
        >
          {isError ? (
            <View style={styles.emptyState}>
              <Typography size="lg" weight="medium" color="tertiary" style={styles.emptyText}>
                {'찜한 활동을 불러오지 못했어요.\n다시 시도해주세요.'}
              </Typography>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => refetch()}
                activeOpacity={0.7}
              >
                <Typography size="sm" weight="medium" color="secondary">
                  다시 시도
                </Typography>
              </TouchableOpacity>
            </View>
          ) : isLoading && !isRefreshing ? (
            <View style={styles.emptyState}>
              <Loading />
            </View>
          ) : filteredActivities.length === 0 ? (
            <View style={styles.emptyState}>
              <Typography size="lg" weight="medium" color="tertiary" style={styles.emptyText}>
                {'찜 한 활동이 없습니다.\n마음에 드는 활동에 하트를 눌러보세요.'}
              </Typography>
            </View>
          ) : (
            <>
              <View style={styles.filterRow}>
                <Dropdown label={selectedSort} onPress={() => setShowSortSheet(true)} />
              </View>
              <View style={styles.grid}>
                {Array.from({ length: Math.ceil(filteredActivities.length / 2) }, (_, rowIndex) => {
                  const rowItems = filteredActivities.slice(rowIndex * 2, rowIndex * 2 + 2);
                  const isLastRow = rowIndex === Math.ceil(filteredActivities.length / 2) - 1;
                  const isOddTotal = filteredActivities.length % 2 !== 0;
                  return (
                    <View key={rowItems[0]?.id ?? rowIndex} style={styles.row}>
                      {rowItems.map((activity) => (
                        <TouchableOpacity
                          key={activity.id}
                          style={styles.gridItem}
                          activeOpacity={0.9}
                          onPress={() => navigateOnce(`/detail/${activity.id}`)}
                        >
                          <CardSaved
                            activityId={activity.id}
                            dday={formatDday(activity.deadline)}
                            title={activity.title}
                            tags={assignUniqueVariants(pickDiverseTags(activity.hashtags))}
                            thumbnailUrl={activity.thumbnailUrl}
                            onRemove={handleRemove}
                          />
                        </TouchableOpacity>
                      ))}
                      {isLastRow && isOddTotal && <View style={styles.gridItem} />}
                    </View>
                  );
                })}
              </View>
            </>
          )}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </View>

      <Modal
        visible={showSortSheet}
        transparent
        statusBarTranslucent
        onRequestClose={() => setShowSortSheet(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setShowSortSheet(false)} />
        <View style={styles.sheetContainer}>
          <CategoryFilter
            title="정렬"
            options={['담은순', '마감순']}
            selected={selectedSort}
            optionGap={35}
            height={322}
            onSelect={(item) => {
              setSelectedSort(item);
              setShowSortSheet(false);
            }}
            onClose={() => setShowSortSheet(false)}
          />
        </View>
      </Modal>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  bottomSpacer: {
    height: 25,
    alignSelf: 'stretch',
    backgroundColor: '#FFF',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 26,
    marginTop: 17,
  },
  listContent: {
    paddingBottom: 140,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  sheetContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  grid: {
    gap: 29,
    paddingTop: 15,
    paddingHorizontal: 26,
  },
  row: {
    flexDirection: 'row',
    gap: 19,
  },
  gridItem: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  emptyText: {
    textAlign: 'center',
    lineHeight: 22,
  },
  retryButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  scrollView: {
    flex: 1,
  },
  loadingArea: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: colors.neutral.white,
  },
  appBar: {
    height: 60,
  },
  appBarTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
