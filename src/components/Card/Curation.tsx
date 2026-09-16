import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ChipBadge from '@/src/components/Chip/ChipBadge';
import DefaultActivitySvg from '@/assets/images/DefaultActivity.svg';
import { CURATION_IMAGE_BY_KEY } from '@/src/constants/curationThemes';
import { colors } from '@/src/constants/colors';
import type { Activity, Tag } from '@/src/types/activities';

export type { Activity, Tag };

export const CARD_HEIGHT = 290;

type Props = {
  activity: Activity;
  curationKey?: string;
  onPress?: () => void;
};

export default function Curation({ activity, curationKey, onPress }: Props) {
  const tags = activity.tags.slice(0, 2);
  const CurationImage =
    (curationKey && CURATION_IMAGE_BY_KEY[curationKey]) || DefaultActivitySvg;

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={[StyleSheet.absoluteFill, styles.imageWrapper]}>
        <CurationImage width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
      </View>
      <LinearGradient
        colors={['transparent', 'transparent', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,0.8)']}
        locations={[0, 0.5118, 0.7833, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Text
        style={styles.title}
        numberOfLines={2}
        lineBreakStrategyIOS="hangul-word"
        android_hyphenationFrequency="none"
      >
        {activity.title}
      </Text>
      <View style={styles.tags}>
        {tags.map((tag) => {
          const label = tag.label.startsWith('#') ? tag.label.slice(1) : tag.label;
          return (
            <ChipBadge
              key={`${tag.type}-${tag.label}`}
              label={`#${label}`}
              variant={tag.type}
              dark
            />
          );
        })}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: CARD_HEIGHT,
    padding: 13,
    paddingHorizontal: 16,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    gap: 10,
    borderRadius: 11.622,
    overflow: 'hidden',
    backgroundColor: 'rgba(221,221,221,0.5)',
  },
  imageWrapper: {
    overflow: 'hidden',
  },
  title: {
    fontFamily: 'Pretendard-SemiBold',
    fontWeight: '600',
    fontSize: 22,
    color: colors.neutral.white,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
});
