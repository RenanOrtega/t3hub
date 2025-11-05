import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function HomePage() {
  return (
    <div className="space-y-12">
      <section className="text-center space-y-4 py-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Welcome to T3 Hub
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          The professional platform for League of Legends Tier 3 players and
          organizations to connect, scout, and schedule scrims.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Player Scouting</CardTitle>
            <CardDescription>
              Build your digital esports resume and get discovered by teams
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground mb-4">
              <li>• Showcase your rank, lanes, and champion pool</li>
              <li>• Filter players by lane and elo range</li>
              <li>• Professional player profiles</li>
            </ul>
            <Link to="/players">
              <Button className="w-full">Browse Players</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Scrim Scheduling</CardTitle>
            <CardDescription>
              Replace manual Discord scheduling with our centralized system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground mb-4">
              <li>• Post available scrim slots</li>
              <li>• Filter teams by elo range</li>
              <li>• Track scrim history and reliability</li>
            </ul>
            <Link to="/scrims">
              <Button className="w-full">View Scrim Board</Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
