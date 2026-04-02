import React, { useState } from 'react';
import { PublicHeader } from './PublicHeader';
import { PublicFooter } from './PublicFooter';
import { FeaturesPage } from './FeaturesPage';

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
        return <AboutPlaceholder onNavigate={handleNavigation} />;
      case 'contact':
        return <ContactPlaceholder onNavigate={handleNavigation} />;
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

// Placeholder components (to be built later)
function AboutPlaceholder({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="py-20 text-center">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-4">About Grow Platform</h1>
        <p className="text-xl text-gray-600 mb-8">
          We're building the future of financial operations software. Stay tuned for more!
        </p>
        <button
          onClick={() => onNavigate('home')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

function ContactPlaceholder({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="py-20">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="How can we help you?"
              />
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}