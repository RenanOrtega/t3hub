import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useOrganization } from "@/hooks/use-organizations";
import { useTeams } from "@/hooks/use-teams";
import { useAuth } from "@/hooks/use-auth";
import { ArrowLeft, Edit, Plus, Users } from "lucide-react";
import { formatRank } from "../../../shared/types/rank";

export function OrganizationDetailPage() {
  const { organizationId } = useParams<{ organizationId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    data: organization,
    isLoading: isLoadingOrg,
    error: orgError,
  } = useOrganization(organizationId!);

  const {
    data: teams,
    isLoading: isLoadingTeams,
    error: teamsError,
  } = useTeams({ organizationId });

  const isManager = user?.id === organization?.managerUserId;

  if (orgError || teamsError) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">
          Error loading organization:{" "}
          {((orgError || teamsError) as Error).message}
        </p>
        <Button onClick={() => navigate("/organizations")} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Organizations
        </Button>
      </div>
    );
  }

  if (isLoadingOrg) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded w-1/4 animate-pulse" />
        <Card>
          <CardHeader>
            <div className="h-6 bg-muted rounded w-1/2 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Organization not found</p>
        <Button onClick={() => navigate("/organizations")} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Organizations
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate("/organizations")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        {isManager && (
          <Button
            variant="outline"
            onClick={() => navigate(`/my-organizations/${organizationId}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Organization
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{organization.name}</CardTitle>
              {organization.contactInfo && (
                <p className="text-muted-foreground mt-2">
                  {organization.contactInfo}
                </p>
              )}
            </div>
            <Badge variant="secondary">Organization</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Created on {new Date(organization.createdAt).toLocaleDateString()}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Teams</h2>
        {isManager && (
          <Button
            onClick={() =>
              navigate(`/organizations/${organizationId}/teams/new`)
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Team
          </Button>
        )}
      </div>

      {isLoadingTeams ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-1/2" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : teams && teams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => (
            <Card
              key={team.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/teams/${team.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{team.teamName}</CardTitle>
                  <Badge
                    variant={
                      team.rosterStatus === "Recruiting"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {team.rosterStatus}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {team.averageRank && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Average Rank:
                      </span>
                      <span className="font-bold text-primary">
                        {formatRank(team.averageRank)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>View Roster</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">No teams yet</p>
            {isManager && (
              <Button
                onClick={() =>
                  navigate(`/organizations/${organizationId}/teams/new`)
                }
                className="mt-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create your first team
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
