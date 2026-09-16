import { useMemo } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ScreenLayout } from '@/src/components/Layout/ScreenLayout';
import { Loading } from '@/src/components/Loading/Loading';
import { Typography } from '@/src/components/Typography/Typography';
import ArrowLeftSvg from '@/assets/images/ArrowLeft.svg';
import { getMyProfile, getTags, type TagItem } from '@/src/api/user';
import { ErrorBox } from '@/src/components/EmptyState/ErrorBox';
import { colors } from '@/src/constants/colors';

const GROUP_LABELS: Record<string, string> = {
  MOOD: '선호하는 분위기',
  INTENSITY: '나에게 맞는 텐션',
  PURPOSE: '참여 목적',
  DURATION: '가능한 참여 기간',
  SIZE: '편하게 느끼는 인원',
};

const GROUP_ORDER = ['MOOD', 'INTENSITY', 'PURPOSE', 'DURATION', 'SIZE'];

export default function InsightScreen() {
  const router = useRouter();

  const {
    data: tags = [],
    isLoading: isTagsLoading,
    isError: isTagsError,
    refetch: refetchTags,
  } = useQuery({
    queryKey: ['tags', 'PREFERENCE_TAG'],
    queryFn: () => getTags('PREFERENCE_TAG'),
  });

  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: ['users', 'me', 'profile'],
    queryFn: getMyProfile,
  });

  const selectedTagIds = useMemo(
    () => new Set((profile?.tags ?? []).map((tag) => tag.id)),
    [profile],
  );

  const tagsByGroup = useMemo(() => {
    const map: Record<string, TagItem[]> = {};
    tags.forEach((tag) => {
      const group = tag.tagGroupType ?? 'ETC';
      if (!map[group]) map[group] = [];
      map[group].push(tag);
    });
    return map;
  }, [tags]);

  const groups = useMemo(
    () => GROUP_ORDER.filter((group) => (tagsByGroup[group]?.length ?? 0) > 0),
    [tagsByGroup],
  );

  const isLoading = isTagsLoading || isProfileLoading;
  const isError = isTagsError || isProfileError;

  return (
    <ScreenLayout style={styles.screen}>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} hitSlop={12}>
          <ArrowLeftSvg width={10} height={18.5} />
        </TouchableOpacity>
        <Typography size="xl" weight="medium">
          나만의 찍먹 데이터 확인하기
        </Typography>
      </View>

      {isLoading ? (
        <View style={styles.messageBox}>
          <Loading />
        </View>
      ) : isError ? (
        <View style={styles.messageBox}>
          <ErrorBox
            message="데이터를 불러오지 못했어요. 다시 시도해주세요."
            onRetry={() => {
              refetchTags();
              refetchProfile();
            }}
          />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          {groups.map((group) => (
            <View key={group} style={styles.section}>
              <Typography size="md" weight="medium" color="secondary">
                {GROUP_LABELS[group]}
              </Typography>
              <View style={styles.chipsRow}>
                {tagsByGroup[group].map((tag) => {
                  const isSelected = selectedTagIds.has(tag.id);
                  return (
                    <View key={tag.id} style={[styles.chip, isSelected && styles.chipSelected]}>
                      <Typography
                        size="lg"
                        weight="medium"
                        style={isSelected ? styles.chipTextSelected : styles.chipText}
                      >
                        {tag.name}
                      </Typography>
                    </View>
                  );
                })}
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.neutral.white,
  },
  appBar: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.white,
    paddingHorizontal: 22,
    paddingVertical: 3,
    gap: 10,
  },
  messageBox: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 16,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 38,
    paddingBottom: 40,
    gap: 32,
  },
  section: {
    gap: 9,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
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
});
