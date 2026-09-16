import { View, StyleSheet } from 'react-native';
import { colors } from '@/src/constants/colors';

type Props = {
  count: number;
  activeIndex: number;
};

export default function Indicator({ count, activeIndex }: Props) {
  const safeIndex = Math.min(Math.max(activeIndex, 0), count - 1);
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={[styles.dot, i === safeIndex ? styles.active : styles.inactive]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 11,
  },
  dot: {
    width: 8,
    height: 8,
    aspectRatio: 1,
    borderRadius: 4,
  },
  active: {
    backgroundColor: colors.primary.main,
  },
  inactive: {
    backgroundColor: colors.border.light,
  },
});
