import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Cookie, Settings, X } from 'lucide-react';

interface CookieSettings {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<CookieSettings>({
    necessary: true, // Always required
    functional: true,
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      // Show banner after 2 seconds
      setTimeout(() => setShowBanner(true), 2000);
    } else {
      // Load saved preferences
      const savedSettings = JSON.parse(consent);
      setSettings(savedSettings);
      applyCookieSettings(savedSettings);
    }
  }, []);

  const handleAcceptAll = () => {
    const allSettings = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    saveConsent(allSettings);
  };

  const handleRejectAll = () => {
    const minimalSettings = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    saveConsent(minimalSettings);
  };

  const handleSaveSettings = () => {
    saveConsent(settings);
  };

  const saveConsent = (cookieSettings: CookieSettings) => {
    localStorage.setItem('cookie_consent', JSON.stringify(cookieSettings));
    localStorage.setItem('cookie_consent_date', new Date().toISOString());
    applyCookieSettings(cookieSettings);
    setShowBanner(false);
    setShowSettings(false);
  };

  const applyCookieSettings = (cookieSettings: CookieSettings) => {
    // Enable/disable analytics based on consent
    if (cookieSettings.analytics) {
      // Initialize Google Analytics, Mixpanel, etc.
    } else {
      // Disable analytics
    }

    // Enable/disable marketing cookies
    if (cookieSettings.marketing) {
    } else {
    }
  };

  if (!showBanner) return null;

  if (showSettings) {
    return (
      <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6 text-slate-300" />
              <h2 className="text-xl font-bold text-slate-100">Cookie Preferences</h2>
            </div>
            <button
              onClick={() => setShowSettings(false)}
              className="text-gray-400 hover:text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <p className="text-sm text-slate-300">
              We use cookies to enhance your experience, analyze site usage, and assist in our marketing efforts. 
              You can customize your cookie preferences below.
            </p>

            {/* Necessary Cookies */}
            <CookieCategory
              title="Necessary Cookies"
              description="Required for the platform to function. These cannot be disabled."
              enabled={settings.necessary}
              locked={true}
              onChange={() => {}}
            />

            {/* Functional Cookies */}
            <CookieCategory
              title="Functional Cookies"
              description="Remember your preferences and settings for a personalized experience."
              enabled={settings.functional}
              onChange={(checked) => setSettings({ ...settings, functional: checked })}
            />

            {/* Analytics Cookies */}
            <CookieCategory
              title="Analytics Cookies"
              description="Help us understand how you use our platform so we can improve it."
              enabled={settings.analytics}
              onChange={(checked) => setSettings({ ...settings, analytics: checked })}
            />

            {/* Marketing Cookies */}
            <CookieCategory
              title="Marketing Cookies"
              description="Used to show you relevant ads and measure campaign effectiveness."
              enabled={settings.marketing}
              onChange={(checked) => setSettings({ ...settings, marketing: checked })}
            />
          </div>

          <div className="p-6 border-t border-white/10 flex gap-3">
            <Button
              onClick={handleSaveSettings}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Save Preferences
            </Button>
            <Button
              onClick={() => setShowSettings(false)}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>

          <div className="px-6 pb-6">
            <p className="text-xs text-slate-400">
              For more information, read our{' '}
              <a href="/privacy" className="text-blue-400 hover:underline">Privacy Policy</a>
              {' '}and{' '}
              <a href="/cookie-policy" className="text-blue-400 hover:underline">Cookie Policy</a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t-2 border-white/10 shadow-2xl">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Cookie className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-slate-100 mb-1">We value your privacy</h3>
              <p className="text-sm text-slate-300">
                We use cookies to enhance your experience, provide secure login, and analyze our traffic. 
                By clicking "Accept All", you consent to our use of cookies. View our{' '}
                <a href="/privacy" className="text-blue-400 hover:underline font-medium">
                  Privacy Policy
                </a>
                {' '}and{' '}
                <a href="/cookie-policy" className="text-blue-400 hover:underline font-medium">
                  Cookie Policy
                </a>
                {' '}for details.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <Button
              onClick={handleAcceptAll}
              className="bg-blue-600 hover:bg-blue-700 text-white flex-1 md:flex-none"
            >
              Accept All
            </Button>
            <Button
              onClick={handleRejectAll}
              variant="outline"
              className="flex-1 md:flex-none"
            >
              Reject All
            </Button>
            <Button
              onClick={() => setShowSettings(true)}
              variant="outline"
              className="flex items-center gap-2 flex-1 md:flex-none"
            >
              <Settings className="w-4 h-4" />
              Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CookieCategory({
  title,
  description,
  enabled,
  locked = false,
  onChange,
}: {
  title: string;
  description: string;
  enabled: boolean;
  locked?: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-4 p-4 bg-white/5 border border-white/10 rounded-lg">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-semibold text-slate-100">{title}</h4>
          {locked && (
            <span className="px-2 py-0.5 text-xs font-semibold bg-white/10 text-slate-300 rounded">
              Required
            </span>
          )}
        </div>
        <p className="text-sm text-slate-300">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => onChange(e.target.checked)}
          disabled={locked}
          className="sr-only peer"
        />
        <div className={`w-11 h-6 rounded-full peer peer-checked:bg-blue-600 ${
          locked ? 'bg-gray-300' : 'bg-white/10'
        } peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all`}>
        </div>
      </label>
    </div>
  );
}
