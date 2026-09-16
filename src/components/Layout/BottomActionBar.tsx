import { View, StyleSheet } from 'react-native';
import ButtonSaved from '@/src/components/Button/ButtonSaved';
import { BottomCTA, type BottomCTAVariant } from '@/src/components/Button/BottomCTA';
import { colors } from '@/src/constants/colors';

type Props = {
  saved?: boolean;
  onSavePress: () => void;
  label: string;
  onPress: () => void;
  variant?: BottomCTAVariant;
  disabled?: boolean;
};

export default function BottomActionBar({
  saved = false,
  onSavePress,
  label,
  onPress,
  variant = 'dark',
  disabled = false,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <ButtonSaved saved={saved} onPress={onSavePress} />
        <View style={styles.ctaWrapper}>
          <BottomCTA label={label} onPress={onPress} variant={variant} disabled={disabled} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 16,
    paddingRight: 20,
    paddingBottom: 50,
    paddingLeft: 20,
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: colors.neutral.white,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    alignSelf: 'stretch',
  },
  ctaWrapper: {
    flex: 1,
  },
});
