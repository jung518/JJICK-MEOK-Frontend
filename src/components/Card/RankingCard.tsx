import { useState, useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Typography } from '@/src/components/Typography/Typography';
import ChipBadge from '@/src/components/Chip/ChipBadge';
import { colors } from '@/src/constants/colors';
import { formatDday } from '@/src/utils/activity';
import DefaultActivity from '@/assets/images/DefaultActivity.svg';

type Props = {
  rank: number;
  category: string;
  title: string;
  showAD?: boolean;
  deadline: number;
  thumbnailUrl?: string;
};

export default function RankingCard({
  rank,
  category,
  title,
  showAD = false,
  deadline,
  thumbnailUrl,
}: Props) {
  const [imageError, setImageError] = useState(false);
  const ddayLabel = formatDday(deadline);

  useEffect(() => {
    setImageError(false);
  }, [thumbnailUrl]);

  return (
    <View style={styles.container}>
      <Typography size="xxl" weight="medium" style={styles.rank}>
        {rank}
      </Typography>
      <View style={styles.content}>
        <View style={styles.infoRow}>
          <View style={styles.ddayWrapper}>
            <Typography size="md" weight="semiBold" style={styles.dday}>
              {ddayLabel}
            </Typography>
          </View>
          {showAD && (
            <View style={styles.adWrapper}>
              <ChipBadge label="AD" variant="ad" />
            </View>
          )}
          <View style={!showAD ? { marginLeft: 11 } : undefined}>
            <ChipBadge label={category} variant="category" />
          </View>
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
      <View style={[styles.image, { overflow: 'hidden' }]}>
        {thumbnailUrl && !imageError ? (
          <Image
            source={{ uri: thumbnailUrl }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <DefaultActivity width={72} height={72} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    height: 72,
  },
  content: {
    flex: 1,
    marginRight: 60,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rank: {
    color: colors.text.primary,
    textAlign: 'center',
    marginRight: 25,
    alignSelf: 'center',
    marginTop: -20,
  },
  ddayWrapper: {
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  dday: {
    color: colors.text.secondary,
    textAlign: 'center',
  },
  adWrapper: {
    marginLeft: 11,
    marginRight: 4,
    flexShrink: 0,
  },
  title: {
    color: colors.text.primary,
    alignSelf: 'stretch',
    marginTop: 6,
  },
  image: {
    width: 72,
    height: 72,
    aspectRatio: 1,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: colors.border.default,
    backgroundColor: colors.border.light,
  },
});
