import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from '@tanstack/react-query';
import { apiCall, queryKeys } from './api';
import {
  CollectionResponse,
  CreateCollectionData,
  UpdateCollectionData,
  Collection,
} from './types';

export const useGetCollectionById = (
  id: string
): UseQueryResult<CollectionResponse, Error> => {
  return useQuery({
    queryKey: queryKeys.collection(id),
    queryFn: () => apiCall(`/collections/${id}`),
    enabled: !!id,
  });
};

export const useCollections = (
  page = 1,
  limit = 10
): UseQueryResult<Collection[], Error> => {
  return useQuery({
    queryKey: [...queryKeys.collections, page, limit],
    queryFn: () => apiCall(`/collections?page=${page}&limit=${limit}`),
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useUserCollections = (
  page = 1,
  limit = 10
): UseQueryResult<Collection[], Error> => {
  return useQuery({
    queryKey: [...queryKeys.collections, 'user'],
    queryFn: () =>
      apiCall(`/collections/userCollections?page=${page}&limit=${limit}`),
    staleTime: 30 * 1000,
  });
};

export const useAllUserCollectionExcludeCurrentUser = (
  page = 1,
  limit = 10
): UseQueryResult<Collection[], Error> => {
  return useQuery({
    queryKey: [...queryKeys.collections, 'allUserCollectionExcludeCurrentUser'],
    queryFn: () =>
      apiCall(
        `/collections/allUserCollectionsExcludeCurrentUser?page=${page}&limit=${limit}`
      ),
    staleTime: 30 * 1000,
  });
};

export const useCollection = (
  id: string
): UseQueryResult<Collection, Error> => {
  return useQuery({
    queryKey: queryKeys.collection(id),
    queryFn: () => apiCall(`/collections/${id}`),
    enabled: !!id,
  });
};

export const useCreateCollection = (): UseMutationResult<
  Collection,
  Error,
  CreateCollectionData,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCollectionData): Promise<Collection> =>
      apiCall('/collections', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.collections });
    },
  });
};

export const useUpdateCollection = (): UseMutationResult<
  Collection,
  Error,
  { id: string; data: UpdateCollectionData },
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateCollectionData;
    }): Promise<Collection> => {
      console.log('data=======', data);

      return apiCall(`/collections/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.collections });
      queryClient.invalidateQueries({ queryKey: queryKeys.collection(id) });
    },
  });
};

export const useDeleteCollection = (): UseMutationResult<
  Collection,
  Error,
  string,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string): Promise<Collection> =>
      apiCall(`/collections/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.collections });
    },
  });
};
