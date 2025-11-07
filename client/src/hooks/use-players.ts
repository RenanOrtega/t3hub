import { useQuery } from "@tanstack/react-query";
import { authStorage } from "../lib/auth";
import { QueryKeys } from "../constants/query-keys";
import type { Player } from "../types/entities";
import type { Rank } from "../../../shared/types/rank";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

interface PlayerFilters {
  lane?: string;
  minRank?: Rank;
  maxRank?: Rank;
  availabilityStatus?: string;
}

const fetchPlayers = async (filters: PlayerFilters = {}): Promise<Player[]> => {
  const token = authStorage.getToken();

  const queryParams = new URLSearchParams();

  if (filters.lane) {
    queryParams.append("lane", filters.lane);
  }

  if (filters.minRank) {
    queryParams.append("minRank", JSON.stringify(filters.minRank));
  }

  if (filters.maxRank) {
    queryParams.append("maxRank", JSON.stringify(filters.maxRank));
  }

  if (filters.availabilityStatus) {
    queryParams.append("availabilityStatus", filters.availabilityStatus);
  }

  const url = `${API_URL}/api/players${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  const response = await fetch(url, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });

  if (!response.ok) {
    throw new Error("Failed to fetch players");
  }

  return response.json();
};

export const usePlayers = (filters: PlayerFilters = {}) => {
  return useQuery({
    queryKey: [QueryKeys.PLAYERS, filters],
    queryFn: () => fetchPlayers(filters),
    staleTime: 1000 * 60 * 5,
  });
};

const fetchPlayerById = async (playerId: string): Promise<Player> => {
  const token = authStorage.getToken();

  const response = await fetch(`${API_URL}/api/players/${playerId}`, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });

  if (!response.ok) {
    throw new Error("Failed to fetch player");
  }

  return response.json();
};

export const usePlayer = (playerId: string) => {
  return useQuery({
    queryKey: [QueryKeys.PLAYER, playerId],
    queryFn: () => fetchPlayerById(playerId),
    enabled: !!playerId,
    staleTime: 1000 * 60 * 5,
  });
};
