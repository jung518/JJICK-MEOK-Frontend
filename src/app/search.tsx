import { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { Loading } from '@/src/components/Loading/Loading';
import { ScreenLayout } from '@/src/components/Layout/ScreenLayout';
import SearchBar from '@/src/components/Input/SearchBar';
import ActivityCard from '@/src/components/Card/ActivityCard';
import { Typography } from '@/src/components/Typography/Typography';
import ArrowLeft from '@/assets/images/ArrowLeft.svg';
import { colors } from '@/src/constants/colors';
import { searchActivities } from '@/src/api/activities';
import type { ActivitySummary } from '@/src/types/activities';
import { assignUniqueVariants, pickDiverseTags } from '@/src/utils/tagVariant';
import { formatDday, getDaysLeftFromDate, isNotExpired } from '@/src/utils/activity';
import { useApiErrorMessage } from '@/src/hooks/useApiErrorMessage';
import { ErrorBox } from '@/src/components/EmptyState/ErrorBox';
import { useNavigateOnce } from '@/src/hooks/useNavigateOnce';

const SEARCH_DEBOUNCE_MS = 400;

function toCardProps(activity: ActivitySummary) {
  const dday = formatDday(getDaysLeftFromDate(activity.recruitEndAt));
  const tags = assignUniqueVariants(pickDiverseTags(activity.tags));
  return {
    dday,
    title: activity.title,
    tags,
    viewCount: activity.viewCount,
    likeCount: activity.likeCount,
    thumbnailUrl: activity.thumbnailUrl,
  };
}

export default function SearchScreen() {
  const router = useRouter();
  const navigateOnce = useNavigateOnce();
  const [searchText, setSearchText] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedKeyword(searchText.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchText]);

  const {
    data: results,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['activities', 'search', debouncedKeyword],
    queryFn: () => searchActivities(debouncedKeyword),
    enabled: !!debouncedKeyword,
    retry: (failureCount, error) =>
      (error as AxiosError)?.response?.status !== 401 && failureCount < 1,
  });

  const { message: errorMessage, isRetriable } = useApiErrorMessage(
    isError,
    error,
    '검색 결과를 불러오지 못했어요. 다시 시도해주세요.',
  );

  const visibleResults = (results ?? []).filter((item) =>
    isNotExpired(getDaysLeftFromDate(item.recruitEndAt)),
  );

  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral.white }} edges={['top']}>
      <ScreenLayout style={{ backgroundColor: colors.neutral.white }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} hitSlop={12}>
            <ArrowLeft width={10} height={18.5} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <SearchBar value={searchText} onChangeText={handleSearch} />
          </View>
        </View>

        {errorMessage ? (
          <View style={styles.errorBox}>
            <ErrorBox
              message={errorMessage}
              onRetry={isRetriable ? () => refetch() : undefined}
              size="md"
              retrySize="md"
            />
          </View>
        ) : isLoading ? (
          <View style={styles.emptyState}>
            <Loading />
          </View>
        ) : (
          results !== undefined &&
          (visibleResults.length === 0 ? (
            <View style={styles.emptyState}>
              <Typography size="lg" weight="medium" style={styles.emptyText}>
                {`'${searchText}'에 대한 검색 결과가 없습니다.`}
              </Typography>
            </View>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.resultContent}
            >
              <Typography size="lg" weight="medium" style={styles.resultLabel}>
                {`'${searchText}'에 대한 검색 결과`}
              </Typography>
              <View>
                {visibleResults.map((item, i) => (
                  <View key={item.id}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => navigateOnce(`/detail/${item.id}`)}
                    >
                      <ActivityCard {...toCardProps(item)} />
                    </TouchableOpacity>
                    {i < visibleResults.length - 1 && (
                      <View style={styles.cardDividerRow}>
                        <View style={styles.cardDivider} />
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </ScrollView>
          ))
        )}
      </ScreenLayout>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 50,
    paddingHorizontal: 22,
    paddingVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    flexShrink: 0,
  },
  resultContent: {
    paddingHorizontal: 22,
    paddingTop: 23,
    paddingBottom: 40,
    gap: 37,
  },
  resultLabel: {
    color: colors.text.tertiary,
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
  emptyState: {
    paddingTop: 23,
    paddingHorizontal: 22,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.text.tertiary,
  },
  errorBox: {
    paddingTop: 60,
    alignItems: 'center' as const,
    gap: 16,
  },
});
