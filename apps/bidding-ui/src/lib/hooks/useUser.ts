import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { apiCall, queryKeys } from './api';
import { User } from './types';

export const useUserDetails = (): UseQueryResult<User, Error> => {
  return useQuery({
    queryKey: queryKeys.user,
    queryFn: () => apiCall('/users/details'),
    staleTime: 30 * 1000,
  });
};

// Auth Queries (if you have authentication)
export const useUser = (): UseQueryResult<User, Error> => {
  return useQuery({
    queryKey: queryKeys.user,
    queryFn: () => apiCall('/auth/me'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
