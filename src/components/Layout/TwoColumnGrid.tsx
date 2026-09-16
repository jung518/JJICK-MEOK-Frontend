import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';

type Props<T> = {
  items: T[];
  keyExtractor: (item: T) => string | number;
  renderItem: (item: T) => ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function TwoColumnGrid<T>({ items, keyExtractor, renderItem, style }: Props<T>) {
  const rowCount = Math.ceil(items.length / 2);
  const isOddTotal = items.length % 2 !== 0;

  return (
    <View style={[styles.grid, style]}>
      {Array.from({ length: rowCount }, (_, rowIndex) => {
        const rowItems = items.slice(rowIndex * 2, rowIndex * 2 + 2);
        const isLastRow = rowIndex === rowCount - 1;
        return (
          <View key={rowItems[0] ? keyExtractor(rowItems[0]) : rowIndex} style={styles.row}>
            {rowItems.map((item) => (
              <View key={keyExtractor(item)} style={styles.gridItem}>
                {renderItem(item)}
              </View>
            ))}
            {isLastRow && isOddTotal && <View style={styles.gridItem} />}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: 29,
    paddingTop: 15,
    paddingHorizontal: 26,
  },
  row: {
    flexDirection: 'row',
    gap: 19,
  },
  gridItem: {
    flex: 1,
  },
});
