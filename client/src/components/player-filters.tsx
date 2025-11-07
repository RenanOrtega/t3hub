import { Lane } from '@/constants/enums';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RANKED_TIERS, type RankedTier } from '../../../shared/types/rank';

type PlayerFiltersProps = {
  selectedLane: Lane | 'all';
  minTier: RankedTier | 'all';
  maxTier: RankedTier | 'all';
  onLaneChange: (lane: Lane | 'all') => void;
  onMinTierChange: (tier: RankedTier | 'all') => void;
  onMaxTierChange: (tier: RankedTier | 'all') => void;
  onReset: () => void;
};

const LANES = Object.values(Lane);

export function PlayerFilters({
  selectedLane,
  minTier,
  maxTier,
  onLaneChange,
  onMinTierChange,
  onMaxTierChange,
  onReset,
}: PlayerFiltersProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Lane</label>
            <Select value={selectedLane} onValueChange={onLaneChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Lanes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Lanes</SelectItem>
                {LANES.map((lane) => (
                  <SelectItem key={lane} value={lane}>
                    {lane}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Min Rank</label>
            <Select value={minTier} onValueChange={onMinTierChange}>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any</SelectItem>
                {RANKED_TIERS.map((tier) => (
                  <SelectItem key={tier} value={tier}>
                    {tier}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Max Rank</label>
            <Select value={maxTier} onValueChange={onMaxTierChange}>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any</SelectItem>
                {RANKED_TIERS.map((tier) => (
                  <SelectItem key={tier} value={tier}>
                    {tier}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button variant="outline" onClick={onReset} className="w-full">
              Reset Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
