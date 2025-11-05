import type { Player, ScrimSlot, Team, Organization } from '@/types/entities';
import type { Lane } from '@/constants/enums';
import {
  mockPlayers,
  mockScrimSlots,
  mockTeams,
  mockOrganizations,
} from './mock-data';

const MOCK_DELAY_MS = 500;

function simulateDelay<T>(data: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), MOCK_DELAY_MS);
  });
}

export async function fetchPlayers(): Promise<Player[]> {
  return simulateDelay(mockPlayers);
}

export async function fetchPlayerById(id: string): Promise<Player | undefined> {
  const player = mockPlayers.find((p) => p.id === id);
  return simulateDelay(player);
}

type PlayerFilters = {
  lane?: Lane;
  minElo?: number;
  maxElo?: number;
};

export async function fetchFilteredPlayers(
  filters: PlayerFilters
): Promise<Player[]> {
  let filtered = [...mockPlayers];

  if (filters.lane) {
    filtered = filtered.filter(
      (p) => p.primaryLane === filters.lane || p.secondaryLane === filters.lane
    );
  }

  if (filters.minElo !== undefined) {
    filtered = filtered.filter((p) => p.currentElo >= filters.minElo);
  }

  if (filters.maxElo !== undefined) {
    filtered = filtered.filter((p) => p.currentElo <= filters.maxElo);
  }

  return simulateDelay(filtered);
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
