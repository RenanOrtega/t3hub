import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useOrganizations } from "@/hooks/use-organizations";
import { Search } from "lucide-react";
import type { Organization } from "@/types/entities";

function OrganizationCard({ organization }: { organization: Organization }) {
  const navigate = useNavigate();

  const handleOrganizationClick = () => {
    navigate(`/organizations/${organization.id}`);
  };

  return (
    <Card
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleOrganizationClick}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{organization.name}</CardTitle>
            {organization.contactInfo && (
              <p className="text-sm text-muted-foreground mt-1">
                {organization.contactInfo}
              </p>
            )}
          </div>
          <Badge variant="secondary">Organization</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">
          Created {new Date(organization.createdAt).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
}

export function OrganizationsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const {
    data: organizations,
    isLoading,
    error,
  } = useOrganizations({
    search: debouncedSearch,
  });

  const handleSearchChange = (value: string) => {
    setSearch(value);
    const timer = setTimeout(() => {
      setDebouncedSearch(value);
    }, 300);
    return () => clearTimeout(timer);
  };

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
      <div>
        <h1 className="text-3xl font-bold">Browse Organizations</h1>
        <p className="text-muted-foreground mt-1">
          Discover esports organizations and teams
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search organizations..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-muted rounded w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : organizations && organizations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {organizations.map((organization) => (
            <OrganizationCard
              key={organization.id}
              organization={organization}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No organizations found</p>
        </div>
      )}
    </div>
  );
}
