export type Gender = 'オス' | '去勢オス' | 'メス' | '避妊メス';

export const GENDERS: Gender[] = ['オス', '去勢オス', 'メス', '避妊メス'];

export interface BreathingRecord {
  id: string;
  created_at: string;
  dog_name: string;
  dog_breed: string;
  mix_detail: string | null; // 犬種がMIXの場合の「何犬と何犬か」（任意）
  birth_date: string; // YYYY-MM-DD
  weight: number; // kg
  gender: Gender;
  measured_date: string; // YYYY-MM-DD
  room_temperature: number; // ℃
  is_sleeping: boolean;
  after_toilet: boolean;
  is_other_condition: boolean;
  other_condition_note: string | null;
  breathing_rate: number; // 回/分
  recorded_by: string;
  notes: string | null;
}

/** 一覧表示・フィルタ用に、測定日時点の年齢（歳）を付加したもの */
export interface EnrichedRecord extends BreathingRecord {
  age_at_measurement: number;
}

export interface Filters {
  dogName: string;
  breeds: string[];
  genders: string[];
  ageFrom: string;
  ageTo: string;
  weightFrom: string;
  weightTo: string;
  dateFrom: string;
  dateTo: string;
  tempFrom: string;
  tempTo: string;
  breathingFrom: string;
  breathingTo: string;
  sleeping: 'any' | 'yes' | 'no';
  afterToilet: 'any' | 'yes' | 'no';
  otherCondition: 'any' | 'yes' | 'no';
  recordedBy: string;
}

export const EMPTY_FILTERS: Filters = {
  dogName: '',
  breeds: [],
  genders: [],
  ageFrom: '',
  ageTo: '',
  weightFrom: '',
  weightTo: '',
  dateFrom: '',
  dateTo: '',
  tempFrom: '',
  tempTo: '',
  breathingFrom: '',
  breathingTo: '',
  sleeping: 'any',
  afterToilet: 'any',
  otherCondition: 'any',
  recordedBy: '',
};
