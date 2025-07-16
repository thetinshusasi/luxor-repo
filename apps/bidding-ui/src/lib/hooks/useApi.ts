import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';

// Types matching backend DTOs and entities
export interface Collection {
  id: string;
  name: string;
  description: string;
  userId: string;
  stock: number;
  price: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  isDeleted: boolean;
  isOwner: boolean;
}

export interface CollectionBid {
  id: string;
  collectionId: string;
  isOwner: boolean;
  price: number;
  status: BidStatus;
}

export interface Bid {
  id: string;
  collectionId: string;
  price: number;
  userId: string;
  status: BidStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  isDeleted: boolean;
  isOwner: boolean;
}

export enum BidStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export interface CreateCollectionData {
  name: string;
  description: string;
  stock: number;
  price: number;
}

export interface UpdateCollectionData {
  name?: string;
  description?: string;
  stock?: number;
  price?: number;
}

export interface CreateBidData {
  collectionId: string;
  price: number;
}

export interface UpdateBidData {
  price: number;
}

export interface AcceptBidData {
  bidId: string;
  collectionId: string;
}

export interface CollectionResponse {
  id: string;
  name: string;
  description: string;
  stock: number;
  price: number;
  isOwner: boolean;
}

// API base URL - update this to match your backend
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Helper function for API calls with authentication
const apiCall = async (endpoint: string, options?: RequestInit) => {
  // Get token from localStorage or wherever you store it
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    // Handle 401 Unauthorized - redirect to login
    if (response.status === 401) {
      localStorage.removeItem('accessToken');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error('Authentication required');
    }

    // Handle 403 Forbidden - redirect to login
    if (response.status === 403) {
      localStorage.removeItem('accessToken');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error('Access forbidden - please login again');
    }

    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message ||
        `API Error: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
};

// Query Keys
export const queryKeys = {
  collections: ['collections'] as const,
  collection: (id: string) => ['collection', id] as const,
  bids: (collectionId: string) => ['bids', collectionId] as const,
  user: ['users'] as const,
};

export const useGetCollectionById = (
  id: string
): UseQueryResult<CollectionResponse, Error> => {
  return useQuery({
    queryKey: queryKeys.collection(id),
    queryFn: () => apiCall(`/collections/${id}`),
    enabled: !!id,
  });
};

export const useUserDetails = () => {
  return useQuery({
    queryKey: queryKeys.user,
    queryFn: () => apiCall('/users/details'),
    staleTime: 30 * 1000,
  });
};

// Collections Queries
export const useCollections = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: [...queryKeys.collections, page, limit],
    queryFn: () => apiCall(`/collections?page=${page}&limit=${limit}`),
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useUserCollections = (page = 1, limit = 10) => {
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
) => {
  return useQuery({
    queryKey: [...queryKeys.collections, 'allUserCollectionExcludeCurrentUser'],
    queryFn: () =>
      apiCall(
        `/collections/allUserCollectionsExcludeCurrentUser?page=${page}&limit=${limit}`
      ),
    staleTime: 30 * 1000,
  });
};

export const useAllBidsByCollectionIds = (collectionIds: string[]) => {
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

export const useCollection = (id: string) => {
  return useQuery({
    queryKey: queryKeys.collection(id),
    queryFn: () => apiCall(`/collections/${id}`),
    enabled: !!id,
  });
};

// Bids Queries
export const useBids = (collectionId: string) => {
  return useQuery({
    queryKey: queryKeys.bids(collectionId),
    queryFn: () => apiCall(`/collections/${collectionId}/bids`),
    enabled: !!collectionId,
  });
};

export const useAllBids = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['bids', page, limit],
    queryFn: () => apiCall(`/bids?page=${page}&limit=${limit}`),
    staleTime: 30 * 1000,
  });
};

// Mutations
export const useCreateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCollectionData) =>
      apiCall('/collections', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.collections });
    },
  });
};

export const useUpdateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCollectionData }) => {
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

export const useDeleteCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiCall(`/collections/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.collections });
    },
  });
};

export const useCreateBid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBidData) =>
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

export const useUpdateBid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bidId, data }: { bidId: string; data: UpdateBidData }) =>
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

export const useAcceptBid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AcceptBidData) =>
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

export const useRejectBid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rejectBidData: AcceptBidData) =>
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

export const useDeleteBid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bidId: string) =>
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

// Auth Queries (if you have authentication)
export const useUser = () => {
  return useQuery({
    queryKey: queryKeys.user,
    queryFn: () => apiCall('/auth/me'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
