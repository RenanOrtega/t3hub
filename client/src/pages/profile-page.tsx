import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Trophy, Target, Star } from "lucide-react";
import { getTierColor, formatRank } from "../../../shared/types/rank";
import { usePlayer } from "@/hooks/use-players";

export function ProfilePage() {
  const { playerId } = useParams<{ playerId: string }>();

  const { data: player, isLoading, error } = usePlayer(playerId as string);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading player profile...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <h1 className="text-2xl font-bold mb-2">Player not found</h1>
              <p className="text-muted-foreground">
                The player you're looking for doesn't exist.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const displayName = player.gameName && player.tagLine
    ? `${player.gameName}#${player.tagLine}`
    : player.inGameName || "Unknown Player";

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="shrink-0">
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-12 w-12 text-primary" />
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold">{displayName}</h1>
                  {player.summonerLevel && (
                    <p className="text-muted-foreground">
                      Level {player.summonerLevel} • {player.region || "BR1"}
                    </p>
                  )}
                  {player.verifiedAt && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Verified{" "}
                      {new Date(player.verifiedAt).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  {player.availabilityStatus && (
                    <Badge
                      variant={
                        player.availabilityStatus === "Free Agent"
                          ? "default"
                          : "secondary"
                      }
                      className="h-fit"
                    >
                      {player.availabilityStatus}
                    </Badge>
                  )}
                  {player.verifiedAt && (
                    <Badge variant="outline" className="h-fit">
                      ✓ Verified
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Current Rank
            </CardTitle>
          </CardHeader>
          <CardContent>
            {player.currentElo ? (
              <div
                className={`text-2xl font-bold ${getTierColor(
                  player.currentElo.tier
                )}`}
              >
                {formatRank(player.currentElo)}
              </div>
            ) : (
              <div className="text-2xl font-bold text-muted-foreground">
                Unranked
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Star className="h-4 w-4" />
              Peak Rank
            </CardTitle>
          </CardHeader>
          <CardContent>
            {player.peakElo ? (
              <div
                className={`text-2xl font-bold ${getTierColor(
                  player.peakElo.tier
                )}`}
              >
                {formatRank(player.peakElo)}
              </div>
            ) : (
              <div className="text-2xl font-bold text-muted-foreground">
                Unranked
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4" />
              Matches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">10</div>
            <p className="text-xs text-muted-foreground mt-1">50% win rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Win Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-500">50%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((100 * 50) / 100)} wins
            </p>
          </CardContent>
        </Card>
      </div>

      {(player.primaryLane || player.secondaryLane || player.championPool) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Lanes Card */}
          {(player.primaryLane || player.secondaryLane) && (
            <Card>
              <CardHeader>
                <CardTitle>Lanes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {player.primaryLane && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Primary Lane
                      </span>
                      <Badge variant="default" className="text-sm">
                        {player.primaryLane}
                      </Badge>
                    </div>
                  )}
                  {player.secondaryLane && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Secondary Lane
                      </span>
                      <Badge variant="secondary" className="text-sm">
                        {player.secondaryLane}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Champion Pool Card */}
          <Card>
            <CardHeader>
              <CardTitle>Champion Pool</CardTitle>
            </CardHeader>
            <CardContent>
              {player.championPool && player.championPool.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {player.championPool.map((champion) => (
                    <Badge key={champion} variant="outline" className="text-sm">
                      {champion}
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No champions added yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {!player.verifiedAt && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <h3 className="text-lg font-semibold mb-2">Profile Incomplete</h3>
              <p className="text-muted-foreground">
                This player has not completed the onboarding process yet.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Matches - Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Matches</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Match history coming soon
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
