'use client';

import { useState } from 'react';
import RecordForm from '@/components/RecordForm';
import RecordList from '@/components/RecordList';

export default function Home() {
  const [tab, setTab] = useState<'form' | 'list'>('form');

  return (
    <main className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">🐶 呼吸数リスト</h1>

        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => setTab('form')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
              tab === 'form' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100'
            }`}
          >
            記録する
          </button>
          <button
            onClick={() => setTab('list')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
              tab === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100'
            }`}
          >
            一覧・フィルター
          </button>
        </div>

        {tab === 'form' ? (
          <div className="max-w-lg mx-auto">
            <RecordForm />
          </div>
        ) : (
          <RecordList />
        )}
      </div>
    </main>
  );
}
