import React, { useState } from 'react';
import svgPaths from "./svg-cgx17yfs5v";
import imgPrimaryLogoGrow260X1043 from "../assets/a47dcf28a3997c763da9c73c54846d4fd7deaf00.png";

interface SignInProps {
  onSuccess?: () => void;
}

function EyeOffIcon({ onClick }: { onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className="shrink-0 size-[16px] cursor-pointer text-[#9ca3af] hover:text-[#5a6a76] transition-colors">
      <svg fill="none" viewBox="0 0 16.4324 15" className="size-full">
        <g>
          <path d="M1.46618 0.75L14.9662 14.25" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path clipRule="evenodd" d={svgPaths.p303ccb2} fill="currentColor" fillRule="evenodd" />
        </g>
      </svg>
    </button>
  );
}

function EyeOnIcon({ onClick }: { onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className="shrink-0 size-[16px] cursor-pointer text-[#9ca3af] hover:text-[#5a6a76] transition-colors">
      <svg fill="none" viewBox="0 0 18 18" className="size-full">
        <path d="M9 3.75C5.25 3.75 2.025 6.075 0.75 9C2.025 11.925 5.25 14.25 9 14.25C12.75 14.25 15.975 11.925 17.25 9C15.975 6.075 12.75 3.75 9 3.75ZM9 12.75C6.9225 12.75 5.25 11.0775 5.25 9C5.25 6.9225 6.9225 5.25 9 5.25C11.0775 5.25 12.75 6.9225 12.75 9C12.75 11.0775 11.0775 12.75 9 12.75ZM9 6.75C7.7475 6.75 6.75 7.7475 6.75 9C6.75 10.2525 7.7475 11.25 9 11.25C10.2525 11.25 11.25 10.2525 11.25 9C11.25 7.7475 10.2525 6.75 9 6.75Z" fill="currentColor" />
      </svg>
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg className="shrink-0 size-[18px]" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg className="shrink-0 size-[18px]" viewBox="0 0 24 24" fill="none">
      <path d="M12 11.5H3V3.5H12V11.5Z" fill="#F1511B"/>
      <path d="M22 11.5H13V3.5H22V11.5Z" fill="#80CC28"/>
      <path d="M12 21.5H3V12.5H12V21.5Z" fill="#00ADEF"/>
      <path d="M22 21.5H13V12.5H22V21.5Z" fill="#FBBC09"/>
    </svg>
  );
}

const STAT_BARS = [
  { h: 44, label: 'Jan' }, { h: 52, label: 'Feb' }, { h: 60, label: 'Mar' },
  { h: 80, label: 'Apr', active: true }, { h: 56, label: 'May' },
  { h: 72, label: 'Jun' }, { h: 48, label: 'Jul' }, { h: 64, label: 'Aug' },
];

export default function SignIn({ onSuccess }: SignInProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [oauthLoading, setOauthLoading] = useState<'google' | 'microsoft' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) { setError('Please enter your email and password.'); return; }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.detail || 'Invalid email or password. Please try again.');
        return;
      }
      sessionStorage.setItem('growkyc_token', data.access_token);
      sessionStorage.setItem('growkyc_user', JSON.stringify(data.user));
      onSuccess?.();
    } catch {
      setError('Unable to connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'microsoft') => {
    setError(`${provider === 'google' ? 'Google' : 'Microsoft'} sign-in is not yet configured.`);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0a0e17] text-slate-200">

      {/* ── Left panel (form) ── */}
      <div className="flex flex-col justify-between w-[46%] min-w-[420px] h-full bg-[#0d121d] border-r border-white/5 px-12 py-8">

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-lg bg-gradient-to-br from-[#13B5EA] to-[#0E7C9E] flex items-center justify-center shadow-lg shadow-[#13B5EA]/20">
            <svg viewBox="0 0 24 24" className="size-5 text-white" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L4 5v6c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V5l-8-3z" strokeLinejoin="round"/></svg>
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-white">Grow KYC</span>
        </div>

        {/* Form centred vertically */}
        <div className="flex flex-col gap-5 w-full max-w-[400px] mx-auto">
          <div className="mb-1">
            <h1 className="text-[24px] font-semibold text-white tracking-tight">Welcome back</h1>
            <p className="text-[13px] text-slate-400 mt-1.5">Sign in to your compliance workspace.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-[12px] font-medium text-slate-400">Email address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@organisation.com.au"
                autoComplete="email"
                required
                className="h-[44px] w-full rounded-lg border border-white/10 bg-white/[0.03] px-3.5 text-[13px] text-white placeholder:text-slate-500 outline-none focus:border-[#13B5EA] focus:ring-2 focus:ring-[#13B5EA]/20 transition-all"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-[12px] font-medium text-slate-400">Password</label>
                <button type="button" className="text-[12px] text-[#13B5EA] hover:text-[#3fc7f5] font-medium transition-colors">Forgot password?</button>
              </div>
              <div className="h-[44px] w-full rounded-lg border border-white/10 bg-white/[0.03] flex items-center px-3.5 gap-2 focus-within:border-[#13B5EA] focus-within:ring-2 focus-within:ring-[#13B5EA]/20 transition-all">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="flex-1 bg-transparent text-[13px] text-white placeholder:text-slate-500 outline-none"
                />
                {showPassword
                  ? <EyeOnIcon onClick={() => setShowPassword(false)} />
                  : <EyeOffIcon onClick={() => setShowPassword(true)} />
                }
              </div>
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2 cursor-pointer w-fit">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="size-[14px] rounded border-white/20 bg-transparent accent-[#13B5EA] cursor-pointer"
              />
              <span className="text-[13px] text-slate-400">Remember me for 30 days</span>
            </label>

            {/* Error */}
            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-[12px] px-3.5 py-2.5 leading-relaxed">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="h-[44px] w-full rounded-lg bg-gradient-to-r from-[#13B5EA] to-[#0E9BCC] text-white text-[13px] font-semibold tracking-wide hover:from-[#28c0f0] hover:to-[#13a6d8] active:opacity-90 disabled:opacity-60 transition-all shadow-lg shadow-[#13B5EA]/20"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[12px] text-slate-500 font-medium">or continue with</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* OAuth */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleOAuth('google')}
              disabled={!!oauthLoading}
              className="h-[42px] flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] text-[13px] text-slate-300 font-medium hover:bg-white/[0.06] active:bg-white/[0.08] disabled:opacity-60 transition-colors"
            >
              <GoogleIcon />
              {oauthLoading === 'google' ? 'Redirecting…' : 'Google'}
            </button>
            <button
              type="button"
              onClick={() => handleOAuth('microsoft')}
              disabled={!!oauthLoading}
              className="h-[42px] flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] text-[13px] text-slate-300 font-medium hover:bg-white/[0.06] active:bg-white/[0.08] disabled:opacity-60 transition-colors"
            >
              <MicrosoftIcon />
              {oauthLoading === 'microsoft' ? 'Redirecting…' : 'Microsoft'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span>© {new Date().getFullYear()} Grow Advisory Group</span>
          <div className="flex items-center gap-3">
            <button type="button" className="hover:text-slate-300 transition-colors">Privacy Policy</button>
            <span>·</span>
            <button type="button" className="hover:text-slate-300 transition-colors">Terms of Use</button>
          </div>
        </div>
      </div>

      {/* ── Right panel (showcase) ── */}
      <div className="flex-1 h-full relative overflow-hidden flex flex-col justify-between p-12 bg-gradient-to-br from-[#0d121d] via-[#0f1b2d] to-[#0a1622]">

        {/* Decorative glow */}
        <div className="absolute -top-32 -right-24 w-[28rem] h-[28rem] rounded-full bg-[#13B5EA]/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 w-[24rem] h-[24rem] rounded-full bg-[#0E7C9E]/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

        {/* Headline */}
        <div className="relative z-10 flex flex-col gap-4 mt-8">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 w-fit">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 text-[12px] font-medium tracking-wide">Trusted by Australian Financial Services</span>
          </div>
          <h2 className="text-white text-[38px] font-bold leading-[1.1] tracking-tight">
            Australia's leading<br /><span className="bg-gradient-to-r from-[#13B5EA] to-[#5eead4] bg-clip-text text-transparent">compliance platform</span>
          </h2>
          <p className="text-slate-400 text-[14px] leading-relaxed max-w-sm">
            Streamline KYC onboarding, AML/CTF screening, and regulatory reporting with AI-powered automation.
          </p>
        </div>

        {/* Analytics card (dark glass) */}
        <div className="relative z-10 bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[14px] font-semibold text-white">Compliance Overview</p>
              <p className="text-[12px] text-slate-400 mt-0.5">Monthly verification performance</p>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[11px] text-emerald-300 font-semibold">98.4% pass rate</span>
            </div>
          </div>

          {/* Bar chart */}
          <div className="flex items-end gap-2 h-[88px] mb-2">
            {STAT_BARS.map((bar) => (
              <div key={bar.label} className="flex flex-col items-center gap-1 flex-1">
                <div
                  className={`w-full rounded-md transition-all ${bar.active ? 'bg-gradient-to-t from-[#0E7C9E] to-[#13B5EA]' : 'bg-white/10'}`}
                  style={{ height: `${bar.h}px` }}
                />
                <span className="text-[10px] text-slate-500 font-medium">{bar.label}</span>
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/10">
            <div>
              <p className="text-[18px] font-bold text-white">12,847</p>
              <p className="text-[11px] text-slate-500">Verifications</p>
            </div>
            <div>
              <p className="text-[18px] font-bold text-white">99.1%</p>
              <p className="text-[11px] text-slate-500">Uptime SLA</p>
            </div>
            <div>
              <p className="text-[18px] font-bold text-white">{'<2s'}</p>
              <p className="text-[11px] text-slate-500">Avg. response</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
