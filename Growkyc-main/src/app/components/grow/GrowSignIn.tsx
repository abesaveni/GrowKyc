import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from '../../lib/toast';
import { Eye, EyeOff } from 'lucide-react';
import growLogo from '../../../assets/a47dcf28a3997c763da9c73c54846d4fd7deaf00.png';

interface GrowSignInProps {
  onSignIn: () => void;
}

export function GrowSignIn({ onSignIn }: GrowSignInProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Signed in successfully!');
      onSignIn();
    }, 1000);
  };

  const handleGoogleSignIn = () => {
    toast.info('Google Sign In', {
      description: 'Redirecting to Google...'
    });
  };

  const handleMicrosoftSignIn = () => {
    toast.info('Microsoft Sign In', {
      description: 'Redirecting to Microsoft...'
    });
  };

  const handleForgotPassword = () => {
    toast.info('Password Reset', {
      description: 'Check your email for reset instructions'
    });
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-11">
      <div className="w-full max-w-[1400px] flex gap-11">
        {/* Left Side - Sign In Form */}
        <div className="flex-1 bg-white rounded-lg p-11 flex flex-col items-center justify-center">
          <div className="w-full max-w-[478px] space-y-6">
            {/* Logo */}
            <div className="flex justify-center mb-11">
              <img src={growLogo} alt="Grow Advisory Group" className="h-16" />
            </div>

            {/* Form Header */}
            <div className="text-center space-y-3">
              <h1 className="text-2xl font-bold text-[#2e2e2e]">Sign In</h1>
              <p className="text-sm text-[#5a6a76]">Welcome back! Please enter your details</p>
            </div>

            {/* Sign In Form */}
            <form onSubmit={handleSignIn} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-[#5a6a76]">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="h-11 border-[#bdc1c5] rounded-lg"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-[#5a6a76]">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="h-11 border-[#bdc1c5] rounded-lg pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5a6a76] hover:text-[#2e2e2e]"
                  >
                    {showPassword ? (
                      <Eye className="w-[18px] h-[18px]" />
                    ) : (
                      <EyeOff className="w-[18px] h-[18px]" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pb-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-[#bdc1c5]"
                  />
                  <label htmlFor="remember" className="text-sm text-[#2e2e2e] cursor-pointer">
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-[#2855a6] hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {/* Sign In Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-[#2855a6] hover:bg-[#1e4089] text-white rounded-lg"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-[#e9e9e9]" />
                <span className="text-sm text-[#5a6a76]">Or</span>
                <div className="flex-1 h-px bg-[#e9e9e9]" />
              </div>

              {/* Social Sign In Buttons */}
              <div className="flex gap-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleSignIn}
                  className="flex-1 h-11 border-[#bdc1c5] rounded-lg"
                >
                  <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"/>
                    <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"/>
                    <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5818182 23.1818182,9.90909091 L12,9.90909091 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"/>
                    <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"/>
                  </svg>
                  Sign in with Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleMicrosoftSignIn}
                  className="flex-1 h-11 border-[#bdc1c5] rounded-lg"
                >
                  <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24">
                    <path fill="#F35325" d="M11.4 11.4H3V3h8.4v8.4z"/>
                    <path fill="#81BC06" d="M21 11.4h-8.4V3H21v8.4z"/>
                    <path fill="#05A6F0" d="M11.4 21H3v-8.4h8.4V21z"/>
                    <path fill="#FFBA08" d="M21 21h-8.4v-8.4H21V21z"/>
                  </svg>
                  Sign in with Microsoft
                </Button>
              </div>

              {/* Privacy Links */}
              <div className="flex items-center justify-center gap-2 text-sm">
                <span className="text-[#5a6a76]">Read our</span>
                <button type="button" className="text-[#2855a6] hover:underline">
                  Privacy Policy
                </button>
                <span className="text-[#5a6a76]">|</span>
                <button type="button" className="text-[#2855a6] hover:underline">
                  Terms & Condition
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side - Welcome Section */}
        <div className="flex-1 bg-[#2855a6] rounded-2xl p-11 relative overflow-hidden">
          {/* Decorative Circles */}
          <div className="absolute top-0 left-3 w-[271px] h-[271px] opacity-30">
            <div className="w-full h-full rounded-full border-[40px] border-white/30 border-t-white" style={{ transform: 'scaleY(-1)' }} />
          </div>
          <div className="absolute bottom-0 right-0 w-[245px] h-[245px] opacity-30" style={{ transform: 'rotate(90deg)' }}>
            <div className="w-full h-full rounded-full border-[36px] border-white/30 border-t-white" />
          </div>

          {/* Content */}
          <div className="relative z-10 text-white text-center space-y-4">
            <h2 className="text-[52px] font-bold leading-tight">
              Welcome back!<br />
              Please sign in to your<br />
              Grow account
            </h2>
            <p className="text-sm max-w-[566px] mx-auto">
              Lorem ipsum dolor sit amet consectetur. Urna dui quis in ac dignissim habitasse nisl. Pretium risus ultricies mauris posuere penatibus eu semper in.
            </p>
          </div>

          {/* Graph Section */}
          <div className="absolute bottom-[70px] left-[41px] right-[41px]">
            <div className="bg-white rounded-lg p-6 relative">
              {/* Graph Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-[42px] h-[42px] bg-white rounded-lg flex items-center justify-center border">
                    <svg className="w-6 h-6 text-[#2855a6]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 11C17.66 11 18.99 9.66 18.99 8S17.66 5 16 5 13.01 6.34 13.01 8 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8S9.66 5 8 5 5.01 6.34 5.01 8 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-[#2e2e2e] text-lg">Graph and Analysis</p>
                    <p className="text-xs text-[#5a6a76]">Project complete per month</p>
                  </div>
                </div>
                <select className="h-11 px-4 border border-[#bdc1c5] rounded-lg text-sm text-[#5a6a76]">
                  <option>Month</option>
                </select>
              </div>

              {/* Bar Chart */}
              <div className="flex items-end justify-center gap-6 h-[200px]">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'].map((month, idx) => {
                  const heights = [132, 115, 146, 163, 126, 158, 118, 139];
                  const isActive = month === 'Apr';
                  return (
                    <div key={month} className="flex flex-col items-center gap-4 flex-1">
                      <div
                        className={`w-full rounded-lg ${isActive ? 'bg-[#2855a6]' : 'bg-[#e9e9e9]'}`}
                        style={{ height: `${heights[idx]}px` }}
                      />
                      <span className="text-xs text-[#5a6a76]">{month}</span>
                    </div>
                  );
                })}
              </div>

              {/* Tasks Due Card (Floating) */}
              <div className="absolute top-[-63.5px] right-[-80px] bg-white rounded-lg shadow-2xl p-6 w-[215px]">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#f5f5f5] rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#f5a623]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16 11C17.66 11 18.99 9.66 18.99 8S17.66 5 16 5 13.01 6.34 13.01 8 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8S9.66 5 8 5 5.01 6.34 5.01 8 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z"/>
                      </svg>
                    </div>
                    <span className="text-sm text-[#5a6a76]">Tasks Due</span>
                  </div>
                  <button className="text-[#5a6a76]">
                    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="6" r="1.5"/>
                      <circle cx="12" cy="12" r="1.5"/>
                      <circle cx="12" cy="18" r="1.5"/>
                    </svg>
                  </button>
                </div>
                
                <div className="bg-[#f5f5f5] rounded-lg p-6">
                  <div className="flex items-end justify-between">
                    <div className="flex items-end gap-1">
                      {[6, 22, 14, 18, 23, 26, 19, 22, 26, 18, 24, 12].map((height, idx) => (
                        <div
                          key={idx}
                          className="w-1 bg-[#f5a623] rounded-full"
                          style={{ height: `${height}px` }}
                        />
                      ))}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-[#2e2e2e]">14</p>
                      <div className="flex items-center gap-1 text-xs text-[#f5a623]">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                        <span>20%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
