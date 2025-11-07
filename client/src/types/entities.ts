import type {
  UserRole,
  Lane,
  AvailabilityStatus,
  RosterStatus,
  ScrimSlotStatus,
  ScrimRequestStatus,
} from "@/constants/enums";
import type { Rank } from "../../../shared/types/rank";

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
  averageRank?: Rank;
  rosterStatus: RosterStatus;
};

export type Player = {
  id: string;
  userId: string;
  puuid?: string;
  summonerId?: string;
  gameName?: string;
  tagLine?: string;
  region: string;
  profileIconId?: number;
  summonerLevel?: number;
  verifiedAt?: Date | string;
  inGameName?: string;
  primaryLane?: Lane;
  secondaryLane?: Lane;
  currentElo?: Rank;
  peakElo?: Rank;
  championPool?: string[];
  availabilityStatus?: AvailabilityStatus;
  discordTag?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
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
  minRankRequired: Rank;
  maxRankRequired: Rank;
};

export type ScrimRequest = {
  id: string;
  slotId: string;
  requestingTeamId: string;
  status: ScrimRequestStatus;
  requestMessage?: string;
  createdAt: Date;
};
