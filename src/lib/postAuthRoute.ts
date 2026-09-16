import type { RegistrationStatus } from '@/src/store/authStore';

export function getPostAuthRoute(registrationStatus: RegistrationStatus | null): string {
  if (registrationStatus === 'NOT_STARTED') return '/(auth)/profile-setup';
  if (registrationStatus === 'PROFILE_COMPLETED') return '/onboarding/step1';
  return '/(tabs)/home';
}
