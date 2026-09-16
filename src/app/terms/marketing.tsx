import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Close from '@/src/components/Icon/Close';
import { ScreenLayout } from '@/src/components/Layout/ScreenLayout';
import { colors } from '@/src/constants/colors';

export default function TermsMarketingScreen() {
  const router = useRouter();

  return (
    <ScreenLayout style={styles.container}>
      <Stack.Screen options={{ gestureEnabled: false }} />
      <View style={styles.header}>
        <Close onPress={() => router.back()} />
        <Text style={styles.headerTitle}>찍먹 마케팅 정보 수신 동의</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.introSection}>
          <Text style={styles.body}>
            찍먹은 이용자가 동의한 경우, 신규 활동 추천, 이벤트, 혜택, 설문조사, 서비스 업데이트 등
            마케팅 정보를 발송할 수 있습니다.
          </Text>
          <Text style={styles.body}>
            마케팅 정보 수신 동의는 선택 항목이며, 동의하지 않아도 찍먹 서비스 이용에는 제한이
            없습니다.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. 마케팅 정보 수신 목적</Text>
          <Text style={styles.body}>찍먹은 다음의 목적을 위해 마케팅 정보를 발송합니다.</Text>

          <Text style={styles.subSection}>1) 신규 활동 및 추천 콘텐츠 안내</Text>
          <Text style={styles.body}>
            이용자의 관심사, 활동 조건, 서비스 이용 기록 등을 바탕으로 새로운 클래스, 모임,
            프로그램, 행사, 강연 등 추천 활동 정보를 안내합니다.
          </Text>

          <Text style={styles.subSection}>2) 이벤트 및 혜택 안내</Text>
          <Text style={styles.body}>
            찍먹에서 진행하는 이벤트, 프로모션, 리워드, 혜택, 설문조사 참여 기회 등을 안내합니다.
          </Text>

          <Text style={styles.subSection}>3) 서비스 소식 및 업데이트 안내</Text>
          <Text style={styles.body}>
            신규 기능, 서비스 개선 사항, 주요 공지, 추천 기능 업데이트 등 서비스 관련 소식을
            안내합니다.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. 수신 방법</Text>
          <Text style={styles.body}>찍먹은 다음 방법을 통해 마케팅 정보를 발송할 수 있습니다.</Text>
          {['앱 푸시 알림', '이메일'].map((item) => (
            <Text key={item} style={styles.listItem}>{`• ${item}`}</Text>
          ))}
          <Text style={styles.note}>
            추후 휴대폰번호를 수집하는 경우, 문자 메시지 또는 카카오 알림톡 등을 통해 마케팅 정보를
            발송할 수 있습니다. 이 경우 필요한 사항을 사전에 안내하고 동의를 받을 수 있습니다.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. 이용하는 개인정보 항목</Text>
          <Text style={styles.body}>마케팅 정보 발송을 위해 다음 정보를 이용할 수 있습니다.</Text>
          {[
            '이메일',
            '닉네임',
            '마케팅 정보 수신 동의 여부',
            '관심사',
            '선호 활동 지역',
            '선호 활동 시간대',
            '서비스 이용 기록',
            '조회 기록',
            '검색 기록',
            '찜 기록',
            '추천 클릭 및 반응 기록',
          ].map((item) => (
            <Text key={item} style={styles.listItem}>{`• ${item}`}</Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. 보유 및 이용 기간</Text>
          <Text style={styles.body}>
            마케팅 정보 수신 동의일로부터 동의 철회 또는 회원 탈퇴 시까지 보관 및 이용합니다.
          </Text>
          <Text style={styles.body}>
            다만, 관련 법령에 따라 보관이 필요한 경우 해당 기간 동안 안전하게 보관한 후 파기합니다.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. 동의 거부 권리 및 불이익</Text>
          <Text style={styles.body}>이용자는 마케팅 정보 수신 동의를 거부할 권리가 있습니다.</Text>
          <Text style={styles.body}>
            마케팅 정보 수신 동의는 선택 항목이므로, 동의하지 않아도 회원가입 및 찍먹 서비스
            이용에는 제한이 없습니다.
          </Text>
          <Text style={styles.body}>
            다만, 동의하지 않을 경우 신규 활동 추천, 이벤트, 혜택, 설문조사, 서비스 업데이트 등
            마케팅성 안내를 받을 수 없습니다.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. 수신 동의 철회 방법</Text>
          <Text style={styles.body}>
            이용자는 언제든지 마케팅 정보 수신 동의를 철회할 수 있습니다.
          </Text>
          <Text style={styles.body}>철회 방법은 다음과 같습니다.</Text>
          {[
            '앱 내 마이페이지 > 설정 > 알림 설정 > 마케팅 정보 수신 동의 해제',
            '이메일 하단의 수신거부 링크 선택',
            '고객센터 또는 운영자 이메일을 통한 철회 요청',
          ].map((item) => (
            <Text key={item} style={styles.listItem}>{`• ${item}`}</Text>
          ))}
          <Text style={styles.body}>
            찍먹은 이용자가 수신 동의를 철회한 경우, 관련 법령에 따라 처리하고 이후 광고성 정보를
            발송하지 않습니다.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. 수신 동의 여부 확인</Text>
          <Text style={styles.body}>
            찍먹은 관련 법령에 따라 마케팅 정보 수신 동의 여부를 정기적으로 확인할 수 있습니다.
          </Text>
          <Text style={styles.body}>
            수신 동의 여부 확인 시에는 전송자의 명칭, 수신 동의 사실 및 동의 날짜, 수신 동의 유지
            또는 철회 방법을 안내합니다.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. 시행일</Text>
          <Text style={styles.body}>본 마케팅 정보 수신 동의는 2026년 ○월 ○일부터 적용됩니다.</Text>
          <Text style={styles.body}>공고일자: 2026년 ○월 ○일</Text>
          <Text style={styles.body}>시행일자: 2026년 ○월 ○일</Text>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral.white,
  },
  header: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 71,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: colors.neutral.white,
    marginTop: 44,
  },
  headerTitle: {
    fontFamily: 'Inter',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
    letterSpacing: 0.07,
    color: '#101828',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
    gap: 24,
  },
  introSection: {
    paddingBottom: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 12,
    flexShrink: 0,
    alignSelf: 'stretch',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  section: {
    alignSelf: 'stretch',
    flexShrink: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 24,
    gap: 8,
  },
  sectionTitle: {
    fontFamily: 'Inter',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 30,
    letterSpacing: -0.449,
    color: '#101828',
  },
  body: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22.75,
    letterSpacing: -0.15,
    color: '#364153',
  },
  subSection: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    letterSpacing: -0.15,
    color: '#101828',
  },
  listItem: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22.75,
    letterSpacing: -0.15,
    color: '#364153',
    paddingLeft: 8,
  },
  note: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: -0.15,
    color: '#667085',
  },
});
