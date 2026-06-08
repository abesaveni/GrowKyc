import React, { useState } from 'react';
import svgPaths from "./svg-cgx17yfs5v";
import imgPrimaryLogoGrow260X1043 from "../assets/a47dcf28a3997c763da9c73c54846d4fd7deaf00.png";
import { signIn, signInWithOAuth } from '../lib/auth';

function FormHeader() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-center justify-center not-italic relative shrink-0 w-full" data-name="Form header">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#2e2e2e] text-[24px]">Sign In</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#5a6a76] text-[14px]">Welcome back! Please enter your details</p>
    </div>
  );
}

function MajesticonsEyeOff({ onClick }: { onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className="overflow-clip relative shrink-0 size-[18px] cursor-pointer" data-name="majesticons:eye-off">
      <div className="absolute inset-[12.5%_4.35%]">
        <div className="absolute inset-[-5.56%_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.4324 15">
            <g id="Group">
              <path d="M1.46618 0.75L14.9662 14.25" id="Vector" stroke="var(--stroke-0, #5A6A76)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              <path clipRule="evenodd" d={svgPaths.p303ccb2} fill="var(--fill-0, #5A6A76)" fillRule="evenodd" id="Vector_2" />
            </g>
          </svg>
        </div>
      </div>
    </button>
  );
}

function MajesticonsEyeOn({ onClick }: { onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className="overflow-clip relative shrink-0 size-[18px] cursor-pointer" data-name="majesticons:eye-on">
      <svg className="block size-full" fill="none" viewBox="0 0 18 18">
        <path d="M9 3.75C5.25 3.75 2.025 6.075 0.75 9C2.025 11.925 5.25 14.25 9 14.25C12.75 14.25 15.975 11.925 17.25 9C15.975 6.075 12.75 3.75 9 3.75ZM9 12.75C6.9225 12.75 5.25 11.0775 5.25 9C5.25 6.9225 6.9225 5.25 9 5.25C11.0775 5.25 12.75 6.9225 12.75 9C12.75 11.0775 11.0775 12.75 9 12.75ZM9 6.75C7.7475 6.75 6.75 7.7475 6.75 9C6.75 10.2525 7.7475 11.25 9 11.25C10.2525 11.25 11.25 10.2525 11.25 9C11.25 7.7475 10.2525 6.75 9 6.75Z" fill="#5A6A76" />
      </svg>
    </button>
  );
}

interface FormProps {
  onSuccess?: () => void;
}

function Form({ onSuccess }: FormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [oauthLoading, setOauthLoading] = useState<'google' | 'microsoft' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const result = await signIn(email.trim(), password);
      if (result.success) {
        onSuccess?.();
      } else {
        setError(result.error || 'Sign in failed. Please check your credentials.');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'microsoft') => {
    setOauthLoading(provider);
    try {
      const result = await signInWithOAuth(provider);
      if (!result.success) {
        setError(result.error || `Failed to sign in with ${provider}.`);
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setOauthLoading(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Form">
      <div className="content-stretch flex flex-col gap-[24px] items-start p-[44px] relative w-full">
        <FormHeader />

        {/* Email field */}
        <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
          <label className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#5a6a76] text-[14px] w-full" htmlFor="email">
            Email
          </label>
          <div className="h-[44px] relative rounded-[8px] shrink-0 w-full">
            <div aria-hidden="true" className="absolute border border-[#bdc1c5] border-solid inset-0 pointer-events-none rounded-[8px]" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
              required
              className="absolute inset-0 bg-transparent px-[16px] text-[14px] text-[#2e2e2e] rounded-[8px] outline-none w-full font-['Inter:Regular',sans-serif]"
            />
          </div>
        </div>

        {/* Password field */}
        <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
          <label className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#5a6a76] text-[14px] w-full" htmlFor="password">
            Password
          </label>
          <div className="h-[44px] relative rounded-[8px] shrink-0 w-full">
            <div aria-hidden="true" className="absolute border border-[#bdc1c5] border-solid inset-0 pointer-events-none rounded-[8px]" />
            <div className="flex flex-row items-center size-full">
              <div className="content-stretch flex items-center justify-between px-[16px] relative size-full">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="bg-transparent text-[14px] text-[#2e2e2e] outline-none flex-1 font-['Inter:Regular',sans-serif]"
                />
                {showPassword
                  ? <MajesticonsEyeOn onClick={() => setShowPassword(false)} />
                  : <MajesticonsEyeOff onClick={() => setShowPassword(true)} />
                }
              </div>
            </div>
          </div>
        </div>

        {/* Remember me + Forgot password */}
        <div className="content-stretch flex items-end justify-between pb-[12px] relative shrink-0 w-full">
          <label className="content-stretch flex gap-[8px] items-end relative shrink-0 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="relative shrink-0 size-[16px] rounded-[3.5px] border border-[#BDC1C5] cursor-pointer accent-[#2855a6]"
            />
            <span className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#2e2e2e] text-[14px]">Remember me</span>
          </label>
          <button
            type="button"
            onClick={() => {/* forgot password flow */}}
            className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#2855a6] text-[14px] hover:underline"
          >
            Forgot password?
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="w-full bg-red-50 border border-red-200 text-red-700 text-[13px] rounded-[8px] px-[16px] py-[10px]">
            {error}
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-[#2855a6] h-[44px] relative rounded-[8px] shrink-0 w-full disabled:opacity-60 hover:bg-[#1e4491] transition-colors cursor-pointer"
        >
          <div className="flex flex-row items-center justify-center size-full">
            <div className="content-stretch flex items-center justify-center px-[16px] relative size-full">
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[14px] text-white">
                {loading ? 'Signing in...' : 'Sign in'}
              </p>
            </div>
          </div>
        </button>

        {/* Divider */}
        <div className="content-stretch flex gap-[17px] items-center justify-center relative shrink-0 w-full">
          <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative">
            <div className="absolute inset-[-1px_0_0_0]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 214 1">
                <line id="Line 8" stroke="#E9E9E9" x2="214" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#5a6a76] text-[14px]">Or</p>
          <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative">
            <div className="absolute inset-[-1px_0_0_0]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 214 1">
                <line id="Line 8" stroke="#E9E9E9" x2="214" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
        </div>

        {/* OAuth buttons */}
        <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-full">
          {/* Google */}
          <button
            type="button"
            onClick={() => handleOAuth('google')}
            disabled={!!oauthLoading}
            className="flex-[1_0_0] h-[44px] min-h-px min-w-px relative rounded-[8px] hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-60"
          >
            <div aria-hidden="true" className="absolute border border-[#bdc1c5] border-solid inset-0 pointer-events-none rounded-[8px]" />
            <div className="flex flex-row items-center justify-center size-full gap-[8px] px-[16px]">
              {/* Google icon */}
              <svg className="shrink-0 size-[24px]" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#2e2e2e] text-[14px]">
                {oauthLoading === 'google' ? 'Redirecting...' : 'Sign in with Google'}
              </p>
            </div>
          </button>

          {/* Microsoft */}
          <button
            type="button"
            onClick={() => handleOAuth('microsoft')}
            disabled={!!oauthLoading}
            className="flex-[1_0_0] h-[44px] min-h-px min-w-px relative rounded-[8px] hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-60"
          >
            <div aria-hidden="true" className="absolute border border-[#bdc1c5] border-solid inset-0 pointer-events-none rounded-[8px]" />
            <div className="flex flex-row items-center justify-center size-full gap-[8px] px-[16px]">
              <svg className="shrink-0 size-[24px]" viewBox="0 0 24 24" fill="none">
                <path d="M12 11.5H3V3.5H12V11.5Z" fill="#F1511B"/>
                <path d="M22 11.5H13V3.5H22V11.5Z" fill="#80CC28"/>
                <path d="M12 21.5H3V12.5H12V21.5Z" fill="#00ADEF"/>
                <path d="M22 21.5H13V12.5H22V21.5Z" fill="#FBBC09"/>
              </svg>
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#2e2e2e] text-[14px]">
                {oauthLoading === 'microsoft' ? 'Redirecting...' : 'Sign in with Microsoft'}
              </p>
            </div>
          </button>
        </div>

        {/* Privacy links */}
        <div className="content-stretch flex font-['Inter:Regular',sans-serif] font-normal gap-[8px] items-center justify-center leading-[20px] not-italic relative shrink-0 text-[14px] w-full">
          <p className="relative shrink-0 text-[#5a6a76]">Read our</p>
          <button type="button" className="relative shrink-0 text-[#2855a6] hover:underline">Privacy Policy</button>
          <p className="relative shrink-0 text-[#5a6a76]">|</p>
          <button type="button" className="relative shrink-0 text-[#2855a6] hover:underline">Terms &amp; Conditions</button>
        </div>
      </div>
    </form>
  );
}

function ProgressIndicator({ onSuccess }: { onSuccess?: () => void }) {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="Progress indicator">
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col gap-[44px] items-center p-[44px] relative w-full">
          <div className="h-[64px] relative shrink-0 w-[212px]" data-name="Primary-Logo-grow-260x104 3">
            <img alt="Grow logo" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgPrimaryLogoGrow260X1043} />
          </div>
          <Form onSuccess={onSuccess} />
        </div>
      </div>
    </div>
  );
}

function GraphBarJan() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-h-px min-w-px relative">
      <div className="bg-[#e9e9e9] h-[132px] rounded-[8px] shrink-0 w-full" />
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#5a6a76] text-[12px] text-center w-full">Jan</p>
    </div>
  );
}
function GraphBarFeb() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-h-px min-w-px relative">
      <div className="bg-[#e9e9e9] h-[115px] rounded-[8px] shrink-0 w-full" />
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#5a6a76] text-[12px] text-center w-full">Feb</p>
    </div>
  );
}
function GraphBarMar() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-h-px min-w-px relative">
      <div className="bg-[#e9e9e9] h-[146px] rounded-[8px] shrink-0 w-full" />
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#5a6a76] text-[12px] text-center w-full">Mar</p>
    </div>
  );
}
function GraphBarApr() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-h-px min-w-px relative">
      <div className="bg-[#2855a6] h-[163px] rounded-[8px] shrink-0 w-full" />
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#5a6a76] text-[12px] text-center w-full">Apr</p>
    </div>
  );
}
function GraphBarMay() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-h-px min-w-px relative">
      <div className="bg-[#e9e9e9] h-[126px] rounded-[8px] shrink-0 w-full" />
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#5a6a76] text-[12px] text-center w-full">May</p>
    </div>
  );
}
function GraphBarJun() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-h-px min-w-px relative">
      <div className="bg-[#e9e9e9] h-[158px] rounded-[8px] shrink-0 w-full" />
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#5a6a76] text-[12px] text-center w-full">Jun</p>
    </div>
  );
}
function GraphBarJul() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-h-px min-w-px relative">
      <div className="bg-[#e9e9e9] h-[118px] rounded-[8px] shrink-0 w-full" />
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#5a6a76] text-[12px] text-center w-full">Jul</p>
    </div>
  );
}
function GraphBarAug() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-h-px min-w-px relative">
      <div className="bg-[#e9e9e9] h-[139px] rounded-[8px] shrink-0 w-full" />
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#5a6a76] text-[12px] text-center w-full">Aug</p>
    </div>
  );
}

function WelcomeSection() {
  return (
    <div className="bg-[#2855a6] flex-[1_0_0] h-[803px] min-h-px min-w-px overflow-clip relative rounded-[16px]" data-name="Welcome Section">
      <div className="absolute content-stretch flex flex-col gap-[16px] items-center left-[44px] not-italic text-center text-white top-[54px] w-[566px]">
        <div className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[52px] whitespace-nowrap">
          <p className="mb-0">Welcome back!</p>
          <p className="mb-0">Please sign in to your</p>
          <p>Grow account</p>
        </div>
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] min-w-full relative shrink-0 text-[14px] w-[min-content] whitespace-pre-wrap">
          Australia's leading compliance platform. Streamline KYC, AML/CTF, and regulatory reporting with AI-powered automation.
        </p>
      </div>
      <div className="absolute content-stretch flex items-center left-[41px] top-[406px]">
        <div className="bg-white content-stretch flex flex-col gap-[24px] items-start p-[24px] relative rounded-[8px] shrink-0 w-[532px]">
          <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
            <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
              <div className="bg-white overflow-clip relative rounded-[8px] shrink-0 size-[42px] flex items-center justify-center">
                <svg className="size-[24px]" viewBox="0 0 20 20" fill="none">
                  <path d={svgPaths.p1a20bd00} fill="#2855A6" />
                  <path d={svgPaths.p3a1ec600} fill="#2855A6" opacity="0.4" />
                  <path d={svgPaths.p30215e80} fill="#2855A6" opacity="0.7" />
                  <path d={svgPaths.p386d1f80} fill="#2855A6" />
                </svg>
              </div>
              <div className="content-stretch flex flex-col gap-[4px] items-start not-italic relative shrink-0">
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#2e2e2e] text-[18px]">Analytics Overview</p>
                <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] relative shrink-0 text-[#5a6a76] text-[12px]">Compliance performance per month</p>
              </div>
            </div>
          </div>
          <div className="content-stretch flex gap-[24px] h-[200px] items-end justify-center relative shrink-0 w-full">
            <GraphBarJan /><GraphBarFeb /><GraphBarMar /><GraphBarApr />
            <GraphBarMay /><GraphBarJun /><GraphBarJul /><GraphBarAug />
          </div>
        </div>
      </div>
    </div>
  );
}

interface SignInProps {
  onSuccess?: () => void;
}

export default function SignIn({ onSuccess }: SignInProps) {
  return (
    <div className="content-stretch flex flex-col items-start relative size-full" data-name="Sign In">
      <div className="bg-[#f5f5f5] flex-[1_0_0] min-h-px min-w-px relative w-full">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[44px] items-center p-[44px] relative size-full">
            <ProgressIndicator onSuccess={onSuccess} />
            <WelcomeSection />
          </div>
        </div>
      </div>
    </div>
  );
}
