import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

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
