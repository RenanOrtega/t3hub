import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import {
  useCreateOrganization,
  useUpdateOrganization,
  useOrganization,
} from "@/hooks/use-organizations";

export function OrganizationFormPage() {
  const navigate = useNavigate();
  const { organizationId } = useParams<{ organizationId?: string }>();
  const isEditing = organizationId !== undefined && organizationId !== "new";

  const [name, setName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { data: organization, isLoading: isLoadingOrg } = useOrganization(
    organizationId && organizationId !== "new" ? organizationId : ""
  );

  const createMutation = useCreateOrganization();
  const updateMutation = useUpdateOrganization();

  useEffect(() => {
    if (organization && isEditing) {
      setName(organization.name);
      setContactInfo(organization.contactInfo || "");
    }
  }, [organization, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Organization name is required");
      return;
    }

    if (name.length < 3) {
      setError("Organization name must be at least 3 characters");
      return;
    }

    try {
      if (isEditing && organizationId) {
        await updateMutation.mutateAsync({
          organizationId,
          data: {
            name,
            contactInfo: contactInfo || undefined,
          },
        });
        navigate(`/profile`);
      } else {
        await createMutation.mutateAsync({
          name,
          contactInfo: contactInfo || undefined,
        });
        navigate(`/profile`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  if (isEditing && isLoadingOrg) {
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

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button
        variant="ghost"
        onClick={() => navigate("/profile")}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Profile
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>
            {isEditing ? "Edit Organization" : "Create New Organization"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Organization Name *
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter organization name"
                required
                minLength={3}
                maxLength={255}
              />
            </div>

            <div>
              <label
                htmlFor="contactInfo"
                className="block text-sm font-medium mb-2"
              >
                Contact Information
              </label>
              <Input
                id="contactInfo"
                type="text"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="Email, Discord, or website"
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Optional: How people can reach your organization
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
                onClick={() => navigate("/profile")}
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
                  ? "Update Organization"
                  : "Create Organization"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
