import { ScrollView, StyleSheet, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useOnboardingStore } from '@/src/store/onboardingStore';
import { getCustomPageData } from '@/src/api/pages';
import { assignUniqueVariants } from '@/src/utils/tagVariant';
import { isNotExpired } from '@/src/utils/activity';
import { ContentCard } from '@/src/components/Card/ContentCard';
import { Loading } from '@/src/components/Loading/Loading';
import ProgressBar from '@/src/components/Bar/ProgressBar';
import { BottomCTA } from '@/src/components/Button/BottomCTA';
import { CTAContainer } from '@/src/components/Layout/CTAContainer';
import { ScreenLayout } from '@/src/components/Layout/ScreenLayout';
import { Typography } from '@/src/components/Typography/Typography';
import { colors } from '@/src/constants/colors';
import { useNavigateOnce } from '@/src/hooks/useNavigateOnce';
import DefaultActivitySvg from '@/assets/images/DefaultActivity.svg';

export default function OnboardingResult() {
  const router = useRouter();
  const navigateOnce = useNavigateOnce();
  const storedNickname = useOnboardingStore((s) => s.nickname) || '회원';

  const { data, isLoading } = useQuery({
    queryKey: ['pages', 'custom'],
    queryFn: () => getCustomPageData(3),
  });

  const nickname = data?.nickname ?? storedNickname;
  const activities = (data?.recommended.activities ?? [])
    .filter((activity) => isNotExpired(activity.deadline))
    .slice(0, 3);

  return (
    <ScreenLayout style={styles.container}>
      <Stack.Screen options={{ gestureEnabled: false }} />
      <View style={styles.progressContainer}>
        <ProgressBar step={4} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerBlock}>
          <Typography size="xxxl" weight="semiBold" style={styles.title}>
            {`${nickname}님이 좋아할 만한\n활동을 모아봤어요!`}
          </Typography>
          <Typography size="md" style={styles.subtitle}>
            나만을 위한 추천 활동을 확인하세요
          </Typography>
        </View>

        {isLoading ? (
          <View style={styles.loadingBox}>
            <Loading />
          </View>
        ) : (
          <View style={styles.cardList}>
            {activities.map((activity) => (
              <ContentCard
                key={activity.id}
                title={activity.title}
                subtitle={activity.address}
                imageUri={activity.thumbnailUrl || undefined}
                tags={assignUniqueVariants(activity.hashtags.slice(0, 2))}
                onPress={() => navigateOnce(`/detail/${activity.id}`)}
                renderFallback={() => <DefaultActivitySvg width="100%" height="100%" />}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <CTAContainer style={styles.cta}>
        <BottomCTA
          label="더 많은 추천 확인하기"
          onPress={() => router.replace('/(tabs)/home')}
          variant="dark"
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
    paddingTop: 52,
    paddingBottom: 16,
    gap: 47,
  },
  headerBlock: {
    gap: 10,
  },
  title: {
    lineHeight: 32,
  },
  subtitle: {
    color: colors.text.secondary,
    lineHeight: 20,
  },
  cardList: {
    gap: 13,
  },
  loadingBox: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  cta: { paddingHorizontal: 20, paddingTop: 16 },
});
