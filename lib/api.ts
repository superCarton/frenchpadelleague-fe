import { Club, Player, Profiles, Tournament, WithStrapiMeta } from "./interfaces";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337/api";

type StrapiPopulate =
  | string
  | {
      fieldName: string;
      subFields: string[];
    };

const buildUrl = (url: string, populateFields?: StrapiPopulate[]) => {
  return `${API_URL}${url}?${
    populateFields
      ? populateFields
          .map((field) => {
            if (typeof field === "string") {
              return `populate[${field}]=true`;
            } else {
              return field.subFields
                .map((subField) => `populate[${field.fieldName}][populate][${subField}]=true`)
                .join("&");
            }
          })
          .join("&")
      : ""
  }`;
};

export async function login(email: string, password: string): Promise<{ jwt: string }> {
  const res = await fetch(buildUrl("/auth/local"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      identifier: email,
      password,
    }),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error?.message || "Erreur login");

  return data;
}

export async function forgotPassword(email: string) {
  const res = await fetch(buildUrl("/auth/forgot-password"), {
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
  const res = await fetch(buildUrl("/auth/reset-password"), {
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

export async function getMeProfiles(jwt: string): Promise<Profiles> {
  if (!jwt) throw new Error("Utilisateur non authentifié");

  const res = await fetch(buildUrl("/me/profiles"), {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error?.message || "Erreur /me/profiles");

  return data;
}

export async function getMePlayer(jwt: string): Promise<Player> {
  if (!jwt) throw new Error("Utilisateur non authentifié");

  const res = await fetch(buildUrl("/me/player"), {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error?.message || "Erreur /me/profiles");

  return data;
}

export async function getPlayerById(playerId: string): Promise<WithStrapiMeta<Player>> {
  const res = await fetch(buildUrl(`/players/${playerId}`, ["league"]));
  const data = await res.json();

  if (!res.ok) throw new Error(data.error?.message || "Erreur /players/:playerId");

  return data;
}

export async function getPlayers(): Promise<WithStrapiMeta<Player[]>> {
  const res = await fetch(buildUrl("/players", ["league"]));
  const data = await res.json();

  if (!res.ok) throw new Error(data.error?.message || "Erreur /players");

  return data;
}

export async function createPlayer(payload: any) {
  const res = await fetch(buildUrl("/players"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();

  if (!res.ok) throw new Error(data.error?.message || "Erreur création joueur");

  return data;
}

export async function subscribeNewsletter(email: string) {
  const res = await fetch(buildUrl("/newsletters"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: { email } }),
  });
  const data = await res.json();

  if (!res.ok) throw new Error(data.error?.message || "Erreur lors de l'ajout à la newsletter");

  return data;
}

export async function unsubscribeNewsletter(token: string) {
  const res = await fetch(buildUrl(`/newsletters/unknown?token=${token}`), {
    method: "DELETE",
  });
  const data = await res.json();

  if (!res.ok)
    throw new Error(data.error?.message || "Erreur lors de la suppression de la newsletter");

  return data;
}

export async function getTournaments(): Promise<WithStrapiMeta<Tournament[]>> {
  const res = await fetch(
    buildUrl("/tournaments", [
      "league",
      { fieldName: "club", subFields: ["logo", "coverImage", "address"] },
    ])
  );
  const data = await res.json();

  if (!res.ok) throw new Error(data.error?.message || "Erreur /tournaments");

  return data;
}

export async function getTournamentById(tournamentId: string): Promise<WithStrapiMeta<Tournament>> {
  const res = await fetch(
    buildUrl(`/tournaments/${tournamentId}`, [
      "league",
      { fieldName: "club", subFields: ["logo", "coverImage", "address"] },
    ])
  );
  const data = await res.json();

  if (!res.ok) throw new Error(data.error?.message || "Erreur /tournaments/:tournamentId");

  return data;
}

export async function getClubById(clubId: string): Promise<WithStrapiMeta<Club>> {
  const res = await fetch(buildUrl(`/clubs/${clubId}`, ["address", "logo", "coverImage"]));
  const data = await res.json();

  if (!res.ok) throw new Error(data.error?.message || "Erreur /clubs/:clubId");

  return data;
}
