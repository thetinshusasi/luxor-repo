import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from '@tanstack/react-query';
import { apiCall, queryKeys } from './api';
import { CreateBidData, UpdateBidData, AcceptBidData, Bid } from './types';

export const useBids = (collectionId: string): UseQueryResult<Bid[], Error> => {
  return useQuery({
    queryKey: queryKeys.bids(collectionId),
    queryFn: () => apiCall(`/collections/${collectionId}/bids`),
    enabled: !!collectionId,
  });
};

export const useAllBids = (
  page = 1,
  limit = 10
): UseQueryResult<Bid[], Error> => {
  return useQuery({
    queryKey: ['bids', page, limit],
    queryFn: () => apiCall(`/bids?page=${page}&limit=${limit}`),
    staleTime: 30 * 1000,
  });
};

export const useAllBidsByCollectionIds = (
  collectionIds: string[]
): UseQueryResult<Bid[], Error> => {
  return useQuery({
    queryKey: ['bids', 'allBidsByCollectionIds', collectionIds],
    queryFn: () =>
      apiCall(`/collections/allBidsByCollectionIds`, {
        method: 'POST',
        body: JSON.stringify({ collectionIds }),
      }),
    enabled: collectionIds && collectionIds.length > 0,
  });
};

export const useCreateBid = (): UseMutationResult<
  Bid,
  Error,
  CreateBidData,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBidData): Promise<Bid> =>
      apiCall('/bids', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: (_, { collectionId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bids(collectionId) });
      queryClient.invalidateQueries({
        queryKey: queryKeys.collection(collectionId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.collections });
      queryClient.invalidateQueries({
        queryKey: [
          ...queryKeys.collections,
          'allUserCollectionExcludeCurrentUser',
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ['bids', 'allBidsByCollectionIds'],
      });
    },
  });
};

export const useUpdateBid = (): UseMutationResult<
  Bid,
  Error,
  { bidId: string; data: UpdateBidData },
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bidId,
      data,
    }: {
      bidId: string;
      data: UpdateBidData;
    }): Promise<Bid> =>
      apiCall(`/bids/${bidId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bids'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.collections });
      queryClient.invalidateQueries({
        queryKey: [
          ...queryKeys.collections,
          'allUserCollectionExcludeCurrentUser',
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ['bids', 'allBidsByCollectionIds'],
      });
    },
  });
};

export const useAcceptBid = (): UseMutationResult<
  Bid,
  Error,
  AcceptBidData,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AcceptBidData): Promise<Bid> =>
      apiCall('/collections/accept-bid', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.collections });
      queryClient.invalidateQueries({ queryKey: ['bids'] });
      queryClient.invalidateQueries({
        queryKey: [
          ...queryKeys.collections,
          'allUserCollectionExcludeCurrentUser',
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ['bids', 'allBidsByCollectionIds'],
      });
    },
  });
};

export const useRejectBid = (): UseMutationResult<
  Bid,
  Error,
  AcceptBidData,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rejectBidData: AcceptBidData): Promise<Bid> =>
      apiCall(`/collections/reject-bid`, {
        method: 'POST',
        body: JSON.stringify(rejectBidData),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.collections });
      queryClient.invalidateQueries({ queryKey: ['bids'] });
      queryClient.invalidateQueries({
        queryKey: [
          ...queryKeys.collections,
          'allUserCollectionExcludeCurrentUser',
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ['bids', 'allBidsByCollectionIds'],
      });
    },
  });
};

export const useDeleteBid = (): UseMutationResult<
  Bid,
  Error,
  string,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bidId: string): Promise<Bid> =>
      apiCall(`/bids/${bidId}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.collections });
      queryClient.invalidateQueries({ queryKey: ['bids'] });
      queryClient.invalidateQueries({
        queryKey: [
          ...queryKeys.collections,
          'allUserCollectionExcludeCurrentUser',
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ['bids', 'allBidsByCollectionIds'],
      });
    },
  });
};
