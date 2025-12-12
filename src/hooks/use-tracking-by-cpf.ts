import api from '@/services/api';
import { useQuery } from '@tanstack/react-query';
import { Tracking } from '@/schemas/tracking-schema';
import { QUERY_KEYS, APP_CONFIG } from '@/constants/app.constants';
import { cleanCpf } from '@/utils/is-valid-cpf';

export function useTrackingByCpf(cpf: string, enabled: boolean = false) {
  const cleanedCpf = cpf ? cleanCpf(cpf) : '';

  const result = useQuery({
    queryKey: [...QUERY_KEYS.TRACKINGS, 'cpf', cleanedCpf],
    queryFn: async (): Promise<Tracking[]> => {
      try {
        const response = await api.get('/tracking', {
          params: {
            'cpf': `eq.${cleanedCpf}`,
            'order': 'created_at.desc'
          }
        });
        return response.data || [];
      } catch (error) {
        console.error('Error fetching tracking by CPF:', error);
        throw error;
      }
    },
    enabled: enabled && !!cleanedCpf && cleanedCpf.length === 11,
    staleTime: APP_CONFIG.CACHE_DURATION.ORDER_DETAILS,
    retry: (failureCount, error) => {
      // Don't retry if not found
      if (error instanceof Error && error.message.includes('not found')) {
        return false;
      }
      return failureCount < APP_CONFIG.RETRY.MAX_ATTEMPTS;
    },
    retryDelay: APP_CONFIG.RETRY.DELAY,
  });

  return result;
}
