import type { ScrimSlot, Team, Organization } from "@/types/entities";
import { mockScrimSlots, mockTeams, mockOrganizations } from "./mock-data";

const MOCK_DELAY_MS = 500;

function simulateDelay<T>(data: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), MOCK_DELAY_MS);
  });
}

export async function fetchScrimSlots(): Promise<ScrimSlot[]> {
  return simulateDelay(mockScrimSlots);
}

export async function fetchTeams(): Promise<Team[]> {
  return simulateDelay(mockTeams);
}

export async function fetchTeamById(id: string): Promise<Team | undefined> {
  const team = mockTeams.find((t) => t.id === id);
  return simulateDelay(team);
}

export async function fetchOrganizations(): Promise<Organization[]> {
  return simulateDelay(mockOrganizations);
}

export async function fetchOrganizationById(
  id: string
): Promise<Organization | undefined> {
  const org = mockOrganizations.find((o) => o.id === id);
  return simulateDelay(org);
}
