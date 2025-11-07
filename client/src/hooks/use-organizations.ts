import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authStorage } from "../lib/auth";
import { QueryKeys } from "../constants/query-keys";
import type { Organization } from "../types/entities";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

interface OrganizationFilters {
  search?: string;
}

const fetchOrganizations = async (
  filters: OrganizationFilters = {}
): Promise<Organization[]> => {
  const token = authStorage.getToken();

  const queryParams = new URLSearchParams();

  if (filters.search) {
    queryParams.append("search", filters.search);
  }

  const url = `${API_URL}/api/organizations${
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
    throw new Error("Failed to fetch organizations");
  }

  return response.json();
};

export const useOrganizations = (filters: OrganizationFilters = {}) => {
  return useQuery({
    queryKey: [QueryKeys.ORGANIZATIONS, filters],
    queryFn: () => fetchOrganizations(filters),
    staleTime: 1000 * 60 * 5,
  });
};

const fetchMyOrganizations = async (): Promise<Organization[]> => {
  const token = authStorage.getToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await fetch(`${API_URL}/api/organizations/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch my organizations");
  }

  return response.json();
};

export const useMyOrganizations = () => {
  return useQuery({
    queryKey: [QueryKeys.ORGANIZATIONS, "my"],
    queryFn: fetchMyOrganizations,
    staleTime: 1000 * 60 * 5,
  });
};

const fetchOrganizationById = async (
  organizationId: string
): Promise<Organization> => {
  const token = authStorage.getToken();

  const response = await fetch(
    `${API_URL}/api/organizations/${organizationId}`,
    {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch organization");
  }

  return response.json();
};

export const useOrganization = (organizationId: string) => {
  return useQuery({
    queryKey: [QueryKeys.ORGANIZATION, organizationId],
    queryFn: () => fetchOrganizationById(organizationId),
    enabled: !!organizationId,
    staleTime: 1000 * 60 * 5,
  });
};

interface CreateOrganizationData {
  name: string;
  contactInfo?: string;
}

const createOrganization = async (
  data: CreateOrganizationData
): Promise<Organization> => {
  const token = authStorage.getToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await fetch(`${API_URL}/api/organizations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create organization");
  }

  return response.json();
};

export const useCreateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.ORGANIZATIONS] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.ORGANIZATIONS, "my"] });
    },
  });
};

interface UpdateOrganizationData {
  name?: string;
  contactInfo?: string;
}

const updateOrganization = async (
  organizationId: string,
  data: UpdateOrganizationData
): Promise<Organization> => {
  const token = authStorage.getToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await fetch(
    `${API_URL}/api/organizations/${organizationId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update organization");
  }

  return response.json();
};

export const useUpdateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      data,
    }: {
      organizationId: string;
      data: UpdateOrganizationData;
    }) => updateOrganization(organizationId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.ORGANIZATIONS] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.ORGANIZATIONS, "my"] });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.ORGANIZATION, variables.organizationId],
      });
    },
  });
};

const deleteOrganization = async (organizationId: string): Promise<void> => {
  const token = authStorage.getToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await fetch(
    `${API_URL}/api/organizations/${organizationId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete organization");
  }
};

export const useDeleteOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.ORGANIZATIONS] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.ORGANIZATIONS, "my"] });
    },
  });
};
