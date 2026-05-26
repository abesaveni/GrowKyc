import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { GrowKYC } from './grow-kyc/GrowKYC';
import { AuthProvider } from '../../context/AuthContext';
import { RoleBasedRedirect } from '../../components/RoleBasedRedirect';

export function GrowKYCApp() {
  return (
    <AuthProvider>
      <Routes>
        {/* Main home route rendering the role selection/ExecutiveOverview */}
        <Route path="/" element={<GrowKYC />} />

        {/* Dashboard Routes mapping directly to GrowKYC internal routes */}
        <Route path="/:role/*" element={<GrowKYC />} />
        
        {/* Catch-all route to prevent blank pages or 404s */}
        <Route path="/*" element={<GrowKYC />} />
      </Routes>
    </AuthProvider>
  );
}