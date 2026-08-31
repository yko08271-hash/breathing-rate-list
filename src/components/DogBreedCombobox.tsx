'use client';

import { useState, useRef, useEffect } from 'react';
import { DOG_BREED_GROUPS, DOG_BREEDS } from '@/data/dogBreeds';

interface Props {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export default function DogBreedCombobox({ value, onChange, required }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        inputRef.current && !inputRef.current.parentElement?.contains(e.target as Node)
      ) {
        setOpen(false);
        setQuery('');
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleSelect(breed: string) {
    onChange(breed);
    setOpen(false);
    setQuery('');
  }

  function handleClear() {
    onChange('');
    setQuery('');
  }

  const filteredGroups = query.trim()
    ? [{ label: '検索結果', breeds: DOG_BREEDS.filter((b) => b.includes(query.trim())) }]
    : DOG_BREED_GROUPS;

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <div className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm flex items-center justify-between bg-white focus-within:ring-2 focus-within:ring-blue-400">
          <input
            ref={inputRef}
            type="text"
            value={open ? query : value}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            placeholder="犬種を検索または▼一覧から選択..."
            className="w-full outline-none text-sm bg-transparent placeholder-gray-400"
            autoComplete="off"
          />
          {value && (
            <button type="button" onClick={handleClear} className="text-gray-400 hover:text-gray-600 ml-1 flex-shrink-0">
              ✕
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white hover:bg-gray-50 text-gray-600 flex-shrink-0"
        >
          ▼ 一覧
        </button>
      </div>

      <input
        type="text"
        value={value}
        onChange={() => {}}
        required={required}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />

      {open && (
        <div
          ref={panelRef}
          className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-72 overflow-y-auto"
        >
          {filteredGroups.every((g) => g.breeds.length === 0) ? (
            <div className="px-4 py-6 text-center text-gray-400 text-sm">
              「{query}」は見つかりません
            </div>
          ) : (
            filteredGroups.map((group) =>
              group.breeds.length === 0 ? null : (
                <div key={group.label}>
                  <div className="sticky top-0 bg-gray-100 px-3 py-1 text-xs font-bold text-gray-500 border-b border-gray-200">
                    {group.label}
                  </div>
                  <div className="flex flex-wrap gap-1.5 p-2">
                    {group.breeds.map((breed) => (
                      <button
                        key={breed}
                        type="button"
                        onClick={() => handleSelect(breed)}
                        className={`text-sm px-2.5 py-1 rounded-full border transition ${
                          value === breed
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-400'
                        }`}
                      >
                        {breed}
                      </button>
                    ))}
                  </div>
                </div>
              )
            )
          )}
        </div>
      )}
    </div>
  );
}
