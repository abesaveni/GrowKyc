import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { toast } from '../../lib/toast';
import { Breadcrumbs } from '../ui/breadcrumbs';
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Briefcase,
  Award,
  Calendar,
  CheckCircle,
  Shield,
  MessageSquare,
  Star,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { format } from 'date-fns';

interface UserProfileProps {
  userId?: string;
  onBack?: () => void;
}

const mockUserProfile = {
  id: 'user-001',
  name: 'Michael Chen',
  role: 'investor',
  email: 'michael.chen@platinumcapital.com.au',
  phone: '+61 2 9876 5432',
  location: 'Sydney, NSW',
  organization: 'Platinum Capital Partners',
  joinDate: new Date('2023-06-15'),
  verified: true,
  avatar: null,
  bio: 'Experienced property investor with a focus on mortgage investment opportunities in premium Australian markets. Over 15 years of experience in commercial and residential property investment.',
  stats: {
    totalBids: 28,
    wonBids: 12,
    totalInvested: 14500000,
    avgBid: 1050000,
    successRate: 43
  },
  recentActivity: [
    {
      id: 'act-001',
      type: 'bid',
      description: 'Placed bid of A$1,100,000 on MIP-2024-001',
      date: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 'act-002',
      type: 'contract',
      description: 'Signed investment agreement for MIP-2024-007',
      date: new Date(Date.now() - 48 * 60 * 60 * 1000)
    },
    {
      id: 'act-003',
      type: 'payment',
      description: 'Payment processed for A$980,000',
      date: new Date(Date.now() - 72 * 60 * 60 * 1000)
    }
  ],
  badges: [
    { id: 'verified', name: 'Verified Investor', icon: CheckCircle, color: 'text-green-600' },
    { id: 'top-bidder', name: 'Top Bidder', icon: Award, color: 'text-amber-600' },
    { id: 'trusted', name: 'Trusted Member', icon: Shield, color: 'text-blue-600' }
  ]
};

export function UserProfile({ userId = 'user-001', onBack }: UserProfileProps) {
  const [profile] = useState(mockUserProfile);

  const handleSendMessage = () => {
    toast.success('Message window opened', {
      description: `Starting conversation with ${profile.name}`
    });
  };

  const handleViewDeals = () => {
    toast.info('Viewing deals', {
      description: `All deals from ${profile.name}`
    });
  };

  const breadcrumbItems = [
    { label: 'Dashboard', href: '#' },
    { label: 'Users', href: '#' },
    { label: profile.name }
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Back Button */}
      {onBack && (
        <Button variant="outline" onClick={onBack}>
          ← Back
        </Button>
      )}

      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-white text-3xl font-semibold">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-semibold text-gray-900">{profile.name}</h1>
                    {profile.verified && (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-gray-600 mb-3">
                    <span className="capitalize font-medium">{profile.role}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Joined {format(profile.joinDate, 'MMM yyyy')}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleSendMessage}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  <Button onClick={handleViewDeals}>
                    <Briefcase className="w-4 h-4 mr-2" />
                    View Deals
                  </Button>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{profile.bio}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{profile.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{profile.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{profile.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Building2 className="w-4 h-4" />
                  <span className="text-sm">{profile.organization}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Briefcase className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-semibold text-gray-900">{profile.stats.totalBids}</p>
            <p className="text-sm text-gray-600">Total Bids</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-semibold text-gray-900">{profile.stats.wonBids}</p>
            <p className="text-sm text-gray-600">Won Bids</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              A${(profile.stats.totalInvested / 1000000).toFixed(1)}M
            </p>
            <p className="text-sm text-gray-600">Total Invested</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              A${(profile.stats.avgBid / 1000).toFixed(0)}K
            </p>
            <p className="text-sm text-gray-600">Avg Bid</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Star className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-2xl font-semibold text-gray-900">{profile.stats.successRate}%</p>
            <p className="text-sm text-gray-600">Success Rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Badges */}
        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {profile.badges.map((badge) => {
                const Icon = badge.icon;
                return (
                  <div key={badge.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Icon className={`w-6 h-6 ${badge.color}`} />
                    <div>
                      <p className="font-semibold text-gray-900">{badge.name}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profile.recentActivity.map((activity) => (
                <div key={activity.id} className="flex gap-3 p-3 border rounded-lg">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.description}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {format(activity.date, "dd MMM yyyy, HH:mm 'AEST'")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Info */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-1">Verified Account</p>
              <p className="text-sm text-blue-800">
                This user has completed identity verification and is an active participant on the platform. 
                All transactions are secured and monitored for compliance.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
