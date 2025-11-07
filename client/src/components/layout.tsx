import { Link, useLocation } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "../hooks/use-auth";

const NAV_ITEMS = [
  { href: "/players", label: "Players" },
  { href: "/scrims", label: "Scrim Board" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold">
              T3 Hub
            </Link>
            <div className="flex items-center gap-6">
              <nav className="flex gap-6">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary",
                      location.pathname === item.href
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              {isAuthenticated && user ? (
                <div className="flex items-center gap-4 border-l pl-6">
                  <div className="flex items-center gap-2">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.displayName ?? user.email}
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <span className="text-sm font-medium">
                      {user.displayName ?? user.email}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={logout}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
