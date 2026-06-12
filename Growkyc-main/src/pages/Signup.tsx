import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Mail, Lock, User, Eye, EyeOff, ArrowRight, Building } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../context/AuthContext';

type StrengthLevel = 'empty' | 'weak' | 'fair' | 'strong' | 'very-strong';

function getPasswordStrength(pwd: string): { level: StrengthLevel; label: string; color: string; width: string } {
  if (!pwd) return { level: 'empty', label: '', color: 'bg-gray-200', width: '0%' };
  let score = 0;
  if (pwd.length >= 12) score++;
  if (pwd.length >= 16) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 2) return { level: 'weak', label: 'Weak', color: 'bg-red-500', width: '25%' };
  if (score === 3) return { level: 'fair', label: 'Fair', color: 'bg-amber-400', width: '50%' };
  if (score === 4) return { level: 'strong', label: 'Strong', color: 'bg-blue-500', width: '75%' };
  return { level: 'very-strong', label: 'Very Strong', color: 'bg-green-500', width: '100%' };
}

export const Signup: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<Role>('User');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const strength = getPasswordStrength(password);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 12) {
      setError('Password must be at least 12 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: fullName, email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.detail || 'Registration failed.');
        return;
      }
      login(data.access_token, data.user);
      navigate('/');
    } catch (err) {
      setError('An error occurred during account creation.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden py-12">
      {/* Dynamic Background Decorations */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200 rounded-full blur-3xl opacity-40 animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-200 rounded-full blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="w-full max-w-lg p-10 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl z-10 border border-white/40 transform transition-all duration-300">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-[#13B5EA] to-[#0E7C9E] rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-200 mb-6 transform transition-transform duration-300 hover:scale-105">
            <Shield className="text-white w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Account</h2>
          <p className="text-slate-500 mt-2 text-sm font-medium">Join GrowKYC Enterprise Portal</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 border border-red-100 flex items-center shadow-sm">
            <Shield className="w-4 h-4 mr-2 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400 group-focus-within:text-[#13B5EA] transition-colors" />
              </div>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="block w-full pl-11 pr-4 py-3.5 border-2 border-slate-200 rounded-xl focus:ring-0 focus:border-[#13B5EA] transition-all sm:text-sm bg-white/50 text-slate-900 placeholder-slate-400 font-medium"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-[#13B5EA] transition-colors" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-11 pr-4 py-3.5 border-2 border-slate-200 rounded-xl focus:ring-0 focus:border-[#13B5EA] transition-all sm:text-sm bg-white/50 text-slate-900 placeholder-slate-400 font-medium"
                placeholder="name@company.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Select Role</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Building className="h-5 w-5 text-slate-400 group-focus-within:text-[#13B5EA] transition-colors" />
              </div>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="block w-full pl-11 pr-4 py-3.5 border-2 border-slate-200 rounded-xl focus:ring-0 focus:border-[#13B5EA] transition-all sm:text-sm bg-white/50 text-slate-900 font-medium appearance-none cursor-pointer"
              >
                <option value="User">Regular User</option>
                <option value="Agent">Agent</option>
                <option value="Analyst">AML Analyst</option>
                <option value="Compliance_Officer">Compliance Officer</option>
                <option value="MLRO">MLRO</option>
                <option value="Partner">Partner</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-[#13B5EA] transition-colors" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-10 py-3.5 border-2 border-slate-200 rounded-xl focus:ring-0 focus:border-[#13B5EA] transition-all sm:text-sm bg-white/50 text-slate-900 placeholder-slate-400 font-medium"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-slate-400 hover:text-slate-600 transition-colors" />
                  ) : (
                    <Eye className="h-4 w-4 text-slate-400 hover:text-slate-600 transition-colors" />
                  )}
                </button>
              </div>
              {password.length > 0 && (
                <div className="mt-2 space-y-1">
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${strength.color}`} style={{ width: strength.width }} />
                  </div>
                  <p className="text-xs text-slate-500">
                    Strength: <span className={`font-semibold ${strength.level === 'weak' ? 'text-red-500' : strength.level === 'fair' ? 'text-amber-500' : strength.level === 'strong' ? 'text-blue-600' : 'text-green-600'}`}>{strength.label}</span>
                    {' '}&bull; Min 12 characters
                  </p>
                </div>
              )}
              {password.length === 0 && (
                <p className="mt-1 text-xs text-slate-400">Min 12 characters required</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-[#13B5EA] transition-colors" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-11 pr-10 py-3.5 border-2 border-slate-200 rounded-xl focus:ring-0 focus:border-[#13B5EA] transition-all sm:text-sm bg-white/50 text-slate-900 placeholder-slate-400 font-medium"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-slate-400 hover:text-slate-600 transition-colors" />
                  ) : (
                    <Eye className="h-4 w-4 text-slate-400 hover:text-slate-600 transition-colors" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-cyan-200 text-sm font-bold text-white bg-gradient-to-r from-[#13B5EA] to-[#0E7C9E] hover:from-[#11a2d2] hover:to-[#0c6b88] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#13B5EA] transition-all disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5 mt-4"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                Create Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-100 pt-6">
          <p className="text-sm text-slate-500 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[#13B5EA] hover:text-[#0E7C9E] transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
