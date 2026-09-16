import { useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ScreenLayout } from '@/src/components/Layout/ScreenLayout';
import ArrowLeftBar from '@/src/components/Bar/ArrowLeftBar';
import { Loading } from '@/src/components/Loading/Loading';
import { Typography } from '@/src/components/Typography/Typography';
import ChipBadge, { type TagVariant } from '@/src/components/Chip/ChipBadge';
import ButtonInsight from '@/src/components/Button/ButtonInsight';
import LogoutModal from '@/src/components/Modal/LogoutModal';
import { useApiErrorMessage } from '@/src/hooks/useApiErrorMessage';
import { ErrorBox } from '@/src/components/EmptyState/ErrorBox';
import ArrowRightSvg from '@/assets/images/ArrowRight.svg';
import EditSvg from '@/assets/images/Edit.svg';
import ProfileSvg from '@/assets/images/Profile.svg';
import { getMyProfile } from '@/src/api/user';
import { useAuthStore } from '@/src/store/authStore';
import { colors } from '@/src/constants/colors';
import { sortByVariantPriority } from '@/src/utils/tagVariant';
import { useNavigateOnce } from '@/src/hooks/useNavigateOnce';

function MenuRow({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.menuRow} onPress={onPress} activeOpacity={0.7}>
      <Typography size="lg" weight="medium">
        {label}
      </Typography>
      <ArrowRightSvg width={6} height={11} color={colors.text.tertiary} />
    </TouchableOpacity>
  );
}

export default function MyPageScreen() {
  const router = useRouter();
  const navigateOnce = useNavigateOnce();
  const logout = useAuthStore((s) => s.logout);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const {
    data: profile,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['users', 'me', 'profile'],
    queryFn: getMyProfile,
  });

  const { message: errorMessage, isRetriable } = useApiErrorMessage(
    isError,
    error,
    '내 정보를 불러오지 못했어요. 다시 시도해주세요.',
  );

  const nickname = profile?.nickname ?? '';
  const tags = sortByVariantPriority(
    (profile?.tags ?? [])
      .filter((tag) => tag.groupType !== null)
      .map((tag) => ({ id: tag.id, label: tag.name, variant: tag.groupType as TagVariant })),
  );

  const handleConfirmLogout = async () => {
    setShowLogoutModal(false);
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <ScreenLayout style={styles.screen}>
      <View style={styles.appBar}>
        <ArrowLeftBar onPress={() => router.back()} />
        <View style={styles.appBarTitle} pointerEvents="none">
          <Typography size="xl" weight="medium">
            마이
          </Typography>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {isLoading ? (
          <View style={styles.messageBox}>
            <Loading />
          </View>
        ) : errorMessage ? (
          <View style={styles.messageBox}>
            <ErrorBox message={errorMessage} onRetry={isRetriable ? () => refetch() : undefined} />
          </View>
        ) : (
          <>
            <View style={styles.profileCard}>
              <View style={styles.avatarWrapper}>
                {profile?.profileImageUrl ? (
                  <Image source={{ uri: profile.profileImageUrl }} style={styles.avatarImage} />
                ) : (
                  <ProfileSvg width={75} height={75} />
                )}
              </View>
              <View style={styles.profileInfo}>
                <View style={styles.nicknameRow}>
                  <Typography size="xxl" weight="semiBold">
                    {nickname}님
                  </Typography>
                  <TouchableOpacity onPress={() => {}} hitSlop={8}>
                    <EditSvg width={20} height={20} />
                  </TouchableOpacity>
                </View>
                <Typography size="lg" weight="medium" color="tertiary">
                  환영합니다!
                </Typography>
              </View>
            </View>

            <View style={styles.tagCard}>
              <Typography size="md" weight="semiBold" style={styles.tagCardTitle}>
                나의 취향 태그
              </Typography>
              <View style={styles.tagRow}>
                {tags.map((tag) => (
                  <ChipBadge key={tag.id} label={`${tag.label}`} variant={tag.variant} />
                ))}
              </View>
              <ButtonInsight onPress={() => navigateOnce('/insight')} />
            </View>

            <View style={styles.menuCard}>
              <MenuRow label="회원정보 관리" onPress={() => {}} />
              <MenuRow label="공지사항" onPress={() => {}} />
              <MenuRow label="약관 및 정책" onPress={() => navigateOnce('/terms/service')} />
              <MenuRow label="로그아웃" onPress={() => setShowLogoutModal(true)} />
            </View>
          </>
        )}
      </ScrollView>

      <Modal
        visible={showLogoutModal}
        transparent
        statusBarTranslucent
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setShowLogoutModal(false)} />
        <View style={styles.sheetContainer}>
          <LogoutModal onCancel={() => setShowLogoutModal(false)} onConfirm={handleConfirmLogout} />
        </View>
      </Modal>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.neutral.surface,
  },
  appBar: {
    height: 50,
  },
  appBarTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 21,
    paddingBottom: 140,
    gap: 20,
  },
  messageBox: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 16,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.neutral.white,
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 22,
  },
  avatarWrapper: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  profileInfo: {
    flex: 1,
    gap: 7,
  },
  nicknameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tagCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingTop: 18,
    paddingBottom: 14,
  },
  tagCardTitle: {
    marginBottom: 14,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 7,
    marginBottom: 25,
  },
  menuCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: 15,
    paddingVertical: 8,
    gap: 15,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
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
