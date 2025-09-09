import { TournamentRound } from "./interfaces";

export const roundNames: Record<TournamentRound, string> = {
  groups: "Poules",
  r32: "Seizième de finale",
  r16: "Huitième de finale",
  quarter: "Quart de finale",
  semi: "Demi finale",
  final: "Finale",
};

export const getPrettyErrorMessage = (message: string) => {
  switch (message) {
    case "fetch failed":
      return "Erreur de réseau";
  }
  return message;
};

export const leagueColors = {
  bronze: "#6f3310",
  silver: "#959084",
  gold: "#e2a21c",
  premium: "#0b0b0b",
  legend: "#820817",
};
