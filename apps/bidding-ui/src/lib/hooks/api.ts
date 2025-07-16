// API base URL - update this to match your backend
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Helper function for API calls with authentication
export const apiCall = async (endpoint: string, options?: RequestInit) => {
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
