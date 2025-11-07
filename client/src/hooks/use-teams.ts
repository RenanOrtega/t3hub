import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authStorage } from "../lib/auth";
import { QueryKeys } from "../constants/query-keys";
import type { Team } from "../types/entities";
import type { Rank } from "../../../shared/types/rank";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

interface TeamFilters {
  organizationId?: string;
  rosterStatus?: string;
}

const fetchTeams = async (filters: TeamFilters = {}): Promise<Team[]> => {
  const token = authStorage.getToken();

  const queryParams = new URLSearchParams();

  if (filters.organizationId) {
    queryParams.append("organizationId", filters.organizationId);
  }

  if (filters.rosterStatus) {
    queryParams.append("rosterStatus", filters.rosterStatus);
  }

  const url = `${API_URL}/api/teams${
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
    throw new Error("Failed to fetch teams");
  }

  return response.json();
};

export const useTeams = (filters: TeamFilters = {}) => {
  return useQuery({
    queryKey: [QueryKeys.TEAMS, filters],
    queryFn: () => fetchTeams(filters),
    staleTime: 1000 * 60 * 5,
  });
};

const fetchTeamById = async (teamId: string): Promise<Team> => {
  const token = authStorage.getToken();

  const response = await fetch(`${API_URL}/api/teams/${teamId}`, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });

  if (!response.ok) {
    throw new Error("Failed to fetch team");
  }

  return response.json();
};

export const useTeam = (teamId: string) => {
  return useQuery({
    queryKey: [QueryKeys.TEAM, teamId],
    queryFn: () => fetchTeamById(teamId),
    enabled: !!teamId,
    staleTime: 1000 * 60 * 5,
  });
};

interface CreateTeamData {
  organizationId: string;
  teamName: string;
  rosterStatus: string;
  averageRank?: Rank;
}

const createTeam = async (
  organizationId: string,
  data: CreateTeamData
): Promise<Team> => {
  const token = authStorage.getToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await fetch(
    `${API_URL}/api/organizations/${organizationId}/teams`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create team");
  }

  return response.json();
};

export const useCreateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      data,
    }: {
      organizationId: string;
      data: CreateTeamData;
    }) => createTeam(organizationId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.TEAMS] });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.TEAMS, { organizationId: variables.organizationId }],
      });
    },
  });
};

interface UpdateTeamData {
  teamName?: string;
  rosterStatus?: string;
  averageRank?: Rank;
}

const updateTeam = async (
  teamId: string,
  data: UpdateTeamData
): Promise<Team> => {
  const token = authStorage.getToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await fetch(`${API_URL}/api/teams/${teamId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update team");
  }

  return response.json();
};

export const useUpdateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, data }: { teamId: string; data: UpdateTeamData }) =>
      updateTeam(teamId, data),
    onSuccess: (updatedTeam) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.TEAMS] });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.TEAM, updatedTeam.id],
      });
    },
  });
};

const deleteTeam = async (teamId: string): Promise<void> => {
  const token = authStorage.getToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await fetch(`${API_URL}/api/teams/${teamId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete team");
  }
};

export const useDeleteTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.TEAMS] });
    },
  });
};
