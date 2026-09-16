import { useState, useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useQueryClient } from '@tanstack/react-query';
import { Typography } from '@/src/components/Typography/Typography';
import ChipBadge from '@/src/components/Chip/ChipBadge';
import HeartSaved from '@/assets/images/HeartSaved.svg';
import HeartUnselected from '@/assets/images/HeartUnselected.svg';
import DefaultActivity from '@/assets/images/DefaultActivity.svg';
import { colors } from '@/src/constants/colors';
import { addFavorite, deleteFavorite } from '@/src/api/favorites';
import { useImageWithFallback } from '@/src/hooks/useImageWithFallback';

type Props = {
  activityId: number;
  category: string;
  dday: string;
  title: string;
  initialSaved?: boolean;
  thumbnailUrl?: string;
  onRemove?: (activityId: number) => void;
};

export default function CurationDetailCard({
  activityId,
  category,
  dday,
  title,
  initialSaved = true,
  thumbnailUrl,
  onRemove,
}: Props) {
  const queryClient = useQueryClient();
  const [saved, setSaved] = useState(initialSaved);
  const [isSaving, setIsSaving] = useState(false);
  const [imgWidth, setImgWidth] = useState(0);
  const { hasImage, onError } = useImageWithFallback(thumbnailUrl);

  useEffect(() => {
    setSaved(initialSaved);
  }, [initialSaved]);

  const handleHeartPress = () => {
    if (isSaving) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const nextSaved = !saved;
    setSaved(nextSaved);
    setIsSaving(true);
    const request = nextSaved ? addFavorite(activityId) : deleteFavorite(activityId);
    request
      .then(() => {
        if (!nextSaved) onRemove?.(activityId);
        queryClient.invalidateQueries({ queryKey: ['favorites-page'] });
      })
      .catch(() => setSaved(!nextSaved))
      .finally(() => setIsSaving(false));
  };

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
        <View style={styles.topRow}>
          <ChipBadge label={category} variant="category" />
          <Typography size="sm" weight="semiBold" style={styles.dday} numberOfLines={1}>
            {dday}
          </Typography>
        </View>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 10,
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
    gap: 5,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: colors.text.primary,
  },
  dday: {
    flexShrink: 0,
    color: colors.text.secondary,
    textAlign: 'right',
  },
  heartContainer: {
    width: 29,
    height: 29,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
