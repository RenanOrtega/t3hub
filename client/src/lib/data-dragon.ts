const DATA_DRAGON_BASE = "https://ddragon.leagueoflegends.com";
const VALID_ICON_IDS = Array.from({ length: 29 }, (_, i) => i); // 0-28

let cachedVersion: string | null = null;

export async function getLatestDataDragonVersion(): Promise<string> {
  if (cachedVersion) {
    return cachedVersion;
  }

  try {
    const response = await fetch(`${DATA_DRAGON_BASE}/api/versions.json`);
    if (!response.ok) {
      throw new Error("Failed to fetch Data Dragon versions");
    }
    const versions = await response.json() as string[];
    cachedVersion = versions[0];
    return cachedVersion;
  } catch (error) {
    console.error("Failed to fetch Data Dragon version:", error);
    return "14.24.1"; // fallback version
  }
}

export function getProfileIconUrl(iconId: number, version?: string): string {
  const versionToUse = version || cachedVersion || "14.24.1";
  return `${DATA_DRAGON_BASE}/cdn/${versionToUse}/img/profileicon/${iconId}.png`;
}

export function isValidIconId(iconId: number): boolean {
  return VALID_ICON_IDS.includes(iconId);
}

export function getValidIconIds(): number[] {
  return [...VALID_ICON_IDS];
}
