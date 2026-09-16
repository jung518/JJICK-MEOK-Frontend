import { useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  View,
  StyleSheet,
  type LayoutChangeEvent,
} from 'react-native';
import { Typography } from '@/src/components/Typography/Typography';
import { colors } from '@/src/constants/colors';

type Props = {
  tabs: string[];
  selected: string;
  onSelect: (tab: string) => void;
  gap?: number;
  paddingHorizontal?: number;
};

export default function CategoryBar({
  tabs,
  selected,
  onSelect,
  gap = 13,
  paddingHorizontal = 19,
}: Props) {
  const scrollRef = useRef<ScrollView>(null);
  const itemLayouts = useRef<Record<string, { x: number; width: number }>>({});
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const layout = itemLayouts.current[selected];
    if (!layout || !containerWidth) return;
    const targetX = layout.x + layout.width / 2 - containerWidth / 2;
    scrollRef.current?.scrollTo({ x: Math.max(0, targetX), y: 0, animated: true });
  }, [selected, containerWidth, tabs]);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        onLayout={(e: LayoutChangeEvent) => setContainerWidth(e.nativeEvent.layout.width)}
        contentContainerStyle={[styles.scrollContent, { gap, paddingHorizontal }]}
      >
        {tabs.map((tab) => {
          const isActive = tab === selected;
          return (
            <TouchableOpacity
              key={tab}
              style={styles.tabItem}
              activeOpacity={0.7}
              onPress={() => onSelect(tab)}
              onLayout={(e: LayoutChangeEvent) => {
                const { x, width } = e.nativeEvent.layout;
                itemLayouts.current[tab] = { x, width };
              }}
            >
              <Typography
                size="lg"
                weight="semiBold"
                style={isActive ? styles.activeText : styles.inactiveText}
              >
                {tab}
              </Typography>
              <View style={[styles.indicator, isActive && styles.activeIndicator]} />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <View style={styles.border} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    backgroundColor: colors.neutral.white,
  },
  scrollContent: {
    alignItems: 'flex-end',
  },
  tabItem: {
    paddingHorizontal: 2,
    gap: 8,
    alignItems: 'center',
  },
  activeText: {
    color: colors.text.primary,
  },
  inactiveText: {
    color: '#999999',
  },
  indicator: {
    height: 3,
    borderRadius: 200,
    alignSelf: 'stretch',
    marginBottom: 1,
  },
  activeIndicator: {
    backgroundColor: colors.text.primary,
  },
  border: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.border.light,
  },
});
