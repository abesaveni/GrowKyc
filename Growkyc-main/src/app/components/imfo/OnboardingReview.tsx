import React from 'react';

interface OnboardingReviewProps {
  onNavigate: (page: string) => void;
  role: string;
}

export function OnboardingReview({ onNavigate, role }: OnboardingReviewProps) {
  return (
    <div className="p-6">
      <div className="bg-white rounded-lg border border-gray-300 p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Onboarding Review Queue</h2>
        <p className="text-gray-600">Compliance review queue for pending investor onboarding applications</p>
      </div>
    </div>
  );
}
