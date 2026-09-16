import { Modal, Pressable, View, StyleSheet } from 'react-native';
import type { ReactNode } from 'react';

type Props = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
};

export default function BottomSheetModal({ visible, onClose, children }: Props) {
  return (
    <Modal visible={visible} transparent statusBarTranslucent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheetContainer}>{children}</View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  sheetContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
