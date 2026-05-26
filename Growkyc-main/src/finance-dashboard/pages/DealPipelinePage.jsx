import React, { useEffect, useState } from 'react';
import { fetchMock } from '../utils/fetchMock';
import { formatCurrency, formatDate } from '../utils/format';
import { getInitialDeals, PIPELINE_STAGES } from '../data/dealPipelineData';

function DealCard({ deal, onDragStart }) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, deal.id)}
      className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm cursor-grab active:cursor-grabbing hover:border-indigo-300 transition-colors"
    >
      <p className="font-semibold text-gray-900 text-sm">{deal.name}</p>
      <p className="text-sm text-indigo-700 font-medium mt-1">{formatCurrency(deal.amount)}</p>
      <p className="text-xs text-gray-600 mt-2">Borrower: {deal.borrower}</p>
      <p className="text-xs text-gray-500 mt-1">Close: {formatDate(deal.closeDate)}</p>
    </div>
  );
}

export function DealPipelinePage() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draggingId, setDraggingId] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchMock(() => getInitialDeals()).then((data) => {
      setDeals(data);
      setLoading(false);
    });
  }, []);

  const handleDragStart = (e, dealId) => {
    e.dataTransfer.setData('text/plain', dealId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggingId(dealId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, stage) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('text/plain');
    setDraggingId(null);
    setDeals((prev) =>
      prev.map((d) => (d.id === dealId ? { ...d, stage } : d))
    );
  };

  const dealsByStage = (stage) => deals.filter((d) => d.stage === stage);

  return (
    <div className="p-6 space-y-6 max-w-[1800px] mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Deal Pipeline</h2>
        <p className="text-gray-600 mt-1">Drag deals between stages to update pipeline status.</p>
      </div>

      {loading ? (
        <p className="text-gray-500 py-12 text-center">Loading pipeline…</p>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4 min-h-[480px]">
          {PIPELINE_STAGES.map((stage) => (
            <div
              key={stage}
              className="flex-shrink-0 w-72 bg-slate-100 rounded-xl border border-gray-200"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage)}
            >
              <div className="p-3 border-b border-gray-200 bg-white rounded-t-xl">
                <h3 className="font-semibold text-gray-900 text-sm">{stage}</h3>
                <p className="text-xs text-gray-500">{dealsByStage(stage).length} deals</p>
              </div>
              <div className="p-3 space-y-3 min-h-[400px]">
                {dealsByStage(stage).map((deal) => (
                  <DealCard
                    key={deal.id}
                    deal={deal}
                    onDragStart={handleDragStart}
                  />
                ))}
                {dealsByStage(stage).length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-8">Drop deals here</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {draggingId && (
        <p className="text-xs text-indigo-600 text-center">Dragging deal — release on a column to move stage</p>
      )}
    </div>
  );
}
