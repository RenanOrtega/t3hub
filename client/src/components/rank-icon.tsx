import { useState } from "react";
import { cn } from "../lib/utils";
import type { Rank } from "../../../shared/types/rank";

interface RankIconProps {
  rank: Rank;
  size?: "xs" | "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const sizeClasses = {
  xs: "w-6 h-6",
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
};

const getRankImageUrl = (tier: string): string => {
  const tierLower = tier.toLowerCase().replace("í", "i");

  const tierMap: Record<string, string> = {
    "ferro": "iron",
    "bronze": "bronze",
    "prata": "silver",
    "ouro": "gold",
    "platina": "platinum",
    "esmeralda": "emerald",
    "diamante": "diamond",
    "mestre": "master",
    "grao-mestre": "grandmaster",
    "desafiante": "challenger",
  };

  const englishTier = tierMap[tierLower] || "iron";

  return `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/ranked-emblem-${englishTier}.png`;
};

export function RankIcon({ rank, size = "md", showLabel = false, className }: RankIconProps) {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted rounded-full border border-border",
          sizeClasses[size],
          className
        )}
      >
        <span className="text-xs font-bold text-muted-foreground">
          {rank.tier.charAt(0)}
        </span>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <img
        src={getRankImageUrl(rank.tier)}
        alt={`${rank.tier} ${rank.division || ""}`}
        className={cn("object-contain", sizeClasses[size])}
        onError={() => setImageError(true)}
        loading="lazy"
      />
      {showLabel && (
        <div className="flex flex-col">
          <span className="text-sm font-semibold">
            {rank.tier} {rank.division || ""}
          </span>
          <span className="text-xs text-muted-foreground">{rank.lp} LP</span>
        </div>
      )}
    </div>
  );
}
