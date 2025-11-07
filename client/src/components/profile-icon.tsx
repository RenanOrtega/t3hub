import { useEffect, useState } from "react";
import { getLatestDataDragonVersion, getProfileIconUrl } from "../lib/data-dragon";
import { cn } from "../lib/utils";

interface ProfileIconProps {
  iconId: number;
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
  xl: "w-24 h-24",
};

export function ProfileIcon({ iconId, alt, size = "md", className }: ProfileIconProps) {
  const [version, setVersion] = useState<string | undefined>(undefined);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    getLatestDataDragonVersion().then(setVersion);
  }, []);

  if (imageError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted rounded-lg border border-border",
          sizeClasses[size],
          className
        )}
      >
        <span className="text-xs text-muted-foreground">?</span>
      </div>
    );
  }

  return (
    <img
      src={getProfileIconUrl(iconId, version)}
      alt={alt || `Profile icon ${iconId}`}
      className={cn(
        "rounded-lg border-2 border-border object-cover",
        sizeClasses[size],
        className
      )}
      onError={() => setImageError(true)}
      loading="lazy"
    />
  );
}
