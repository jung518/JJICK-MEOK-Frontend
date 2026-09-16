export const ACTIVITY_TYPE_LABEL: Record<string, string> = {
  PROGRAM: '프로그램',
  ONE_DAY: '원데이',
  EVENT: '행사·강연',
  CLUB: '동아리',
};

export function getActivityTypeLabel(activityType: string): string {
  return ACTIVITY_TYPE_LABEL[activityType] ?? activityType;
}

export function formatDday(deadline: number): string {
  return deadline <= 0 ? 'D-day' : `D-${deadline}`;
}

export function getDaysLeftFromDate(dateString: string): number {
  return Math.ceil((new Date(dateString).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export function isNotExpired(deadline: number): boolean {
  return deadline >= 0;
}
