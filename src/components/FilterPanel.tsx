'use client';

import type { Filters } from '@/lib/types';
import { GENDERS } from '@/lib/types';
import { DOG_BREEDS } from '@/data/dogBreeds';

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
  onReset: () => void;
  availableBreeds: string[];
}

export default function FilterPanel({ filters, onChange, onReset, availableBreeds }: Props) {
  function set<K extends keyof Filters>(key: K, value: Filters[K]) {
    onChange({ ...filters, [key]: value });
  }

  function toggleArray(key: 'breeds' | 'genders', value: string) {
    const arr = filters[key];
    const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
    set(key, next);
  }

  const inputClass = 'w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400';
  const rangeClass = 'flex items-center gap-1';
  const breedOptions = availableBreeds.length > 0 ? availableBreeds : DOG_BREEDS;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-700">フィルタ</h3>
        <button onClick={onReset} className="text-xs text-blue-500 hover:underline">リセット</button>
      </div>

      {/* 犬名 */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">犬名</label>
        <input type="text" value={filters.dogName} onChange={(e) => set('dogName', e.target.value)} placeholder="部分一致" className={inputClass} />
      </div>

      {/* 犬種 */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">犬種</label>
        <select
          multiple
          value={filters.breeds}
          onChange={(e) => set('breeds', Array.from(e.target.selectedOptions, (o) => o.value))}
          className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
          size={4}
        >
          {breedOptions.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
        <p className="text-xs text-gray-400 mt-1">Ctrl/⌘クリックで複数選択</p>
      </div>

      {/* 性別 */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">性別</label>
        <div className="flex gap-3 flex-wrap">
          {GENDERS.map((g) => (
            <label key={g} className="flex items-center gap-1 text-sm cursor-pointer">
              <input type="checkbox" checked={filters.genders.includes(g)} onChange={() => toggleArray('genders', g)} className="accent-blue-600" />
              {g}
            </label>
          ))}
        </div>
      </div>

      {/* 年齢 */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">年齢（歳）</label>
        <div className={rangeClass}>
          <input type="number" value={filters.ageFrom} onChange={(e) => set('ageFrom', e.target.value)} placeholder="から" min="0" className={inputClass} />
          <span className="text-gray-400 text-sm">〜</span>
          <input type="number" value={filters.ageTo} onChange={(e) => set('ageTo', e.target.value)} placeholder="まで" min="0" className={inputClass} />
        </div>
      </div>

      {/* 体重 */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">体重（kg）</label>
        <div className={rangeClass}>
          <input type="number" value={filters.weightFrom} onChange={(e) => set('weightFrom', e.target.value)} placeholder="から" min="0" step="0.1" className={inputClass} />
          <span className="text-gray-400 text-sm">〜</span>
          <input type="number" value={filters.weightTo} onChange={(e) => set('weightTo', e.target.value)} placeholder="まで" min="0" step="0.1" className={inputClass} />
        </div>
      </div>

      {/* 測定日 */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">測定日</label>
        <div className="space-y-1">
          <input type="date" value={filters.dateFrom} onChange={(e) => set('dateFrom', e.target.value)} className={inputClass} />
          <div className="text-center text-gray-400 text-xs">〜</div>
          <input type="date" value={filters.dateTo} onChange={(e) => set('dateTo', e.target.value)} className={inputClass} />
        </div>
      </div>

      {/* 温度 */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">温度（室温・℃）</label>
        <div className={rangeClass}>
          <input type="number" value={filters.tempFrom} onChange={(e) => set('tempFrom', e.target.value)} placeholder="から" step="0.1" className={inputClass} />
          <span className="text-gray-400 text-sm">〜</span>
          <input type="number" value={filters.tempTo} onChange={(e) => set('tempTo', e.target.value)} placeholder="まで" step="0.1" className={inputClass} />
        </div>
      </div>

      {/* 呼吸数 */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">呼吸数（回/分）</label>
        <div className={rangeClass}>
          <input type="number" value={filters.breathingFrom} onChange={(e) => set('breathingFrom', e.target.value)} placeholder="から" min="0" className={inputClass} />
          <span className="text-gray-400 text-sm">〜</span>
          <input type="number" value={filters.breathingTo} onChange={(e) => set('breathingTo', e.target.value)} placeholder="まで" min="0" className={inputClass} />
        </div>
      </div>

      {/* 睡眠中 */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">睡眠中</label>
        <div className="flex gap-3">
          {(['any', 'yes', 'no'] as const).map((v) => (
            <label key={v} className="flex items-center gap-1 text-sm cursor-pointer">
              <input type="radio" name="sleeping" checked={filters.sleeping === v} onChange={() => set('sleeping', v)} className="accent-blue-600" />
              {v === 'any' ? '指定なし' : v === 'yes' ? '睡眠中のみ' : '睡眠中以外'}
            </label>
          ))}
        </div>
      </div>

      {/* 平常時 */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">平常時</label>
        <div className="flex gap-3">
          {(['any', 'yes', 'no'] as const).map((v) => (
            <label key={v} className="flex items-center gap-1 text-sm cursor-pointer">
              <input type="radio" name="afterToilet" checked={filters.afterToilet === v} onChange={() => set('afterToilet', v)} className="accent-blue-600" />
              {v === 'any' ? '指定なし' : v === 'yes' ? '平常時のみ' : '平常時以外'}
            </label>
          ))}
        </div>
      </div>

      {/* その他 */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">その他</label>
        <div className="flex gap-3">
          {(['any', 'yes', 'no'] as const).map((v) => (
            <label key={v} className="flex items-center gap-1 text-sm cursor-pointer">
              <input type="radio" name="otherCondition" checked={filters.otherCondition === v} onChange={() => set('otherCondition', v)} className="accent-blue-600" />
              {v === 'any' ? '指定なし' : v === 'yes' ? 'その他のみ' : 'その他以外'}
            </label>
          ))}
        </div>
      </div>

      {/* 記録者 */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">記録者</label>
        <input type="text" value={filters.recordedBy} onChange={(e) => set('recordedBy', e.target.value)} placeholder="部分一致" className={inputClass} />
      </div>
    </div>
  );
}
