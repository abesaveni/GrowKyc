import React, { useState } from 'react';
import { PublicHeader } from './PublicHeader';
import { PublicFooter } from './PublicFooter';
import { FeaturesPage } from './FeaturesPage';
import { AboutPage } from './AboutPage';
import { ContactPage } from './ContactPage';

type PublicPage = 'home' | 'features' | 'modules' | 'pricing' | 'about' | 'contact' | 'login' | 'signup';

interface PublicSiteProps {
  onNavigate: (destination: string) => void;
}

export function PublicSite({ onNavigate }: PublicSiteProps) {
  const [currentPage, setCurrentPage] = useState<PublicPage>('home');

  const handleNavigation = (page: string) => {
    if (page === 'login' || page === 'signup') {
      onNavigate(page);
    } else {
      setCurrentPage(page as PublicPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <FeaturesPage onNavigate={handleNavigation} />;
      case 'features':
        return <FeaturesPage onNavigate={handleNavigation} />;
      case 'modules':
        return <FeaturesPage onNavigate={handleNavigation} />;
      case 'pricing':
        return <FeaturesPage onNavigate={handleNavigation} />;
      case 'about':
        return <AboutPage onNavigate={handleNavigation} />;
      case 'contact':
        return <ContactPage />;
      default:
        return <FeaturesPage onNavigate={handleNavigation} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader onNavigate={handleNavigation} currentPage={currentPage} />
      <main className="flex-1">
        {renderPage()}
      </main>
      <PublicFooter onNavigate={handleNavigation} />
    </div>
  );
}