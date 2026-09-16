import { View, StyleSheet, Image } from 'react-native';
import { Typography } from '@/src/components/Typography/Typography';
import ChipBadge, { type Tag } from '@/src/components/Chip/ChipBadge';
import Eyes from '@/src/components/Icon/Eyes';
import HeartDisabled from '@/assets/images/HeartDisabled.svg';
import DefaultActivity from '@/assets/images/DefaultActivity.svg';
import { colors } from '@/src/constants/colors';
import { useImageWithFallback } from '@/src/hooks/useImageWithFallback';

type Props = {
  dday: string;
  title: string;
  tags: Tag[];
  viewCount: number;
  likeCount: number;
  thumbnailUrl?: string;
};

export default function ActivityCard({
  dday,
  title,
  tags,
  viewCount,
  likeCount,
  thumbnailUrl,
}: Props) {
  const { hasImage, onError } = useImageWithFallback(thumbnailUrl);

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <View style={styles.titleGroup}>
          <Typography size="sm" weight="semiBold" style={styles.ddayText}>
            {dday}
          </Typography>
          <Typography
            size="lg"
            weight="semiBold"
            style={styles.titleText}
            numberOfLines={2}
            lineBreakStrategyIOS="hangul-word"
            android_hyphenationFrequency="none"
          >
            {title}
          </Typography>
        </View>
        <View style={styles.tagsRow}>
          {tags.map((tag, index) => (
            <ChipBadge key={index} label={tag.label} variant={tag.variant} />
          ))}
        </View>
      </View>

      <View style={styles.rightSection}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Eyes size={14} color="#CCCCCC" />
            <Typography size="sm" weight="regular" style={styles.statText}>
              {viewCount}
            </Typography>
          </View>
          <View style={styles.statItem}>
            <HeartDisabled width={12} height={11} />
            <Typography size="sm" weight="regular" style={styles.statText}>
              {likeCount}
            </Typography>
          </View>
        </View>
        <View style={styles.imageWrapper}>
          {hasImage ? (
            <Image
              source={{ uri: thumbnailUrl }}
              style={styles.image}
              resizeMode="cover"
              onError={onError}
            />
          ) : (
            <DefaultActivity width={80} height={80} />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 26,
    width: '100%',
  },
  leftSection: {
    flex: 1,
    flexDirection: 'column',
    gap: 15,
    marginTop: 20,
  },
  titleGroup: {
    position: 'relative',
  },
  ddayText: {
    position: 'absolute',
    top: -20,
    left: 0,
    color: colors.text.secondary,
  },
  titleText: {
    color: colors.text.primary,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 3,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  statText: {
    color: '#CCCCCC',
    lineHeight: 12,
  },
  imageWrapper: {
    width: 80,
    height: 80,
    borderRadius: 5,
    borderWidth: 0.944,
    borderColor: colors.border.default,
    backgroundColor: '#E8E8E8',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: colors.neutral.surface,
  },
});
