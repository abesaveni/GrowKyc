import React, { useState } from 'react';
import { Package, TrendingUp } from 'lucide-react';
import { AssetRealisationView } from './AssetRealisationView';

type AssetTab = 'register' | 'realisation';

/** Asset register summary + full realisation workflow */
export function AssetsHub({ matterId }: { matterId?: string }) {
  const [tab, setTab] = useState<AssetTab>('realisation');

  return (
    <div className="min-h-full">
      <div className="border-b border-gray-200 bg-white px-6 pt-4">
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setTab('realisation')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 ${
              tab === 'realisation' ? 'border-red-600 text-red-700' : 'border-transparent text-gray-600'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Asset realisation
          </button>
          <button
            type="button"
            onClick={() => setTab('register')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 ${
              tab === 'register' ? 'border-red-600 text-red-700' : 'border-transparent text-gray-600'
            }`}
          >
            <Package className="w-4 h-4" />
            Register summary
          </button>
        </div>
      </div>
      {tab === 'realisation' ? (
        <AssetRealisationView matterId={matterId} />
      ) : (
        <div className="p-6 max-w-[1600px] mx-auto">
          <p className="text-gray-600 mb-4">
            High-level register view. Use <strong>Asset realisation</strong> for sale progress, agents, and value tracking.
          </p>
          <AssetRealisationView matterId={matterId} />
        </div>
      )}
    </div>
  );
}
