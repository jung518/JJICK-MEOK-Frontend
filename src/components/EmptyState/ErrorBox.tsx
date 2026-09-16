import { TouchableOpacity, type StyleProp, type TextStyle } from 'react-native';
import { Typography } from '@/src/components/Typography/Typography';
import { colors } from '@/src/constants/colors';

type TypographySize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';
type TypographyWeight = 'regular' | 'medium' | 'semiBold' | 'bold';
type TypographyColor = 'primary' | 'secondary' | 'tertiary';

type Props = {
  message: string;
  onRetry?: () => void;
  size?: TypographySize;
  weight?: TypographyWeight;
  color?: TypographyColor;
  style?: StyleProp<TextStyle>;
  retrySize?: TypographySize;
  retryWeight?: TypographyWeight;
  retryColor?: TypographyColor;
  retryBorderColor?: string;
};

export function ErrorBox({
  message,
  onRetry,
  size = 'sm',
  weight = 'medium',
  color = 'secondary',
  style,
  retrySize = 'sm',
  retryWeight = 'medium',
  retryColor = 'secondary',
  retryBorderColor = colors.border.default,
}: Props) {
  return (
    <>
      <Typography size={size} weight={weight} color={color} style={[{ textAlign: 'center' }, style]}>
        {message}
      </Typography>
      {onRetry && (
        <TouchableOpacity
          style={{
            paddingVertical: 8,
            paddingHorizontal: 20,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: retryBorderColor,
          }}
          onPress={onRetry}
          activeOpacity={0.7}
        >
          <Typography size={retrySize} weight={retryWeight} color={retryColor}>
            다시 시도
          </Typography>
        </TouchableOpacity>
      )}
    </>
  );
}
