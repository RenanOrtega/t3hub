import type {
  UserRole,
  Lane,
  AvailabilityStatus,
  RosterStatus,
  ScrimSlotStatus,
  ScrimRequestStatus,
} from '@/constants/enums';

export type User = {
  id: string;
  email: string;
  role: UserRole;
};

export type Organization = {
  id: string;
  name: string;
  managerUserId: string;
  contactInfo?: string;
  createdAt: Date;
};

export type Team = {
  id: string;
  organizationId: string;
  teamName: string;
  eloAverage: number;
  rosterStatus: RosterStatus;
};

export type Player = {
  id: string;
  userId: string;
  inGameName: string;
  primaryLane: Lane;
  secondaryLane: Lane;
  currentElo: number;
  peakElo: number;
  championPool: string[];
  availabilityStatus: AvailabilityStatus;
};

export type Roster = {
  id: string;
  playerId: string;
  teamId: string;
  joinDate: Date;
};

export type ScrimSlot = {
  id: string;
  hostTeamId: string;
  dateTimeStart: Date;
  durationMinutes: number;
  status: ScrimSlotStatus;
  minEloRequired: number;
  maxEloRequired: number;
};

export type ScrimRequest = {
  id: string;
  slotId: string;
  requestingTeamId: string;
  status: ScrimRequestStatus;
  requestMessage?: string;
  createdAt: Date;
};
