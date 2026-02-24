import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
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
  const { actor, isFetching: isActorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const principal = identity?.getPrincipal().toString() ?? null;

  return useQuery<Payment[]>({
    // Include principal in query key so the query is re-run when identity changes
    queryKey: ['payments', principal],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPayments();
    },
    // Only fetch when actor is ready AND user is authenticated
    enabled: !!actor && !isActorFetching && !!identity,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}
