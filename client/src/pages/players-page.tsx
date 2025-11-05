import { useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { QueryKeys } from '@/constants/query-keys';
import { fetchFilteredPlayers } from '@/mocks/mock-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlayerFilters } from '@/components/player-filters';
import type { Player } from '@/types/entities';
import type { Lane } from '@/constants/enums';

function PlayerCard({ player }: { player: Player }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{player.inGameName}</CardTitle>
          <Badge variant={player.availabilityStatus === 'Free Agent' ? 'default' : 'secondary'}>
            {player.availabilityStatus}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Primary Lane:</span>
            <span className="font-medium">{player.primaryLane}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Secondary Lane:</span>
            <span className="font-medium">{player.secondaryLane}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Current Elo:</span>
            <span className="font-bold text-primary">{player.currentElo}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Peak Elo:</span>
            <span className="font-medium">{player.peakElo}</span>
          </div>
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
        </div>
      </CardContent>
    </Card>
  );
}

export function PlayersPage() {
  const [selectedLane, setSelectedLane] = useState<Lane | 'all'>('all');
  const [minElo, setMinElo] = useState('');
  const [maxElo, setMaxElo] = useState('');

  const filters = {
    lane: selectedLane !== 'all' ? selectedLane : undefined,
    minElo: minElo ? parseInt(minElo) : undefined,
    maxElo: maxElo ? parseInt(maxElo) : undefined,
  };

  const { data: players } = useSuspenseQuery({
    queryKey: [QueryKeys.PLAYERS, filters],
    queryFn: () => fetchFilteredPlayers(filters),
  });

  const handleReset = () => {
    setSelectedLane('all');
    setMinElo('');
    setMaxElo('');
  };

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
        minElo={minElo}
        maxElo={maxElo}
        onLaneChange={setSelectedLane}
        onMinEloChange={setMinElo}
        onMaxEloChange={setMaxElo}
        onReset={handleReset}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {players.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>

      {players.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No players found matching your filters</p>
        </div>
      )}
    </div>
  );
}
