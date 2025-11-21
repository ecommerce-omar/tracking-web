import api from '@/services/api';
import { useQuery } from '@tanstack/react-query';
import { Tracking } from '@/schemas/tracking-schema';
import { QUERY_KEYS, APP_CONFIG } from '@/constants/app.constants';

export function useTracking(trackingCode: string) {
  const enabled = !!trackingCode && trackingCode.trim().length >= 3;

  const result = useQuery({
    queryKey: [...QUERY_KEYS.TRACKINGS, 'code', trackingCode],
    queryFn: async (): Promise<Tracking | null> => {
      try {
        const response = await api.get('/tracking', {
          params: {
            'tracking_code': `eq.${trackingCode.trim().toUpperCase()}`
          }
        });
        return response.data[0] || null;
      } catch (error) {
        console.error('Error fetching tracking:', error);
        return null;
      }
    },
    enabled,
    staleTime: APP_CONFIG.CACHE_DURATION.ORDER_DETAILS,
    retry: (failureCount, error) => {
      // Don't retry if tracking not found
      if (error instanceof Error && error.message.includes('not found')) {
        return false;
      }
      return failureCount < APP_CONFIG.RETRY.MAX_ATTEMPTS;
    },
    retryDelay: APP_CONFIG.RETRY.DELAY,
  });

  return result;
}

// Legacy export for backward compatibility
export const useTrackingOrder = useTracking;