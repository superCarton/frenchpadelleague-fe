type StrapiDocument = { documentId: string; id: number };

export type WithStrapiMeta<A> = {
  data: A;
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

export type StrapiImage = {
  url: string;
};

export type Gender = "male" | "female";

export type TournamentGender = Gender | "mixed";

export interface Address {
  street: string;
  streetComplement?: string;
  city: string;
  zipcode: string;
  country: string;
  latitude: number;
  longitude: number;
}

export type Badge = "bronze" | "silver" | "gold" | "premium" | "legend";

export interface League extends StrapiDocument {
  badge: Badge;
  description: string;
  title: string;
  minElo: number;
  maxElo: number;
  badgeImage: StrapiImage;
  gender: Gender;
}

export interface GameFormat extends StrapiDocument {
  name: string;
  description: string;
  nbOfSets: number;
  nbGamesInSet: number;
  noAd: boolean;
  lastSetSuperTie: boolean;
}

export interface User extends StrapiDocument {
  username: string;
  email: string;
  blocked: boolean;
  confirmed: boolean;
}

export interface PlayerStat {
  elo: number;
  bestElo: number;
  mixedElo?: number;
  bestMixedElo?: number;
  quizzDone: boolean;
  fftPadelRank?: number;
  quizzTotalPoints?: number;
}

export interface Player extends StrapiDocument {
  firstname: string;
  lastname: string;
  birthdate: string;
  gender: Gender;
  league: League;
  user: User;
  club?: Club;
  matchesHistory: Match[];
  publishedAt: string;
  playerStat: PlayerStat;
  photo?: StrapiImage;
  phoneNumber?: string;
}

export interface Profiles {
  player: Player;
}

export type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface OpeningHours {
  days: { name: Weekday }[];
  openingTime: string;
  closingTime: string;
}

export interface PadelCourt {
  name: string;
  type: "indoor" | "outdoor";
}

export interface Club extends StrapiDocument {
  user: User;
  name: string;
  address: Address;
  totalCourts: number;
  contactEmail?: string;
  instagramLink?: string;
  website?: string;
  hasRestaurant: boolean;
  phoneNumber?: string;
  description?: string;
  players: Player[];
  tournaments: Tournament[];
  logo: StrapiImage;
  coverImage: StrapiImage;
  opening_hours?: OpeningHours[];
  padelCourts: PadelCourt[];
}

export interface Team extends StrapiDocument {
  playerA: Player;
  playerB: Player;
  tournament: Tournament;
  name: string;
  confirmed: boolean;
  seed?: number;
  elo: number;
}

export type MatchStatus = "wont-play" | "scheduled" | "started" | "finished";

export interface MatchSet {
  teamAScore: number;
  teamBScore: number;
}

export type TournamentRound = "groups" | "r32" | "r16" | "quarter" | "semi" | "final";

export interface Match extends StrapiDocument {
  team_a?: Team;
  team_b?: Team;
  game_format: GameFormat;
  matchStatus: MatchStatus;
  date?: string;
  scheduledDate?: string;
  winner?: Team;
  tournament_group?: TournamentGroup;
  score: MatchSet[];
  tournament: Tournament;
  round: TournamentRound;
}

export type TournamentStatus =
  | "pending-validation"
  | "validated"
  | "registrations-opened"
  | "registrations-closed"
  | "started"
  | "completed"
  | "cancelled";

export interface Tournament extends StrapiDocument {
  name: string;
  startDate: string;
  endDate?: string;
  currentStatus: TournamentStatus;
  gender: TournamentGender;
  league: League;
  club: Club;
  registrationDeadline?: string;
  description?: string;
  prizeMoney?: number;
  registrationFee?: number;
  maxTeams?: number;
  matches: Match[];
  tournament_groups: TournamentGroup[];
  referee: Player;
  teams: Team[];
  courts: PadelCourt[];
  ballsType: string;
}

export interface TournamentGroup extends StrapiDocument {
  name: string;
  teams: Team[];
  matches: Match[];
  nbTeamsQualified?: number;
  tournament: Tournament;
}

interface GroupTeamStat {
  team: Team;
  played: number;
  won: number;
  lost: number;
  gamesFor: number;
  gamesAgainst: number;
  gamesDiff: number;
}

export interface TournamentGroupWithStats extends TournamentGroup {
  isFinished: boolean;
  stats: GroupTeamStat[];
}
