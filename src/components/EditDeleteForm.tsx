'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import DogBreedCombobox from './DogBreedCombobox';
import { MIX_BREED } from '@/data/dogBreeds';
import { GENDERS, type BreathingRecord } from '@/lib/types';

type Step = 'edit' | 'success' | 'deleted';

const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

interface Props {
  record: BreathingRecord;
  onDone?: () => void;
}

export default function EditDeleteForm({ record, onDone }: Props) {
  const [step, setStep] = useState<Step>('edit');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<BreathingRecord>(record);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleCheckbox(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: checked }));
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const weight = parseFloat(String(form.weight));
    const temp = parseFloat(String(form.room_temperature));
    const rate = parseInt(String(form.breathing_rate));
    if (isNaN(weight) || weight <= 0) { setError('体重は正しい数値で入力してください'); return; }
    if (isNaN(temp)) { setError('温度（室温）は数値で入力してください'); return; }
    if (isNaN(rate) || rate < 0) { setError('呼吸数は正しい数値で入力してください'); return; }

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.from('breathing_records').update({
      dog_name: form.dog_name.trim(),
      dog_breed: form.dog_breed,
      mix_detail: form.dog_breed === MIX_BREED ? (form.mix_detail?.trim() || null) : null,
      birth_date: form.birth_date,
      weight,
      gender: form.gender,
      measured_date: form.measured_date,
      room_temperature: temp,
      is_sleeping: form.is_sleeping,
      after_toilet: form.after_toilet,
      is_other_condition: form.is_other_condition,
      other_condition_note: form.is_other_condition ? (form.other_condition_note?.trim() || null) : null,
      breathing_rate: rate,
      recorded_by: form.recorded_by.trim(),
      notes: form.notes?.trim() || null,
    }).eq('id', form.id);

    setLoading(false);
    if (updateError) { setError('更新に失敗しました: ' + updateError.message); }
    else { setStep('success'); onDone?.(); }
  }

  async function handleDelete() {
    setLoading(true);
    const supabase = createClient();
    const { error: deleteError } = await supabase.from('breathing_records').delete().eq('id', form.id);
    setLoading(false);
    if (deleteError) { setError('削除に失敗しました: ' + deleteError.message); }
    else { setStep('deleted'); onDone?.(); }
  }

  if (step === 'success') {
    return (
      <div className="text-center py-4">
        <div className="text-4xl mb-2">✅</div>
        <p className="font-bold text-green-600">更新しました</p>
      </div>
    );
  }

  if (step === 'deleted') {
    return (
      <div className="text-center py-4">
        <div className="text-4xl mb-2">🗑️</div>
        <p className="font-bold text-gray-600">削除しました</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleUpdate} className="space-y-4">
      <div>
        <label className={labelClass}>記録者名 *</label>
        <input type="text" name="recorded_by" value={form.recorded_by} onChange={handleChange} required className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>犬名 *</label>
        <input type="text" name="dog_name" value={form.dog_name} onChange={handleChange} required className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>犬種 *</label>
        <DogBreedCombobox value={form.dog_breed} onChange={(v) => setForm((prev) => ({ ...prev, dog_breed: v }))} required />
        {form.dog_breed === MIX_BREED && (
          <input
            type="text"
            name="mix_detail"
            value={form.mix_detail ?? ''}
            onChange={handleChange}
            placeholder="何犬と何犬のミックスか（任意・不明な場合は空欄でOK）"
            className={inputClass + ' mt-2'}
          />
        )}
      </div>
      <div>
        <label className={labelClass}>年齢（生年月日）*</label>
        <input type="date" name="birth_date" value={form.birth_date} onChange={handleChange} required className={inputClass} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>体重（kg）*</label>
          <input type="number" name="weight" value={String(form.weight)} onChange={handleChange} required min="0" step="0.1" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>性別 *</label>
          <select name="gender" value={form.gender} onChange={handleChange} required className={inputClass}>
            {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className={labelClass}>測定日 *</label>
        <input type="date" name="measured_date" value={form.measured_date} onChange={handleChange} required className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>温度（室温・℃）*</label>
        <input type="number" name="room_temperature" value={String(form.room_temperature)} onChange={handleChange} required step="0.1" className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>呼吸数（回/分）*</label>
        <input type="number" name="breathing_rate" value={String(form.breathing_rate)} onChange={handleChange} required min="0" step="1" className={inputClass} />
      </div>
      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="is_sleeping" checked={form.is_sleeping} onChange={handleCheckbox} className="accent-blue-600 w-4 h-4" />
          <span className="text-sm">睡眠中に測定した</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="after_toilet" checked={form.after_toilet} onChange={handleCheckbox} className="accent-blue-600 w-4 h-4" />
          <span className="text-sm">トイレ後に測定した</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="is_other_condition" checked={form.is_other_condition} onChange={handleCheckbox} className="accent-blue-600 w-4 h-4" />
          <span className="text-sm">その他</span>
        </label>
        {form.is_other_condition && (
          <input
            type="text"
            name="other_condition_note"
            value={form.other_condition_note ?? ''}
            onChange={handleChange}
            placeholder="内容を入力（任意）"
            className={inputClass + ' mt-1'}
          />
        )}
      </div>
      <div>
        <label className={labelClass}>備考</label>
        <textarea name="notes" value={form.notes ?? ''} onChange={handleChange} rows={2} className={inputClass} />
      </div>

      {error && <p className="text-red-600 text-sm bg-red-50 p-2 rounded-lg">{error}</p>}

      <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition">
        {loading ? '更新中...' : '更新する'}
      </button>

      {!showDeleteConfirm ? (
        <button type="button" onClick={() => setShowDeleteConfirm(true)} className="w-full bg-white border border-red-400 text-red-500 py-2 rounded-lg hover:bg-red-50 transition">
          この記録を削除する
        </button>
      ) : (
        <div className="border border-red-300 rounded-lg p-4 bg-red-50 space-y-2">
          <p className="text-sm font-medium text-red-700 text-center">本当に削除しますか？（元に戻せません）</p>
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowDeleteConfirm(false)} className="flex-1 bg-white border border-gray-300 py-2 rounded-lg text-sm">キャンセル</button>
            <button type="button" onClick={handleDelete} disabled={loading} className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm hover:bg-red-700 disabled:opacity-50 transition">
              {loading ? '削除中...' : '削除する'}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
