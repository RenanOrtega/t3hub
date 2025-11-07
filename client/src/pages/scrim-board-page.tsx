import { useSuspenseQuery } from '@tanstack/react-query';
import { QueryKeys } from '@/constants/query-keys';
import { fetchScrimSlots, fetchTeams, fetchOrganizations } from '@/mocks/mock-api';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ScrimSlot } from '@/types/entities';
import { ScrimSlotStatus } from '@/constants/enums';
import { formatRankShort, getTierColor } from '../../../shared/types/rank';

const STATUS_VARIANT_MAP: Record<ScrimSlotStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  [ScrimSlotStatus.OPEN]: 'default',
  [ScrimSlotStatus.PENDING]: 'secondary',
  [ScrimSlotStatus.CONFIRMED]: 'outline',
  [ScrimSlotStatus.COMPLETED]: 'outline',
  [ScrimSlotStatus.CANCELLED]: 'destructive',
};

function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function ScrimSlotCard({ slot }: { slot: ScrimSlot }) {
  const { data: teams } = useSuspenseQuery({
    queryKey: [QueryKeys.TEAMS],
    queryFn: fetchTeams,
  });

  const { data: organizations } = useSuspenseQuery({
    queryKey: [QueryKeys.ORGANIZATIONS],
    queryFn: fetchOrganizations,
  });

  const hostTeam = teams.find((t) => t.id === slot.hostTeamId);
  const hostOrg = organizations.find((o) => o.id === hostTeam?.organizationId);

  const canRequest = slot.status === ScrimSlotStatus.OPEN;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">
              {hostOrg?.name} - {hostTeam?.teamName}
            </CardTitle>
            {hostTeam?.averageRank && (
              <p className={`text-sm mt-1 ${getTierColor(hostTeam.averageRank.tier)}`}>
                Team Rank: {formatRankShort(hostTeam.averageRank)}
              </p>
            )}
          </div>
          <Badge variant={STATUS_VARIANT_MAP[slot.status]}>
            {slot.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Date:</span>
          <span className="font-medium">{formatDateTime(slot.dateTimeStart)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Duration:</span>
          <span className="font-medium">{slot.durationMinutes} minutes</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Rank Range:</span>
          <span className="font-medium">
            <span className={getTierColor(slot.minRankRequired.tier)}>
              {formatRankShort(slot.minRankRequired)}
            </span>
            {' - '}
            <span className={getTierColor(slot.maxRankRequired.tier)}>
              {formatRankShort(slot.maxRankRequired)}
            </span>
          </span>
        </div>
      </CardContent>
      {canRequest && (
        <CardFooter>
          <Button className="w-full">Request Scrim</Button>
        </CardFooter>
      )}
    </Card>
  );
}

export function ScrimBoardPage() {
  const { data: scrimSlots } = useSuspenseQuery({
    queryKey: [QueryKeys.SCRIM_SLOTS],
    queryFn: fetchScrimSlots,
  });

  const upcomingSlots = scrimSlots.filter(
    (slot) => slot.status !== ScrimSlotStatus.COMPLETED && slot.status !== ScrimSlotStatus.CANCELLED
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Scrim Board</h2>
          <p className="text-muted-foreground">
            Find and schedule scrims with other teams
          </p>
        </div>
        <Button>Post New Slot</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {upcomingSlots.map((slot) => (
          <ScrimSlotCard key={slot.id} slot={slot} />
        ))}
      </div>

      {upcomingSlots.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No upcoming scrim slots available</p>
        </div>
      )}
    </div>
  );
}
