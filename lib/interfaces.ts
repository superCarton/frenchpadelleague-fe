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

export interface League extends StrapiDocument {
  badge: "bronze" | "silver" | "gold" | "premium" | "legend";
  description: string;
  title: string;
  minElo: number;
  maxElo: number;
  badgeImage: StrapiImage;
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

export interface Player extends StrapiDocument {
  firstname: string;
  lastname: string;
  birthdate: string;
  gender: Gender;
  elo: number;
  league: League;
  user: User;
  club?: Club;
  matchesHistory: Match[];
}

export interface Profiles {
  player: Player;
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
}

export interface Team extends StrapiDocument {
  playerA: Player;
  playerB: Player;
  tournament: Tournament;
  name: string;
  confirmed: boolean;
}

export type MatchStatus = "wont-play" | "scheduled" | "started" | "finished";

export interface MatchSet {
  teamAScore: number;
  teamBScore: number;
}

export type TournamentRound = "r32" | "r16" | "quarter" | "semi" | "final";

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
  round?: TournamentRound;
  nextMatch?: Match;
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
  allocatedCourts: number;
  registrationFee?: number;
  maxTeams?: number;
  matches: Match[];
  tournament_groups: TournamentGroup[];
  referee: Player;
}

export interface TournamentGroup extends StrapiDocument {
  name: string;
  teams: Team[];
  matches: Match[];
  nbTeamsQualified?: number;
  tournament: Tournament;
}
