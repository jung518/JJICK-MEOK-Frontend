import { StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import { BottomCTA } from '@/src/components/Button/BottomCTA';
import { CTAContainer } from '@/src/components/Layout/CTAContainer';
import SocialLoginButton from '@/src/components/Button/SocialLoginButton';
import { Typography } from '@/src/components/Typography/Typography';
import { colors } from '@/src/constants/colors';
import { useOAuthLogin } from '@/src/hooks/useOAuthLogin';
import { useNavigateOnce } from '@/src/hooks/useNavigateOnce';
import CarouselAuto from '@/src/components/Carousel/CarouselAuto';
import Ellipse37 from '@/assets/images/Ellipse 37.svg';
import Ellipse38 from '@/assets/images/Ellipse 38.svg';
import Ellipse39 from '@/assets/images/Ellipse 39.svg';
import Ellipse40 from '@/assets/images/Ellipse 40.svg';

export default function LoginScreen() {
  const navigateOnce = useNavigateOnce();
  const { login: kakaoLogin } = useOAuthLogin('kakao');
  const { login: googleLogin } = useOAuthLogin('google');
  const { login: naverLogin } = useOAuthLogin('naver');
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ gestureEnabled: false }} />

      <Typography size="xxxl" weight="semiBold" style={styles.title}>
        {'나에게 맞는\n새로운 경험의 시작'}
      </Typography>

      <View style={styles.carousel}>
        <CarouselAuto images={[Ellipse37, Ellipse38, Ellipse39, Ellipse40]} />
      </View>

      <View style={styles.socialButtons}>
        <SocialLoginButton provider="naver" onPress={naverLogin} />
        <SocialLoginButton provider="google" onPress={googleLogin} />
        <SocialLoginButton provider="kakao" onPress={kakaoLogin} />
      </View>

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Typography size="lg" color="secondary">
          또는
        </Typography>
        <View style={styles.dividerLine} />
      </View>

      <CTAContainer>
        <BottomCTA
          label="이메일로 시작하기"
          onPress={() => navigateOnce('/(auth)/email-login')}
          variant="dark"
        />
      </CTAContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.white,
    paddingHorizontal: 20,
  },
  title: {
    lineHeight: 32,
    marginTop: 141,
    textAlign: 'center',
  },
  carousel: {
    marginTop: 89,
    marginHorizontal: -20,
    marginBottom: 59,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 31,
    marginTop: 'auto',
    marginBottom: 27,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 23,
    marginBottom: 27,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border.light,
  },
});
