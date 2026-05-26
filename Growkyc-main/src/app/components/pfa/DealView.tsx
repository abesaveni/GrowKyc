import React from 'react';
import { EnhancedDealView } from './EnhancedDealView';

interface DealViewProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

export function DealView({ onNavigate, onBack }: DealViewProps) {
  // Use the enhanced version with full property images, maps, and security details
  return <EnhancedDealView onNavigate={onNavigate} onBack={onBack} />;
}