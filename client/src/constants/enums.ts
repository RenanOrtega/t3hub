export enum UserRole {
  PLAYER = 'Player',
  MANAGER = 'Manager',
}

export enum Lane {
  TOP = 'Top',
  JUNGLE = 'Jungle',
  MID = 'Mid',
  ADC = 'ADC',
  SUPPORT = 'Support',
}

export enum AvailabilityStatus {
  ACTIVE = 'Active',
  FREE_AGENT = 'Free Agent',
  INACTIVE = 'Inactive',
}

export enum RosterStatus {
  FULL = 'Full',
  RECRUITING = 'Recruiting',
}

export enum ScrimSlotStatus {
  OPEN = 'Open',
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

export enum ScrimRequestStatus {
  PENDING = 'Pending',
  ACCEPTED = 'Accepted',
  REJECTED = 'Rejected',
}
