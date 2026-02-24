import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { Payment } from '../backend';

export function useSubmitPayment() {
  const { actor, isFetching: isActorFetching } = useActor();
  const queryClient = useQueryClient();

  const isActorReady = !!actor && !isActorFetching;

  const mutation = useMutation({
    mutationFn: async (data: {
      fullName: string;
      address: string;
      email: string;
      cardNumber: string;
      expiryDate: string;
      cvv: string;
      amount: bigint;
    }) => {
      // Guard: actor must be ready before executing
      if (!actor || isActorFetching) {
        throw new Error('__actor_not_ready__');
      }

      try {
        await actor.submitPayment(
          data.fullName,
          data.address,
          data.email,
          data.cardNumber,
          data.expiryDate,
          data.cvv,
          data.amount
        );
      } catch (err: unknown) {
        // Parse canister rejection messages for user-friendly errors
        const message = err instanceof Error ? err.message : String(err);
        if (message.includes('Unauthorized')) {
          throw new Error('You are not authorized to submit payments.');
        }
        if (message.includes('network') || message.includes('fetch') || message.includes('timeout')) {
          throw new Error('Network error. Please check your connection and try again.');
        }
        throw new Error(`Payment failed: ${message}`);
      }
    },
    // Retry up to 2 times with exponential back-off for transient errors,
    // but do NOT retry if the actor is simply not ready yet.
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message === '__actor_not_ready__') {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(800 * 2 ** attemptIndex, 4000),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });

  return { ...mutation, isActorReady };
}

export function useGetAllPayments() {
  const { actor, isFetching: isActorFetching } = useActor();
  const { identity, isInitializing } = useInternetIdentity();

  const isAuthenticated = !!identity;
  const principal = identity?.getPrincipal().toString() ?? 'anonymous';

  // Only enable the query when:
  // 1. Identity initialization is complete (not restoring from storage)
  // 2. The actor is not currently being fetched/recreated
  // 3. The actor instance is available
  // 4. The user is authenticated (identity is present)
  const isReady = !isInitializing && !isActorFetching && !!actor && isAuthenticated;

  return useQuery<Payment[]>({
    // Include principal in query key so the query re-runs when identity changes
    queryKey: ['payments', principal],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not ready');
      return actor.getAllPayments();
    },
    enabled: isReady,
    staleTime: 0,
    refetchOnWindowFocus: true,
    // Retry up to 3 times with exponential back-off to handle transient
    // actor initialization failures after login.
    // With retry:3, failureCount reaches 4 when all retries are exhausted.
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 8000),
  });
}
