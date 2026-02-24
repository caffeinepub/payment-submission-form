import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Payment } from '../backend';

export function useSubmitPayment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      fullName: string;
      address: string;
      email: string;
      cardNumber: string;
      expiryDate: string;
      cvv: string;
      amount: bigint;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.submitPayment(
        data.fullName,
        data.address,
        data.email,
        data.cardNumber,
        data.expiryDate,
        data.cvv,
        data.amount
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });
}

export function useGetAllPayments() {
  const { actor, isFetching } = useActor();

  return useQuery<Payment[]>({
    queryKey: ['payments'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPayments();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
}
