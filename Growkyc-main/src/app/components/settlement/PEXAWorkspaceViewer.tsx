import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Building2, 
  Users, 
  DollarSign, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  RefreshCw,
  Send,
  Download,
  Upload,
  Calendar,
  MapPin,
  Briefcase,
  CheckSquare,
  XCircle,
  AlertCircle,
  TrendingUp,
  Home,
  Shield,
  Landmark,
  CreditCard,
  ArrowRight,
  ArrowDown,
  Bell
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '../../lib/toast';

interface PEXAWorkspaceViewerProps {
  caseData: any;
  workspaceId?: string;
}

export function PEXAWorkspaceViewer({ caseData, workspaceId }: PEXAWorkspaceViewerProps) {
  const [workspace, setWorkspace] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (workspaceId) {
      loadWorkspace();
    }
  }, [workspaceId]);

  const loadWorkspace = async () => {
    setLoading(true);
    try {
      // In production, this will call the actual PEXA API
      const response = await fetch(`/api/pexa/workspace/${workspaceId}`);
      if (response.ok) {
        const data = await response.json();
        setWorkspace(data);
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Failed to load PEXA workspace:', error);
      // Load mock data for demonstration
      setWorkspace(getMockWorkspaceData(caseData));
    } finally {
      setLoading(false);
    }
  };

  const syncWithPEXA = async () => {
    setSyncing(true);
    try {
      // This will push case data to PEXA and pull latest updates
      const response = await fetch(`/api/pexa/workspace/${workspaceId}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseData })
      });
      
      if (response.ok) {
        const updated = await response.json();
        setWorkspace(updated);
        toast.success('Synced with PEXA', 'All data is up to date');
      }
    } catch (error) {
      toast.error('Sync failed', 'Could not connect to PEXA. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  const createWorkspace = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/pexa/workspace/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseData })
      });
      
      if (response.ok) {
        const newWorkspace = await response.json();
        setWorkspace(newWorkspace);
        setIsConnected(true);
        toast.success('PEXA Workspace Created', `Workspace ID: ${newWorkspace.workspaceId}`);
      }
    } catch (error) {
      toast.error('Failed to create workspace', 'Please check your PEXA credentials');
    } finally {
      setLoading(false);
    }
  };

  const submitForSettlement = async () => {
    if (!workspace) return;
    
    try {
      const response = await fetch(`/api/pexa/workspace/${workspace.workspaceId}/submit`, {
        method: 'POST'
      });
      
      if (response.ok) {
        toast.success('Submitted for Settlement', 'PEXA workspace has been submitted');
        await loadWorkspace();
      }
    } catch (error) {
      toast.error('Submission failed', 'Please check outstanding tasks');
    }
  };

  if (!isConnected && !workspace) {
    return (
      <div className="space-y-6">
        {/* Building Placeholder Alerts */}
        <div className="grid grid-cols-2 gap-4">
          <Alert className="border-blue-200 bg-blue-50">
            <AlertCircle className="w-4 h-4 text-blue-600" />
            <AlertDescription>
              <strong className="text-blue-900">🚧 Building: Real-time PEXA Integration</strong>
              <p className="text-sm text-blue-800 mt-1">
                Live connection to PEXA for automatic workspace creation, document sync, and settlement tracking. OAuth authentication is in development.
              </p>
            </AlertDescription>
          </Alert>
          <Alert className="border-purple-200 bg-purple-50">
            <AlertCircle className="w-4 h-4 text-purple-600" />
            <AlertDescription>
              <strong className="text-purple-900">🚧 Building: Automated Document Lodgement</strong>
              <p className="text-sm text-purple-800 mt-1">
                Smart document detection, verification, and lodgement with Land Registry Services. OCR and validation engines coming soon.
              </p>
            </AlertDescription>
          </Alert>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              PEXA Integration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Connect to PEXA</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Create a PEXA workspace to manage digital property settlement
                </p>
              </div>
              <Button onClick={createWorkspace} disabled={loading}>
                {loading ? 'Creating...' : 'Create PEXA Workspace'}
              </Button>
              <Alert className="text-left">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription className="text-xs">
                  <strong>Note:</strong> PEXA credentials required. Configure in Settings → Integrations → PEXA API.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        {/* Additional Building Features */}
        <Card>
          <CardHeader>
            <CardTitle>What's Being Built</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">Automatic Workspace Creation</h4>
                  <p className="text-sm text-gray-600">
                    One-click workspace creation from case data with auto-populated property details, parties, and financial information.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">Real-time Settlement Tracking</h4>
                  <p className="text-sm text-gray-600">
                    Live updates via webhooks showing document status, party actions, lodgement progress, and settlement milestones.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">Smart Document Management</h4>
                  <p className="text-sm text-gray-600">
                    AI-powered document classification, OCR extraction, automated verification against PEXA requirements, and electronic lodgement.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">Automated Financial Settlements</h4>
                  <p className="text-sm text-gray-600">
                    Automatic calculation of adjustments, stamp duty, fees, and settlement amounts with real-time validation.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <Users className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">Multi-party Collaboration</h4>
                  <p className="text-sm text-gray-600">
                    Automated invitations, role allocation, identity verification, and real-time collaboration for all settlement parties.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <Landmark className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">Land Registry Integration</h4>
                  <p className="text-sm text-gray-600">
                    Direct integration with state Land Registry Services for title searches, document lodgement, and registration tracking.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const ws = workspace || getMockWorkspaceData(caseData);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                PEXA Workspace
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Workspace ID: {ws.workspaceId}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={getStatusVariant(ws.status)}>
                {formatStatus(ws.status)}
              </Badge>
              <Button variant="outline" size="sm" onClick={syncWithPEXA} disabled={syncing}>
                <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'Syncing...' : 'Sync'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{ws.parties.length}</div>
              <div className="text-sm text-gray-600">Parties</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                ${ws.financialSettlement.totalSettlementAmount.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Settlement Amount</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{ws.documents.length}</div>
              <div className="text-sm text-gray-600">Documents</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{ws.tasks.filter((t: any) => t.status === 'outstanding').length}</div>
              <div className="text-sm text-gray-600">Outstanding Tasks</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settlement Date & Time */}
      {ws.settlementDateTime && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Settlement Date & Time</div>
                  <div className="text-lg font-semibold">
                    {format(new Date(ws.settlementDateTime), 'EEEE, MMMM d, yyyy \'at\' h:mm a')}
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Reschedule
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Outstanding Tasks Alert */}
      {ws.tasks.filter((t: any) => t.status === 'outstanding').length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>
            <strong>{ws.tasks.filter((t: any) => t.status === 'outstanding').length} outstanding tasks</strong> must be completed before settlement can proceed.
          </AlertDescription>
        </Alert>
      )}

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="parties">Parties</TabsTrigger>
          <TabsTrigger value="property">Property</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workspace Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Status</div>
                  <div className="font-medium">{formatStatus(ws.status)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Jurisdiction</div>
                  <div className="font-medium">{ws.jurisdiction}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Created Date</div>
                  <div className="font-medium">{format(new Date(ws.createdDate), 'dd/MM/yyyy')}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Last Modified</div>
                  <div className="font-medium">{format(new Date(ws.lastModifiedDate), 'dd/MM/yyyy')}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Role Allocations */}
          <Card>
            <CardHeader>
              <CardTitle>Role Allocations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ws.roleAllocations.map((role: any) => (
                  <div key={role.roleId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="font-medium">{formatRoleType(role.roleType)}</div>
                        <div className="text-sm text-gray-600">{role.organisationName || role.capacity}</div>
                      </div>
                    </div>
                    {role.representativeDetails && (
                      <div className="text-sm text-gray-600 text-right">
                        <div>{role.representativeDetails.name}</div>
                        <div>{role.representativeDetails.email}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Parties Tab */}
        <TabsContent value="parties" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Parties ({ws.parties.length})</span>
                <Button size="sm">
                  <Users className="w-4 h-4 mr-2" />
                  Add Party
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ws.parties.map((party: any) => (
                  <div key={party.partyId} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-semibold text-lg">{party.fullName}</div>
                        <Badge variant="outline" className="mt-1">{party.role}</Badge>
                      </div>
                      <Badge variant={party.identityVerified ? 'default' : 'secondary'}>
                        {party.identityVerified ? (
                          <><CheckCircle2 className="w-3 h-3 mr-1" /> Verified</>
                        ) : (
                          <><Clock className="w-3 h-3 mr-1" /> Pending</>
                        )}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-gray-600">Email</div>
                        <div>{party.email || 'Not provided'}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Phone</div>
                        <div>{party.phone || 'Not provided'}</div>
                      </div>
                      {party.address && (
                        <div className="col-span-2">
                          <div className="text-gray-600">Address</div>
                          <div>
                            {party.address.streetAddress}, {party.address.suburb} {party.address.state} {party.address.postcode}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Property Tab */}
        <TabsContent value="property" className="space-y-4">
          {ws.landTitles.map((title: any, index: number) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5 text-blue-600" />
                  Land Title Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Title Reference</div>
                    <div className="font-medium">{title.titleReference}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Lot/Plan Number</div>
                    <div className="font-medium">{title.lotPlanNumber}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-sm text-gray-600">Property Address</div>
                    <div className="font-medium flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {title.address.streetAddress}, {title.address.suburb} {title.address.state} {title.address.postcode}
                    </div>
                  </div>
                </div>

                {/* Mortgages */}
                {title.mortgages && title.mortgages.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Landmark className="w-4 h-4" />
                      Mortgages ({title.mortgages.length})
                    </h4>
                    <div className="space-y-2">
                      {title.mortgages.map((mortgage: any, idx: number) => (
                        <div key={idx} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                          <div>
                            <div className="font-medium">{mortgage.mortgagee}</div>
                            <div className="text-sm text-gray-600">
                              ${mortgage.mortgageAmount.toLocaleString()} • {mortgage.mortgageNumber}
                            </div>
                          </div>
                          <Badge variant={mortgage.action === 'discharge' ? 'destructive' : 'secondary'}>
                            {mortgage.action}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Caveats */}
                {title.caveats && title.caveats.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Caveats ({title.caveats.length})
                    </h4>
                    <div className="space-y-2">
                      {title.caveats.map((caveat: any, idx: number) => (
                        <div key={idx} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{caveat.caveatNumber}</div>
                              <div className="text-sm text-gray-600">Lodged by: {caveat.lodgedBy}</div>
                            </div>
                            <Badge>{caveat.action}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Settlement Statement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Summary */}
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Total Settlement Amount</div>
                <div className="text-3xl font-bold text-green-600">
                  ${ws.financialSettlement.totalSettlementAmount.toLocaleString()}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant={getDisbursementStatusVariant(ws.financialSettlement.disbursementStatus)}>
                    {formatDisbursementStatus(ws.financialSettlement.disbursementStatus)}
                  </Badge>
                </div>
              </div>

              {/* Source Items */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <ArrowDown className="w-4 h-4 text-green-600" />
                  Source Funds
                </h4>
                <div className="space-y-2">
                  {ws.financialSettlement.sourceItems.map((item: any) => (
                    <div key={item.itemId} className="p-3 bg-green-50 rounded-lg flex items-center justify-between">
                      <div>
                        <div className="font-medium">{item.description}</div>
                        <div className="text-sm text-gray-600">{item.party}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">
                          ${item.amount.toLocaleString()}
                        </div>
                        <Badge variant="outline" className="text-xs">{item.category}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Destination Items */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-blue-600" />
                  Destination Funds
                </h4>
                <div className="space-y-2">
                  {ws.financialSettlement.destinationItems.map((item: any) => (
                    <div key={item.itemId} className="p-3 bg-blue-50 rounded-lg flex items-center justify-between">
                      <div>
                        <div className="font-medium">{item.description}</div>
                        <div className="text-sm text-gray-600">{item.party}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-blue-600">
                          ${item.amount.toLocaleString()}
                        </div>
                        <Badge variant="outline" className="text-xs">{item.category}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fees & Duties */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3">Fees & Duties</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">PEXA Fees</span>
                    <span className="font-medium">${ws.financialSettlement.pexaFees.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Lodgement Fees</span>
                    <span className="font-medium">${ws.financialSettlement.lodgementFees.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Stamp Duty</span>
                    <span className="font-medium">${ws.financialSettlement.stampDuty.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Adjustments */}
              {ws.financialSettlement.adjustments.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Adjustments</h4>
                  <div className="space-y-2">
                    {ws.financialSettlement.adjustments.map((adj: any) => (
                      <div key={adj.adjustmentId} className="p-3 bg-purple-50 rounded-lg flex items-center justify-between">
                        <div>
                          <div className="font-medium">{adj.description}</div>
                          <div className="text-sm text-gray-600">
                            {adj.type} • Adjusted to {format(new Date(adj.adjustedTo), 'dd/MM/yyyy')}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">${adj.amount.toLocaleString()}</div>
                          <div className="text-xs text-gray-600">Paid by {adj.paidBy}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button className="flex-1">
                  <Send className="w-4 h-4 mr-2" />
                  Submit for Financial Settlement
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download Statement
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Documents ({ws.documents.length})</span>
                <Button size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Document
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ws.documents.map((doc: any) => (
                  <div key={doc.documentId} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <FileText className="w-5 h-5 text-blue-600 mt-1" />
                        <div className="flex-1">
                          <div className="font-medium">{doc.fileName}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            {formatDocumentType(doc.documentType)} • Uploaded by {doc.uploadedBy} on {format(new Date(doc.uploadedDate), 'dd/MM/yyyy')}
                          </div>
                          {doc.signatureRequired && (
                            <div className="mt-2">
                              <Badge variant={doc.signatureStatus === 'fully_signed' ? 'default' : 'secondary'}>
                                {doc.signatureStatus === 'fully_signed' ? (
                                  <><CheckCircle2 className="w-3 h-3 mr-1" /> Fully Signed</>
                                ) : doc.signatureStatus === 'partially_signed' ? (
                                  <><Clock className="w-3 h-3 mr-1" /> Partially Signed</>
                                ) : (
                                  <><AlertCircle className="w-3 h-3 mr-1" /> Unsigned</>
                                )}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                        {doc.signatureRequired && doc.signatureStatus !== 'fully_signed' && (
                          <Button size="sm">
                            <Send className="w-4 h-4 mr-2" />
                            Sign
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Settlement Tasks ({ws.tasks.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ws.tasks.map((task: any) => (
                  <div key={task.taskId} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {task.status === 'completed' ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600 mt-1" />
                        ) : task.status === 'outstanding' ? (
                          <AlertCircle className="w-5 h-5 text-orange-600 mt-1" />
                        ) : (
                          <Clock className="w-5 h-5 text-blue-600 mt-1" />
                        )}
                        <div className="flex-1">
                          <div className="font-medium">{task.description}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            Assigned to: {task.assignedTo}
                            {task.dueDate && ` • Due: ${format(new Date(task.dueDate), 'dd/MM/yyyy')}`}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={task.priority === 'critical' ? 'destructive' : 'secondary'}>
                          {task.priority}
                        </Badge>
                        <Badge variant={getTaskStatusVariant(task.status)}>
                          {task.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Button 
              className="flex-1" 
              onClick={submitForSettlement}
              disabled={ws.tasks.filter((t: any) => t.status === 'outstanding').length > 0}
            >
              <Send className="w-4 h-4 mr-2" />
              Submit for Settlement
            </Button>
            <Button variant="outline" className="flex-1">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Settlement
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper Functions
function getMockWorkspaceData(caseData: any) {
  return {
    workspaceId: `WS-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    status: 'in_progress',
    jurisdiction: 'NSW',
    roleAllocations: [
      {
        roleId: 'ROLE-1',
        roleType: 'incoming_mortgagee',
        participantId: 'PART-001',
        capacity: 'Lender',
        organisationName: caseData.financialData?.lender || 'Commonwealth Bank',
        representativeDetails: {
          name: 'Sarah Chen',
          email: 'sarah.chen@cba.com.au',
          phone: '(02) 9123 4567',
          reference: 'CBA-SETTLE-2024'
        }
      },
      {
        roleId: 'ROLE-2',
        roleType: 'purchaser',
        participantId: 'PART-002',
        capacity: 'Buyer',
        organisationName: 'Smith Legal',
        representativeDetails: {
          name: 'Michael Smith',
          email: 'michael@smithlegal.com.au',
          phone: '(02) 9876 5432',
          reference: 'SL-24-1234'
        }
      }
    ],
    settlementDateTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    parties: [
      {
        partyId: 'PARTY-1',
        partyType: 'individual',
        fullName: caseData.borrowerName || 'John Smith',
        email: caseData.borrowerEmail || 'john.smith@email.com',
        phone: '0412 345 678',
        identityVerified: true,
        role: 'Purchaser',
        address: caseData.propertyData?.address
      }
    ],
    landTitles: [
      {
        titleReference: caseData.propertyData?.titleReference || 'LOT 123 DP 456789',
        lotPlanNumber: caseData.propertyData?.lotPlan || 'LOT 123 DP 456789',
        jurisdiction: 'NSW',
        address: {
          streetAddress: caseData.propertyData?.address?.street || '123 Example Street',
          suburb: caseData.propertyData?.address?.suburb || 'Sydney',
          state: caseData.propertyData?.address?.state || 'NSW',
          postcode: caseData.propertyData?.address?.postcode || '2000'
        },
        titleType: 'torrens',
        dealingNumbers: [] as any[],
        caveats: [] as any[],
        mortgages: caseData.financialData?.existingMortgages?.map((m: any, i: number) => ({
          mortgageNumber: `MTG-${i + 1}`,
          mortgagee: m.lender,
          mortgageAmount: m.amount,
          action: 'discharge',
          accountNumber: m.accountNumber
        })) || []
      }
    ],
    financialSettlement: {
      settlementStatementId: `STMT-${caseData.caseId}`,
      totalSettlementAmount: caseData.financialData?.totalLoanAmount || 850000,
      sourceItems: [
        {
          itemId: 'SOURCE-1',
          description: 'New Mortgage Loan',
          amount: caseData.financialData?.totalLoanAmount || 850000,
          direction: 'source',
          category: 'loan',
          party: caseData.financialData?.lender || 'Commonwealth Bank'
        }
      ],
      destinationItems: caseData.financialData?.existingMortgages?.map((m: any, i: number) => ({
        itemId: `DEST-${i + 1}`,
        description: `Discharge ${m.lender}`,
        amount: m.payoutAmount || m.amount,
        direction: 'destination',
        category: 'other',
        party: m.lender
      })) || [],
      adjustments: [] as any[],
      pexaFees: 325,
      lodgementFees: 185,
      stampDuty: caseData.financialData?.stampDuty || 34520,
      disbursementStatus: 'pending'
    },
    documents: [
      {
        documentId: 'DOC-1',
        documentType: 'contract',
        fileName: 'Contract_of_Sale.pdf',
        uploadedDate: new Date().toISOString(),
        uploadedBy: 'System',
        signatureRequired: true,
        signatureStatus: 'unsigned',
        signatories: ['Purchaser', 'Vendor']
      },
      {
        documentId: 'DOC-2',
        documentType: 'mortgage',
        fileName: 'Mortgage_Document.pdf',
        uploadedDate: new Date().toISOString(),
        uploadedBy: 'System',
        signatureRequired: true,
        signatureStatus: 'unsigned',
        signatories: ['Borrower', 'Lender']
      }
    ],
    tasks: [
      {
        taskId: 'TASK-1',
        taskType: 'identity_verification',
        description: 'Complete identity verification for all parties',
        status: 'outstanding',
        assignedTo: 'Smith Legal',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'critical'
      },
      {
        taskId: 'TASK-2',
        taskType: 'funds_confirmation',
        description: 'Confirm source funds availability',
        status: 'outstanding',
        assignedTo: 'Commonwealth Bank',
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'high'
      }
    ],
    lodgementInstructions: [] as any[],
    createdDate: new Date().toISOString(),
    lastModifiedDate: new Date().toISOString()
  };
}

function getStatusVariant(status: string) {
  switch (status) {
    case 'completed': return 'default';
    case 'settled': return 'default';
    case 'settlement_booked': return 'default';
    case 'in_progress': return 'secondary';
    case 'failed': return 'destructive';
    case 'cancelled': return 'destructive';
    default: return 'outline';
  }
}

function formatStatus(status: string) {
  return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function formatRoleType(roleType: string) {
  return roleType.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function formatDocumentType(docType: string) {
  return docType.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function getDisbursementStatusVariant(status: string) {
  switch (status) {
    case 'completed': return 'default';
    case 'disbursed': return 'default';
    case 'funds_held': return 'secondary';
    case 'funds_required': return 'destructive';
    default: return 'outline';
  }
}

function formatDisbursementStatus(status: string) {
  return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function getTaskStatusVariant(status: string) {
  switch (status) {
    case 'completed': return 'default';
    case 'in_progress': return 'secondary';
    case 'outstanding': return 'destructive';
    default: return 'outline';
  }
}