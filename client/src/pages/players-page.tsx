import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlayerFilters } from "@/components/player-filters";
import type { Player } from "@/types/entities";
import type { Lane } from "@/constants/enums";
import { useNavigate } from "react-router-dom";
import { formatRank, type RankedTier, tierToRank } from "../../../shared/types/rank";
import { usePlayers } from "@/hooks/use-players";

function PlayerCard({ player }: { player: Player }) {
  const navigate = useNavigate();

  const handlePlayerSelect = () => {
    navigate(`/profile/${player.id}`);
  };

  const displayName = player.gameName && player.tagLine
    ? `${player.gameName}#${player.tagLine}`
    : player.inGameName || "Unknown Player";

  return (
    <Card
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handlePlayerSelect}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{displayName}</CardTitle>
            {player.summonerLevel && (
              <p className="text-sm text-muted-foreground mt-1">
                Level {player.summonerLevel}
              </p>
            )}
          </div>
          {player.availabilityStatus && (
            <Badge
              variant={
                player.availabilityStatus === "Free Agent"
                  ? "default"
                  : "secondary"
              }
            >
              {player.availabilityStatus}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {player.primaryLane && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Primary Lane:</span>
              <span className="font-medium">{player.primaryLane}</span>
            </div>
          )}
          {player.secondaryLane && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Secondary Lane:</span>
              <span className="font-medium">{player.secondaryLane}</span>
            </div>
          )}
          {player.currentElo && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Current Elo:</span>
              <span className="font-bold text-primary">
                {formatRank(player.currentElo)}
              </span>
            </div>
          )}
          {player.peakElo && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Peak Elo:</span>
              <span className="font-medium">{formatRank(player.peakElo)}</span>
            </div>
          )}
          {player.championPool && player.championPool.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Champion Pool:</p>
              <div className="flex flex-wrap gap-1">
                {player.championPool.map((champion) => (
                  <Badge key={champion} variant="outline" className="text-xs">
                    {champion}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {!player.primaryLane && !player.currentElo && (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">
                Profile incomplete - Complete onboarding to show details
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function PlayersPage() {
  const [selectedLane, setSelectedLane] = useState<Lane | "all">("all");
  const [minTier, setMinTier] = useState<RankedTier | "all">("all");
  const [maxTier, setMaxTier] = useState<RankedTier | "all">("all");

  const filters = {
    lane: selectedLane !== "all" ? selectedLane : undefined,
    minRank: minTier !== "all" ? tierToRank(minTier) : undefined,
    maxRank: maxTier !== "all" ? tierToRank(maxTier) : undefined,
  };

  const { data: players = [], isLoading, error } = usePlayers(filters);

  const handleReset = () => {
    setSelectedLane("all");
    setMinTier("all");
    setMaxTier("all");
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Player Profiles</h2>
          <p className="text-muted-foreground">
            Browse and scout players for your team
          </p>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading players...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Player Profiles</h2>
          <p className="text-muted-foreground">
            Browse and scout players for your team
          </p>
        </div>
        <div className="text-center py-12">
          <p className="text-destructive">Failed to load players. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Player Profiles</h2>
        <p className="text-muted-foreground">
          Browse and scout players for your team
        </p>
      </div>

      <PlayerFilters
        selectedLane={selectedLane}
        minTier={minTier}
        maxTier={maxTier}
        onLaneChange={setSelectedLane}
        onMinTierChange={setMinTier}
        onMaxTierChange={setMaxTier}
        onReset={handleReset}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {players.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>

      {players.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No players found matching your filters
          </p>
        </div>
      )}
    </div>
  );
}
