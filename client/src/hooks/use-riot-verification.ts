import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authStorage } from "../lib/auth";
import { QueryKeys } from "../constants/query-keys";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

interface VerificationStatus {
  verified: boolean;
  player: {
    gameName: string;
    tagLine: string;
    summonerLevel: number;
    verifiedAt: string;
  } | null;
}

interface GenerateVerificationResponse {
  verificationIconId: number;
  expiresIn: number;
}

interface VerifyAccountResponse {
  success: boolean;
  message: string;
  player: {
    gameName: string;
    tagLine: string;
    summonerLevel: number;
    profileIconId: number;
    currentRank: {
      tier: string;
      division: string | null;
      lp: number;
    } | null;
  };
}

const fetchVerificationStatus = async (): Promise<VerificationStatus> => {
  const token = authStorage.getToken();

  if (!token) {
    throw new Error("No token");
  }

  const response = await fetch(
    `${API_URL}/api/riot/verification/status`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch verification status");
  }

  return response.json();
};

const generateVerification = async (data: {
  gameName: string;
  tagLine: string;
}): Promise<GenerateVerificationResponse> => {
  const token = authStorage.getToken();

  if (!token) {
    throw new Error("No token");
  }

  const response = await fetch(
    `${API_URL}/api/riot/verification/generate`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to generate verification");
  }

  return response.json();
};

const verifyAccount = async (data: {
  gameName: string;
  tagLine: string;
  verificationIconId: number;
  primaryLane: string;
  secondaryLane: string;
  discordTag: string;
}): Promise<VerifyAccountResponse> => {
  const token = authStorage.getToken();

  if (!token) {
    throw new Error("No token");
  }

  const response = await fetch(
    `${API_URL}/api/riot/verification/verify`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to verify account");
  }

  return response.json();
};

export const useRiotVerification = () => {
  const queryClient = useQueryClient();

  const { data: verificationStatus, isLoading } = useQuery({
    queryKey: [QueryKeys.RIOT_VERIFICATION_STATUS],
    queryFn: fetchVerificationStatus,
    enabled: authStorage.isAuthenticated(),
    retry: false,
  });

  const generateMutation = useMutation({
    mutationFn: generateVerification,
  });

  const verifyMutation = useMutation({
    mutationFn: verifyAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.RIOT_VERIFICATION_STATUS],
      });
    },
  });

  return {
    verificationStatus,
    isLoading,
    generateVerification: generateMutation.mutateAsync,
    verifyAccount: verifyMutation.mutateAsync,
    isGenerating: generateMutation.isPending,
    isVerifying: verifyMutation.isPending,
    generateError: generateMutation.error,
    verifyError: verifyMutation.error,
  };
};
