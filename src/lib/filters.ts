import type { BreathingRecord, EnrichedRecord, Filters } from './types';

/** 測定日時点での満年齢（歳）を計算する */
export function calcAge(birthDate: string, onDate: string): number {
  const birth = new Date(birthDate + 'T00:00:00');
  const on = new Date(onDate + 'T00:00:00');
  let age = on.getFullYear() - birth.getFullYear();
  const monthDiff = on.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && on.getDate() < birth.getDate())) {
    age -= 1;
  }
  return Math.max(age, 0);
}

export function enrichRecords(records: BreathingRecord[]): EnrichedRecord[] {
  return records.map((r) => ({
    ...r,
    age_at_measurement: calcAge(r.birth_date, r.measured_date),
  }));
}

export function applyFilters(records: EnrichedRecord[], f: Filters): EnrichedRecord[] {
  return records.filter((r) => {
    if (f.dogName && !r.dog_name.includes(f.dogName)) return false;
    if (f.breeds.length > 0 && !f.breeds.includes(r.dog_breed)) return false;
    if (f.genders.length > 0 && !f.genders.includes(r.gender)) return false;
    if (f.ageFrom && r.age_at_measurement < parseFloat(f.ageFrom)) return false;
    if (f.ageTo && r.age_at_measurement > parseFloat(f.ageTo)) return false;
    if (f.weightFrom && r.weight < parseFloat(f.weightFrom)) return false;
    if (f.weightTo && r.weight > parseFloat(f.weightTo)) return false;
    if (f.dateFrom && r.measured_date < f.dateFrom) return false;
    if (f.dateTo && r.measured_date > f.dateTo) return false;
    if (f.tempFrom && r.room_temperature < parseFloat(f.tempFrom)) return false;
    if (f.tempTo && r.room_temperature > parseFloat(f.tempTo)) return false;
    if (f.breathingFrom && r.breathing_rate < parseInt(f.breathingFrom)) return false;
    if (f.breathingTo && r.breathing_rate > parseInt(f.breathingTo)) return false;
    if (f.sleeping === 'yes' && !r.is_sleeping) return false;
    if (f.sleeping === 'no' && r.is_sleeping) return false;
    if (f.afterToilet === 'yes' && !r.after_toilet) return false;
    if (f.afterToilet === 'no' && r.after_toilet) return false;
    if (f.otherCondition === 'yes' && !r.is_other_condition) return false;
    if (f.otherCondition === 'no' && r.is_other_condition) return false;
    if (f.recordedBy && !r.recorded_by.includes(f.recordedBy)) return false;
    return true;
  });
}
