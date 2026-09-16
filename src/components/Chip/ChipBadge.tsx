import { View, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Typography } from '@/src/components/Typography/Typography';
import { colors } from '@/src/constants/colors';

export type TagVariant = 'MOOD' | 'INTENSITY' | 'DURATION' | 'SIZE' | 'PURPOSE';
export type ChipBadgeVariant = 'category' | 'categoryDark' | 'ad' | TagVariant;

export type Tag = {
  label: string;
  variant: TagVariant;
};

export const TAG_VARIANT_META: Record<TagVariant, { name: string; description: string }> = {
  MOOD: { name: '활동 분위기', description: '활동에서 느껴지는 전체적인 정서와 무드' },
  INTENSITY: { name: '활동 강도', description: '활동에 필요한 부담감, 몰입도, 도전 정도' },
  PURPOSE: { name: '활동 목적', description: '사용자가 활동을 통해 얻고 싶은 것' },
  DURATION: { name: '활동 기간', description: '활동이 지속되는 기간' },
  SIZE: { name: '활동 규모', description: '활동에 함께 참여하는 인원 규모와 참여 환경' },
};

type Props = {
  label: string;
  variant: ChipBadgeVariant;
  dark?: boolean;
  onPress?: () => void;
};

const TAG_VARIANTS: TagVariant[] = ['MOOD', 'INTENSITY', 'DURATION', 'SIZE', 'PURPOSE'];

function getVariantStyles(
  variant: ChipBadgeVariant,
  dark?: boolean,
): { container: ViewStyle; text: TextStyle } {
  if (TAG_VARIANTS.includes(variant as TagVariant)) {
    const tagColors = dark
      ? colors.tagDark[variant as TagVariant]
      : colors.tag[variant as TagVariant];
    return {
      container: { backgroundColor: tagColors.bg, paddingVertical: 4 },
      text: { color: tagColors.text },
    };
  }
  switch (variant) {
    case 'category':
      return {
        container: { backgroundColor: colors.neutral.surface, paddingVertical: 4 },
        text: { color: colors.text.tertiary, textAlign: 'center' },
      };
    case 'categoryDark':
      return {
        container: {
          backgroundColor: colors.text.secondary,
          paddingVertical: 2,
          paddingHorizontal: 5,
        },
        text: { color: colors.disabled, textAlign: 'center' },
      };
    case 'ad':
    default:
      return {
        container: { borderWidth: 1, borderColor: colors.border.default, paddingVertical: 1 },
        text: { color: colors.border.default, textAlign: 'center' },
      };
  }
}

export default function ChipBadge({ label, variant, dark, onPress }: Props) {
  const { container: variantContainer, text: variantText } = getVariantStyles(variant, dark);

  const content = (
    <View style={[styles.container, variantContainer]}>
      <Typography size="sm" weight="medium" style={variantText}>
        {label}
      </Typography>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
