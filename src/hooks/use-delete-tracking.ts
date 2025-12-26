import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { QUERY_KEYS } from '@/constants/app.constants';
import { toast } from 'sonner';

export function useDeleteTracking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (trackingCode: string) => {
      const response = await api.delete('/tracking', {
        params: {
          'tracking_code': `eq.${trackingCode.trim().toUpperCase()}`
        }
      });
      return response.data;
    },
    onSuccess: () => {
      // Invalidar cache de trackings - o Supabase realtime irá atualizar automaticamente
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRACKINGS });

      toast.success('Rastreio excluído com sucesso');
    },
    onError: (error) => {
      console.error('Error deleting tracking:', error);
      toast.error('Erro ao excluir rastreio');
    }
  });
}
