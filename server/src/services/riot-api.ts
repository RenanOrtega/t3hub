const RIOT_API_KEY = process.env.RIOT_API_KEY;
const REGION = "BR1";
const AMERICAS_ROUTING = "americas";

interface RiotAccountData {
  puuid: string;
  gameName: string;
  tagLine: string;
}

interface RiotSummonerData {
  id: string;
  accountId: string;
  puuid: string;
  profileIconId: number;
  summonerLevel: number;
  revisionDate: number;
}

interface RiotLeagueEntry {
  queueType: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
}

export class RiotApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = "RiotApiError";
  }
}

async function fetchRiotApi<T>(url: string): Promise<T> {
  if (!RIOT_API_KEY) {
    throw new RiotApiError("RIOT_API_KEY não configurada no servidor");
  }

  const response = await fetch(url, {
    headers: {
      "X-Riot-Token": RIOT_API_KEY,
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new RiotApiError("Conta não encontrada", 404);
    }
    if (response.status === 403) {
      throw new RiotApiError("API Key inválida", 403);
    }
    if (response.status === 429) {
      throw new RiotApiError("Limite de requisições excedido", 429);
    }
    throw new RiotApiError(
      `Erro na API da Riot: ${response.status}`,
      response.status
    );
  }

  return response.json() as Promise<T>;
}

export async function getAccountByRiotId(
  gameName: string,
  tagLine: string
): Promise<RiotAccountData> {
  const url = `https://${AMERICAS_ROUTING}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(
    gameName
  )}/${encodeURIComponent(tagLine)}`;
  return fetchRiotApi<RiotAccountData>(url);
}

export async function getSummonerByPuuid(
  puuid: string
): Promise<RiotSummonerData> {
  const url = `https://${REGION}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`;
  return fetchRiotApi<RiotSummonerData>(url);
}

export async function getLeagueEntriesByPuuid(
  puuid: string
): Promise<RiotLeagueEntry[]> {
  const url = `https://${REGION}.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}`;
  return fetchRiotApi<RiotLeagueEntry[]>(url);
}

export function generateRandomIconId(): number {
  const validIconIds = Array.from({ length: 28 }, (_, i) => i + 1);
  return validIconIds[Math.floor(Math.random() * validIconIds.length)];
}
