import { View, StyleSheet, TouchableOpacity } from 'react-native';
import AppLogo from '@/assets/images/AppLogo.svg';
import Search from '@/assets/images/Search.svg';
import { colors } from '@/src/constants/colors';

type Props = {
  onSearchPress?: () => void;
};

export default function TopNav({ onSearchPress }: Props) {
  return (
    <View style={styles.container}>
      <AppLogo width={65} height={65} />
      <TouchableOpacity activeOpacity={0.7} onPress={onSearchPress}>
        <Search width={28} height={28} color={colors.text.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 13,
    paddingVertical: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.neutral.white,
  },
});
