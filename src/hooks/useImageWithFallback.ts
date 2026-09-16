import { useEffect, useState } from 'react';

export function useImageWithFallback(url?: string) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [url]);

  const hasImage = !!url && !imageError;
  const onError = () => setImageError(true);

  return { hasImage, onError };
}
