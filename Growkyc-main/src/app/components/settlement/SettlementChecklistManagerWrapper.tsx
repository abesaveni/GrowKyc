import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { SettlementChecklistManager } from './SettlementChecklistManager';

interface SettlementChecklistManagerWrapperProps {
  caseData: any;
}

export function SettlementChecklistManagerWrapper({ caseData }: SettlementChecklistManagerWrapperProps) {
  return (
    <DndProvider backend={HTML5Backend}>
      <SettlementChecklistManager caseData={caseData} />
    </DndProvider>
  );
}
