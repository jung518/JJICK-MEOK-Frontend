import { useLocalSearchParams } from 'expo-router';
import CategoryListScreen, { type ActivityType } from './_CategoryListScreen';

const CATEGORY_CONFIG: Record<string, { activityType: ActivityType; title: string }> = {
  program: { activityType: 'PROGRAM', title: '프로그램' },
  oneday: { activityType: 'ONE_DAY', title: '원데이' },
  festival: { activityType: 'EVENT', title: '행사·강연' },
  club: { activityType: 'CLUB', title: '동아리' },
};

export default function ActivityCategoryScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const config = CATEGORY_CONFIG[type ?? ''];

  if (!config) return null;

  return <CategoryListScreen type={config.activityType} title={config.title} />;
}
