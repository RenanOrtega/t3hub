import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import {
  useCreateTeam,
  useUpdateTeam,
  useTeam,
} from "@/hooks/use-teams";
import { useOrganization } from "@/hooks/use-organizations";

const ROSTER_STATUSES = ["Full", "Recruiting"] as const;

export function TeamFormPage() {
  const navigate = useNavigate();
  const { organizationId, teamId } = useParams<{
    organizationId?: string;
    teamId?: string;
  }>();
  const isEditing = teamId !== undefined && teamId !== "new";

  const [teamName, setTeamName] = useState("");
  const [rosterStatus, setRosterStatus] = useState<(typeof ROSTER_STATUSES)[number]>("Recruiting");
  const [error, setError] = useState<string | null>(null);

  const { data: organization, isLoading: isLoadingOrg } = useOrganization(
    organizationId || ""
  );

  const { data: team, isLoading: isLoadingTeam } = useTeam(
    teamId && teamId !== "new" ? teamId : ""
  );

  const createMutation = useCreateTeam();
  const updateMutation = useUpdateTeam();

  useEffect(() => {
    if (team && isEditing) {
      setTeamName(team.teamName);
      setRosterStatus(team.rosterStatus as (typeof ROSTER_STATUSES)[number]);
    }
  }, [team, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!teamName.trim()) {
      setError("Team name is required");
      return;
    }

    if (teamName.length < 3) {
      setError("Team name must be at least 3 characters");
      return;
    }

    if (!organizationId) {
      setError("Organization ID is required");
      return;
    }

    try {
      if (isEditing && teamId) {
        await updateMutation.mutateAsync({
          teamId,
          data: {
            teamName,
            rosterStatus,
          },
        });
        navigate(`/organizations/${organizationId}`);
      } else {
        await createMutation.mutateAsync({
          organizationId,
          data: {
            organizationId,
            teamName,
            rosterStatus,
          },
        });
        navigate(`/organizations/${organizationId}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  if (isLoadingOrg || (isEditing && isLoadingTeam)) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="h-8 bg-muted rounded w-1/4 animate-pulse" />
        <Card>
          <CardHeader>
            <div className="h-6 bg-muted rounded w-1/2 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-10 bg-muted rounded animate-pulse" />
              <div className="h-10 bg-muted rounded animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <p className="text-destructive">Organization not found</p>
        <Button onClick={() => navigate("/profile")} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Profile
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button
        variant="ghost"
        onClick={() => navigate(`/organizations/${organizationId}`)}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {organization.name}
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>
            {isEditing ? "Edit Team" : `Create New Team for ${organization.name}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="teamName" className="block text-sm font-medium mb-2">
                Team Name *
              </label>
              <Input
                id="teamName"
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Enter team name (e.g., Main Team, Academy)"
                required
                minLength={3}
                maxLength={255}
              />
            </div>

            <div>
              <label
                htmlFor="rosterStatus"
                className="block text-sm font-medium mb-2"
              >
                Roster Status *
              </label>
              <select
                id="rosterStatus"
                value={rosterStatus}
                onChange={(e) =>
                  setRosterStatus(e.target.value as (typeof ROSTER_STATUSES)[number])
                }
                className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                {ROSTER_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                Set to "Recruiting" if you're looking for players
              </p>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-3 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/organizations/${organizationId}`)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="flex-1"
              >
                {createMutation.isPending || updateMutation.isPending
                  ? "Saving..."
                  : isEditing
                    ? "Update Team"
                    : "Create Team"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
