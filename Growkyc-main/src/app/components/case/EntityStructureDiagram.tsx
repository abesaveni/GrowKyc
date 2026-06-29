import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Building2, User, Users, Shield, ChevronRight, CheckCircle, Plus, AlertCircle } from 'lucide-react';

interface Director {
  name: string;
  position: string;
  verified?: boolean;
}

interface Shareholder {
  name: string;
  percentage: number;
  verified?: boolean;
}

interface Trustee {
  type: 'individual' | 'company';
  name: string;
  verified?: boolean;
  directors?: Director[];
}

interface Guarantor {
  type: 'individual' | 'company';
  name: string;
  verified?: boolean;
  directors?: Director[];
}

interface EntityStructureDiagramProps {
  entityType: 'personal' | 'company' | 'trust';
  borrowerName?: string;
  companyName?: string;
  trustName?: string;
  directors?: Director[];
  shareholders?: Shareholder[];
  trustees?: Trustee[];
  guarantors?: Guarantor[];
}

export function EntityStructureDiagram({
  entityType,
  borrowerName,
  companyName,
  trustName,
  directors = [],
  shareholders = [],
  trustees = [],
  guarantors = []
}: EntityStructureDiagramProps) {
  
  const renderPersonalStructure = () => (
    <div className="flex flex-col items-center gap-6 py-8">
      {/* Main Borrower */}
      <div className="flex flex-col items-center">
        <div className="text-xs text-slate-400 mb-2 uppercase font-semibold">Borrowing Entity</div>
        <div className="bg-gradient-to-br from-indigo-500 to-blue-600 text-white p-6 rounded-xl shadow-lg border-4 border-indigo-300 min-w-[280px]">
          <div className="flex items-center gap-3 mb-2">
            <User className="w-6 h-6" />
            <div>
              <div className="text-sm opacity-80">Personal (Individual)</div>
              <div className="text-lg font-bold">{borrowerName || 'Primary Borrower'}</div>
            </div>
            <CheckCircle className="w-5 h-5 ml-auto" />
          </div>
        </div>
      </div>

      {/* Guarantors */}
      {guarantors.length > 0 ? (
        <>
          <div className="flex items-center gap-2">
            <div className="w-0.5 h-12 bg-gray-300"></div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="text-xs text-slate-400 mb-3 uppercase font-semibold">Guarantors ({guarantors.length})</div>
            <div className="flex flex-wrap gap-4 justify-center max-w-4xl">
              {guarantors.map((guarantor, idx) => (
                <div key={idx} className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white p-4 rounded-lg shadow-md border-2 border-teal-300 min-w-[220px]">
                  <div className="flex items-center gap-2 mb-1">
                    {guarantor.type === 'individual' ? <User className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                    <div className="text-xs opacity-80">{guarantor.type === 'individual' ? 'Individual' : 'Company'}</div>
                    {guarantor.verified && <CheckCircle className="w-4 h-4 ml-auto" />}
                  </div>
                  <div className="font-bold">{guarantor.name}</div>
                  
                  {/* Company guarantor directors */}
                  {guarantor.type === 'company' && guarantor.directors && guarantor.directors.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-teal-400/30">
                      <div className="text-xs opacity-80 mb-2">Directors:</div>
                      {guarantor.directors.map((dir, didx) => (
                        <div key={didx} className="text-xs flex items-center gap-1 mb-1">
                          <User className="w-3 h-3" />
                          <span>{dir.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <div className="w-0.5 h-12 bg-gray-300"></div>
          </div>
          
          <div className="flex flex-col items-center w-full max-w-md">
            <div className="text-xs text-slate-400 mb-3 uppercase font-semibold">Guarantors</div>
            <div className="border-2 border-dashed border-white/10 rounded-lg p-6 w-full bg-white/5/50">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="bg-white/10 rounded-full p-3">
                  <Plus className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-300 mb-1">No Guarantors Added</div>
                  <div className="text-xs text-slate-400">
                    Add guarantors if required for this borrowing entity
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderCompanyStructure = () => (
    <div className="flex flex-col items-center gap-6 py-8">
      {/* Company Entity */}
      <div className="flex flex-col items-center">
        <div className="text-xs text-slate-400 mb-2 uppercase font-semibold">Borrowing Entity</div>
        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white p-6 rounded-xl shadow-lg border-4 border-purple-300 min-w-[320px]">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-7 h-7" />
            <div>
              <div className="text-sm opacity-80">Company</div>
              <div className="text-xl font-bold">{companyName || 'Company Pty Ltd'}</div>
            </div>
            <CheckCircle className="w-5 h-5 ml-auto" />
          </div>
        </div>
      </div>

      {/* Directors and Shareholders */}
      {(directors.length > 0 || shareholders.length > 0) ? (
        <>
          <div className="flex items-center gap-2">
            <div className="w-0.5 h-12 bg-gray-300"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full">
            {/* Directors */}
            {directors.length > 0 ? (
              <div className="flex flex-col">
                <div className="text-xs text-slate-400 mb-3 uppercase font-semibold text-center">
                  Directors ({directors.length})
                </div>
                <div className="space-y-3">
                  {directors.map((director, idx) => (
                    <div key={idx} className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-lg shadow-md border-2 border-blue-300">
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        <div className="flex-1">
                          <div className="font-bold">{director.name}</div>
                          <div className="text-xs opacity-80">{director.position}</div>
                        </div>
                        {director.verified && <CheckCircle className="w-4 h-4" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="text-xs text-slate-400 mb-3 uppercase font-semibold text-center">
                  Directors
                </div>
                <div className="border-2 border-dashed border-white/10 rounded-lg p-6 bg-white/5/50">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="bg-white/10 rounded-full p-2">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-300 mb-1">No Directors</div>
                      <div className="text-xs text-slate-400">
                        Add company directors
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Shareholders */}
            {shareholders.length > 0 ? (
              <div className="flex flex-col">
                <div className="text-xs text-slate-400 mb-3 uppercase font-semibold text-center">
                  Shareholders 25%+ ({shareholders.length})
                </div>
                <div className="space-y-3">
                  {shareholders.map((shareholder, idx) => (
                    <div key={idx} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-lg shadow-md border-2 border-green-300">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        <div className="flex-1">
                          <div className="font-bold">{shareholder.name}</div>
                          <div className="text-xs opacity-80">{shareholder.percentage}% ownership</div>
                        </div>
                        {shareholder.verified && <CheckCircle className="w-4 h-4" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="text-xs text-slate-400 mb-3 uppercase font-semibold text-center">
                  Shareholders 25%+
                </div>
                <div className="border-2 border-dashed border-white/10 rounded-lg p-6 bg-white/5/50">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="bg-white/10 rounded-full p-2">
                      <Users className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-300 mb-1">No Shareholders</div>
                      <div className="text-xs text-slate-400">
                        Add shareholders with 25%+ ownership
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <div className="w-0.5 h-12 bg-gray-300"></div>
          </div>
          
          <div className="flex flex-col items-center w-full max-w-md">
            <div className="border-2 border-dashed border-amber-300 rounded-lg p-6 w-full bg-amber-500/10/50">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="bg-amber-500/20 rounded-full p-3">
                  <AlertCircle className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-amber-300 mb-1">Company Structure Required</div>
                  <div className="text-xs text-amber-300">
                    Please add directors and shareholders (25%+ ownership) to complete the company structure
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Guarantors */}
      {guarantors.length > 0 ? (
        <>
          <div className="flex items-center gap-2">
            <div className="w-0.5 h-12 bg-gray-300"></div>
          </div>
          
          <div className="flex flex-col items-center w-full">
            <div className="text-xs text-slate-400 mb-3 uppercase font-semibold">Guarantors ({guarantors.length})</div>
            <div className="flex flex-wrap gap-4 justify-center max-w-4xl">
              {guarantors.map((guarantor, idx) => (
                <div key={idx} className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white p-4 rounded-lg shadow-md border-2 border-teal-300 min-w-[220px]">
                  <div className="flex items-center gap-2 mb-1">
                    {guarantor.type === 'individual' ? <User className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                    <div className="text-xs opacity-80">{guarantor.type === 'individual' ? 'Individual' : 'Company'}</div>
                    {guarantor.verified && <CheckCircle className="w-4 h-4 ml-auto" />}
                  </div>
                  <div className="font-bold">{guarantor.name}</div>
                  
                  {guarantor.type === 'company' && guarantor.directors && guarantor.directors.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-teal-400/30">
                      <div className="text-xs opacity-80 mb-2">Directors:</div>
                      {guarantor.directors.map((dir, didx) => (
                        <div key={didx} className="text-xs flex items-center gap-1 mb-1">
                          <User className="w-3 h-3" />
                          <span>{dir.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <div className="w-0.5 h-12 bg-gray-300"></div>
          </div>
          
          <div className="flex flex-col items-center w-full max-w-md">
            <div className="text-xs text-slate-400 mb-3 uppercase font-semibold">Guarantors</div>
            <div className="border-2 border-dashed border-white/10 rounded-lg p-6 w-full bg-white/5/50">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="bg-white/10 rounded-full p-3">
                  <Plus className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-300 mb-1">No Guarantors Added</div>
                  <div className="text-xs text-slate-400">
                    Add guarantors if required for this borrowing entity
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderTrustStructure = () => (
    <div className="flex flex-col items-center gap-6 py-8">
      {/* Trust Entity */}
      <div className="flex flex-col items-center">
        <div className="text-xs text-slate-400 mb-2 uppercase font-semibold">Borrowing Entity</div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white p-6 rounded-xl shadow-lg border-4 border-amber-300 min-w-[320px]">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-7 h-7" />
            <div>
              <div className="text-sm opacity-80">Trust</div>
              <div className="text-xl font-bold">{trustName || 'Family Trust'}</div>
            </div>
            <CheckCircle className="w-5 h-5 ml-auto" />
          </div>
        </div>
      </div>

      {/* Trustees */}
      {trustees.length > 0 ? (
        <>
          <div className="flex items-center gap-2">
            <div className="w-0.5 h-12 bg-gray-300"></div>
          </div>
          
          <div className="flex flex-col items-center w-full">
            <div className="text-xs text-slate-400 mb-3 uppercase font-semibold">Trustees ({trustees.length})</div>
            <div className="flex flex-wrap gap-4 justify-center max-w-4xl">
              {trustees.map((trustee, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="bg-gradient-to-br from-violet-500 to-purple-600 text-white p-4 rounded-lg shadow-md border-2 border-violet-300 min-w-[240px]">
                    <div className="flex items-center gap-2 mb-1">
                      {trustee.type === 'individual' ? <User className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                      <div className="text-xs opacity-80">
                        {trustee.type === 'individual' ? 'Individual Trustee' : 'Corporate Trustee'}
                      </div>
                      {trustee.verified && <CheckCircle className="w-4 h-4 ml-auto" />}
                    </div>
                    <div className="font-bold">{trustee.name}</div>
                  </div>

                  {/* Corporate trustee directors */}
                  {trustee.type === 'company' && trustee.directors && trustee.directors.length > 0 && (
                    <>
                      <div className="w-0.5 h-8 bg-gray-300 my-2"></div>
                      <div className="space-y-2">
                        {trustee.directors.map((director, didx) => (
                          <div key={didx} className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-3 rounded-lg shadow-sm border border-blue-300 min-w-[200px]">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <div className="flex-1">
                                <div className="text-sm font-bold">{director.name}</div>
                                <div className="text-xs opacity-80">{director.position}</div>
                              </div>
                              {director.verified && <CheckCircle className="w-3 h-3" />}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <div className="w-0.5 h-12 bg-gray-300"></div>
          </div>
          
          <div className="flex flex-col items-center w-full max-w-md">
            <div className="text-xs text-slate-400 mb-3 uppercase font-semibold">Trustees</div>
            <div className="border-2 border-dashed border-amber-300 rounded-lg p-6 w-full bg-amber-500/10/50">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="bg-amber-500/20 rounded-full p-3">
                  <AlertCircle className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-amber-300 mb-1">Trust Structure Required</div>
                  <div className="text-xs text-amber-300">
                    Please add at least one trustee (individual or corporate) to complete the trust structure
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Guarantors */}
      {guarantors.length > 0 ? (
        <>
          <div className="flex items-center gap-2">
            <div className="w-0.5 h-12 bg-gray-300"></div>
          </div>
          
          <div className="flex flex-col items-center w-full">
            <div className="text-xs text-slate-400 mb-3 uppercase font-semibold">Guarantors ({guarantors.length})</div>
            <div className="flex flex-wrap gap-4 justify-center max-w-4xl">
              {guarantors.map((guarantor, idx) => (
                <div key={idx} className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white p-4 rounded-lg shadow-md border-2 border-teal-300 min-w-[220px]">
                  <div className="flex items-center gap-2 mb-1">
                    {guarantor.type === 'individual' ? <User className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                    <div className="text-xs opacity-80">{guarantor.type === 'individual' ? 'Individual' : 'Company'}</div>
                    {guarantor.verified && <CheckCircle className="w-4 h-4 ml-auto" />}
                  </div>
                  <div className="font-bold">{guarantor.name}</div>
                  
                  {guarantor.type === 'company' && guarantor.directors && guarantor.directors.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-teal-400/30">
                      <div className="text-xs opacity-80 mb-2">Directors:</div>
                      {guarantor.directors.map((dir, didx) => (
                        <div key={didx} className="text-xs flex items-center gap-1 mb-1">
                          <User className="w-3 h-3" />
                          <span>{dir.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <div className="w-0.5 h-12 bg-gray-300"></div>
          </div>
          
          <div className="flex flex-col items-center w-full max-w-md">
            <div className="text-xs text-slate-400 mb-3 uppercase font-semibold">Guarantors</div>
            <div className="border-2 border-dashed border-white/10 rounded-lg p-6 w-full bg-white/5/50">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="bg-white/10 rounded-full p-3">
                  <Plus className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-300 mb-1">No Guarantors Added</div>
                  <div className="text-xs text-slate-400">
                    Add guarantors if required for this borrowing entity
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <Card className="border-2 border-indigo-300 bg-gradient-to-br from-slate-50 to-blue-50">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="w-5 h-5" />
          Complete Borrowing Entity Structure
        </CardTitle>
        <p className="text-sm opacity-90 mt-1">
          Visual representation of all parties requiring verification
        </p>
      </CardHeader>
      <CardContent className="p-6">
        {entityType === 'personal' && renderPersonalStructure()}
        {entityType === 'company' && renderCompanyStructure()}
        {entityType === 'trust' && renderTrustStructure()}

        {/* Legend */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="text-xs text-slate-400 mb-3 uppercase font-semibold">Legend</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-slate-300">Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-300" />
              <span className="text-slate-300">Individual</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-300" />
              <span className="text-slate-300">Company</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-slate-300" />
              <span className="text-slate-300">Trust</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}