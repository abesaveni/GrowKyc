import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { StatusBadge } from '../StatusBadge';
import { format } from 'date-fns';
import { Case } from '../../data/mockData';

interface ComprehensiveCaseDetailsProps {
  caseData: Case;
}

export function ComprehensiveCaseDetails({ caseData }: ComprehensiveCaseDetailsProps) {
  const lvr = ((caseData.outstandingDebt / caseData.valuation.amount) * 100).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Summary Cards Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Case Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-slate-400">Case Created</p>
              <p className="font-medium">{format(caseData.createdAt, 'dd MMM yyyy, HH:mm')}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Last Updated</p>
              <p className="font-medium">{format(caseData.updatedAt, 'dd MMM yyyy, HH:mm')}</p>
            </div>
            {caseData.urgency && (
              <div>
                <p className="text-sm text-slate-400">Urgency Level</p>
                <p className="font-medium capitalize">{caseData.urgency}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-slate-400">Total Bids</p>
              <p className="font-medium">{caseData.bidCount || 0} bids received</p>
            </div>
            {caseData.currentBid && (
              <div>
                <p className="text-sm text-slate-400">Current Highest Bid</p>
                <p className="font-medium text-lg text-green-400">
                  ${caseData.currentBid.toLocaleString()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Overview & Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Property Valuation</span>
              <span className="font-semibold">${caseData.valuation.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Outstanding Debt</span>
              <span className="font-semibold text-red-400">
                ${caseData.outstandingDebt.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">LVR (Loan to Value)</span>
              <span className="font-semibold">{lvr}%</span>
            </div>
            {caseData.loanDetails?.arrears && parseFloat(String(caseData.loanDetails.arrears)) > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Arrears</span>
                <span className="font-semibold text-orange-400">
                  ${parseFloat(String(caseData.loanDetails.arrears)).toLocaleString()}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center pt-4 border-t">
              <span className="text-slate-300">Equity Available</span>
              <span className="font-semibold text-green-400">
                ${(caseData.valuation.amount - caseData.outstandingDebt).toLocaleString()}
              </span>
            </div>
            {caseData.minimumBid && (
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Minimum Bid</span>
                <span className="font-semibold">${caseData.minimumBid.toLocaleString()}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Borrower & Entity Details */}
      {caseData.borrowerDetails && (
        <Card>
          <CardHeader>
            <CardTitle>Borrower & Entity Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-slate-100 mb-3">Personal Information</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-slate-400">Full Name</p>
                    <p className="font-medium">{caseData.borrowerDetails.firstName} {caseData.borrowerDetails.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Email</p>
                    <p className="font-medium">{caseData.borrowerDetails.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Phone</p>
                    <p className="font-medium">{caseData.borrowerDetails.phone}</p>
                  </div>
                  {caseData.borrowerDetails.dob && (
                    <div>
                      <p className="text-sm text-slate-400">Date of Birth</p>
                      <p className="font-medium">{caseData.borrowerDetails.dob}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-100 mb-3">KYC & Verification</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-slate-400">KYC Status</p>
                    <div className="mt-1">
                      <StatusBadge 
                        status={caseData.borrowerDetails.kycStatus === 'verified' ? 'completed' : 'pending'} 
                        type="case" 
                      />
                    </div>
                  </div>
                  {caseData.borrowerDetails.idType && (
                    <div>
                      <p className="text-sm text-slate-400">ID Type</p>
                      <p className="font-medium capitalize">{caseData.borrowerDetails.idType.replace(/_/g, ' ')}</p>
                    </div>
                  )}
                  {caseData.borrowerDetails.sourceOfFunds && (
                    <div>
                      <p className="text-sm text-slate-400">Source of Funds</p>
                      <p className="font-medium">{caseData.borrowerDetails.sourceOfFunds}</p>
                    </div>
                  )}
                  {caseData.borrowerDetails.pepStatus && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-2 mt-2">
                      <p className="text-sm font-semibold text-yellow-300">⚠️ PEP Status Flagged</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-100 mb-3">Employment</h3>
                <div className="space-y-2">
                  {caseData.borrowerDetails.employment && (
                    <div>
                      <p className="text-sm text-slate-400">Employment Status</p>
                      <p className="font-medium capitalize">{caseData.borrowerDetails.employment}</p>
                    </div>
                  )}
                  {caseData.borrowerDetails.employer && (
                    <div>
                      <p className="text-sm text-slate-400">Employer</p>
                      <p className="font-medium">{caseData.borrowerDetails.employer}</p>
                    </div>
                  )}
                  {caseData.borrowerDetails.occupation && (
                    <div>
                      <p className="text-sm text-slate-400">Occupation</p>
                      <p className="font-medium">{caseData.borrowerDetails.occupation}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Entity Structure */}
            {caseData.entityStructure && caseData.entityStructure.type !== 'personal' && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold text-slate-100 mb-3">Entity Structure</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {caseData.entityStructure.type === 'company' && (
                    <>
                      <div>
                        <p className="text-sm text-slate-400">Company Name</p>
                        <p className="font-medium">{caseData.entityStructure.companyName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">ACN / ABN</p>
                        <p className="font-medium">{caseData.entityStructure.companyACN} / {caseData.entityStructure.companyABN}</p>
                      </div>
                      {caseData.entityStructure.directors && caseData.entityStructure.directors.length > 0 && (
                        <div className="col-span-2">
                          <p className="text-sm text-slate-400 mb-2">Directors ({caseData.entityStructure.directors.length})</p>
                          <div className="space-y-1">
                            {caseData.entityStructure.directors.slice(0, 3).map((director: any, idx: number) => (
                              <p key={idx} className="text-sm font-medium">• {director.name} - {director.position}</p>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  {caseData.entityStructure.type === 'trust' && (
                    <>
                      <div>
                        <p className="text-sm text-slate-400">Trust Name</p>
                        <p className="font-medium">{caseData.entityStructure.trustName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Trust Type</p>
                        <p className="font-medium capitalize">{caseData.entityStructure.trustType}</p>
                      </div>
                      {caseData.entityStructure.trustees && caseData.entityStructure.trustees.length > 0 && (
                        <div className="col-span-2">
                          <p className="text-sm text-slate-400 mb-2">Trustees ({caseData.entityStructure.trustees.length})</p>
                          <div className="space-y-1">
                            {caseData.entityStructure.trustees.slice(0, 3).map((trustee: any, idx: number) => (
                              <p key={idx} className="text-sm font-medium">• {trustee.name}</p>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Property Extended Details */}
      {caseData.property && (
        <Card>
          <CardHeader>
            <CardTitle>Extended Property Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {caseData.property.titleReference && (
                <div>
                  <p className="text-sm text-slate-400">Title Reference</p>
                  <p className="font-medium">{caseData.property.titleReference}</p>
                </div>
              )}
              {caseData.property.lotNumber && (
                <div>
                  <p className="text-sm text-slate-400">Lot / Plan</p>
                  <p className="font-medium">{caseData.property.lotNumber} / {caseData.property.planNumber}</p>
                </div>
              )}
              {caseData.property.localGovernmentArea && (
                <div>
                  <p className="text-sm text-slate-400">LGA</p>
                  <p className="font-medium">{caseData.property.localGovernmentArea}</p>
                </div>
              )}
              {caseData.property.zoning && (
                <div>
                  <p className="text-sm text-slate-400">Zoning</p>
                  <p className="font-medium">{caseData.property.zoning}</p>
                </div>
              )}
              {caseData.property.yearBuilt && (
                <div>
                  <p className="text-sm text-slate-400">Year Built</p>
                  <p className="font-medium">{caseData.property.yearBuilt}</p>
                </div>
              )}
              {caseData.property.floorArea && (
                <div>
                  <p className="text-sm text-slate-400">Floor Area</p>
                  <p className="font-medium">{caseData.property.floorArea} m²</p>
                </div>
              )}
              {caseData.property.condition && (
                <div>
                  <p className="text-sm text-slate-400">Condition</p>
                  <p className="font-medium capitalize">{caseData.property.condition}</p>
                </div>
              )}
              {caseData.property.construction && (
                <div>
                  <p className="text-sm text-slate-400">Construction</p>
                  <p className="font-medium capitalize">{caseData.property.construction}</p>
                </div>
              )}
            </div>

            {/* Rates & Charges */}
            {(caseData.property.councilRates || caseData.property.waterRates || caseData.property.strataFees) && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold text-slate-100 mb-3">Rates & Charges</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {caseData.property.councilRates && (
                    <div>
                      <p className="text-sm text-slate-400">Council Rates</p>
                      <p className="font-medium">${parseFloat(caseData.property.councilRates).toLocaleString()}</p>
                    </div>
                  )}
                  {caseData.property.waterRates && (
                    <div>
                      <p className="text-sm text-slate-400">Water Rates</p>
                      <p className="font-medium">${parseFloat(caseData.property.waterRates).toLocaleString()}</p>
                    </div>
                  )}
                  {caseData.property.strataFees && (
                    <div>
                      <p className="text-sm text-slate-400">Strata Fees</p>
                      <p className="font-medium">${parseFloat(caseData.property.strataFees).toLocaleString()}</p>
                    </div>
                  )}
                  {caseData.property.landTax && (
                    <div>
                      <p className="text-sm text-slate-400">Land Tax</p>
                      <p className="font-medium">${parseFloat(caseData.property.landTax).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Risk Assessments */}
            {(caseData.property.floodRisk || caseData.property.bushfireRisk) && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold text-slate-100 mb-3">Environmental Risk</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {caseData.property.floodRisk && (
                    <div>
                      <p className="text-sm text-slate-400">Flood Risk</p>
                      <p className="font-medium capitalize">{caseData.property.floodRisk}</p>
                    </div>
                  )}
                  {caseData.property.bushfireRisk && (
                    <div>
                      <p className="text-sm text-slate-400">Bushfire Risk</p>
                      <p className="font-medium capitalize">{caseData.property.bushfireRisk}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* RP Data Valuation */}
      {caseData.valuation?.rpDataAvmMid && (
        <Card>
          <CardHeader>
            <CardTitle>RP Data AVM Valuation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-slate-400">AVM Mid (Used)</p>
                <p className="font-medium text-lg text-green-400">${caseData.valuation.rpDataAvmMid.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">AVM Low</p>
                <p className="font-medium">${caseData.valuation.rpDataAvmLow?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">AVM High</p>
                <p className="font-medium">${caseData.valuation.rpDataAvmHigh?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Confidence Score</p>
                <p className="font-medium">{caseData.valuation.rpDataConfidence}</p>
              </div>
              {caseData.valuation.rpDataLastSaleDate && (
                <>
                  <div>
                    <p className="text-sm text-slate-400">Last Sale Date</p>
                    <p className="font-medium">{caseData.valuation.rpDataLastSaleDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Last Sale Price</p>
                    <p className="font-medium">${caseData.valuation.rpDataLastSalePrice?.toLocaleString()}</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loan Details */}
      {caseData.loanDetails && (
        <Card>
          <CardHeader>
            <CardTitle>Loan Details & Default History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {caseData.loanDetails.originalLoanAmount && (
                <div>
                  <p className="text-sm text-slate-400">Original Loan Amount</p>
                  <p className="font-medium">
                    ${parseFloat(String(caseData.loanDetails.originalLoanAmount)).toLocaleString()}
                  </p>
                </div>
              )}
              {caseData.loanDetails.interestRate && (
                <div>
                  <p className="text-sm text-slate-400">Interest Rate</p>
                  <p className="font-medium">{caseData.loanDetails.interestRate}%</p>
                </div>
              )}
              {caseData.loanDetails.missedPayments !== undefined && (
                <div>
                  <p className="text-sm text-slate-400">Missed Payments</p>
                  <p className="font-medium text-red-400">{caseData.loanDetails.missedPayments}</p>
                </div>
              )}
              {caseData.loanDetails.repaymentType && (
                <div>
                  <p className="text-sm text-slate-400">Repayment Type</p>
                  <p className="font-medium capitalize">{caseData.loanDetails.repaymentType.replace(/_/g, ' ')}</p>
                </div>
              )}
              {caseData.loanDetails.defaultDate && (
                <div className="col-span-2">
                  <p className="text-sm text-slate-400">Default Date</p>
                  <p className="font-medium">{caseData.loanDetails.defaultDate}</p>
                </div>
              )}
              {caseData.loanDetails.loanStartDate && (
                <div className="col-span-2">
                  <p className="text-sm text-slate-400">Loan Start Date</p>
                  <p className="font-medium">{caseData.loanDetails.loanStartDate}</p>
                </div>
              )}
              {caseData.loanDetails.defaultReason && (
                <div className="col-span-4">
                  <p className="text-sm text-slate-400">Default Reason</p>
                  <p className="font-medium">{caseData.loanDetails.defaultReason}</p>
                </div>
              )}
              {caseData.loanDetails.hardshipCircumstances && (
                <div className="col-span-4">
                  <p className="text-sm text-slate-400">Hardship Circumstances</p>
                  <p className="font-medium">{caseData.loanDetails.hardshipCircumstances}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lender Details */}
      {caseData.lenderDetails && (
        <Card>
          <CardHeader>
            <CardTitle>Lender Details & Licensing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-slate-400">Lender Name</p>
                <p className="font-medium">{caseData.lenderDetails.name}</p>
              </div>
              {caseData.lenderDetails.contact && (
                <div>
                  <p className="text-sm text-slate-400">Contact Person</p>
                  <p className="font-medium">{caseData.lenderDetails.contact}</p>
                </div>
              )}
              {caseData.lenderDetails.email && (
                <div>
                  <p className="text-sm text-slate-400">Email</p>
                  <p className="font-medium">{caseData.lenderDetails.email}</p>
                </div>
              )}
              {caseData.lenderDetails.phone && (
                <div>
                  <p className="text-sm text-slate-400">Phone</p>
                  <p className="font-medium">{caseData.lenderDetails.phone}</p>
                </div>
              )}
              {caseData.lenderDetails.accountNumber && (
                <div>
                  <p className="text-sm text-slate-400">Account Number</p>
                  <p className="font-medium">{caseData.lenderDetails.accountNumber}</p>
                </div>
              )}
              {caseData.lenderDetails.aclNumber && (
                <>
                  <div>
                    <p className="text-sm text-slate-400">ACL Number</p>
                    <p className="font-medium">{caseData.lenderDetails.aclNumber}</p>
                  </div>
                  {caseData.lenderDetails.aclHolderName && (
                    <div>
                      <p className="text-sm text-slate-400">ACL Holder Name</p>
                      <p className="font-medium">{caseData.lenderDetails.aclHolderName}</p>
                    </div>
                  )}
                  {caseData.lenderDetails.licenceType && (
                    <div>
                      <p className="text-sm text-slate-400">Licence Type</p>
                      <p className="font-medium">{caseData.lenderDetails.licenceType}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Parties */}
      {caseData.allParties && Object.keys(caseData.allParties).some(key => caseData.allParties?.[key as keyof typeof caseData.allParties]) && (
        <Card>
          <CardHeader>
            <CardTitle>All Parties & Representatives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {caseData.allParties.borrowerLawyer && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-sm text-slate-300 mb-2">Borrower's Lawyer</h4>
                  <p className="font-medium">{caseData.allParties.borrowerLawyer.name}</p>
                  <p className="text-sm text-slate-300">{caseData.allParties.borrowerLawyer.firm}</p>
                  <p className="text-sm text-slate-300">{caseData.allParties.borrowerLawyer.email}</p>
                  <p className="text-sm text-slate-300">{caseData.allParties.borrowerLawyer.phone}</p>
                </div>
              )}
              {caseData.allParties.lenderLawyer && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-sm text-slate-300 mb-2">Lender's Lawyer</h4>
                  <p className="font-medium">{caseData.allParties.lenderLawyer.name}</p>
                  <p className="text-sm text-slate-300">{caseData.allParties.lenderLawyer.firm}</p>
                  <p className="text-sm text-slate-300">{caseData.allParties.lenderLawyer.email}</p>
                  <p className="text-sm text-slate-300">{caseData.allParties.lenderLawyer.phone}</p>
                </div>
              )}
              {caseData.allParties.realEstateAgent && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-sm text-slate-300 mb-2">Real Estate Agent</h4>
                  <p className="font-medium">{caseData.allParties.realEstateAgent.name}</p>
                  <p className="text-sm text-slate-300">{caseData.allParties.realEstateAgent.agency}</p>
                  <p className="text-sm text-slate-300">{caseData.allParties.realEstateAgent.email}</p>
                  <p className="text-sm text-slate-300">{caseData.allParties.realEstateAgent.phone}</p>
                  <p className="text-xs text-slate-400">Lic: {caseData.allParties.realEstateAgent.license}</p>
                </div>
              )}
              {caseData.allParties.accountant && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-sm text-slate-300 mb-2">Accountant</h4>
                  <p className="font-medium">{caseData.allParties.accountant.name}</p>
                  <p className="text-sm text-slate-300">{caseData.allParties.accountant.firm}</p>
                  <p className="text-sm text-slate-300">{caseData.allParties.accountant.email}</p>
                  <p className="text-sm text-slate-300">{caseData.allParties.accountant.phone}</p>
                </div>
              )}
              {caseData.allParties.valuer && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-sm text-slate-300 mb-2">Valuer</h4>
                  <p className="font-medium">{caseData.allParties.valuer.name}</p>
                  <p className="text-sm text-slate-300">{caseData.allParties.valuer.company}</p>
                  <p className="text-sm text-slate-300">{caseData.allParties.valuer.email}</p>
                  <p className="text-sm text-slate-300">{caseData.allParties.valuer.phone}</p>
                </div>
              )}
              {caseData.allParties.conveyancer && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-sm text-slate-300 mb-2">Conveyancer</h4>
                  <p className="font-medium">{caseData.allParties.conveyancer.name}</p>
                  <p className="text-sm text-slate-300">{caseData.allParties.conveyancer.firm}</p>
                  <p className="text-sm text-slate-300">{caseData.allParties.conveyancer.email}</p>
                  <p className="text-sm text-slate-300">{caseData.allParties.conveyancer.phone}</p>
                </div>
              )}
              {caseData.allParties.auctioneer && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-sm text-slate-300 mb-2">Auctioneer</h4>
                  <p className="font-medium">{caseData.allParties.auctioneer.name}</p>
                  <p className="text-sm text-slate-300">{caseData.allParties.auctioneer.company}</p>
                  <p className="text-sm text-slate-300">{caseData.allParties.auctioneer.email}</p>
                  <p className="text-sm text-slate-300">{caseData.allParties.auctioneer.phone}</p>
                </div>
              )}
              {caseData.allParties.propertyManager && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-sm text-slate-300 mb-2">Property Manager</h4>
                  <p className="font-medium">{caseData.allParties.propertyManager.name}</p>
                  <p className="text-sm text-slate-300">{caseData.allParties.propertyManager.agency}</p>
                  <p className="text-sm text-slate-300">{caseData.allParties.propertyManager.email}</p>
                  <p className="text-sm text-slate-300">{caseData.allParties.propertyManager.phone}</p>
                </div>
              )}
              {caseData.allParties.insuranceBroker && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-sm text-slate-300 mb-2">Insurance Broker</h4>
                  <p className="font-medium">{caseData.allParties.insuranceBroker.name}</p>
                  <p className="text-sm text-slate-300">{caseData.allParties.insuranceBroker.company}</p>
                  <p className="text-sm text-slate-300">{caseData.allParties.insuranceBroker.email}</p>
                  <p className="text-sm text-slate-300">{caseData.allParties.insuranceBroker.phone}</p>
                </div>
              )}
              {caseData.allParties.receiver?.appointed && (
                <div className="border rounded-lg p-4 border-orange-300 bg-orange-500/10">
                  <h4 className="font-semibold text-sm text-orange-300 mb-2">⚠️ Receiver/Liquidator</h4>
                  <p className="font-medium">{caseData.allParties.receiver.name}</p>
                  <p className="text-sm text-slate-300">{caseData.allParties.receiver.company}</p>
                  <p className="text-sm text-slate-300">{caseData.allParties.receiver.email}</p>
                  <p className="text-sm text-slate-300">{caseData.allParties.receiver.phone}</p>
                </div>
              )}
              {caseData.allParties.trustee?.appointed && (
                <div className="border rounded-lg p-4 border-purple-300 bg-purple-500/10">
                  <h4 className="font-semibold text-sm text-purple-300 mb-2">Trustee (Bankruptcy)</h4>
                  <p className="font-medium">{caseData.allParties.trustee.name}</p>
                  <p className="text-sm text-slate-300">{caseData.allParties.trustee.company}</p>
                  <p className="text-sm text-slate-300">{caseData.allParties.trustee.email}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* NCCP Compliance & Verification Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {caseData.nccpCompliance && (
          <Card>
            <CardHeader>
              <CardTitle>NCCP Compliance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-slate-400">Subject to NCCP Act 2009</p>
                <p className="font-medium">
                  {caseData.nccpCompliance.subjectToNCCP ? (
                    <span className="text-orange-400 font-semibold">✓ Yes - Regulated Consumer Credit</span>
                  ) : (
                    <span className="text-green-400 font-semibold">✗ No - Not Consumer Credit</span>
                  )}
                </p>
              </div>
              {caseData.nccpCompliance.loanPurpose && (
                <div>
                  <p className="text-sm text-slate-400">Loan Purpose</p>
                  <p className="font-medium">{caseData.nccpCompliance.loanPurpose}</p>
                </div>
              )}
              {caseData.nccpCompliance.borrowerCooperation && (
                <div>
                  <p className="text-sm text-slate-400">Borrower Cooperation</p>
                  <p className="font-medium capitalize">{caseData.nccpCompliance.borrowerCooperation}</p>
                </div>
              )}
              {caseData.nccpCompliance.possessionStatus && (
                <div>
                  <p className="text-sm text-slate-400">Possession Status</p>
                  <p className="font-medium capitalize">{caseData.nccpCompliance.possessionStatus.replace(/_/g, ' ')}</p>
                </div>
              )}
              {caseData.nccpCompliance.tenancyDetails && (
                <div>
                  <p className="text-sm text-slate-400">Tenancy Details</p>
                  <p className="font-medium">{caseData.nccpCompliance.tenancyDetails}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Documents & Verification Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {caseData.infoTrackChecksCompleted && (
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm font-medium">InfoTrack Checks</span>
                  <span className="text-green-400 font-semibold">✓ Completed</span>
                </div>
              )}
              {caseData.automatedChecksCompleted && (
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm font-medium">Automated Verification</span>
                  <span className="text-green-400 font-semibold">✓ Completed</span>
                </div>
              )}
              {caseData.creditCheckCompleted && (
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm font-medium">Credit Check</span>
                  <span className="text-green-400 font-semibold">✓ Completed</span>
                </div>
              )}
              {caseData.paymentVerified && (
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm font-medium">Payment Verified</span>
                  <span className="text-green-400 font-semibold">✓ Verified</span>
                </div>
              )}
              {caseData.documentsTracking && (
                <>
                  {caseData.documentsTracking.titleSearchCompleted && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm">Title Search</span>
                      <span className="text-green-400">✓</span>
                    </div>
                  )}
                  {caseData.documentsTracking.identityVerificationCompleted && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm">Identity Verification (GreenID)</span>
                      <span className="text-green-400">✓</span>
                    </div>
                  )}
                  {caseData.documentsTracking.encumbranceCheckCompleted && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm">Encumbrance Check</span>
                      <span className="text-green-400">✓</span>
                    </div>
                  )}
                  {caseData.documentsTracking.zoningCheckCompleted && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm">Zoning Check</span>
                      <span className="text-green-400">✓</span>
                    </div>
                  )}
                  {caseData.documentsTracking.originalLoanAgreementUploaded && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm">Original Loan Agreement</span>
                      <span className="text-green-400">✓</span>
                    </div>
                  )}
                  {caseData.documentsTracking.bankStatementsUploaded && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm">Bank Statements</span>
                      <span className="text-green-400">✓</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Notes */}
      {caseData.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Case Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300">{caseData.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
