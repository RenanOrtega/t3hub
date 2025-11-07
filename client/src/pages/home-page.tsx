import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, Calendar } from "lucide-react";
import { PlayerQuickSearch } from "@/components/player-quick-search";

export function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Welcome to T3 Hub
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A plataforma profissional para jogadores e organizações Tier 3 de
          League of Legends se conectarem, scouting e agendamento de scrims.
        </p>
      </section>

      {/* Search Section */}
      <section className="max-w-2xl mx-auto">
        <PlayerQuickSearch />
      </section>

      {/* Features Section */}
      <section className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Funcionalidades</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Player Scouting</CardTitle>
              </div>
              <CardDescription className="text-base">
                Construa seu currículo digital de esports e seja descoberto por
                times
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Mostre seu rank, lanes e champion pool</li>
                <li>• Filtre jogadores por lane e elo</li>
                <li>• Perfis profissionais de jogadores</li>
                <li>• Histórico de partidas e estatísticas</li>
              </ul>
              <Link to="/players" className="block">
                <Button className="w-full" size="lg">
                  Explorar Jogadores
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Scrim Scheduling</CardTitle>
              </div>
              <CardDescription className="text-base">
                Substitua o agendamento manual no Discord pelo nosso sistema
                centralizado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Poste horários disponíveis para scrims</li>
                <li>• Filtre times por faixa de elo</li>
                <li>• Acompanhe histórico e confiabilidade</li>
                <li>• Sistema de confirmação automático</li>
              </ul>
              <Link to="/scrims" className="block">
                <Button className="w-full" size="lg">
                  Ver Quadro de Scrims
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-3xl mx-auto text-center space-y-4 py-8">
        <h2 className="text-2xl font-bold">Sobre o T3 Hub</h2>
        <p className="text-muted-foreground leading-relaxed">
          O T3 Hub foi criado para resolver os principais desafios do cenário
          competitivo Tier 3 de League of Legends. Nossa plataforma centraliza o
          processo de scouting de jogadores e o agendamento de scrims,
          eliminando a necessidade de gerenciar múltiplos servidores do Discord
          e planilhas desorganizadas. Conectamos jogadores talentosos com
          organizações e facilitamos a criação de uma comunidade competitiva
          mais estruturada e profissional.
        </p>
      </section>
    </div>
  );
}
