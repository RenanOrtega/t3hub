import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authStorage, isTokenExpired } from "../lib/auth";
import { QueryKeys } from "../constants/query-keys";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

interface User {
  id: string;
  email: string;
  role: string;
  displayName: string | null;
  avatarUrl: string | null;
}

const fetchCurrentUser = async (): Promise<User> => {
  const token = authStorage.getToken();

  if (!token || isTokenExpired(token)) {
    throw new Error("No valid token");
  }

  const response = await fetch(`${API_URL}/api/auth/me`, {
    credentials: "include",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  return response.json();
};

export const useAuth = () => {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: [QueryKeys.CURRENT_USER],
    queryFn: fetchCurrentUser,
    enabled: authStorage.isAuthenticated(),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const token = authStorage.getToken();
      if (token) {
        await fetch(`${API_URL}/api/auth/logout`, {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    },
    onSuccess: () => {
      authStorage.removeToken();
      queryClient.clear();
      window.location.href = "/login";
    },
  });

  return {
    user: user ?? null,
    isLoading,
    isAuthenticated: authStorage.isAuthenticated() && !error,
    logout: () => logoutMutation.mutate(),
  };
};
