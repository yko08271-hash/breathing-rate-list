'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import DogBreedCombobox from './DogBreedCombobox';
import { MIX_BREED } from '@/data/dogBreeds';
import { GENDERS, type Gender, type BreathingRecord } from '@/lib/types';

const CACHE_KEY_RECORDED_BY = 'br_recorded_by';

function getCached(key: string, fallback = '') {
  if (typeof window === 'undefined') return fallback;
  return localStorage.getItem(key) ?? fallback;
}

function setCached(key: string, value: string) {
  localStorage.setItem(key, value);
}

// ブラウザのローカルタイムゾーンでYYYY-MM-DD文字列を作る
function formatLocalDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const EMPTY_FORM = {
  recorded_by: '',
  dog_name: '',
  dog_breed: '',
  mix_detail: '',
  birth_date: '',
  weight: '',
  gender: 'オス' as Gender,
  room_temperature: '',
  is_sleeping: false,
  after_toilet: false,
  is_other_condition: false,
  other_condition_note: '',
  breathing_rate: '',
  notes: '',
};

export default function RecordForm({ onDone }: { onDone?: () => void } = {}) {
  const today = formatLocalDate(new Date());
  const [measuredDate, setMeasuredDate] = useState(today);
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [knownDogs, setKnownDogs] = useState<Record<string, Pick<BreathingRecord, 'dog_breed' | 'mix_detail' | 'birth_date' | 'weight' | 'gender'>>>({});
  const autofilledRef = useRef(false);

  useEffect(() => {
    setForm((prev) => ({ ...prev, recorded_by: getCached(CACHE_KEY_RECORDED_BY) }));

    // 既存の犬の直近データを取得し、犬名入力時に犬種・生年月日・性別・体重を自動入力できるようにする
    const supabase = createClient();
    supabase
      .from('breathing_records')
      .select('dog_name, dog_breed, mix_detail, birth_date, weight, gender, measured_date')
      .order('measured_date', { ascending: false })
      .then(({ data, error }) => {
        if (error || !data) return;
        const map: Record<string, Pick<BreathingRecord, 'dog_breed' | 'mix_detail' | 'birth_date' | 'weight' | 'gender'>> = {};
        for (const r of data) {
          if (!(r.dog_name in map)) {
            map[r.dog_name] = { dog_breed: r.dog_breed, mix_detail: r.mix_detail, birth_date: r.birth_date, weight: r.weight, gender: r.gender as Gender };
          }
        }
        setKnownDogs(map);
      });
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'recorded_by') setCached(CACHE_KEY_RECORDED_BY, value);
  }

  function handleDogNameBlur() {
    if (autofilledRef.current) return;
    const known = knownDogs[form.dog_name.trim()];
    if (!known) return;
    autofilledRef.current = true;
    setForm((prev) => ({
      ...prev,
      dog_breed: known.dog_breed,
      mix_detail: known.mix_detail ?? '',
      birth_date: known.birth_date,
      weight: String(known.weight),
      gender: known.gender,
    }));
  }

  function handleCheckbox(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: checked }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg('');

    const weight = parseFloat(form.weight);
    const temp = parseFloat(form.room_temperature);
    const rate = parseInt(form.breathing_rate);

    if (isNaN(weight) || weight <= 0) { setErrorMsg('体重は正しい数値で入力してください'); return; }
    if (isNaN(temp)) { setErrorMsg('温度（室温）は数値で入力してください'); return; }
    if (isNaN(rate) || rate < 0) { setErrorMsg('呼吸数は正しい数値で入力してください'); return; }
    if (!form.birth_date) { setErrorMsg('生年月日を入力してください'); return; }

    setStatus('submitting');
    const supabase = createClient();

    const payload = {
      dog_name: form.dog_name.trim(),
      dog_breed: form.dog_breed,
      mix_detail: form.dog_breed === MIX_BREED ? (form.mix_detail.trim() || null) : null,
      birth_date: form.birth_date,
      weight,
      gender: form.gender,
      measured_date: measuredDate,
      room_temperature: temp,
      is_sleeping: form.is_sleeping,
      after_toilet: form.after_toilet,
      is_other_condition: form.is_other_condition,
      other_condition_note: form.is_other_condition ? (form.other_condition_note.trim() || null) : null,
      breathing_rate: rate,
      recorded_by: form.recorded_by.trim(),
      notes: form.notes.trim() || null,
    };

    const { error } = await supabase.from('breathing_records').insert(payload);

    if (error) {
      setErrorMsg('送信に失敗しました: ' + error.message);
      setStatus('error');
      return;
    }

    setStatus('success');
    onDone?.();
  }

  function handleContinue() {
    // 記録者名以外はリセットして次の記録へ
    setForm({ ...EMPTY_FORM, recorded_by: form.recorded_by });
    setMeasuredDate(formatLocalDate(new Date()));
    autofilledRef.current = false;
    setStatus('idle');
  }

  const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  if (status === 'success') {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 text-center">
        <div className="text-5xl mb-4">✅</div>
        <p className="text-xl font-bold text-green-600 mb-2">記録を送信しました！</p>
        <p className="text-gray-500 mb-6">{form.dog_name || 'この犬'} の記録を保存しました。</p>
        <button onClick={handleContinue} className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
          続けて記録する
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-4">
      {/* 記録者名 */}
      <div>
        <label className={labelClass}>記録者名 * <span className="text-xs text-blue-500">（次回から自動入力）</span></label>
        <input type="text" name="recorded_by" value={form.recorded_by} onChange={handleChange} required placeholder="例：田中" className={inputClass} />
      </div>

      {/* 犬名 */}
      <div>
        <label className={labelClass}>犬名 * <span className="text-xs text-blue-500">（既存の犬なら犬種等を自動入力）</span></label>
        <input
          type="text"
          name="dog_name"
          value={form.dog_name}
          onChange={handleChange}
          onBlur={handleDogNameBlur}
          required
          placeholder="例：ポチ"
          list="known-dog-names"
          className={inputClass}
        />
        <datalist id="known-dog-names">
          {Object.keys(knownDogs).map((name) => <option key={name} value={name} />)}
        </datalist>
      </div>

      {/* 犬種 */}
      <div>
        <label className={labelClass}>犬種 *</label>
        <DogBreedCombobox value={form.dog_breed} onChange={(v) => setForm((prev) => ({ ...prev, dog_breed: v }))} required />
        {form.dog_breed === MIX_BREED && (
          <input
            type="text"
            name="mix_detail"
            value={form.mix_detail}
            onChange={handleChange}
            placeholder="何犬と何犬のミックスか（任意・不明な場合は空欄でOK）"
            className={inputClass + ' mt-2'}
          />
        )}
      </div>

      {/* 生年月日 */}
      <div>
        <label className={labelClass}>年齢（生年月日）*</label>
        <input type="date" name="birth_date" value={form.birth_date} onChange={handleChange} required max={today} className={inputClass} />
        <p className="text-xs text-gray-400 mt-1">正確な日付が不明な場合はおおよその日付で構いません</p>
      </div>

      {/* 体重・性別 */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>体重（kg）*</label>
          <input type="number" name="weight" value={form.weight} onChange={handleChange} required min="0" step="0.1" placeholder="例：5.2" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>性別 *</label>
          <select name="gender" value={form.gender} onChange={handleChange} required className={inputClass}>
            {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
      </div>

      {/* 測定日 */}
      <div>
        <label className={labelClass}>測定日 *</label>
        <input type="date" value={measuredDate} onChange={(e) => setMeasuredDate(e.target.value)} required max={today} className={inputClass} />
      </div>

      {/* 温度（室温） */}
      <div>
        <label className={labelClass}>温度（室温・℃）*</label>
        <input type="number" name="room_temperature" value={form.room_temperature} onChange={handleChange} required step="0.1" placeholder="例：24.5" className={inputClass} />
      </div>

      {/* 呼吸数 */}
      <div>
        <label className={labelClass}>呼吸数（回/分）*</label>
        <input type="number" name="breathing_rate" value={form.breathing_rate} onChange={handleChange} required min="0" step="1" placeholder="例：22" className={inputClass} />
      </div>

      {/* 睡眠中・平常時 */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="is_sleeping" checked={form.is_sleeping} onChange={handleCheckbox} className="accent-blue-600 w-4 h-4" />
          <span className="text-sm">睡眠中に測定した</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="after_toilet" checked={form.after_toilet} onChange={handleCheckbox} className="accent-blue-600 w-4 h-4" />
          <span className="text-sm">平常時（※トイレ後等の落ち着いた状態）</span>
        </label>
      </div>

      {/* 備考 */}
      <div>
        <label className={labelClass}>備考</label>
        <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} placeholder="任意" className={inputClass} />
      </div>

      {errorMsg && <p className="text-red-600 text-sm bg-red-50 p-2 rounded-lg">{errorMsg}</p>}

      <button type="submit" disabled={status === 'submitting'} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition">
        {status === 'submitting' ? '送信中...' : '記録する'}
      </button>
    </form>
  );
}
