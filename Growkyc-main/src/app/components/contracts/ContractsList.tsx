import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { StatusBadge } from '../StatusBadge';
import { Eye, Download, Plus } from 'lucide-react';
import { mockCases } from '../../data/mockData';
import { format } from 'date-fns';

interface ContractsListProps {
  onNavigate?: (page: string, id?: string) => void;
}

export function ContractsList({ onNavigate }: ContractsListProps) {
  const contracts = mockCases.filter(c => 
    c.status === 'under_contract' || c.status === 'completed'
  );

  const handleViewContract = (contractId: string) => {
    if (onNavigate) {
      onNavigate('contract_sign', contractId);
    }
  };

  const handleDownloadContract = (contract: any) => {
    // Simulate PDF download
    alert(`Downloading contract ${contract.caseNumber}...\n\nContract for ${contract.property.address}`);
  };

  const handleCreateContract = () => {
    alert('Create New Contract\n\nThis would open a contract creation wizard.');
  };

  // Property images mapping
  const propertyImages: { [key: string]: string } = {
    'case-001': 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=200',
    'case-002': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200',
    'case-003': 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200',
    'case-004': 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=200',
    'case-005': 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=200',
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Contracts</CardTitle>
            <Button onClick={handleCreateContract}>
              <Plus className="w-4 h-4 mr-2" />
              Create New Contract
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Contract ID</TableHead>
                <TableHead>Parties</TableHead>
                <TableHead className="text-right">Contract Value</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img 
                        src={propertyImages[contract.id] || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=200'} 
                        alt={contract.property.address}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <p className="font-medium text-slate-100">{contract.property.address}</p>
                        <p className="text-sm text-slate-400">
                          {contract.property.suburb}, {contract.property.state}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{contract.caseNumber}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{contract.borrowerName}</p>
                      <p className="text-slate-400">{contract.lenderName}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    ${contract.currentBid?.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {format(contract.createdAt, 'dd MMM yyyy')}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={contract.status} type="case" />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewContract(contract.id)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownloadContract(contract)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}