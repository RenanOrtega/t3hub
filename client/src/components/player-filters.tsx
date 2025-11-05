import { Lane } from '@/constants/enums';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type PlayerFiltersProps = {
  selectedLane: Lane | 'all';
  minElo: string;
  maxElo: string;
  onLaneChange: (lane: Lane | 'all') => void;
  onMinEloChange: (elo: string) => void;
  onMaxEloChange: (elo: string) => void;
  onReset: () => void;
};

const LANES = Object.values(Lane);

export function PlayerFilters({
  selectedLane,
  minElo,
  maxElo,
  onLaneChange,
  onMinEloChange,
  onMaxEloChange,
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
            <label className="text-sm font-medium">Min Elo</label>
            <Input
              type="number"
              placeholder="1800"
              value={minElo}
              onChange={(e) => onMinEloChange(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Max Elo</label>
            <Input
              type="number"
              placeholder="2800"
              value={maxElo}
              onChange={(e) => onMaxEloChange(e.target.value)}
            />
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
