import { useState, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  TouchableOpacity,
  Animated,
  PanResponder,
} from 'react-native';
import { Loading } from '@/src/components/Loading/Loading';
import { useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { ScreenLayout } from '@/src/components/Layout/ScreenLayout';
import ArrowLeftBar from '@/src/components/Bar/ArrowLeftBar';
import { Dropdown } from '@/src/components/Filter/Dropdown';
import ActivityCard from '@/src/components/Card/ActivityCard';
import CategoryFilter from '@/src/components/Modal/CategoryFilter';
import { Typography } from '@/src/components/Typography/Typography';
import { colors } from '@/src/constants/colors';
import { getCategoryPageData } from '@/src/api/pages';
import type { HomeActivity } from '@/src/types/activities';
import { assignUniqueVariants, pickDiverseTags } from '@/src/utils/tagVariant';
import { useNavigateOnce } from '@/src/hooks/useNavigateOnce';

const PULL_THRESHOLD = 60;
const PULL_MAX = 80;

type SheetType = 'category' | 'sort' | null;

function toCardProps(activity: HomeActivity) {
  const dday = activity.deadline <= 0 ? 'D-day' : `D-${activity.deadline}`;
  const tags = assignUniqueVariants(pickDiverseTags(activity.hashtags ?? []));
  return {
    dday,
    title: activity.title,
    tags,
    viewCount: activity.viewCount,
    likeCount: activity.likeCount,
    thumbnailUrl: activity.thumbnailUrl,
  };
}

type ActivityType = 'PROGRAM' | 'ONE_DAY' | 'EVENT' | 'CLUB';

type Props = {
  type: ActivityType;
  title: string;
};

export default function CategoryListScreen({ type, title }: Props) {
  const router = useRouter();
  const navigateOnce = useNavigateOnce();
  const insets = useSafeAreaInsets();
  const [selectedCategoryValue, setSelectedCategoryValue] = useState('');
  const [selectedSortValue, setSelectedSortValue] = useState('');
  const [activeSheet, setActiveSheet] = useState<SheetType>(null);
  const [isPulling, setIsPulling] = useState(false);
  const scrollYRef = useRef(0);
  const isPullingRef = useRef(false);
  const isRefreshingRef = useRef(false);
  const pullAnim = useRef(new Animated.Value(0)).current;

  const { data, refetch, isError, isLoading, error } = useQuery({
    queryKey: ['category', type, selectedCategoryValue, selectedSortValue],
    queryFn: () =>
      getCategoryPageData({
        type,
        category: selectedCategoryValue || undefined,
        sort: selectedSortValue || undefined,
      }),
  });

  const categoryOptions = data?.categoryOptions ?? [];
  const sortOptions = data?.sortOptions ?? [];
  const activities = (data?.activities ?? []).filter((a) => a.deadline >= 0);

  const selectedCategoryLabel =
    categoryOptions.find((o) => o.value === selectedCategoryValue)?.label ?? '전체';
  const selectedSortLabel =
    sortOptions.find((o) => o.value === selectedSortValue)?.label ?? '추천순';

  const errorMessage = (() => {
    if (isError) {
      const err = error as AxiosError;
      if (err.response?.status === 401) return '로그인 시간이 만료되었어요. 다시 로그인해주세요.';
      if (err.message?.includes('Network Error') || err.code === 'ERR_NETWORK')
        return '네트워크 연결을 확인해주세요.';
      return '활동 목록을 불러오지 못했어요. 다시 시도해주세요.';
    }
    if (data && activities.length === 0) {
      if (categoryOptions.length === 0) return '선택한 카테고리를 불러오지 못했어요.';
      return '조건에 맞는 활동이 없어요.';
    }
    return null;
  })();

  const isRetriable = isError && (error as AxiosError)?.response?.status !== 401;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: (_, { dy, dx }) =>
        scrollYRef.current <= 0 && dy > 8 && dy > Math.abs(dx) * 2,
      onPanResponderMove: (_, { dy }) => {
        if (dy > 0) {
          const pull = Math.min(dy * 0.4, PULL_MAX);
          pullAnim.setValue(pull);
          if (pull >= PULL_THRESHOLD && !isPullingRef.current) {
            isPullingRef.current = true;
            setIsPulling(true);
          }
        }
      },
      onPanResponderRelease: (_, { dy }) => {
        const pull = Math.min(dy * 0.4, PULL_MAX);
        if (pull >= PULL_THRESHOLD && !isRefreshingRef.current) {
          isRefreshingRef.current = true;
          Animated.spring(pullAnim, { toValue: PULL_MAX, useNativeDriver: false }).start();
          refetch().finally(() => {
            isRefreshingRef.current = false;
            isPullingRef.current = false;
            setIsPulling(false);
            Animated.spring(pullAnim, { toValue: 0, useNativeDriver: false }).start();
          });
        } else {
          isPullingRef.current = false;
          setIsPulling(false);
          Animated.spring(pullAnim, { toValue: 0, useNativeDriver: false }).start();
        }
      },
      onPanResponderTerminate: () => {
        isPullingRef.current = false;
        setIsPulling(false);
        Animated.spring(pullAnim, { toValue: 0, useNativeDriver: false }).start();
      },
    }),
  ).current;

  useFocusEffect(
    useCallback(() => {
      setSelectedCategoryValue('');
      setSelectedSortValue('');
    }, []),
  );

  return (
    <ScreenLayout style={{ backgroundColor: colors.neutral.white, paddingTop: insets.top }}>
      <ArrowLeftBar onPress={() => router.back()} title={title} />

      <View style={styles.filterRow}>
        <Dropdown label={selectedCategoryLabel} onPress={() => setActiveSheet('category')} />
        <Dropdown label={selectedSortLabel} onPress={() => setActiveSheet('sort')} />
      </View>

      <View {...panResponder.panHandlers} style={{ flex: 1 }}>
        <Animated.View style={[styles.pullArea, { height: pullAnim }]}>
          {isPulling && <Loading />}
        </Animated.View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          onScroll={(e) => {
            scrollYRef.current = e.nativeEvent.contentOffset.y;
          }}
          scrollEventThrottle={16}
        >
          {isLoading ? (
            <View style={styles.messageBox}>
              <Loading />
            </View>
          ) : errorMessage ? (
            <View style={styles.messageBox}>
              <Typography
                size="sm"
                weight="medium"
                color="secondary"
                style={{ textAlign: 'center' }}
              >
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
          ) : (
            activities.map((activity, i) => (
              <View key={activity.id}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => navigateOnce(`/detail/${activity.id}`)}
                >
                  <ActivityCard {...toCardProps(activity)} />
                </TouchableOpacity>
                {i < activities.length - 1 && (
                  <View style={styles.cardDividerRow}>
                    <View style={styles.cardDivider} />
                  </View>
                )}
              </View>
            ))
          )}
        </ScrollView>
      </View>

      {activeSheet && (
        <>
          <Pressable style={styles.backdrop} onPress={() => setActiveSheet(null)} />
          <View style={styles.sheetContainer}>
            <CategoryFilter
              title={activeSheet === 'category' ? '활동 분야 선택' : '정렬'}
              options={
                activeSheet === 'category'
                  ? categoryOptions.map((o) => o.label)
                  : sortOptions.map((o) => o.label)
              }
              selected={activeSheet === 'category' ? selectedCategoryLabel : selectedSortLabel}
              optionGap={activeSheet === 'sort' ? 35 : 30}
              height={activeSheet === 'category' ? 428 : 322}
              onSelect={(label) => {
                if (activeSheet === 'category') {
                  const opt = categoryOptions.find((o) => o.label === label);
                  setSelectedCategoryValue(opt?.value ?? '');
                } else {
                  const opt = sortOptions.find((o) => o.label === label);
                  setSelectedSortValue(opt?.value ?? '');
                }
                setActiveSheet(null);
              }}
              onClose={() => setActiveSheet(null)}
            />
          </View>
        </>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 40,
  },
  cardDividerRow: {
    paddingTop: 15,
    paddingBottom: 15,
  },
  cardDivider: {
    width: '100%',
    height: 1,
    backgroundColor: '#EAEAEA',
  },
  pullArea: {
    overflow: 'hidden',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: colors.neutral.white,
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
  messageBox: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
    gap: 16,
  },
  retryButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
});
