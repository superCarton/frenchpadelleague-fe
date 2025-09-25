import { TournamentRound, Weekday } from "./interfaces";

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

export const leagueGradients = {
  bronze: "from-bronze to-bronze-light",
  silver: "from-silver to-silver-light",
  gold: "from-gold to-gold-light",
  premium: "from-premium to-premium-light",
  legend: "from-legend to-legend-light",
};

export const leagueColors = {
  bronze: "#6f3310",
  silver: "#959084",
  gold: "#e2a21c",
  premium: "#0b0b0b",
  legend: "#820817",
};

export const daysNames: Record<Weekday, string> = {
  monday: "Lundi",
  tuesday: "Mardi",
  wednesday: "Mercredi",
  thursday: "Jeudi",
  friday: "Vendredi",
  saturday: "Samedi",
  sunday: "Dimanche",
};

export const formatHour = (hourString: string) => {
  const [h, m] = hourString.split(":").map(Number);
  if (m === 0) {
    return `${h}h`;
  }
  return `${h}h${m}`;
};
