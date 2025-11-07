import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export function PlayerQuickSearch() {
  const [nick, setNick] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (nick.trim()) {
      navigate(`/players?search=${encodeURIComponent(nick)}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Card className="border-2">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl flex items-center justify-center gap-2">
          <Search className="w-6 h-6" />
          Buscar Jogador
        </CardTitle>
        <CardDescription>Encontre jogadores pelo nick da Riot</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Nome do jogador + #BR1"
            value={nick}
            onChange={(e) => setNick(e.target.value)}
            onKeyDown={handleKeyPress}
            className="text-lg h-12"
          />
          <Button onClick={handleSearch} size="lg" disabled={!nick.trim()}>
            <Search className="w-4 h-4 mr-2" />
            Buscar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
