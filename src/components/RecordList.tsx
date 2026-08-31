'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { BreathingRecord, Filters } from '@/lib/types';
import { EMPTY_FILTERS } from '@/lib/types';
import { enrichRecords, applyFilters } from '@/lib/filters';
import FilterPanel from './FilterPanel';
import DataTable from './DataTable';

export default function RecordList() {
  const [records, setRecords] = useState<BreathingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);

  const load = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from('breathing_records')
      .select('*')
      .order('measured_date', { ascending: false })
      .order('created_at', { ascending: false });
    if (error) {
      setErrorMsg('データ取得に失敗しました: ' + error.message);
    } else {
      setErrorMsg('');
      setRecords((data ?? []) as BreathingRecord[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const enriched = useMemo(() => enrichRecords(records), [records]);
  const filtered = useMemo(() => applyFilters(enriched, filters), [enriched, filters]);
  const availableBreeds = useMemo(
    () => Array.from(new Set(records.map((r) => r.dog_breed))).sort(),
    [records]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
      <FilterPanel
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(EMPTY_FILTERS)}
        availableBreeds={availableBreeds}
      />
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-gray-700">記録一覧</h3>
          <button onClick={load} className="text-xs text-blue-500 hover:underline">
            {loading ? '更新中...' : '再読み込み'}
          </button>
        </div>
        {errorMsg && <p className="text-red-600 text-sm bg-red-50 p-2 rounded-lg mb-3">{errorMsg}</p>}
        {loading ? (
          <p className="text-center text-gray-400 py-12">読み込み中...</p>
        ) : (
          <DataTable records={filtered} onMutate={load} />
        )}
      </div>
    </div>
  );
}
