import type {
  User,
  Organization,
  Team,
  Roster,
  ScrimSlot,
  ScrimRequest,
} from '@/types/entities';
import {
  UserRole,
  RosterStatus,
  ScrimSlotStatus,
  ScrimRequestStatus,
} from '@/constants/enums';

export const mockUsers: User[] = [
  { id: 'u1', email: 'manager1@team.com', role: UserRole.MANAGER },
  { id: 'u2', email: 'manager2@team.com', role: UserRole.MANAGER },
];

export const mockOrganizations: Organization[] = [
  {
    id: 'org1',
    name: 'Phoenix Rising',
    managerUserId: 'u1',
    contactInfo: 'discord: phoenix#1234',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'org2',
    name: 'Storm Chasers',
    managerUserId: 'u2',
    contactInfo: 'discord: storm#5678',
    createdAt: new Date('2024-02-20'),
  },
];

export const mockTeams: Team[] = [
  {
    id: 't1',
    organizationId: 'org1',
    teamName: 'Main',
    averageRank: { tier: 'DIAMANTE', division: 'I', lp: 50 },
    rosterStatus: RosterStatus.FULL,
  },
  {
    id: 't2',
    organizationId: 'org1',
    teamName: 'Academy',
    averageRank: { tier: 'PLATINA', division: 'II', lp: 75 },
    rosterStatus: RosterStatus.RECRUITING,
  },
  {
    id: 't3',
    organizationId: 'org2',
    teamName: 'Main',
    averageRank: { tier: 'DIAMANTE', division: 'III', lp: 20 },
    rosterStatus: RosterStatus.FULL,
  },
];

export const mockRosters: Roster[] = [];

export const mockScrimSlots: ScrimSlot[] = [
  {
    id: 's1',
    hostTeamId: 't1',
    dateTimeStart: new Date('2025-11-06T18:00:00'),
    durationMinutes: 120,
    status: ScrimSlotStatus.OPEN,
    minRankRequired: { tier: 'PLATINA', division: 'I', lp: 0 },
    maxRankRequired: { tier: 'MESTRE', division: null, lp: 200 },
  },
  {
    id: 's2',
    hostTeamId: 't1',
    dateTimeStart: new Date('2025-11-07T19:00:00'),
    durationMinutes: 90,
    status: ScrimSlotStatus.CONFIRMED,
    minRankRequired: { tier: 'DIAMANTE', division: 'III', lp: 0 },
    maxRankRequired: { tier: 'MESTRE', division: null, lp: 100 },
  },
  {
    id: 's3',
    hostTeamId: 't2',
    dateTimeStart: new Date('2025-11-06T20:00:00'),
    durationMinutes: 120,
    status: ScrimSlotStatus.OPEN,
    minRankRequired: { tier: 'OURO', division: 'I', lp: 0 },
    maxRankRequired: { tier: 'DIAMANTE', division: 'III', lp: 100 },
  },
  {
    id: 's4',
    hostTeamId: 't3',
    dateTimeStart: new Date('2025-11-08T18:30:00'),
    durationMinutes: 120,
    status: ScrimSlotStatus.PENDING,
    minRankRequired: { tier: 'PLATINA', division: 'I', lp: 0 },
    maxRankRequired: { tier: 'DIAMANTE', division: 'I', lp: 100 },
  },
  {
    id: 's5',
    hostTeamId: 't3',
    dateTimeStart: new Date('2025-11-05T17:00:00'),
    durationMinutes: 90,
    status: ScrimSlotStatus.COMPLETED,
    minRankRequired: { tier: 'PLATINA', division: 'II', lp: 0 },
    maxRankRequired: { tier: 'DIAMANTE', division: 'I', lp: 50 },
  },
];

export const mockScrimRequests: ScrimRequest[] = [
  {
    id: 'sr1',
    slotId: 's2',
    requestingTeamId: 't3',
    status: ScrimRequestStatus.ACCEPTED,
    requestMessage: 'Looking forward to practicing with you!',
    createdAt: new Date('2025-11-04T10:00:00'),
  },
  {
    id: 'sr2',
    slotId: 's4',
    requestingTeamId: 't2',
    status: ScrimRequestStatus.PENDING,
    requestMessage: 'Available for this slot. Let us know!',
    createdAt: new Date('2025-11-04T12:30:00'),
  },
];
