import { useState, useRef, useCallback } from 'react';
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
import { useFocusEffect } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ScreenLayout } from '@/src/components/Layout/ScreenLayout';
import { Dropdown } from '@/src/components/Filter/Dropdown';
import ActivityCard from '@/src/components/Card/ActivityCard';
import CategoryFilter from '@/src/components/Modal/CategoryFilter';
import { colors } from '@/src/constants/colors';
import { getCategoryPageData } from '@/src/api/pages';
import { getMyProfile } from '@/src/api/user';
import type { HomeActivity } from '@/src/types/activities';
import { assignUniqueVariants, pickDiverseTags } from '@/src/utils/tagVariant';
import { formatDday, isNotExpired } from '@/src/utils/activity';
import { useApiErrorMessage } from '@/src/hooks/useApiErrorMessage';
import { ErrorBox } from '@/src/components/EmptyState/ErrorBox';
import AppBar from '@/src/components/Bar/AppBar';
import CategoryBar from '@/src/components/Bar/CategoryBar';
import { useNavigateOnce } from '@/src/hooks/useNavigateOnce';

type SheetType = 'type' | 'sort' | null;

const PULL_THRESHOLD = 60;

function toCardProps(activity: HomeActivity) {
  const dday = formatDday(activity.deadline);
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

export default function CategoryScreen() {
  const navigateOnce = useNavigateOnce();
  const [selectedTypeValue, setSelectedTypeValue] = useState('');
  const [selectedCategoryValue, setSelectedCategoryValue] = useState('');
  const [selectedSortValue, setSelectedSortValue] = useState('');
  const [activeSheet, setActiveSheet] = useState<SheetType>(null);
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
          refetchRef.current().finally(() => {
            isRefreshingRef.current = false;
            setIsRefreshing(false);
          });
        }
      },
      onPanResponderTerminate: () => {},
    }),
  ).current;

  const { data, refetch, isLoading, isError, error } = useQuery({
    queryKey: ['category', selectedTypeValue, selectedCategoryValue, selectedSortValue],
    queryFn: () =>
      getCategoryPageData({
        type: selectedTypeValue || undefined,
        category: selectedCategoryValue || undefined,
        sort: selectedSortValue || undefined,
      }),
  });
  refetchRef.current = refetch;

  const { data: profile } = useQuery({
    queryKey: ['users', 'me', 'profile'],
    queryFn: getMyProfile,
  });
  const nickname = profile?.nickname ?? '';

  const typeOptions = data?.typeOptions ?? [];
  const categoryOptions = data?.categoryOptions ?? [];
  const sortOptions = data?.sortOptions ?? [];
  const activities = (data?.activities ?? []).filter((a) => isNotExpired(a.deadline));

  const selectedTypeLabel = typeOptions.find((o) => o.value === selectedTypeValue)?.label ?? '전체';
  const selectedCategoryLabel =
    categoryOptions.find((o) => o.value === selectedCategoryValue)?.label ?? '전체';
  const selectedSortLabel =
    sortOptions.find((o) => o.value === selectedSortValue)?.label ?? '추천순';

  const tabOptions = categoryOptions.length > 0 ? categoryOptions.map((o) => o.label) : ['전체'];

  const apiError = useApiErrorMessage(isError, error, '활동 목록을 불러오지 못했어요. 다시 시도해주세요.');
  const errorMessage =
    apiError.message ?? (data && activities.length === 0 ? '조건에 맞는 활동이 없어요.' : null);
  const isRetriable = apiError.isRetriable;

  useFocusEffect(
    useCallback(() => {
      setSelectedTypeValue('');
      setSelectedCategoryValue('');
      setSelectedSortValue('');
    }, []),
  );

  return (
    <ScreenLayout style={{ backgroundColor: colors.neutral.white }}>
      <AppBar name={nickname} onSearchPress={() => navigateOnce('/search')} />
      <CategoryBar
        tabs={tabOptions}
        selected={selectedCategoryLabel}
        onSelect={(label) => {
          const opt = categoryOptions.find((o) => o.label === label);
          setSelectedCategoryValue(opt?.value ?? '');
        }}
      />
      <View {...panResponder.panHandlers} style={{ flex: 1 }}>
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
          <View style={[styles.filterRow, styles.fullWidth]}>
            <Dropdown label={selectedTypeLabel} onPress={() => setActiveSheet('type')} />
            <Dropdown label={selectedSortLabel} onPress={() => setActiveSheet('sort')} />
          </View>
          {isLoading && !isRefreshing ? (
            <View style={styles.messageBox}>
              <Loading />
            </View>
          ) : errorMessage ? (
            <View style={styles.messageBox}>
              <ErrorBox message={errorMessage} onRetry={isRetriable ? () => refetch() : undefined} />
            </View>
          ) : (
            <View style={styles.cards}>
              {activities.map((activity, i) => (
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
              ))}
            </View>
          )}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </View>

      <Modal
        visible={!!activeSheet}
        transparent
        statusBarTranslucent
        onRequestClose={() => setActiveSheet(null)}
      >
        <Pressable style={styles.backdrop} onPress={() => setActiveSheet(null)} />
        <View style={styles.sheetContainer}>
          <CategoryFilter
            title={activeSheet === 'type' ? '카테고리 선택' : '정렬'}
            options={
              activeSheet === 'type'
                ? typeOptions.map((o) => o.label)
                : sortOptions.map((o) => o.label)
            }
            selected={activeSheet === 'type' ? selectedTypeLabel : selectedSortLabel}
            optionGap={activeSheet === 'sort' ? 35 : 30}
            height={activeSheet === 'type' ? 428 : 322}
            onSelect={(label) => {
              if (activeSheet === 'type') {
                const opt = typeOptions.find((o) => o.label === label);
                setSelectedTypeValue(opt?.value ?? '');
                setSelectedCategoryValue('');
              } else {
                const opt = sortOptions.find((o) => o.label === label);
                setSelectedSortValue(opt?.value ?? '');
              }
              setActiveSheet(null);
            }}
            onClose={() => setActiveSheet(null)}
          />
        </View>
      </Modal>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  fullWidth: {
    marginHorizontal: -20,
  },
  bottomSpacer: {
    height: 25,
    alignSelf: 'stretch',
    backgroundColor: '#FFF',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 140,
  },
  cards: {
    paddingTop: 15,
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
  loadingArea: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: colors.neutral.white,
  },
  messageBox: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 16,
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
});
