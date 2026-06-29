import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Users,
  UserCircle,
  Briefcase,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  MessageCircle,
  HelpCircle,
  Shield,
  TrendingUp,
  FileText,
  DollarSign,
  PenTool,
  Send,
  Sparkles,
  Save,
  Info,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Code
} from 'lucide-react';
import { EntityBuilder } from './onboarding/EntityBuilder';
import { OwnershipBuilder } from './onboarding/OwnershipBuilder';
import { VerifyPeople } from './onboarding/VerifyPeople';
import { BusinessProfile } from './onboarding/BusinessProfile';
import { FinancialProfile } from './onboarding/FinancialProfile';
import { ConsentDeclarations } from './onboarding/ConsentDeclarations';
import { FinalReview } from './onboarding/FinalReview';
import { OnboardingChat } from './onboarding/OnboardingChat';
import { toast } from '../../lib/toast';

interface SmartOnboardingProps {
  onBack: () => void;
}

type Stage = 'master' | 'structure' | 'ownership' | 'verify' | 'business' | 'financial' | 'consent' | 'review';

type EntityType = 'company' | 'trust' | 'individual' | 'sole_trader';

interface Entity {
  id: string;
  type: EntityType;
  name: string;
  status: 'draft' | 'in_progress' | 'pending_review' | 'approved' | 'requires_action';
  completionPercentage: number;
  riskLevel: 'low' | 'medium' | 'high';
  data: any;
}

export function SmartOnboarding({ onBack }: SmartOnboardingProps) {
  const [currentStage, setCurrentStage] = useState<Stage>('master');
  const [entities, setEntities] = useState<Entity[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const [devMode, setDevMode] = useState(true); // Developer mode enabled by default
  const [individualData, setIndividualData] = useState<any>({});
  const [discoveredEntities, setDiscoveredEntities] = useState<any[]>([]);
  const [checksComplete, setChecksComplete] = useState(false);
  const [selectedSearches, setSelectedSearches] = useState<string[]>([]);

  // Auto-save functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setLastSaved(new Date());
      // In production, save to backend here
    }, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, [entities, selectedEntity]);

  const stages = [
    { id: 'structure', label: 'Structure', icon: Building2 },
    { id: 'ownership', label: 'Ownership', icon: Users },
    { id: 'verify', label: 'Verify', icon: Shield },
    { id: 'business', label: 'Business', icon: Briefcase },
    { id: 'financial', label: 'Financial', icon: DollarSign },
    { id: 'consent', label: 'Consent', icon: FileText },
    { id: 'review', label: 'Review', icon: CheckCircle },
  ];

  const getCurrentStageIndex = () => {
    return stages.findIndex(s => s.id === currentStage);
  };

  const getCompletionPercentage = () => {
    if (!selectedEntity) return 0;
    const stageIndex = getCurrentStageIndex();
    return Math.round((stageIndex / stages.length) * 100);
  };

  const getTimeRemaining = () => {
    const stagesRemaining = stages.length - getCurrentStageIndex();
    return `${stagesRemaining * 5} min remaining`;
  };

  const handleAddEntity = (type: EntityType) => {
    const newEntity: Entity = {
      id: `entity-${Date.now()}`,
      type,
      name: '',
      status: 'draft',
      completionPercentage: 0,
      riskLevel: 'low',
      data: {},
    };
    setEntities([...entities, newEntity]);
    setSelectedEntity(newEntity);
    setCurrentStage('structure');
    toast.success('Entity created! Let\'s set it up.');
  };

  const handleContinueEntity = (entity: Entity) => {
    setSelectedEntity(entity);
    // Determine which stage to resume from
    if (entity.completionPercentage < 15) {
      setCurrentStage('structure');
    } else if (entity.completionPercentage < 30) {
      setCurrentStage('ownership');
    } else if (entity.completionPercentage < 45) {
      setCurrentStage('verify');
    } else if (entity.completionPercentage < 60) {
      setCurrentStage('business');
    } else if (entity.completionPercentage < 75) {
      setCurrentStage('financial');
    } else if (entity.completionPercentage < 90) {
      setCurrentStage('consent');
    } else {
      setCurrentStage('review');
    }
  };

  const handleStageComplete = (data: any) => {
    if (!selectedEntity) return;

    // Update entity with new data
    const updatedEntity = {
      ...selectedEntity,
      data: { ...selectedEntity.data, ...data },
      completionPercentage: getCompletionPercentage() + 14,
    };
    
    setEntities(entities.map(e => e.id === updatedEntity.id ? updatedEntity : e));
    setSelectedEntity(updatedEntity);

    // Move to next stage
    const currentIndex = getCurrentStageIndex();
    if (currentIndex < stages.length - 1) {
      setCurrentStage(stages[currentIndex + 1].id as Stage);
      
      // Celebration micro-animation
      toast.success('Stage complete! 🎉', `${stages[currentIndex + 1].label} stage unlocked`);
    }
  };

  const handleBackToMaster = () => {
    setCurrentStage('master');
    setSelectedEntity(null);
  };

  const getEntityIcon = (type: EntityType) => {
    switch (type) {
      case 'company': return Building2;
      case 'trust': return Shield;
      case 'individual': return UserCircle;
      case 'sole_trader': return Briefcase;
    }
  };

  const getEntityTypeLabel = (type: EntityType) => {
    switch (type) {
      case 'company': return 'Company';
      case 'trust': return 'Trust';
      case 'individual': return 'Individual';
      case 'sole_trader': return 'Sole Trader';
    }
  };

  const renderMasterDashboard = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Client Onboarding Dashboard</h1>
          <p className="text-slate-300 mt-2">
            Add and manage multiple entities. Each company, trust, or individual needs separate onboarding.
          </p>
          {entities.length > 0 && (
            <div className="mt-3 flex items-center gap-4">
              <Badge variant="outline" className="text-sm">
                <Building2 className="w-4 h-4 mr-1" />
                {entities.filter(e => e.type === 'company').length} Companies
              </Badge>
              <Badge variant="outline" className="text-sm">
                <Shield className="w-4 h-4 mr-1" />
                {entities.filter(e => e.type === 'trust').length} Trusts
              </Badge>
              <Badge variant="outline" className="text-sm">
                <UserCircle className="w-4 h-4 mr-1" />
                {entities.filter(e => e.type === 'individual').length} Individuals
              </Badge>
              <Badge variant="outline" className="text-sm">
                <Briefcase className="w-4 h-4 mr-1" />
                {entities.filter(e => e.type === 'sole_trader').length} Sole Traders
              </Badge>
            </div>
          )}
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to KYC
        </Button>
      </div>

      {/* Quick Stats */}
      {entities.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-white">{entities.length}</div>
              <div className="text-sm text-slate-300">Total Entities</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {entities.filter(e => e.status === 'approved').length}
              </div>
              <div className="text-sm text-slate-300">Approved</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-amber-600">
                {entities.filter(e => e.status === 'in_progress' || e.status === 'draft').length}
              </div>
              <div className="text-sm text-slate-300">In Progress</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">
                {entities.filter(e => e.status === 'pending_review').length}
              </div>
              <div className="text-sm text-slate-300">Pending Review</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Entity Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">
            {entities.length === 0 ? 'Add Your First Entity' : 'Your Entities'}
          </h2>
          {entities.length > 0 && (
            <div className="text-sm text-slate-300">
              Click any card to continue, or add more entities below
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Existing Entity Cards */}
          {entities.map((entity) => {
            const EntityIcon = getEntityIcon(entity.type);
            return (
              <Card
                key={entity.id}
                className="hover:shadow-lg transition-all cursor-pointer border-2"
                onClick={() => handleContinueEntity(entity)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        entity.riskLevel === 'high' ? 'bg-red-100' :
                        entity.riskLevel === 'medium' ? 'bg-amber-100' :
                        'bg-green-100'
                      }`}>
                        <EntityIcon className={`w-6 h-6 ${
                          entity.riskLevel === 'high' ? 'text-red-600' :
                          entity.riskLevel === 'medium' ? 'text-amber-600' :
                          'text-green-600'
                        }`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {entity.name || `New ${getEntityTypeLabel(entity.type)}`}
                        </CardTitle>
                        <CardDescription>{getEntityTypeLabel(entity.type)}</CardDescription>
                      </div>
                    </div>
                    <Badge
                      className={
                        entity.status === 'approved' ? 'bg-green-500' :
                        entity.status === 'pending_review' ? 'bg-blue-500' :
                        entity.status === 'requires_action' ? 'bg-red-500' :
                        entity.status === 'in_progress' ? 'bg-amber-500' :
                        'bg-gray-500'
                      }
                    >
                      {entity.status === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
                      {entity.status === 'pending_review' && <Clock className="w-3 h-3 mr-1" />}
                      {entity.status === 'requires_action' && <AlertCircle className="w-3 h-3 mr-1" />}
                      {entity.status === 'in_progress' && <Clock className="w-3 h-3 mr-1" />}
                      {entity.status === 'draft' && <FileText className="w-3 h-3 mr-1" />}
                      {entity.status.replace(/_/g, ' ').toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Completion Progress */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-slate-300">Completion</span>
                      <span className="font-semibold text-white">{entity.completionPercentage}%</span>
                    </div>
                    <Progress value={entity.completionPercentage} />
                  </div>

                  {/* Risk Level */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Risk Level</span>
                    <Badge variant="outline" className={
                      entity.riskLevel === 'high' ? 'border-red-500 text-red-700' :
                      entity.riskLevel === 'medium' ? 'border-amber-500 text-amber-700' :
                      'border-green-500 text-green-700'
                    }>
                      {entity.riskLevel.toUpperCase()}
                    </Badge>
                  </div>

                  {/* Action Button */}
                  <Button className="w-full" variant={entity.completionPercentage === 100 ? 'outline' : 'default'}>
                    {entity.completionPercentage === 100 ? 'Review' : 'Continue Setup'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}

          {/* Add New Entity Card - Always shown */}
          <Card className="border-2 border-dashed border-blue-400 hover:border-blue-600 hover:bg-blue-50 transition-all cursor-pointer group">
            <CardContent className="p-8 flex flex-col items-center justify-center min-h-64">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <Plus className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-white mb-2">
                {entities.length === 0 ? 'Add First Entity' : 'Add Another Entity'}
              </h3>
              <p className="text-sm text-slate-300 text-center mb-4">
                {entities.length === 0 
                  ? 'Select entity type to begin onboarding' 
                  : 'Add more companies, trusts, or individuals'
                }
              </p>
              <div className="grid grid-cols-2 gap-2 w-full">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAddEntity('company')}
                  className="flex-col h-auto py-3 hover:bg-blue-100 hover:border-blue-500"
                >
                  <Building2 className="w-5 h-5 mb-1" />
                  <span className="text-xs font-semibold">Company</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAddEntity('trust')}
                  className="flex-col h-auto py-3 hover:bg-blue-100 hover:border-blue-500"
                >
                  <Shield className="w-5 h-5 mb-1" />
                  <span className="text-xs font-semibold">Trust</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAddEntity('individual')}
                  className="flex-col h-auto py-3 hover:bg-blue-100 hover:border-blue-500"
                >
                  <UserCircle className="w-5 h-5 mb-1" />
                  <span className="text-xs font-semibold">Individual</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAddEntity('sole_trader')}
                  className="flex-col h-auto py-3 hover:bg-blue-100 hover:border-blue-500"
                >
                  <Briefcase className="w-5 h-5 mb-1" />
                  <span className="text-xs font-semibold">Sole Trader</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Help Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#0d121d] rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white mb-2">Need help getting started?</h3>
              <p className="text-sm text-slate-300 mb-3">
                Our AI assistant can guide you through each step and answer your questions.
              </p>
              <Button size="sm" onClick={() => setIsChatOpen(true)}>
                <MessageCircle className="w-4 h-4 mr-2" />
                Start Chat
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStageContent = () => {
    if (!selectedEntity) return null;

    switch (currentStage) {
      case 'structure':
        return <EntityBuilder entity={selectedEntity} onComplete={handleStageComplete} />;
      case 'ownership':
        return <OwnershipBuilder entity={selectedEntity} onComplete={handleStageComplete} />;
      case 'verify':
        return <VerifyPeople entity={selectedEntity} onComplete={handleStageComplete} />;
      case 'business':
        return <BusinessProfile entity={selectedEntity} onComplete={handleStageComplete} />;
      case 'financial':
        return <FinancialProfile entity={selectedEntity} onComplete={handleStageComplete} />;
      case 'consent':
        return <ConsentDeclarations entity={selectedEntity} onComplete={handleStageComplete} />;
      case 'review':
        return <FinalReview entity={selectedEntity} onComplete={() => {
          toast.success('Submitted for compliance review!');
          handleBackToMaster();
        }} />;
      default:
        return null;
    }
  };

  if (currentStage === 'master') {
    return (
      <div className="min-h-screen bg-[#0a0e17] p-6">
        {renderMasterDashboard()}
        {isChatOpen && <OnboardingChat onClose={() => setIsChatOpen(false)} />}
      </div>
    );
  }

  // Stage view with progress
  return (
    <div className="min-h-screen bg-[#0a0e17]">
      {/* Top Progress Bar */}
      <div className="bg-[#0d121d] border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="sm" onClick={handleBackToMaster}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              All Entities
            </Button>
            <div className="flex items-center gap-4">
              {/* Developer Mode Toggle */}
              <div className="flex items-center gap-2 px-3 py-1 bg-amber-100 border-2 border-amber-300 rounded-lg">
                <Code className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-semibold text-amber-900">DEV MODE</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={devMode}
                    onChange={(e) => setDevMode(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#0d121d] after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
              <div className="text-sm text-slate-300">
                <Save className="w-4 h-4 inline mr-1" />
                Last saved {Math.floor((new Date().getTime() - lastSaved.getTime()) / 1000)}s ago
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsChatOpen(true)}>
                <MessageCircle className="w-4 h-4 mr-2" />
                Help
              </Button>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between relative">
            {stages.map((stage, index) => {
              const Icon = stage.icon;
              const isActive = stage.id === currentStage;
              const isComplete = getCurrentStageIndex() > index;
              
              return (
                <div key={stage.id} className="flex-1 relative">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isComplete ? 'bg-green-500' :
                      isActive ? 'bg-blue-600' :
                      'bg-gray-300'
                    } transition-all`}>
                      {isComplete ? (
                        <Check className="w-5 h-5 text-white" />
                      ) : (
                        <Icon className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <span className={`text-xs mt-2 ${isActive ? 'font-bold text-blue-600' : 'text-slate-300'}`}>
                      {stage.label}
                    </span>
                  </div>
                  {index < stages.length - 1 && (
                    <div className={`absolute top-5 left-1/2 w-full h-0.5 ${
                      isComplete ? 'bg-green-500' : 'bg-gray-300'
                    }`} style={{ zIndex: -1 }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-semibold text-white">
                {selectedEntity?.name || 'New Entity'} - {getCompletionPercentage()}% Complete
              </span>
              <span className="text-slate-300">
                <Clock className="w-4 h-4 inline mr-1" />
                {getTimeRemaining()}
              </span>
            </div>
            <Progress value={getCompletionPercentage()} className="h-2" />
          </div>
        </div>
      </div>

      {/* Stage Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {renderStageContent()}
        
        {/* Developer Mode Navigation */}
        {devMode && (
          <Card className="mt-6 border-2 border-amber-300 bg-amber-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  disabled={getCurrentStageIndex() === 0}
                  onClick={() => {
                    const currentIndex = getCurrentStageIndex();
                    if (currentIndex > 0) {
                      setCurrentStage(stages[currentIndex - 1].id as Stage);
                      toast.info('⚠️ Dev Mode: Skipped to previous stage');
                    }
                  }}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous Stage
                </Button>
                
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-semibold text-amber-900">
                    Developer Mode: Skip validation enabled
                  </span>
                </div>
                
                <Button
                  variant="default"
                  className="bg-amber-600 hover:bg-amber-700"
                  disabled={getCurrentStageIndex() === stages.length - 1}
                  onClick={() => {
                    const currentIndex = getCurrentStageIndex();
                    if (currentIndex < stages.length - 1) {
                      setCurrentStage(stages[currentIndex + 1].id as Stage);
                      toast.info('⚠️ Dev Mode: Skipped to next stage without validation');
                    }
                  }}
                >
                  Skip to Next Stage
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Floating Chat */}
      {isChatOpen && <OnboardingChat onClose={() => setIsChatOpen(false)} />}
    </div>
  );
}