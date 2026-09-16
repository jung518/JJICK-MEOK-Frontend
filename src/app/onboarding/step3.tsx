import { useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import ArrowLeftBar from '@/src/components/Bar/ArrowLeftBar';
import ProgressBar from '@/src/components/Bar/ProgressBar';
import ChipFilter from '@/src/components/Chip/ChipFilter';
import { BottomCTA } from '@/src/components/Button/BottomCTA';
import { LocationButton, LocationPosition } from '@/src/components/Button/LocationButton';
import { CTAContainer } from '@/src/components/Layout/CTAContainer';
import { ScreenLayout } from '@/src/components/Layout/ScreenLayout';
import { Typography } from '@/src/components/Typography/Typography';
import { colors } from '@/src/constants/colors';
import { getRegions } from '@/src/api/user';
import { useOnboardingStore } from '@/src/store/onboardingStore';
import { useNavigateOnce } from '@/src/hooks/useNavigateOnce';

const SEOUL_LABEL = '서울';
const SEOUL_ALL_LABEL = '서울전체';
const COLS = 4;

const chunkRows = (items: string[]): string[][] => {
  const rows: string[][] = [];
  for (let i = 0; i < items.length; i += COLS) {
    const row = items.slice(i, i + COLS);
    while (row.length < COLS) row.push('');
    rows.push(row);
  }
  return rows;
};

const getPosition = (rowIndex: number, colIndex: number, totalRows: number): LocationPosition => {
  if (rowIndex === 0 && colIndex === 0) return 'topLeft';
  if (rowIndex === 0 && colIndex === 3) return 'topRight';
  if (rowIndex === totalRows - 1 && colIndex === 0) return 'bottomLeft';
  if (rowIndex === totalRows - 1 && colIndex === 3) return 'bottomRight';
  return 'middle';
};

export default function OnboardingStep3() {
  const router = useRouter();
  const navigateOnce = useNavigateOnce();
  const [isSeoulExpanded, setIsSeoulExpanded] = useState(false);
  const [isSeoulAllSelected, setIsSeoulAllSelected] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState<Set<string>>(new Set());

  const { setRegionIds } = useOnboardingStore();

  const {
    data: provinces = [],
    isLoading: isProvincesLoading,
    isError: isRegionsError,
    refetch: refetchRegions,
  } = useQuery({
    queryKey: ['regions'],
    queryFn: () => getRegions(),
  });

  const seoulProvince = provinces.find((province) => province.name === SEOUL_LABEL);
  const seoulProvinceId = seoulProvince?.id;

  const { data: seoulDistricts = [] } = useQuery({
    queryKey: ['regions', seoulProvinceId],
    queryFn: () => getRegions(seoulProvinceId!),
    enabled: !!seoulProvinceId && isSeoulExpanded,
  });

  const provinceNames = provinces.map((province) => province.name);
  const districtNames = seoulDistricts.map((district) => district.name);
  const nonSeoulProvinceNames = provinceNames.filter((name) => name !== SEOUL_LABEL);

  const displayRows = useMemo(() => {
    if (!isSeoulExpanded || seoulDistricts.length === 0) {
      return chunkRows(provinceNames);
    }
    const normalRows = chunkRows(provinceNames);
    const seoulRowIndex = Math.floor(provinceNames.indexOf(SEOUL_LABEL) / COLS);
    const districtRows = chunkRows(districtNames);
    return [
      ...normalRows.slice(0, seoulRowIndex + 1),
      ...districtRows,
      ...normalRows.slice(seoulRowIndex + 1),
    ];
  }, [isSeoulExpanded, provinceNames, districtNames, seoulDistricts.length]);

  const toggleSeoulExpanded = () => {
    setIsSeoulExpanded((prev) => !prev);
  };

  const toggleSeoulAllSelected = () => {
    if (isSeoulAllSelected) {
      setIsSeoulAllSelected(false);
      return;
    }
    setIsSeoulAllSelected(true);
    setSelectedLocations((prev) => {
      const next = new Set(prev);
      districtNames.forEach((districtName) => next.delete(districtName));
      const selectedNonSeoulProvinces = nonSeoulProvinceNames.filter((provinceName) =>
        next.has(provinceName),
      );
      if (selectedNonSeoulProvinces.length > 2) {
        selectedNonSeoulProvinces.slice(2).forEach((provinceName) => next.delete(provinceName));
      }
      return next;
    });
  };

  const toggleDistrict = (districtName: string) => {
    if (isSeoulAllSelected) return;
    setSelectedLocations((prev) => {
      const next = new Set(prev);
      if (next.has(districtName)) {
        next.delete(districtName);
      } else if (next.size < 3) {
        next.add(districtName);
      }
      return next;
    });
  };

  const toggleProvince = (provinceName: string) => {
    const limit = isSeoulAllSelected ? 2 : 3;
    setSelectedLocations((prev) => {
      const next = new Set(prev);
      if (next.has(provinceName)) {
        next.delete(provinceName);
      } else {
        const selectedCount = isSeoulAllSelected
          ? nonSeoulProvinceNames.filter((name) => next.has(name)).length
          : next.size;
        if (selectedCount < limit) {
          next.add(provinceName);
        }
      }
      return next;
    });
  };

  const handlePress = (label: string) => {
    if (!label) return;
    if (label === SEOUL_LABEL) return toggleSeoulExpanded();
    if (label === SEOUL_ALL_LABEL) return toggleSeoulAllSelected();
    if (districtNames.includes(label)) return toggleDistrict(label);
    return toggleProvince(label);
  };

  const isSelected = (label: string) => {
    if (label === SEOUL_LABEL) return isSeoulExpanded || isSeoulAllSelected;
    if (label === SEOUL_ALL_LABEL) return isSeoulAllSelected;
    if (districtNames.includes(label)) return isSeoulAllSelected || selectedLocations.has(label);
    return selectedLocations.has(label);
  };

  const getDefaultBg = (label: string): string | undefined => {
    if (districtNames.includes(label) || label === SEOUL_ALL_LABEL) {
      return 'rgba(255, 242, 166, 0.45)';
    }
    return undefined;
  };

  const chips = useMemo(() => {
    const result: string[] = [];
    if (isSeoulAllSelected) {
      result.push(SEOUL_LABEL);
    } else {
      districtNames.forEach((districtName) => {
        if (selectedLocations.has(districtName)) result.push(districtName);
      });
    }
    nonSeoulProvinceNames.forEach((provinceName) => {
      if (selectedLocations.has(provinceName)) result.push(provinceName);
    });
    return result;
  }, [isSeoulAllSelected, districtNames, selectedLocations, nonSeoulProvinceNames]);

  const removeChip = (label: string) => {
    if (label === SEOUL_LABEL) {
      setIsSeoulAllSelected(false);
      return;
    }
    setSelectedLocations((prev) => {
      const next = new Set(prev);
      next.delete(label);
      return next;
    });
  };

  const nameToId = useMemo(() => {
    const map: Record<string, number> = {};
    provinces.forEach((province) => (map[province.name] = province.id));
    seoulDistricts.forEach((district) => (map[district.name] = district.id));
    return map;
  }, [provinces, seoulDistricts]);

  const getSelectedRegionIds = (): number[] => {
    const ids: number[] = [];
    if (isSeoulAllSelected && nameToId[SEOUL_ALL_LABEL]) {
      ids.push(nameToId[SEOUL_ALL_LABEL]);
    } else {
      districtNames.forEach((districtName) => {
        if (selectedLocations.has(districtName) && nameToId[districtName]) {
          ids.push(nameToId[districtName]);
        }
      });
    }
    nonSeoulProvinceNames.forEach((provinceName) => {
      if (selectedLocations.has(provinceName) && nameToId[provinceName]) {
        ids.push(nameToId[provinceName]);
      }
    });
    return ids;
  };

  return (
    <ScreenLayout style={styles.container}>
      <View style={styles.progressContainer}>
        <ProgressBar step={2} />
      </View>
      <ArrowLeftBar onPress={() => router.back()} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerBlock}>
          <Typography size="xxxl" weight="semiBold">
            {'주로 활동하는\n지역을 알려주세요'}
          </Typography>
          <Typography size="md" style={styles.subtitle}>
            최대 3곳까지 설정할 수 있어요.
          </Typography>
        </View>

        <View style={styles.chipContainer}>
          {chips.length > 0 && (
            <View style={styles.chipRow}>
              {chips.map((chip) => (
                <ChipFilter key={chip} label={chip} onRemove={() => removeChip(chip)} />
              ))}
            </View>
          )}
        </View>

        {isProvincesLoading ? (
          <ActivityIndicator color={colors.text.secondary} />
        ) : isRegionsError ? (
          <View style={styles.errorContainer}>
            <Typography size="md" style={styles.errorText}>
              데이터를 불러오지 못했어요.
            </Typography>

            <TouchableOpacity onPress={() => refetchRegions()} style={styles.retryButton}>
              <Typography size="md" weight="semiBold">
                다시 시도
              </Typography>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.grid}>
            {displayRows.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.gridRow}>
                {row.map((location, colIndex) =>
                  location ? (
                    <LocationButton
                      key={`${rowIndex}-${colIndex}`}
                      label={location}
                      position={getPosition(rowIndex, colIndex, displayRows.length)}
                      selected={isSelected(location)}
                      defaultBg={getDefaultBg(location)}
                      onPress={() => handlePress(location)}
                    />
                  ) : (
                    <View key={`${rowIndex}-empty-${colIndex}`} style={styles.emptyCell} />
                  ),
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <CTAContainer style={styles.cta}>
        <BottomCTA
          label="다음"
          onPress={() => {
            setRegionIds(getSelectedRegionIds());
            navigateOnce('/onboarding/step4');
          }}
          variant="dark"
          disabled={chips.length === 0}
        />
      </CTAContainer>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.neutral.white },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 99,
    alignItems: 'center',
  },
  headerBlock: {
    width: '100%',
    gap: 13,
  },
  subtitle: {
    color: colors.text.secondary,
    lineHeight: 20,
  },
  chipContainer: {
    width: 332,
    height: 71,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    paddingTop: 30,
  },
  grid: {
    width: 332,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    overflow: 'hidden',
  },
  gridRow: {
    flexDirection: 'row',
  },
  emptyCell: {
    width: 83,
    height: 57,
  },
  cta: { paddingHorizontal: 20, paddingTop: 16 },
  progressContainer: { paddingHorizontal: 20, paddingTop: 9, paddingBottom: 7 },
  errorContainer: { alignItems: 'center', gap: 12, paddingTop: 20 },
  errorText: { color: colors.text.secondary },
  retryButton: { paddingHorizontal: 20, paddingVertical: 8 },
});
