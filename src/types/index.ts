
export interface MixEntry {
  id: string;
  date: string;
  venue: string;
  artist: string;
  event: string;
  generalNotes: string;
  roomMixNotes: string;
  livestreamMixNotes: string;
  inEarMixNotes: string;
  futureUpdates: string;
  ratings: MixRatings;
  audioSrc?: string;
  youtubeUrl?: string;
  createdAt: number;
  updatedAt: number;
}

export interface MixRatings {
  clarity: number;
  balance: number;
  vocals: number;
  instruments: number;
  lowEnd: number;
  stereoImage: number;
  dynamics: number;
  effects: number;
  overall: number;
}

export type RatingCategory = keyof MixRatings;

export interface MixStoreState {
  mixes: MixEntry[];
  activeMixId: string | null;
}

export interface MixContextType {
  state: MixStoreState;
  addMix: (mix: Omit<MixEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateMix: (id: string, mix: Partial<MixEntry>) => void;
  deleteMix: (id: string) => void;
  setActiveMix: (id: string | null) => void;
  getActiveMix: () => MixEntry | undefined;
}

export interface ChartData {
  name: string;
  [key: string]: string | number;
}
