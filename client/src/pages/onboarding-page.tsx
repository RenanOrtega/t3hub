import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRiotVerification } from "../hooks/use-riot-verification";

const LANES = ["Top", "Jungle", "Mid", "ADC", "Support"] as const;
type Lane = (typeof LANES)[number];

type OnboardingStep = "account-type" | "riot-verification" | "completed";

export function OnboardingPage() {
  const navigate = useNavigate();
  const {
    generateVerification,
    verifyAccount,
    isGenerating,
    isVerifying,
    generateError,
    verifyError,
  } = useRiotVerification();

  const [step, setStep] = useState<OnboardingStep>("account-type");
  const [gameName, setGameName] = useState("");
  const [tagLine, setTagLine] = useState("");
  const [primaryLane, setPrimaryLane] = useState<Lane | "">("");
  const [secondaryLane, setSecondaryLane] = useState<Lane | "">("");
  const [discordTag, setDiscordTag] = useState("");
  const [verificationIconId, setVerificationIconId] = useState<number | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const handleConfirmPlayer = () => {
    setStep("riot-verification");
  };

  const handleGenerateVerification = async () => {
    setError(null);

    if (!gameName || !tagLine) {
      setError("Preencha o nome e a tag da sua conta");
      return;
    }

    try {
      const result = await generateVerification({ gameName, tagLine });
      setVerificationIconId(result.verificationIconId);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao gerar código de verificação"
      );
    }
  };

  const handleVerify = async () => {
    setError(null);

    if (!gameName || !tagLine || !verificationIconId || !primaryLane || !secondaryLane || !discordTag) {
      setError("Preencha todas as informações");
      return;
    }

    if (primaryLane === secondaryLane) {
      setError("As lanes primária e secundária devem ser diferentes");
      return;
    }

    try {
      await verifyAccount({
        gameName,
        tagLine,
        verificationIconId,
        primaryLane,
        secondaryLane,
        discordTag,
      });
      setStep("completed");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao verificar conta");
    }
  };

  if (step === "account-type") {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card border border-border rounded-lg p-8 shadow-lg">
          <h1 className="text-2xl font-bold mb-4">Bem-vindo ao T3Hub!</h1>
          <p className="text-muted-foreground mb-6">
            Para começar, confirme se você é um jogador de League of Legends.
          </p>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-400 mb-2">
              Sobre ser um jogador
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Você entrará para a lista de jogadores</li>
              <li>• Precisará vincular sua conta do League of Legends</li>
              <li>• Organizações poderão encontrá-lo para convites</li>
              <li>• Poderá participar de scrims e times</li>
            </ul>
          </div>

          <button
            onClick={handleConfirmPlayer}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Sim, sou jogador
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full mt-3 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Não sou jogador
          </button>
        </div>
      </div>
    );
  }

  if (step === "riot-verification") {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-card border border-border rounded-lg p-8 shadow-lg">
          <h1 className="text-2xl font-bold mb-2">
            Verificação de Conta do League of Legends
          </h1>
          <p className="text-muted-foreground mb-6">
            Vamos verificar que você é o dono da conta informada
          </p>

          {!verificationIconId ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nome da Conta (Game Name)
                </label>
                <input
                  type="text"
                  value={gameName}
                  onChange={(e) => setGameName(e.target.value)}
                  placeholder="Ex: PlayerName"
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Tag Line
                </label>
                <input
                  type="text"
                  value={tagLine}
                  onChange={(e) => setTagLine(e.target.value)}
                  placeholder="Ex: BR1"
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {(error || generateError) && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-3 text-sm">
                  {error || generateError?.message}
                </div>
              )}

              <button
                onClick={handleGenerateVerification}
                disabled={isGenerating}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? "Gerando..." : "Gerar Código de Verificação"}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <h3 className="font-semibold text-green-400 mb-2">
                  Código de Verificação Gerado!
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Siga os passos abaixo para verificar sua conta:
                </p>
                <ol className="text-sm text-muted-foreground space-y-2">
                  <li>
                    1. Abra o League of Legends e vá em Coleção → Ícones
                  </li>
                  <li>
                    2. Selecione o ícone com ID:{" "}
                    <span className="font-bold text-primary">
                      {verificationIconId}
                    </span>
                  </li>
                  <li>3. Salve a alteração no perfil</li>
                  <li>4. Volte aqui e clique em "Verificar Conta"</li>
                </ol>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  ⏰ Este código expira em 10 minutos
                </p>
              </div>

              <div className="border border-border rounded-lg p-4">
                <h4 className="font-medium mb-2">Sua conta:</h4>
                <p className="text-muted-foreground">
                  {gameName}#{tagLine}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Lane Principal
                  </label>
                  <select
                    value={primaryLane}
                    onChange={(e) => setPrimaryLane(e.target.value as Lane)}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Selecione sua lane principal</option>
                    {LANES.map((lane) => (
                      <option key={lane} value={lane}>
                        {lane}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Lane Secundária
                  </label>
                  <select
                    value={secondaryLane}
                    onChange={(e) => setSecondaryLane(e.target.value as Lane)}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Selecione sua lane secundária</option>
                    {LANES.map((lane) => (
                      <option key={lane} value={lane} disabled={lane === primaryLane}>
                        {lane}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Discord (usuário#0000)
                  </label>
                  <input
                    type="text"
                    value={discordTag}
                    onChange={(e) => setDiscordTag(e.target.value)}
                    placeholder="Ex: seunome#1234"
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {(error || verifyError) && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-3 text-sm">
                  {error || verifyError?.message}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setVerificationIconId(null);
                    setError(null);
                  }}
                  className="flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Gerar Novo Código
                </button>
                <button
                  onClick={handleVerify}
                  disabled={isVerifying}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isVerifying ? "Verificando..." : "Verificar Conta"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (step === "completed") {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card border border-border rounded-lg p-8 shadow-lg text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Conta Verificada!</h1>
          <p className="text-muted-foreground mb-4">
            Sua conta do League of Legends foi vinculada com sucesso.
          </p>
          <p className="text-sm text-muted-foreground">
            Redirecionando para a página inicial...
          </p>
        </div>
      </div>
    );
  }

  return null;
}
