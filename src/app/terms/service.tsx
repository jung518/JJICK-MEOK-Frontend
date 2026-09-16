import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Close from '@/src/components/Icon/Close';
import { ScreenLayout } from '@/src/components/Layout/ScreenLayout';
import { colors } from '@/src/constants/colors';

export default function TermsServiceScreen() {
  const router = useRouter();

  return (
    <ScreenLayout style={styles.container}>
      <Stack.Screen options={{ gestureEnabled: false }} />
      <View style={styles.header}>
        <Close onPress={() => router.back()} />
        <Text style={styles.headerTitle}>찍먹 서비스 이용약관</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.introSection}>
          <Text style={styles.body}>
            본 약관은 찍먹 서비스 이용과 관련하여 운영자와 회원의 권리, 의무 및 책임사항, 서비스
            이용 조건과 절차 등 필요한 사항을 규정합니다.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제1조 목적</Text>
          <Text style={styles.body}>
            본 약관은 찍먹 운영팀 또는 향후 설립될 운영 주체(이하 "운영자")가 제공하는 찍먹 서비스의
            이용과 관련하여 운영자와 회원 간의 권리, 의무 및 책임사항, 서비스 이용 조건과 절차, 기타
            필요한 사항을 규정함을 목적으로 합니다.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제2조 용어의 정의</Text>
          <Text style={styles.body}>본 약관에서 사용하는 용어의 정의는 다음과 같습니다.</Text>
          {[
            '"서비스"란 이용자가 웹 또는 모바일 애플리케이션을 통해 취미, 관심사, 클래스, 모임, 프로그램, 행사, 강연 등 다양한 활동 정보를 탐색하고 추천받을 수 있도록 운영자가 제공하는 찍먹 관련 제반 서비스를 의미합니다.',
            '"회원"이란 본 약관에 동의하고 회원가입 절차를 완료하여 서비스를 이용하는 자를 의미합니다.',
            '"비회원"이란 회원가입을 하지 않고 서비스의 일부 기능을 이용하는 자를 의미합니다.',
            '"계정"이란 회원이 서비스를 이용하기 위해 등록한 이메일, 비밀번호, 소셜 로그인 정보, 닉네임 등 회원 식별 및 서비스 이용을 위해 필요한 정보를 의미합니다.',
            '"활동 정보"란 서비스 내에서 제공되는 클래스, 모임, 프로그램, 행사, 강연, 체험 활동 등의 정보를 의미합니다.',
            '"추천 정보"란 회원이 입력한 관심사, 지역, 시간대, 활동 선호 조건, 서비스 이용 기록 등을 바탕으로 제공되는 활동 추천 결과를 의미합니다.',
            '"외부 서비스"란 찍먹 서비스에서 연결되는 외부 신청 페이지, 주최 기관 사이트, 지도 서비스, 결제 페이지 등 제3자가 제공하는 서비스를 의미합니다.',
            '"회원 콘텐츠"란 회원이 서비스 내에서 작성하거나 저장한 후기, 평가, 찜, 관심사 기록, 활동 기록, 취향 리포트 관련 정보 등을 의미합니다.',
            '본 약관에서 정의하지 않은 용어는 관련 법령 및 일반적인 서비스 이용 관행에 따릅니다.',
          ].map((item, i) => (
            <Text key={i} style={styles.listItem}>{`${i + 1}. ${item}`}</Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제3조 약관의 효력 및 변경</Text>
          {[
            '본 약관은 서비스 화면에 게시하거나 기타의 방법으로 회원에게 공지하고, 회원이 이에 동의함으로써 효력이 발생합니다.',
            '운영자는 관련 법령을 위반하지 않는 범위에서 본 약관을 변경할 수 있습니다.',
            '운영자가 약관을 변경하는 경우 변경 내용, 변경 사유 및 시행일자를 서비스 내 공지사항, 알림, 이메일 등 적절한 방법으로 사전에 안내합니다.',
            '회원이 변경된 약관에 동의하지 않는 경우 서비스 이용을 중단하거나 회원 탈퇴를 요청할 수 있습니다.',
            '변경된 약관의 시행일 이후에도 회원이 서비스를 계속 이용하는 경우, 변경된 약관에 동의한 것으로 봅니다. 단, 회원에게 불리하거나 중요한 내용의 변경인 경우 운영자는 별도 동의를 요청할 수 있습니다.',
          ].map((item, i) => (
            <Text key={i} style={styles.listItem}>{`${i + 1}. ${item}`}</Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제4조 약관 외 준칙</Text>
          {[
            '운영자는 필요한 경우 개별 서비스에 대해 별도의 이용약관, 운영정책, 안내사항 등을 둘 수 있습니다.',
            '개별 약관 또는 운영정책이 본 약관과 상충하는 경우, 해당 개별 약관 또는 운영정책이 우선 적용됩니다.',
            '본 약관에 명시되지 않은 사항은 관련 법령 및 일반적인 상관례에 따릅니다.',
          ].map((item, i) => (
            <Text key={i} style={styles.listItem}>{`${i + 1}. ${item}`}</Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제5조 이용계약의 체결</Text>
          <Text style={styles.listItem}>
            1. 이용계약은 서비스를 이용하고자 하는 자가 본 약관에 동의하고 회원가입을 신청한 뒤,
            운영자가 이를 승인함으로써 체결됩니다.
          </Text>
          <Text style={styles.listItem}>
            2. 운영자는 다음 각 호에 해당하는 경우 회원가입 신청을 승인하지 않거나, 사후에
            이용계약을 해지할 수 있습니다.
          </Text>
          {[
            '타인의 정보를 도용한 경우',
            '허위 정보를 입력한 경우',
            '이미 가입된 회원이 중복으로 가입을 신청한 경우',
            '이전에 본 약관 위반으로 서비스 이용이 제한된 이력이 있는 경우',
            '서비스 운영을 방해할 목적이 있다고 판단되는 경우',
            '관련 법령 또는 본 약관을 위반한 경우',
            '기타 운영자가 회원가입 승인이 어렵다고 판단하는 합리적인 사유가 있는 경우',
          ].map((item, i) => (
            <Text key={i} style={styles.nestedItem}>{`${i + 1}. ${item}`}</Text>
          ))}
          <Text style={styles.listItem}>
            3. 회원가입 완료 시점은 서비스 화면에서 가입 완료가 표시된 시점으로 합니다.
          </Text>
          <Text style={styles.listItem}>
            4. 운영자는 서비스 운영상 또는 기술상 문제가 있는 경우 회원가입 승인을 일시적으로 유보할
            수 있습니다.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제6조 회원가입 및 계정 관리</Text>
          {[
            '회원은 회원가입 시 정확하고 최신의 정보를 제공해야 하며, 입력한 정보가 변경된 경우 서비스 내 설정 또는 마이페이지를 통해 이를 수정해야 합니다.',
            '계정 관리 책임은 회원 본인에게 있습니다.',
            '회원은 자신의 계정을 제3자에게 양도, 대여, 공유하거나 이용하게 해서는 안 됩니다.',
            '회원은 계정이 도용되었거나 제3자가 무단으로 사용하고 있음을 알게 된 경우 즉시 운영자에게 알려야 합니다.',
            '회원이 계정 관리 의무를 소홀히 하여 발생한 손해에 대해 운영자는 책임을 지지 않습니다. 단, 운영자의 고의 또는 중대한 과실이 있는 경우에는 관련 법령에 따릅니다.',
          ].map((item, i) => (
            <Text key={i} style={styles.listItem}>{`${i + 1}. ${item}`}</Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제7조 서비스의 제공</Text>
          <Text style={styles.body}>운영자는 회원에게 다음과 같은 서비스를 제공합니다.</Text>
          {[
            '관심사 및 조건 기반 활동 추천 서비스',
            '활동 정보 탐색 및 상세 정보 제공 서비스',
            '활동 찜하기 및 저장 기능',
            '활동 후기 및 평가 확인 기능',
            '이용 기록을 기반으로 한 취향 리포트 기능',
            '외부 신청 페이지 연결 기능',
            '서비스 이용 기록을 기반으로 한 맞춤형 콘텐츠 제공 기능',
            '기타 운영자가 추가로 개발하거나 제공하는 서비스',
          ].map((item, i) => (
            <Text key={i} style={styles.listItem}>{`${i + 1}. ${item}`}</Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제8조 서비스 이용 대상</Text>
          {[
            '찍먹 서비스는 원칙적으로 만 14세 이상 이용자를 대상으로 합니다.',
            '만 14세 미만 이용자가 서비스를 이용하려는 경우, 법정대리인의 동의가 필요할 수 있습니다.',
            '운영자는 서비스의 특성상 특정 연령, 지역, 기기 환경 등에 따라 일부 기능 이용을 제한할 수 있습니다.',
          ].map((item, i) => (
            <Text key={i} style={styles.listItem}>{`${i + 1}. ${item}`}</Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제9조 추천 정보의 성격</Text>
          {[
            '찍먹의 추천 정보는 회원이 입력한 관심사, 지역, 시간대, 활동 선호 조건 및 서비스 이용 기록 등을 바탕으로 제공되는 참고용 정보입니다.',
            '운영자는 추천된 활동이 회원의 취향, 기대, 일정, 비용, 만족도, 안전성 등을 완전히 충족한다고 보장하지 않습니다.',
            '회원은 활동 신청 전 주최 기관 또는 외부 서비스의 공식 안내를 통해 일정, 장소, 비용, 환불 기준, 준비물, 참여 조건, 안전 유의사항 등을 직접 확인해야 합니다.',
            '운영자는 서비스 내 활동 정보의 정확성과 최신성을 유지하기 위해 노력하지만, 외부 기관 또는 주최자가 제공한 정보의 변경, 누락, 오류에 대해 모든 책임을 부담하지는 않습니다.',
          ].map((item, i) => (
            <Text key={i} style={styles.listItem}>{`${i + 1}. ${item}`}</Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제10조 외부 신청 링크 및 외부 서비스</Text>
          {[
            '찍먹은 활동 신청, 상세 정보 확인, 지도 확인 등을 위해 외부 서비스로 연결되는 링크를 제공할 수 있습니다.',
            '외부 서비스에서 이루어지는 신청, 결제, 취소, 환불, 문의, 분쟁 등은 해당 외부 서비스 또는 주최 기관의 약관 및 정책에 따릅니다.',
            '회원이 외부 서비스에서 직접 입력한 개인정보, 결제 정보, 신청 정보 등은 해당 외부 서비스의 개인정보 처리방침 및 이용약관에 따라 처리됩니다.',
            '운영자는 외부 서비스의 운영 상태, 정보 정확성, 결제 및 환불 처리, 활동 진행 여부에 대해 직접적인 책임을 부담하지 않습니다. 다만, 서비스 내 잘못된 정보가 확인될 경우 이를 수정하거나 안내하기 위해 노력합니다.',
          ].map((item, i) => (
            <Text key={i} style={styles.listItem}>{`${i + 1}. ${item}`}</Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제11조 회원의 의무</Text>
          <Text style={styles.body}>
            회원은 서비스를 이용할 때 다음 각 호의 행위를 해서는 안 됩니다.
          </Text>
          {[
            '타인의 개인정보 또는 계정을 도용하는 행위',
            '허위 정보를 입력하거나 부정한 방법으로 서비스를 이용하는 행위',
            '운영자, 다른 회원 또는 제3자의 명예를 훼손하거나 불이익을 주는 행위',
            '음란물, 혐오 표현, 폭력적 표현, 불법 정보 등을 게시하거나 유포하는 행위',
            '운영자 또는 제3자의 저작권, 상표권, 초상권, 개인정보 등 권리를 침해하는 행위',
            '서비스의 정상적인 운영을 방해하는 행위',
            '자동화 프로그램, 해킹, 비정상적인 접근 방식 등을 통해 서비스를 이용하는 행위',
            '서비스 내 정보를 무단으로 수집, 복제, 배포, 판매하거나 영리 목적으로 이용하는 행위',
            '광고, 홍보, 스팸성 콘텐츠를 무단으로 게시하는 행위',
            '기타 관련 법령 또는 본 약관을 위반하는 행위',
          ].map((item, i) => (
            <Text key={i} style={styles.listItem}>{`${i + 1}. ${item}`}</Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제12조 서비스의 변경 및 중단</Text>
          <Text style={styles.listItem}>
            1. 운영자는 서비스 개선, 기술적 필요, 운영 정책 변경, 외부 데이터 제공처의 사정 등에
            따라 서비스의 전부 또는 일부를 변경할 수 있습니다.
          </Text>
          <Text style={styles.listItem}>
            2. 운영자는 다음 각 호에 해당하는 경우 서비스 제공을 일시적으로 중단할 수 있습니다.
          </Text>
          {[
            '서비스 점검, 보수, 업데이트가 필요한 경우',
            '서버 장애, 통신 장애 등 기술적 문제가 발생한 경우',
            '천재지변, 재난, 정전 등 불가항력적 사유가 발생한 경우',
            '외부 데이터 제공처, 제휴사, 주최 기관 등의 사정으로 서비스 제공이 어려운 경우',
            '기타 운영상 서비스 제공이 어렵다고 판단되는 경우',
          ].map((item, i) => (
            <Text key={i} style={styles.nestedItem}>{`${i + 1}. ${item}`}</Text>
          ))}
          <Text style={styles.listItem}>
            3. 운영자는 서비스 변경 또는 중단이 발생하는 경우 가능한 범위 내에서 사전에 공지합니다.
            다만, 긴급한 장애, 보안 문제 등 사전 공지가 어려운 경우 사후에 공지할 수 있습니다.
          </Text>
          <Text style={styles.listItem}>
            4. 운영자는 무료로 제공되는 서비스의 일부 또는 전부를 운영상 필요에 따라 변경하거나
            종료할 수 있습니다.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제13조 회원 콘텐츠</Text>
          <Text style={styles.listItem}>
            1. 회원은 서비스 내에서 후기, 평가, 찜, 관심사 기록, 활동 기록 등 회원 콘텐츠를
            작성하거나 저장할 수 있습니다.
          </Text>
          <Text style={styles.listItem}>
            2. 회원 콘텐츠에 대한 권리는 원칙적으로 해당 콘텐츠를 작성한 회원에게 있습니다.
          </Text>
          <Text style={styles.listItem}>
            3. 회원은 자신이 작성한 회원 콘텐츠가 타인의 권리나 관련 법령을 침해하지 않도록 해야
            합니다.
          </Text>
          <Text style={styles.listItem}>
            4. 운영자는 서비스 운영, 콘텐츠 노출, 추천 품질 개선, 통계 분석, 서비스 홍보 등을 위해
            필요한 범위 내에서 회원 콘텐츠를 활용할 수 있습니다. 단, 회원을 식별할 수 있는 형태로
            외부에 활용하는 경우에는 별도 동의를 받을 수 있습니다.
          </Text>
          <Text style={styles.listItem}>
            5. 운영자는 다음 각 호에 해당하는 회원 콘텐츠를 사전 통지 없이 삭제하거나 노출을 제한할
            수 있습니다.
          </Text>
          {[
            '허위 사실이 포함된 콘텐츠',
            '타인을 비방하거나 명예를 훼손하는 콘텐츠',
            '광고, 홍보, 스팸성 콘텐츠',
            '음란, 혐오, 폭력, 불법 정보가 포함된 콘텐츠',
            '타인의 개인정보 또는 권리를 침해하는 콘텐츠',
            '서비스의 목적과 무관하거나 운영을 방해하는 콘텐츠',
            '기타 관련 법령 또는 본 약관에 위반되는 콘텐츠',
          ].map((item, i) => (
            <Text key={i} style={styles.nestedItem}>{`${i + 1}. ${item}`}</Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제14조 개인정보 보호</Text>
          {[
            '운영자는 서비스 제공을 위해 필요한 범위 내에서 회원의 개인정보를 처리합니다.',
            '개인정보의 수집 항목, 이용 목적, 보유 및 이용 기간, 파기 방법, 제3자 제공, 처리 위탁 등에 관한 자세한 사항은 별도의 개인정보 처리방침에 따릅니다.',
            '운영자는 법령에 근거하거나 회원의 별도 동의가 있는 경우를 제외하고 회원의 개인정보를 제3자에게 제공하지 않습니다.',
          ].map((item, i) => (
            <Text key={i} style={styles.listItem}>{`${i + 1}. ${item}`}</Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제15조 서비스 이용 기록 및 통계 활용</Text>
          {[
            '운영자는 서비스 개선, 추천 품질 향상, 오류 분석, 이용자 경험 개선을 위해 회원의 서비스 이용 기록을 분석할 수 있습니다.',
            '서비스 이용 기록에는 조회, 찜, 검색, 클릭, 추천 반응, 후기 작성, 활동 상세 페이지 방문 기록 등이 포함될 수 있습니다.',
            '운영자는 개인을 식별할 수 없도록 비식별 또는 익명 처리한 통계 자료를 서비스 개선, 제안서, 리포트, 연구, 홍보 자료 등에 활용할 수 있습니다.',
            '운영자는 개인을 식별할 수 있는 정보를 외부에 제공하거나 공개하는 경우 관련 법령에 따라 회원의 동의를 받습니다.',
          ].map((item, i) => (
            <Text key={i} style={styles.listItem}>{`${i + 1}. ${item}`}</Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제16조 광고 및 마케팅 정보</Text>
          {[
            '운영자는 서비스 내에 광고, 제휴 콘텐츠 또는 추천 콘텐츠를 게재할 수 있습니다.',
            '운영자는 회원이 선택적으로 마케팅 정보 수신에 동의한 경우, 신규 활동 추천, 이벤트, 혜택, 설문조사, 서비스 업데이트 등의 정보를 앱 푸시, 이메일 등으로 안내할 수 있습니다.',
            '회원은 언제든지 서비스 내 설정 또는 고객센터를 통해 마케팅 정보 수신 동의를 철회할 수 있습니다.',
            '마케팅 정보 수신에 동의하지 않아도 기본적인 서비스 이용에는 제한이 없습니다.',
          ].map((item, i) => (
            <Text key={i} style={styles.listItem}>{`${i + 1}. ${item}`}</Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제17조 저작권 및 지식재산권</Text>
          {[
            '운영자가 제작한 서비스 화면, 로고, 브랜드명, 디자인, 콘텐츠, 문구, 기능 구성, 추천 방식 등에 대한 저작권 및 지식재산권은 운영자에게 귀속됩니다.',
            '회원은 운영자의 사전 동의 없이 서비스 내 정보를 무단으로 복제, 배포, 전송, 판매, 출판하거나 영리 목적으로 이용할 수 없습니다.',
            '외부 기관, 주최자 또는 제휴처에서 제공한 활동 정보, 이미지, 콘텐츠의 권리는 해당 권리자에게 귀속될 수 있습니다.',
            '회원이 서비스 내에 게시한 콘텐츠가 타인의 권리를 침해하여 분쟁이 발생한 경우, 그 책임은 해당 회원에게 있습니다.',
          ].map((item, i) => (
            <Text key={i} style={styles.listItem}>{`${i + 1}. ${item}`}</Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제18조 회원 탈퇴 및 이용계약 해지</Text>
          {[
            '회원은 언제든지 서비스 내 제공되는 메뉴를 통해 회원 탈퇴를 요청할 수 있습니다.',
            '운영자는 회원의 탈퇴 요청을 관련 법령 및 개인정보 처리방침에 따라 처리합니다.',
            '회원 탈퇴 시 회원의 개인정보와 서비스 이용 기록은 개인정보 처리방침에 따라 삭제 또는 비식별 처리될 수 있습니다.',
            '다만, 관련 법령에 따라 보관이 필요한 정보나 부정 이용 방지를 위해 필요한 최소한의 정보는 정해진 기간 동안 보관될 수 있습니다.',
            '회원 탈퇴 후에는 기존 계정으로 저장한 찜, 추천 기록, 후기, 취향 리포트 등의 정보가 복구되지 않을 수 있습니다.',
          ].map((item, i) => (
            <Text key={i} style={styles.listItem}>{`${i + 1}. ${item}`}</Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제19조 이용 제한</Text>
          <Text style={styles.listItem}>
            1. 운영자는 회원이 본 약관 또는 관련 법령을 위반한 경우 서비스 이용을 제한할 수
            있습니다.
          </Text>
          <Text style={styles.listItem}>
            2. 이용 제한 조치는 위반 내용과 정도에 따라 다음과 같이 이루어질 수 있습니다.
          </Text>
          {[
            '경고',
            '회원 콘텐츠 삭제 또는 노출 제한',
            '일부 기능 이용 제한',
            '계정 일시 정지',
            '계정 영구 정지',
            '이용계약 해지',
          ].map((item, i) => (
            <Text key={i} style={styles.nestedItem}>{`${i + 1}. ${item}`}</Text>
          ))}
          <Text style={styles.listItem}>
            3. 운영자는 이용 제한 조치를 하는 경우 가능한 범위 내에서 회원에게 그 사유를 안내합니다.
            다만, 긴급한 조치가 필요하거나 법령상 안내가 어려운 경우에는 예외로 할 수 있습니다.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제20조 손해배상 및 면책</Text>
          <Text style={styles.listItem}>
            1. 운영자는 운영자의 고의 또는 중대한 과실로 인해 회원에게 손해가 발생한 경우 관련
            법령에 따라 책임을 부담합니다.
          </Text>
          <Text style={styles.listItem}>
            2. 운영자는 다음 각 호의 사유로 발생한 손해에 대해서는 책임을 부담하지 않습니다. 단,
            운영자의 고의 또는 중대한 과실이 있는 경우는 제외합니다.
          </Text>
          {[
            '회원의 귀책사유로 발생한 서비스 이용 장애 또는 손해',
            '회원이 외부 서비스에서 직접 신청, 결제, 취소, 환불 등을 진행하며 발생한 문제',
            '주최 기관 또는 외부 서비스가 제공한 정보의 변경, 오류, 누락, 중단',
            '천재지변, 재난, 서버 장애, 통신 장애 등 불가항력적 사유',
            '회원 간 또는 회원과 제3자 간에 발생한 분쟁',
            '회원이 서비스 내 정보를 충분히 확인하지 않아 발생한 불이익',
            '무료로 제공되는 서비스의 변경, 중단, 종료로 인해 발생한 손해',
          ].map((item, i) => (
            <Text key={i} style={styles.nestedItem}>{`${i + 1}. ${item}`}</Text>
          ))}
          <Text style={styles.listItem}>
            3. 운영자는 서비스 내 활동 정보의 정확성, 최신성, 완전성을 높이기 위해 노력하지만, 모든
            정보가 항상 정확하거나 최신임을 보장하지는 않습니다.
          </Text>
          <Text style={styles.listItem}>
            4. 운영자는 회원이 서비스를 통해 기대한 특정한 결과, 만족도, 활동 참여 성과를 보장하지
            않습니다.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제21조 분쟁의 해결</Text>
          {[
            '운영자와 회원은 서비스 이용과 관련하여 분쟁이 발생한 경우 성실히 협의하여 해결하도록 노력합니다.',
            '협의로 해결되지 않는 분쟁은 관련 법령에 따른 관할 법원을 관할 법원으로 합니다.',
          ].map((item, i) => (
            <Text key={i} style={styles.listItem}>{`${i + 1}. ${item}`}</Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>부칙</Text>
          <Text style={styles.body}>본 약관은 2026년 ○월 ○일부터 시행됩니다.</Text>
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
  listItem: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22.75,
    letterSpacing: -0.15,
    color: '#364153',
    paddingLeft: 8,
  },
  nestedItem: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22.75,
    letterSpacing: -0.15,
    color: '#364153',
    paddingLeft: 20,
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
