'use client';

import { useState } from 'react';
import type { EnrichedRecord } from '@/lib/types';
import { MIX_BREED } from '@/data/dogBreeds';
import EditDeleteForm from './EditDeleteForm';

interface Props {
  records: EnrichedRecord[];
  onMutate?: () => void;
}

export default function DataTable({ records, onMutate }: Props) {
  const [editId, setEditId] = useState<string | null>(null);
  const editRecord = records.find((r) => r.id === editId);

  function handleDone() {
    setEditId(null);
    onMutate?.();
  }

  if (records.length === 0) {
    return <div className="text-center py-12 text-gray-400">該当するデータがありません</div>;
  }

  const avgRate = Math.round(
    (records.reduce((s, r) => s + r.breathing_rate, 0) / records.length) * 10
  ) / 10;

  return (
    <div className="overflow-x-auto">
      <p className="text-sm text-gray-500 mb-2">{records.length}件　平均呼吸数: {avgRate}回/分</p>
      <table className="min-w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-2 py-2 border border-gray-200"></th>
            {[
              '測定日', '犬名', '犬種', '性別', '年齢', '体重(kg)',
              '呼吸数(回/分)', '室温(℃)', '睡眠中', '平常時', 'その他', '記録者', '備考',
            ].map((h) => (
              <th key={h} className="px-3 py-2 text-left font-medium text-gray-600 border border-gray-200 whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id} className="hover:bg-blue-50 even:bg-gray-50">
              <td className="px-2 py-2 border border-gray-200">
                <button
                  onClick={() => setEditId(r.id)}
                  className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition whitespace-nowrap"
                >
                  編集
                </button>
              </td>
              <td className="px-3 py-2 border border-gray-200 whitespace-nowrap">{r.measured_date}</td>
              <td className="px-3 py-2 border border-gray-200 min-w-[120px]">{r.dog_name}</td>
              <td className="px-3 py-2 border border-gray-200 min-w-[140px]">
                {r.dog_breed}
                {r.dog_breed === MIX_BREED && r.mix_detail && (
                  <span className="text-xs text-gray-500">（{r.mix_detail}）</span>
                )}
              </td>
              <td className="px-3 py-2 border border-gray-200 whitespace-nowrap">{r.gender}</td>
              <td className="px-3 py-2 border border-gray-200 text-right">{r.age_at_measurement}歳</td>
              <td className="px-3 py-2 border border-gray-200 text-right">{r.weight}</td>
              <td className="px-3 py-2 border border-gray-200 text-right font-medium text-blue-700">{r.breathing_rate}</td>
              <td className="px-3 py-2 border border-gray-200 text-right">{r.room_temperature}</td>
              <td className="px-3 py-2 border border-gray-200 text-center">{r.is_sleeping ? '✓' : ''}</td>
              <td className="px-3 py-2 border border-gray-200 text-center">{r.after_toilet ? '✓' : ''}</td>
              <td className="px-3 py-2 border border-gray-200 text-xs min-w-[120px]">
                {r.is_other_condition ? `✓${r.other_condition_note ? ' ' + r.other_condition_note : ''}` : ''}
              </td>
              <td className="px-3 py-2 border border-gray-200 whitespace-nowrap">{r.recorded_by}</td>
              <td className="px-3 py-2 border border-gray-200 text-xs text-gray-600 min-w-[160px]">{r.notes ?? ''}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {editId && editRecord && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">記録を編集</h2>
              <button onClick={() => setEditId(null)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <EditDeleteForm record={editRecord} onDone={handleDone} />
          </div>
        </div>
      )}
    </div>
  );
}
