import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Mail, ArrowRight } from 'lucide-react';
import logo from '../../../assets/60b7d162929b5cb780f781445f70fa18c2c16326.png';

export function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border shadow-lg">
        <CardHeader className="text-center pb-8">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="Grow MIP" className="h-12" />
          </div>
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <p className="text-slate-300 text-sm mt-2">
            Enter your email and we'll send you reset instructions
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Send Reset Link
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <div className="text-center pt-4">
              <Button variant="link" type="button" className="text-sm">
                Back to Sign In
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

