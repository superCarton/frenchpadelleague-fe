import { Club, Player, Tournament, WithStrapiMeta } from "./interfaces";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337/api";

export function getToken(): string | null {
  return typeof window !== "undefined" ? localStorage.getItem("jwt") : null;
}

export function getCurrentUser(): any | null {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("user");

  return user ? JSON.parse(user) : null;
}

export function isUserConnected() {
  return typeof window !== "undefined" ? !!localStorage.getItem("jwt") : false;
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/local`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      identifier: email,
      password,
    }),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error?.message || "Erreur login");
  localStorage.setItem("jwt", data.jwt);
  localStorage.setItem("user", JSON.stringify(data.user));

  return data;
}

export async function forgotPassword(email: string) {
  const res = await fetch(`${API_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();

  if (!res.ok)
    throw new Error(data.error?.message || "Erreur lors du renouvelement du mot de passe");

  return data;
}

export async function resetPassword(code: string, newPassword: string) {
  const res = await fetch(`${API_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, password: newPassword, passwordConfirmation: newPassword }),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error?.message || "Erreur lors du changement du mot de passe");
  localStorage.setItem("jwt", data.jwt);
  localStorage.setItem("user", JSON.stringify(data.user));

  return data;
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }
}

export async function getMeProfiles() {
  const token = getToken();

  if (!token) throw new Error("Utilisateur non authentifié");

  const res = await fetch(`${API_URL}/me/profiles`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error?.message || "Erreur /me/profiles");

  return data;
}

export async function getMePlayer(): Promise<Player> {
  const token = getToken();

  if (!token) throw new Error("Utilisateur non authentifié");

  const res = await fetch(`${API_URL}/me/player`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error?.message || "Erreur /me/profiles");

  return data;
}

export async function getPlayerById(playerId: string): Promise<WithStrapiMeta<Player>> {
  const token = getToken();
  const res = await fetch(`${API_URL}/players/${playerId}?populate=league`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error?.message || "Erreur /players/:playerId");

  return data;
}

export async function getPlayers(): Promise<WithStrapiMeta<Player[]>> {
  const token = getToken();
  const res = await fetch(`${API_URL}/players?populate=league`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error?.message || "Erreur /players");

  return data;
}

export async function createPlayer(payload: any) {
  const res = await fetch(`${API_URL}/players`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error?.message || "Erreur création joueur");
  localStorage.setItem("jwt", data.jwt);

  return data;
}

export async function subscribeNewsletter(email: string) {
  const res = await fetch(`${API_URL}/newsletters`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: { email } }),
  });
  const data = await res.json();

  if (!res.ok) throw new Error(data.error?.message || "Erreur lors de l'ajout à la newsletter");

  return data;
}

export async function unsubscribeNewsletter(token: string) {
  const res = await fetch(`${API_URL}/newsletters/unknown?token=${token}`, {
    method: "DELETE",
  });
  const data = await res.json();

  if (!res.ok)
    throw new Error(data.error?.message || "Erreur lors de la suppression de la newsletter");

  return data;
}

export async function getTournaments(): Promise<WithStrapiMeta<Tournament[]>> {
  const token = getToken();
  const res = await fetch(`${API_URL}/tournaments?populate=league&populate=club`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const data = await res.json();

  if (!res.ok) throw new Error(data.error?.message || "Erreur /tournaments");

  return data;
}

export async function getTournamentById(tournamentId: string): Promise<WithStrapiMeta<Tournament>> {
  const token = getToken();
  const res = await fetch(`${API_URL}/tournaments/${tournamentId}?populate=*`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const data = await res.json();

  if (!res.ok) throw new Error(data.error?.message || "Erreur /tournaments/:tournamentId");

  return data;
}

export async function getClubById(clubId: string): Promise<WithStrapiMeta<Club>> {
  const token = getToken();
  const res = await fetch(`${API_URL}/clubs/${clubId}?populate=address`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error?.message || "Erreur /clubs/:clubId");

  return data;
}
