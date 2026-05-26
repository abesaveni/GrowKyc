import React from 'react';
import { Button } from './ui/button';
import { FileCheck } from 'lucide-react';

interface TestButtonProps {
  onClick: () => void;
}

export function TestButton({ onClick }: TestButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-4 right-4 z-50 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl px-6 py-6 rounded-full flex items-center gap-2 text-lg font-bold animate-pulse"
      title="Test 100-Point ID Verification System"
    >
      <FileCheck className="w-6 h-6" />
      <span>Test ID System</span>
    </Button>
  );
}
