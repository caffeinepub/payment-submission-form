import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";
import { Payment } from "../backend";

export function useGetAllPayments() {
  const { actor, isFetching: isActorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  // actorReady: actor exists and is not currently being fetched/recreated
  const actorReady = !!actor && !isActorFetching;

  return useQuery<Payment[]>({
    queryKey: ["payments", "all"],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.getAllPayments();
      return result;
    },
    enabled: actorReady && isAuthenticated,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
  });
}

export function useSubmitPayment() {
  const { actor, isFetching: isActorFetching } = useActor();
  const queryClient = useQueryClient();

  // actorReady: actor exists and is not currently being fetched/recreated
  const actorReady = !!actor && !isActorFetching;

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
      if (!actor || !actorReady) {
        throw new Error("Payment service not ready. Please wait and try again.");
      }
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
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });

  return { ...mutation, actorReady };
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: { name: string }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}
