import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { addFavorite, deleteFavorite } from '@/src/api/favorites';

type Options = {
  onUnsave?: () => void;
};

export function useToggleFavorite(
  activityId: number,
  initialSaved: boolean | undefined,
  options: Options = {},
) {
  const queryClient = useQueryClient();
  const [saved, setSaved] = useState(!!initialSaved);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialSaved !== undefined) setSaved(initialSaved);
  }, [initialSaved]);

  const toggle = () => {
    if (isSaving) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const nextSaved = !saved;
    setSaved(nextSaved);
    setIsSaving(true);
    const request = nextSaved ? addFavorite(activityId) : deleteFavorite(activityId);
    request
      .then(() => {
        if (!nextSaved) options.onUnsave?.();
        queryClient.invalidateQueries({ queryKey: ['favorites-page'] });
      })
      .catch(() => setSaved(!nextSaved))
      .finally(() => setIsSaving(false));
  };

  return { saved, isSaving, toggle };
}
