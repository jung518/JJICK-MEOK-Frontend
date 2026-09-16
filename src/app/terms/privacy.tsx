import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Close from '@/src/components/Icon/Close';
import { ScreenLayout } from '@/src/components/Layout/ScreenLayout';
import { colors } from '@/src/constants/colors';

export default function TermsPrivacyScreen() {
  const router = useRouter();

  return (
    <ScreenLayout style={styles.container}>
      <Stack.Screen options={{ gestureEnabled: false }} />
      <View style={styles.header}>
        <Close onPress={() => router.back()} />
        <Text style={styles.headerTitle}>찍먹 개인정보 처리방침</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.introSection}>
          <Text style={styles.body}>
            찍먹은 회원가입, 계정 관리, 맞춤형 활동 추천 서비스 제공을 위해 아래와 같이 개인정보를
            수집·이용합니다.
          </Text>
          <Text style={styles.body}>
            이용자는 개인정보 수집·이용에 동의하지 않을 권리가 있습니다. 다만, 필수 항목에 대한
            동의를 거부할 경우 회원가입 및 맞춤형 활동 추천 서비스 이용이 제한될 수 있습니다.
          </Text>
        </View>

        {/* 섹션 1 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. 개인정보 수집·이용 목적</Text>
          <Text style={styles.body}>찍먹은 다음의 목적을 위해 개인정보를 수집·이용합니다.</Text>

          <Text style={styles.subSection}>1) 회원가입 및 계정 관리</Text>
          <Text style={styles.body}>
            회원 식별, 회원가입 및 탈퇴 의사 확인, 계정 생성 및 관리, 서비스 이용 자격 확인, 부정
            이용 방지, 문의 및 민원 처리, 공지사항 전달을 위해 개인정보를 이용합니다.
          </Text>

          <Text style={styles.subSection}>2) 맞춤형 활동 추천 서비스 제공</Text>
          <Text style={styles.body}>
            이용자의 관심사, 활동 조건, 현재 상태, 선호 지역, 선호 시간대, 서비스 이용 기록 등을
            바탕으로 취미, 클래스, 모임, 프로그램, 행사 등 활동 정보를 추천하기 위해 개인정보를
            이용합니다.
          </Text>

          <Text style={styles.subSection}>3) 서비스 이용 환경 제공</Text>
          <Text style={styles.body}>
            회원의 찜, 조회, 검색, 추천 반응, 활동 기록 등을 저장하여 개인화된 서비스 화면과 이용
            경험을 제공하기 위해 개인정보를 이용합니다.
          </Text>

          <Text style={styles.subSection}>4) 서비스 개선 및 통계 분석</Text>
          <Text style={styles.body}>
            서비스 이용 패턴을 분석하여 추천 품질 개선, 기능 개선, 오류 확인, 이용자 경험 개선, 통계
            자료 작성 등을 위해 개인정보를 이용합니다. 이 경우 개인을 식별할 수 없도록 비식별 또는
            익명 처리된 형태로 활용할 수 있습니다.
          </Text>
        </View>

        {/* 섹션 2 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. 수집하는 개인정보 항목</Text>
          <Text style={styles.body}>
            찍먹은 서비스 제공을 위해 필요한 최소한의 개인정보를 수집합니다.
          </Text>

          <Text style={styles.subSection}>1) 필수 수집 항목</Text>
          <Text style={styles.body}>
            회원가입 및 기본 서비스 제공을 위해 다음 정보를 필수로 수집합니다.
          </Text>

          <Text style={styles.subHeading}>회원가입 정보</Text>
          {['이메일', '비밀번호', '닉네임', '생년월일', '현재 상태'].map((item) => (
            <Text key={item} style={styles.listItem}>{`• ${item}`}</Text>
          ))}
          <Text style={styles.note}>
            현재 상태 예시: 대학생, 직장인, 취업/진로 준비 중, 프리랜서/자유롭게 일하고 있음, 기타
          </Text>

          <Text style={styles.subHeading}>소셜 로그인 이용 시</Text>
          {[
            '소셜 로그인 제공자로부터 전달받는 회원 식별값',
            '이메일',
            '닉네임 또는 프로필 정보',
          ].map((item) => (
            <Text key={item} style={styles.listItem}>{`• ${item}`}</Text>
          ))}

          <Text style={styles.subHeading}>서비스 이용 과정에서 자동 생성되는 정보</Text>
          {[
            '서비스 이용 기록',
            '접속 로그',
            '접속 IP',
            '기기 정보',
            '쿠키 또는 이와 유사한 기술로 생성되는 정보',
            '조회 기록',
            '검색 기록',
            '찜 기록',
            '추천 클릭 및 반응 기록',
            '오류 및 비정상 이용 기록',
          ].map((item) => (
            <Text key={item} style={styles.listItem}>{`• ${item}`}</Text>
          ))}

          <Text style={styles.subSection}>2) 선택 수집 항목</Text>
          <Text style={styles.body}>
            맞춤 추천의 정확도를 높이기 위해 다음 정보를 선택적으로 수집할 수 있습니다.
          </Text>
          {[
            '성별',
            '관심사',
            '선호 활동 지역',
            '선호 활동 시간대',
            '선호 활동 유형',
            '함께 참여하고 싶은 사람 유형',
            '활동 부담 수준',
            '후기, 평가, 활동 기록',
            '마케팅 정보 수신 동의 여부',
          ].map((item) => (
            <Text key={item} style={styles.listItem}>{`• ${item}`}</Text>
          ))}
          <Text style={styles.body}>
            선택 항목은 입력하지 않아도 회원가입 및 기본 서비스 이용이 가능합니다. 다만, 일부 맞춤
            추천의 정확도나 개인화 기능이 제한될 수 있습니다.
          </Text>
        </View>

        {/* 섹션 3 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. 개인정보의 보유 및 이용 기간</Text>
          <Text style={styles.body}>
            찍먹은 개인정보 수집 및 이용 목적이 달성되면 해당 개인정보를 지체 없이 파기합니다.
          </Text>
          <Text style={styles.body}>
            다만, 회원이 서비스를 이용하는 동안에는 원활한 서비스 제공을 위해 개인정보를 보유하며,
            회원 탈퇴 시 관련 법령 및 내부 방침에 따라 필요한 정보를 제외하고 파기합니다.
          </Text>
          {[
            {
              title: '1) 회원가입 및 계정 관리 정보',
              items: [
                '보유 기간: 회원 탈퇴 시까지',
                '대상 정보: 이메일, 비밀번호, 닉네임, 생년월일, 현재 상태, 소셜 로그인 식별값 등',
              ],
            },
            {
              title: '2) 맞춤 추천 및 서비스 이용 기록',
              items: [
                '보유 기간: 회원 탈퇴 시까지',
                '대상 정보: 관심사, 선호 활동 지역, 선호 시간대, 조회 기록, 검색 기록, 찜 기록, 추천 반응 기록, 후기 및 평가 기록 등',
              ],
            },
            {
              title: '3) 부정 이용 방지를 위한 기록',
              items: [
                '보유 기간: 수집일 또는 회원 탈퇴일로부터 최대 1년',
                '대상 정보: 부정 이용 기록, 서비스 이용 제한 기록, 비정상 접근 기록, 신고 및 제재 기록',
              ],
            },
            {
              title: '4) 마케팅 정보 수신 동의 기록',
              items: [
                '보유 기간: 동의 철회 또는 회원 탈퇴 시까지',
                '대상 정보: 마케팅 정보 수신 동의 여부, 동의 및 철회 일시',
              ],
            },
            {
              title: '5) 관련 법령에 따라 보관이 필요한 정보',
              items: [
                '관련 법령에 따라 보관이 필요한 경우, 해당 법령에서 정한 기간 동안 안전하게 보관한 후 파기합니다.',
              ],
            },
          ].map(({ title, items }) => (
            <View key={title}>
              <Text style={styles.subSection}>{title}</Text>
              {items.map((item) => (
                <Text key={item} style={styles.listItem}>{`• ${item}`}</Text>
              ))}
            </View>
          ))}
        </View>

        {/* 섹션 4 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. 개인정보의 제3자 제공</Text>
          <Text style={styles.body}>
            찍먹은 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다.
          </Text>
          <Text style={styles.body}>
            다만, 다음의 경우에는 예외적으로 개인정보를 제공할 수 있습니다.
          </Text>
          {[
            '이용자가 사전에 별도로 동의한 경우',
            '법령에 따라 개인정보 제출 의무가 발생한 경우',
            '이용자의 생명, 신체, 안전에 급박한 위험이 있어 필요한 경우',
          ].map((item, i) => (
            <Text key={item} style={styles.listItem}>{`${i + 1}. ${item}`}</Text>
          ))}
          <Text style={styles.body}>
            찍먹은 외부 신청 페이지, 주최 기관 사이트, 지도 서비스 등 외부 서비스로 연결되는 링크를
            제공할 수 있습니다. 이때 이용자가 외부 서비스에서 직접 입력하는 개인정보는 해당 외부
            서비스의 개인정보 처리방침에 따라 처리되며, 찍먹은 외부 서비스에서 입력된 개인정보를
            자동으로 수집하거나 저장하지 않습니다.
          </Text>
        </View>

        {/* 섹션 5 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. 개인정보 처리 업무의 위탁</Text>
          <Text style={styles.body}>
            찍먹은 원활한 서비스 제공을 위해 필요한 경우 개인정보 처리 업무의 일부를 외부 업체에
            위탁할 수 있습니다.
          </Text>
          <Text style={styles.body}>
            현재 개발 및 운영 단계에서 위탁 업체가 확정되지 않은 경우, 위탁 업무가 발생하는 시점에
            수탁 업체, 위탁 업무 내용, 보유 및 이용 기간을 개인정보 처리방침을 통해 공개합니다.
          </Text>
          <Text style={styles.body}>예상 위탁 업무는 다음과 같습니다.</Text>
          {[
            '서버 운영 및 데이터 보관',
            '이메일 발송',
            '앱 푸시 알림 발송',
            '소셜 로그인 연동',
            '서비스 이용 분석',
            '오류 및 장애 분석',
          ].map((item) => (
            <Text key={item} style={styles.listItem}>{`• ${item}`}</Text>
          ))}
        </View>

        {/* 섹션 6 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. 개인정보 파기 절차 및 방법</Text>
          <Text style={styles.body}>
            찍먹은 개인정보의 보유 기간이 종료되거나 처리 목적이 달성된 경우 해당 개인정보를 지체
            없이 파기합니다.
          </Text>
          <Text style={styles.subSection}>1) 파기 절차</Text>
          <Text style={styles.body}>
            이용자가 입력한 개인정보는 목적 달성 후 내부 방침 및 관련 법령에 따라 일정 기간 보관된
            뒤 파기됩니다.
          </Text>
          <Text style={styles.subSection}>2) 파기 방법</Text>
          {[
            '전자적 파일 형태의 개인정보는 복구 및 재생이 불가능한 방법으로 삭제합니다.',
            '종이 문서에 출력된 개인정보는 분쇄하거나 소각하는 방식으로 파기합니다.',
          ].map((item) => (
            <Text key={item} style={styles.listItem}>{`• ${item}`}</Text>
          ))}
        </View>

        {/* 섹션 7 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. 동의 거부 권리 및 불이익</Text>
          <Text style={styles.body}>
            이용자는 개인정보 수집·이용에 동의하지 않을 권리가 있습니다.
          </Text>
          <Text style={styles.body}>
            다만, 필수 수집 항목에 대한 동의를 거부할 경우 회원가입, 계정 관리, 맞춤형 활동 추천 등
            찍먹 서비스의 기본 기능 이용이 제한될 수 있습니다.
          </Text>
          <Text style={styles.body}>
            선택 수집 항목에 대한 동의를 거부하더라도 회원가입 및 기본 서비스 이용에는 제한이
            없습니다. 다만, 일부 개인화 추천 기능의 정확도나 이용 편의성이 제한될 수 있습니다.
          </Text>
        </View>

        {/* 섹션 8 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. 시행일</Text>
          <Text style={styles.body}>
            본 개인정보 수집·이용 동의는 2026년 ○월 ○일부터 적용됩니다.
          </Text>
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
  subHeading: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500',
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
