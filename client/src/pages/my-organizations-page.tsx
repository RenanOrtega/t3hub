import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useMyOrganizations } from "@/hooks/use-organizations";
import { useTeams } from "@/hooks/use-teams";
import { Plus, Edit, Users } from "lucide-react";
import { formatRank } from "../../../shared/types/rank";
import type { Organization, Team } from "@/types/entities";

function TeamCard({
  team,
  organizationId,
}: {
  team: Team;
  organizationId: string;
}) {
  const navigate = useNavigate();

  return (
    <div
      className="border rounded-lg p-3 hover:bg-accent/50 transition-colors cursor-pointer"
      onClick={() => navigate(`/teams/${team.id}`)}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium">{team.teamName}</h4>
        <Badge
          variant={team.rosterStatus === "Recruiting" ? "default" : "secondary"}
          className="text-xs"
        >
          {team.rosterStatus}
        </Badge>
      </div>
      <div className="space-y-1 text-sm">
        {team.averageRank && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Avg Rank:</span>
            <span className="font-bold text-primary">
              {formatRank(team.averageRank)}
            </span>
          </div>
        )}
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="h-3 w-3" />
          <span className="text-xs">View Roster</span>
        </div>
      </div>
    </div>
  );
}

function OrganizationSection({ organization }: { organization: Organization }) {
  const navigate = useNavigate();
  const { data: teams, isLoading: isLoadingTeams } = useTeams({
    organizationId: organization.id,
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl">{organization.name}</CardTitle>
            {organization.contactInfo && (
              <p className="text-sm text-muted-foreground mt-1">
                {organization.contactInfo}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                navigate(`/my-organizations/${organization.id}/edit`)
              }
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Teams</h3>
            <Button
              size="sm"
              onClick={() =>
                navigate(`/organizations/${organization.id}/teams/new`)
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Team
            </Button>
          </div>

          {isLoadingTeams ? (
            <div className="space-y-2">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="h-20 bg-muted rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : teams && teams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {teams.map((team) => (
                <TeamCard
                  key={team.id}
                  team={team}
                  organizationId={organization.id}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border rounded-lg bg-muted/20">
              <p className="text-sm text-muted-foreground mb-3">No teams yet</p>
              <Button
                size="sm"
                onClick={() =>
                  navigate(`/organizations/${organization.id}/teams/new`)
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Team
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function MyOrganizationsPage() {
  const navigate = useNavigate();

  const { data: myOrganizations, isLoading, error } = useMyOrganizations();

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">
          Error loading organizations: {(error as Error).message}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Organizations</h1>
          <p className="text-muted-foreground mt-1">
            Manage your organizations and teams
          </p>
        </div>
        <Button onClick={() => navigate("/my-organizations/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Create Organization
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-1/3" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-1/4" />
                  <div className="h-20 bg-muted rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : myOrganizations && myOrganizations.length > 0 ? (
        <div className="space-y-6">
          {myOrganizations.map((organization) => (
            <OrganizationSection
              key={organization.id}
              organization={organization}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No organizations yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first organization to start managing teams and players
            </p>
            <Button onClick={() => navigate("/my-organizations/new")}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Organization
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
