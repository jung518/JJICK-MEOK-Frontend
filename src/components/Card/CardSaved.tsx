import { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Typography } from '@/src/components/Typography/Typography';
import ChipBadge, { type Tag } from '@/src/components/Chip/ChipBadge';
import HeartSaved from '@/assets/images/HeartSaved.svg';
import HeartUnselected from '@/assets/images/HeartUnselected.svg';
import DefaultActivity from '@/assets/images/DefaultActivity.svg';
import { colors } from '@/src/constants/colors';
import { useImageWithFallback } from '@/src/hooks/useImageWithFallback';
import { useToggleFavorite } from '@/src/hooks/useToggleFavorite';

type Props = {
  activityId: number;
  dday: string;
  title: string;
  tags: Tag[];
  initialSaved?: boolean;
  thumbnailUrl?: string;
  onRemove?: (activityId: number) => void;
};

export default function CardSaved({
  activityId,
  dday,
  title,
  tags,
  initialSaved = true,
  thumbnailUrl,
  onRemove,
}: Props) {
  const [imgWidth, setImgWidth] = useState(0);
  const { hasImage, onError } = useImageWithFallback(thumbnailUrl);
  const { saved, toggle: handleHeartPress } = useToggleFavorite(activityId, initialSaved, {
    onUnsave: () => onRemove?.(activityId),
  });

  return (
    <View style={styles.container}>
      <View style={styles.imageArea}>
        <View
          style={StyleSheet.absoluteFill}
          onLayout={(e) => setImgWidth(e.nativeEvent.layout.width)}
        >
          {hasImage ? (
            <Image
              source={{ uri: thumbnailUrl }}
              style={StyleSheet.absoluteFill}
              resizeMode="cover"
              onError={onError}
            />
          ) : (
            <DefaultActivity width={imgWidth} height={150} preserveAspectRatio="xMidYMid slice" />
          )}
        </View>
        <TouchableOpacity
          onPress={handleHeartPress}
          activeOpacity={0.7}
          style={styles.heartContainer}
        >
          {saved ? (
            <HeartSaved width={23} height={20} />
          ) : (
            <HeartUnselected width={29} height={29} />
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Typography
            size="lg"
            weight="semiBold"
            style={styles.title}
            numberOfLines={2}
            lineBreakStrategyIOS="hangul-word"
            android_hyphenationFrequency="none"
          >
            {title}
          </Typography>
          <Typography size="sm" weight="semiBold" style={styles.dday} numberOfLines={1}>
            {dday}
          </Typography>
        </View>
        <View style={styles.tagsRow}>
          {tags.map((tag, index) => (
            <ChipBadge key={index} label={tag.label} variant={tag.variant} />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 11,
  },
  imageArea: {
    height: 150,
    backgroundColor: '#e8e8e8',
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: colors.border.default,
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 7,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  content: {
    gap: 10,
  },
  titleRow: {
    flexDirection: 'row',
    gap: 9,
    alignItems: 'flex-start',
  },
  title: {
    flex: 1,
    color: colors.text.primary,
  },
  dday: {
    flexShrink: 0,
    color: colors.text.secondary,
    textAlign: 'right',
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  heartContainer: {
    width: 29,
    height: 29,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
