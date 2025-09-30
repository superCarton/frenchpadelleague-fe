import {
  Club,
  Gender,
  League,
  Match,
  Player,
  Profiles,
  Team,
  Tournament,
  TournamentGender,
  TournamentGroupWithStats,
  WithStrapiMeta,
} from "./interfaces";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337/api";

type PopulateField =
  | string
  | {
      fieldName: string;
      subFields?: PopulateField[];
    };

const buildUrl = (url: string, fields: PopulateField[]): string => {
  const params: string[] = [];

  function recurse(field: PopulateField, prefix: string) {
    if (typeof field === "string") {
      params.push(`${prefix}[${field}]=true`);
    } else {
      if (field.subFields && field.subFields.length > 0) {
        for (const sub of field.subFields) {
          recurse(sub, `${prefix}[${field.fieldName}][populate]`);
        }
      } else {
        params.push(`${prefix}[${field.fieldName}]=true`);
      }
    }
  }

  for (const f of fields) {
    recurse(f, "populate");
  }

  const queryString = params.join("&");

  return `${API_URL}${url}${url.includes("?") ? "&" : "?"}${queryString}`;
};

const leaguePopulate: PopulateField[] = ["badgeImage"];

const playerPopulate: PopulateField[] = [
  "photo",
  "elo",
  "selfEvaluation",
  { fieldName: "league", subFields: leaguePopulate },
];

const clubPopulate: PopulateField[] = [
  "logo",
  "coverImage",
  "address",
  "padelCourts",
  { fieldName: "opening_hours", subFields: ["days"] },
];

const tournamentPreviewPopulate: PopulateField[] = [
  { fieldName: "league", subFields: leaguePopulate },
  { fieldName: "club", subFields: clubPopulate },
];

const teamPopulate: PopulateField[] = [
  { fieldName: "playerA", subFields: playerPopulate },
  { fieldName: "playerB", subFields: playerPopulate },
  { fieldName: "tournament", subFields: tournamentPreviewPopulate },
];

const matchPopulate: PopulateField[] = [
  "game_format",
  "score",
  {
    fieldName: "team_a",
    subFields: teamPopulate,
  },
  {
    fieldName: "team_b",
    subFields: teamPopulate,
  },
  {
    fieldName: "winner",
    subFields: teamPopulate,
  },
];

const tournamentDetailsPopulate: PopulateField[] = [
  { fieldName: "league", subFields: leaguePopulate },
  "courts",
  { fieldName: "teams", subFields: teamPopulate },
  { fieldName: "club", subFields: clubPopulate },
  { fieldName: "referee", subFields: playerPopulate },
];

export async function login(email: string, password: string): Promise<{ jwt: string }> {
  const res = await fetch(buildUrl("/auth/local", []), {
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
  const res = await fetch(buildUrl("/auth/forgot-password", []), {
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
  const res = await fetch(buildUrl("/auth/reset-password", []), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, password: newPassword, passwordConfirmation: newPassword }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Erreur lors du changement du mot de passe");
  return data;
}

export async function confirmEmail(code: string) {
  const res = await fetch(buildUrl(`/auth/email-confirmation?confirmation=${code}`, []), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Erreur lors de la confirmation de l'email");
}

export async function getMeProfiles(jwt: string): Promise<Profiles> {
  if (!jwt) throw new Error("Utilisateur non authentifié");

  const res = await fetch(buildUrl("/me/profiles", []), {
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

  const res = await fetch(buildUrl("/me/player", []), {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Erreur /me/profiles");
  return data;
}

export async function getPlayerByDocId(playerDocId: string): Promise<WithStrapiMeta<Player>> {
  const res = await fetch(buildUrl(`/players/${playerDocId}`, playerPopulate));
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Erreur /players/:playerDocId");
  return data;
}

export async function getPlayers(gender?: TournamentGender): Promise<WithStrapiMeta<Player[]>> {
  let url = "/players";
  if (gender) {
    url += `?filters[gender][$eq]=${gender === "mixed" ? "male|female" : gender}`;
  }
  const res = await fetch(buildUrl(url, playerPopulate));
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Erreur /players");
  return data;
}

export async function createPlayer(payload: any) {
  const res = await fetch(buildUrl("/players", []), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Erreur création joueur");
  return data;
}

export async function subscribeNewsletter(email: string) {
  const res = await fetch(buildUrl("/newsletters", []), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: { email } }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Erreur lors de l'ajout à la newsletter");
  return data;
}

export async function unsubscribeNewsletter(token: string) {
  const res = await fetch(buildUrl(`/newsletters/unknown?token=${token}`, []), {
    method: "DELETE",
  });
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.error?.message || "Erreur lors de la suppression de la newsletter");
  return data;
}

export async function getTournaments(): Promise<WithStrapiMeta<Tournament[]>> {
  const res = await fetch(buildUrl("/tournaments", tournamentPreviewPopulate));
  const data = await res.json();

  if (!res.ok) throw new Error(data.error);

  return data;
}

export async function getNextTournaments(): Promise<WithStrapiMeta<Tournament[]>> {
  const today = new Date().toISOString();
  const res = await fetch(
    buildUrl(
      `/tournaments?filters[startDate][$gt]=${today}&sort=startDate:asc&pagination[limit]=3`,
      tournamentPreviewPopulate
    )
  );
  const data = await res.json();

  if (!res.ok) throw new Error(data.error?.message || "Erreur /tournaments");

  return data;
}

export async function getTournamentByDocId(
  tournamentDocId: string
): Promise<WithStrapiMeta<Tournament>> {
  const res = await fetch(buildUrl(`/tournaments/${tournamentDocId}`, tournamentDetailsPopulate));
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Erreur /tournaments/:tournamentDocId");
  return data;
}

export async function getClubs(): Promise<WithStrapiMeta<Club[]>> {
  const res = await fetch(buildUrl("/clubs", clubPopulate));
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Erreur /clubs");
  return data;
}

export async function getClubByDocId(clubDocId: string): Promise<WithStrapiMeta<Club>> {
  const res = await fetch(buildUrl(`/clubs/${clubDocId}`, clubPopulate));
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Erreur /clubs/:clubDocId");
  return data;
}

export async function getPlayersByLeague(leagueId: number): Promise<WithStrapiMeta<Player[]>> {
  const res = await fetch(
    buildUrl(`/players?filters[league][id][$eq]=${leagueId}`, playerPopulate)
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Erreur /players?league=leagueId");
  return data;
}

export async function registerTeam(
  {
    tournamentDocId,
    partnerDocId,
  }: {
    tournamentDocId: string;
    partnerDocId?: string;
  },
  jwt: string
): Promise<Team> {
  if (!jwt) throw new Error("Utilisateur non authentifié");

  const res = await fetch(buildUrl("/teams/register", []), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({ tournamentId: tournamentDocId, partnerId: partnerDocId }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Erreur /teams/register");
  return data;
}

export async function getTeamsByTournamentId(
  tournamentId: number
): Promise<WithStrapiMeta<Team[]>> {
  const res = await fetch(
    buildUrl(`/teams?filters[tournament][id][$eq]=${tournamentId}`, teamPopulate)
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Erreur /teams");
  return data;
}

export async function getTeamsByPlayerDocId(playerDocId: string): Promise<WithStrapiMeta<Team[]>> {
  const res = await fetch(
    buildUrl(
      `/teams?filters[$or][0][playerA][documentId][$eq]=${playerDocId}&filters[$or][1][playerB][documentId][$eq]=${playerDocId}&sort=tournament.startDate:asc`,
      teamPopulate
    )
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Erreur /teams");
  return data;
}

export async function getGroupsByTournamentId(
  tournamentId: number
): Promise<TournamentGroupWithStats[]> {
  const res = await fetch(
    buildUrl(`/tournament-groups?filters[tournament][id][$eq]=${tournamentId}`, [
      {
        fieldName: "teams",
        subFields: teamPopulate,
      },
      {
        fieldName: "matches",
        subFields: matchPopulate,
      },
    ])
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Erreur /tournament-groups");
  return data;
}

export async function getMatchesByTournamentId(
  tournamentId: number
): Promise<WithStrapiMeta<Match[]>> {
  const res = await fetch(
    buildUrl(`/matches?filters[tournament][id][$eq]=${tournamentId}`, matchPopulate)
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Erreur /matches");
  return data;
}

export async function getTournamentsByClubDocumentId(
  clubDocumentId: string
): Promise<WithStrapiMeta<Tournament[]>> {
  const res = await fetch(
    buildUrl(`/tournaments?filters[club][documentId][$eq]=${clubDocumentId}`, [
      { fieldName: "league", subFields: leaguePopulate },
      { fieldName: "club", subFields: clubPopulate },
    ])
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Erreur /tournaments/:tournamentDocId");
  return data;
}

export async function getPlayerEloHistory(playerDocId: string) {
  return Promise.resolve({
    bestElo: 810,
    eloHistory: [
      {
        date: "10-03-2025",
        elo: 600,
      },
      {
        date: "04-04-2025",
        elo: 625,
      },
      {
        date: "25-04-2025",
        elo: 665,
      },
      {
        date: "04-06-2025",
        elo: 712,
      },
      {
        date: "30-06-2025",
        elo: 690,
      },
      {
        date: "14-07-2025",
        elo: 720,
      },
      {
        date: "28-07-2025",
        elo: 755,
      },
      {
        date: "28-08-2025",
        elo: 738,
      },
    ],
  });
}

export async function getAllLeagues(gender?: Gender): Promise<WithStrapiMeta<League[]>> {
  let url = "/leagues?&sort=minElo";
  if (gender) {
    url += `&filters[gender][$eq]=${gender}`;
  }
  const res = await fetch(buildUrl(url, leaguePopulate));
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erreur /leagues");
  return data;
}

export async function selfEvaluation(
  {
    fftPadelRank,
    fftLicenceNumber,
    quizScore,
  }: {
    fftPadelRank?: number;
    fftLicenceNumber?: string;
    quizScore?: number;
  },
  jwt: string
): Promise<Player> {
  if (!jwt) throw new Error("Utilisateur non authentifié");

  const res = await fetch(buildUrl("/me/player/self-evaluation", leaguePopulate), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({ fftPadelRank, fftLicenceNumber, quizScore }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Erreur /me/player/self-evaluation");
  return data;
}

export async function uploadMeProfilePhoto(file: File, jwt: string): Promise<Player> {
  if (!jwt) throw new Error("Utilisateur non authentifié");
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(buildUrl("/me/player/photo", []), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Erreur /me/player/photo");
  return data;
}

export async function updateMeProfile(
  profileUpdates: { firstname: string; lastname: string; email: string; phoneNumber?: string },
  jwt: string
): Promise<Player> {
  if (!jwt) throw new Error("Utilisateur non authentifié");
  const res = await fetch(buildUrl("/me/update-profile", playerPopulate), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(profileUpdates),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Erreur /me/update-profile");
  return data;
}
