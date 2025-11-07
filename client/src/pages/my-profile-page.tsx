import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useMyOrganizations } from "@/hooks/use-organizations";
import { useAuth } from "@/hooks/use-auth";
import { Plus, Building2, ChevronRight, Users } from "lucide-react";
import type { Organization } from "@/types/entities";

function OrganizationCard({ organization }: { organization: Organization }) {
  const navigate = useNavigate();

  return (
    <Card
      className="min-w-[280px] hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary/50"
      onClick={() => navigate(`/organizations/${organization.id}`)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base truncate">
              {organization.name}
            </CardTitle>
            {organization.contactInfo && (
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {organization.contactInfo}
              </p>
            )}
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Users className="h-3 w-3" />
          <span>View teams & roster</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function MyProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: myOrganizations, isLoading, error } = useMyOrganizations();

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Please log in to view your profile</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.displayName ?? user.email}
                  className="h-16 w-16 rounded-full border-2 border-border"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-border">
                  <Users className="h-8 w-8 text-primary" />
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold">
                  {user.displayName ?? user.email}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {user.email}
                </p>
                <Badge variant="secondary" className="mt-2">
                  {user.role}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* My Organizations Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-xl font-bold">My Organizations</h2>
              <p className="text-sm text-muted-foreground">
                Manage your teams and players
              </p>
            </div>
          </div>
          <Button onClick={() => navigate("/my-organizations/new")} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Organization
          </Button>
        </div>

        {error ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-destructive">
                Error loading organizations: {(error as Error).message}
              </p>
            </CardContent>
          </Card>
        ) : isLoading ? (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="min-w-[280px] animate-pulse">
                <CardHeader>
                  <div className="h-5 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-muted rounded w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : myOrganizations && myOrganizations.length > 0 ? (
          <div className="relative">
            <div className="flex gap-4 overflow-x-auto pb-4 scroll-smooth">
              {myOrganizations.map((organization) => (
                <OrganizationCard
                  key={organization.id}
                  organization={organization}
                />
              ))}
            </div>
            {myOrganizations.length > 3 && (
              <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none" />
            )}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No organizations yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Create your first organization to start managing teams and
                players
              </p>
              <Button onClick={() => navigate("/my-organizations/new")}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Organization
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Future sections can go here */}
      {/* <div className="space-y-4">
        <h2 className="text-xl font-bold">Match History</h2>
        ...
      </div> */}
    </div>
  );
}
