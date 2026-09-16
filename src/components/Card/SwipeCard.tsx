import { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Platform } from 'react-native';
import { useImageWithFallback } from '@/src/hooks/useImageWithFallback';
import DefaultActivitySvg from '@/assets/images/DefaultActivity.svg';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';
import IconHeart from '@/src/components/Icon/IconHeart';
import ChipBadge from '@/src/components/Chip/ChipBadge';
import MatchBadge from '@/src/components/Badge/MatchBadge';
import { colors } from '@/src/constants/colors';
import type { Activity, Tag } from '@/src/types/activities';

export type { Activity, Tag };
export type { TagType } from '@/src/types/activities';

const SCREEN_WIDTH = Math.min(Dimensions.get('window').width, 430);
export const CARD_WIDTH = SCREEN_WIDTH - 40;
export const CARD_HEIGHT = Math.round(CARD_WIDTH * (444 / 335));

const BORDER_GRADIENT_COLORS = ['#28FFD9', '#FF5EAD', '#8B5CF6', '#28FFD9'] as const;
const BORDER_DURATION = 8000;

type Props = {
  activity: Activity;
  isFront?: boolean;
  saved?: boolean;
  onSave?: () => void;
  onHeartPressIn?: () => void;
};

function useNativeBorderAngle(enabled: boolean) {
  const angle = useSharedValue(0);

  useEffect(() => {
    if (!enabled) return;
    angle.value = withRepeat(
      withTiming(1, { duration: BORDER_DURATION, easing: Easing.linear }),
      -1,
      false,
    );
  }, [enabled, angle]);

  return angle;
}

function useWebBorderAngleDeg(enabled: boolean) {
  const [webDeg, setWebDeg] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    let rafId: number;
    let start: number | null = null;
    const tick = (ts: number) => {
      if (start === null) start = ts;
      setWebDeg((((ts - start) % BORDER_DURATION) / BORDER_DURATION) * 360);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [enabled]);

  return webDeg;
}

function GradientBorderAnimation({ width, height }: { width: number; height: number }) {
  const isWeb = Platform.OS === 'web';
  const borderOpacity = useSharedValue(0);
  const nativeAngle = useNativeBorderAngle(!isWeb);
  const webAngleDeg = useWebBorderAngleDeg(isWeb);

  useEffect(() => {
    borderOpacity.value = withTiming(1, { duration: 350, easing: Easing.out(Easing.quad) });
  }, [borderOpacity]);

  const spinnerSize = Math.ceil(Math.sqrt(width * width + height * height)) + 10;

  const nativeStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${nativeAngle.value * 360}deg` }],
    opacity: borderOpacity.value,
  }));

  const spinnerStyle = isWeb ? { transform: [{ rotate: `${webAngleDeg}deg` }] } : nativeStyle;

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: spinnerSize,
          height: spinnerSize,
          top: (height - spinnerSize) / 2,
          left: (width - spinnerSize) / 2,
        },
        spinnerStyle,
      ]}
    >
      <LinearGradient colors={[...BORDER_GRADIENT_COLORS]} style={{ flex: 1 }} />
    </Animated.View>
  );
}

export default function SwipeCard({
  activity,
  isFront = false,
  saved = false,
  onSave,
  onHeartPressIn,
}: Props) {
  const bg = '#BEBEBE';
  const { hasImage, onError } = useImageWithFallback(activity.imageUrl);

  const handleHeartPressIn = () => {
    onSave?.();
    onHeartPressIn?.();
  };

  return (
    // 항상 동일한 최상위 View — isFront 변경 시에도 언마운트/리마운트 없음
    <View
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: bg,
      }}
    >
      {isFront && <GradientBorderAnimation width={CARD_WIDTH} height={CARD_HEIGHT} />}
      <View
        style={{
          position: 'absolute',
          top: 2,
          left: 2,
          right: 2,
          bottom: 2,
          borderRadius: 10,
          overflow: 'hidden',
          backgroundColor: bg,
        }}
      >
        {hasImage ? (
          <Image
            source={{ uri: activity.imageUrl }}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
            onError={onError}
          />
        ) : (
          <DefaultActivitySvg
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid slice"
            style={StyleSheet.absoluteFill}
          />
        )}
        <View style={styles.matchBadge}>
          <MatchBadge percentage={activity.personalizationScore} />
        </View>
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.98)', 'rgba(0,0,0,0.98)']}
          locations={[0, 0.556, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[styles.overlay, { height: CARD_HEIGHT * 0.488 }]}
        />
        <View
          style={[styles.content, { top: CARD_HEIGHT * 0.7154, paddingHorizontal: 14, gap: 12 }]}
        >
          <View style={{ gap: 5 }}>
            <Text style={[styles.semiBold, styles.dday, { fontSize: 12 }]}>D-{activity.days}</Text>
            <Text
              style={[styles.semiBold, { fontSize: 20 }]}
              numberOfLines={2}
              ellipsizeMode="tail"
              lineBreakStrategyIOS="hangul-word"
            >
              {activity.title}
            </Text>
          </View>
          <View style={styles.bottomRow}>
            <View style={[styles.tags, { gap: 5 }]}>
              {activity.tags.map((tag) => {
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
            <IconHeart saved={saved} size={29} onPressIn={handleHeartPressIn} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  matchBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  content: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  semiBold: {
    fontFamily: 'Pretendard-SemiBold',
    color: colors.neutral.white,
  },
  dday: {
    color: colors.text.secondary,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    marginRight: 8,
  },
});
