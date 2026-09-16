import { useRef, useState } from 'react';
import { PanResponder, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';

const PULL_THRESHOLD = 60;

export function usePullToRefresh(refetch: () => Promise<any>) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const scrollYRef = useRef(0);
  const isRefreshingRef = useRef(false);
  const refetchRef = useRef(refetch);
  refetchRef.current = refetch;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: (_, { dy, dx }) =>
        scrollYRef.current <= 0 && dy > 8 && dy > Math.abs(dx) * 2,
      onPanResponderRelease: (_, { dy }) => {
        if (dy * 0.4 >= PULL_THRESHOLD && !isRefreshingRef.current) {
          isRefreshingRef.current = true;
          setIsRefreshing(true);
          refetchRef.current().finally(() => {
            isRefreshingRef.current = false;
            setIsRefreshing(false);
          });
        }
      },
      onPanResponderTerminate: () => {},
    }),
  ).current;

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollYRef.current = e.nativeEvent.contentOffset.y;
  };

  return { panResponder, isRefreshing, onScroll };
}
