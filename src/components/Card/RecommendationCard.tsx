import { View, StyleSheet, Image } from 'react-native';
import { Typography } from '@/src/components/Typography/Typography';
import ChipBadge from '@/src/components/Chip/ChipBadge';
import { assignUniqueVariants, pickDiverseTags } from '@/src/utils/tagVariant';
import { formatDday } from '@/src/utils/activity';
import { useImageWithFallback } from '@/src/hooks/useImageWithFallback';
import DefaultActivity from '@/assets/images/DefaultActivity.svg';
import { colors } from '@/src/constants/colors';

type Props = {
  category: string;
  title: string;
  hashtags: string[];
  deadline: number;
  thumbnailUrl?: string;
};

export default function RecommendationCard({
  category,
  title,
  hashtags,
  deadline,
  thumbnailUrl,
}: Props) {
  const { hasImage, onError } = useImageWithFallback(thumbnailUrl);
  const displayTags = assignUniqueVariants(pickDiverseTags(hashtags));
  const ddayLabel = formatDday(deadline);

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.upper}>
          <View style={[styles.image, { overflow: 'hidden' }]}>
            {hasImage ? (
              <Image
                source={{ uri: thumbnailUrl }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
                onError={onError}
              />
            ) : (
              <DefaultActivity width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
            )}
          </View>
          <View style={styles.infoRow}>
            <ChipBadge label={category} variant="category" />
            <Typography style={styles.dday}>{ddayLabel}</Typography>
          </View>
        </View>
        <Typography
          style={styles.title}
          numberOfLines={2}
          lineBreakStrategyIOS="hangul-word"
          android_hyphenationFrequency="none"
        >
          {title}
        </Typography>
      </View>
      <View style={styles.preferences}>
        {displayTags.map((tag) => (
          <ChipBadge key={tag.label} label={tag.label} variant={tag.variant} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 143,
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 10,
  },
  inner: {
    alignSelf: 'stretch',
    flexDirection: 'column',
    gap: 5,
  },
  upper: {
    alignSelf: 'stretch',
    flexDirection: 'column',
    gap: 12,
  },
  image: {
    aspectRatio: 151 / 148,
    alignSelf: 'stretch',
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: colors.border.default,
    backgroundColor: 'rgba(195, 195, 195, 0.2)',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  title: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    color: colors.text.primary,
    letterSpacing: 0.32,
    lineHeight: 20,
    alignSelf: 'stretch',
  },
  dday: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  preferences: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'stretch',
  },
});
