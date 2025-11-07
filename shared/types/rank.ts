export const RANKED_TIERS = [
  "FERRO",
  "BRONZE",
  "PRATA",
  "OURO",
  "PLATINA",
  "ESMERALDA",
  "DIAMANTE",
  "MESTRE",
  "GRÃ­O-MESTRE",
  "DESAFIANTE",
] as const;

export type RankedTier = (typeof RANKED_TIERS)[number];

export const DIVISIONS = ["IV", "III", "II", "I"] as const;

export type Division = (typeof DIVISIONS)[number];

export const TIERS_WITH_DIVISIONS: readonly RankedTier[] = [
  "FERRO",
  "BRONZE",
  "PRATA",
  "OURO",
  "PLATINA",
  "ESMERALDA",
  "DIAMANTE",
] as const;

export const TIERS_WITHOUT_DIVISIONS: readonly RankedTier[] = [
  "MESTRE",
  "GRÃ­O-MESTRE",
  "DESAFIANTE",
] as const;

export type Rank = {
  tier: RankedTier;
  division: Division | null;
  lp: number;
};

export const hasDivisions = (tier: RankedTier): boolean => {
  return TIERS_WITH_DIVISIONS.includes(tier);
};

export const isValidRank = (rank: Rank): boolean => {
  const { tier, division, lp } = rank;

  if (hasDivisions(tier)) {
    if (division === null) return false;
    if (lp < 0 || lp > 100) return false;
  } else {
    if (division !== null) return false;
    if (lp < 0) return false;
  }

  return true;
};

export const formatRank = (rank: Rank): string => {
  if (hasDivisions(rank.tier)) {
    return `${rank.tier} ${rank.division} - ${rank.lp} PDL`;
  }
  return `${rank.tier} - ${rank.lp} PDL`;
};

export const formatRankShort = (rank: Rank): string => {
  if (hasDivisions(rank.tier)) {
    return `${rank.tier} ${rank.division}`;
  }
  return rank.tier;
};

export const getTierColor = (tier: RankedTier): string => {
  const colorMap: Record<RankedTier, string> = {
    FERRO: "text-gray-600",
    BRONZE: "text-amber-700",
    PRATA: "text-gray-400",
    OURO: "text-yellow-500",
    PLATINA: "text-cyan-500",
    ESMERALDA: "text-emerald-500",
    DIAMANTE: "text-blue-500",
    MESTRE: "text-purple-500",
    "GRÃ­O-MESTRE": "text-red-500",
    DESAFIANTE: "text-amber-400",
  };
  return colorMap[tier];
};

export const getTierValue = (tier: RankedTier): number => {
  return RANKED_TIERS.indexOf(tier);
};

export const getDivisionValue = (division: Division): number => {
  return DIVISIONS.indexOf(division);
};

export const compareRanks = (a: Rank, b: Rank): number => {
  const tierDiff = getTierValue(a.tier) - getTierValue(b.tier);
  if (tierDiff !== 0) return tierDiff;

  if (hasDivisions(a.tier) && a.division && b.division) {
    const divisionDiff =
      getDivisionValue(b.division) - getDivisionValue(a.division);
    if (divisionDiff !== 0) return divisionDiff;
  }

  return a.lp - b.lp;
};

export const rankToNumericValue = (rank: Rank): number => {
  const tierValue = getTierValue(rank.tier);

  if (hasDivisions(rank.tier) && rank.division) {
    const divisionValue =
      DIVISIONS.length - 1 - getDivisionValue(rank.division);
    return tierValue * 400 + divisionValue * 100 + rank.lp;
  }

  return tierValue * 400 + rank.lp;
};

export const numericValueToRank = (value: number): Rank => {
  if (value < 0) {
    return { tier: "FERRO", division: "IV", lp: 0 };
  }

  const tierIndex = Math.floor(value / 400);

  if (tierIndex >= RANKED_TIERS.length) {
    return { tier: "DESAFIANTE", division: null, lp: value - 9 * 400 };
  }

  const tier = RANKED_TIERS[tierIndex];
  const remainder = value % 400;

  if (hasDivisions(tier)) {
    const divisionIndex = Math.floor(remainder / 100);
    const lp = remainder % 100;
    const division =
      DIVISIONS[DIVISIONS.length - 1 - Math.min(divisionIndex, 3)];
    return { tier, division, lp };
  }

  return { tier, division: null, lp: remainder };
};

export const tierToRank = (tier: RankedTier): Rank => {
  if (hasDivisions(tier)) {
    return { tier, division: "IV", lp: 0 };
  }
  return { tier, division: null, lp: 0 };
};
