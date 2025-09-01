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
  gender: "male" | "female";
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

export interface Referee extends StrapiDocument {
  user: User;
}

export interface Team extends StrapiDocument {
  playerA: Player;
  playerB: Player;
  tournament: Tournament;
  name: string;
  confirmed: boolean;
}

export type MatchStatus = "scheduled" | "started" | "finished";

export interface MatchSet {
  teamAScore: number;
  teamBScore: number;
}

export interface Match extends StrapiDocument {
  team_a: Team;
  team_b: Team;
  game_format: GameFormat;
  matchStatus: MatchStatus;
  date?: string;
  scheduledDate?: string;
  winner?: Team;
  tournament_group?: TournamentGroup;
  tournament_phase?: TournamentPhase;
  score: MatchSet[];
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
  league: League;
  club: Club;
  referee: Referee;
  registrationDeadline?: string;
  description?: string;
  prizeMoney?: number;
  allocatedCourts: number;
  registrationFee?: number;
  maxTeams?: number;
  matches: Match[];
  tournament_phases: TournamentPhase[];
}

export interface GameFormat extends StrapiDocument {
  name: string;
  description: string;
  nbOfSets: number;
  nbGamesInSet: number;
  noAd: boolean;
  lastSetSuperTie: boolean;
}

export interface TournamentGroup extends StrapiDocument {
  name: string;
  teams: Team[];
  matches: Match[];
  nbTeamsQualified?: number;
}

export interface TournamentPhase extends StrapiDocument {
  name: string;
  type: "group-stage" | "knockout" | "classification";
  order: number;
  description?: string;
  game_format: GameFormat;
  tournament: Tournament;
  tournament_groups?: TournamentGroup[];
  matches?: Match[];
}
