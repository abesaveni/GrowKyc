import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Badge } from '../../ui/badge';
import {
  Users,
  Plus,
  X,
  AlertCircle,
  CheckCircle,
  Crown,
  User,
  Building2,
  HelpCircle
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { toast } from '../../../lib/toast';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';

interface OwnershipBuilderProps {
  entity: any;
  onComplete: (data: any) => void;
}

interface Person {
  id: string;
  name: string;
  role: string;
  ownership: number;
  isBeneficialOwner: boolean;
}

export function OwnershipBuilder({ entity, onComplete }: OwnershipBuilderProps) {
  const [people, setPeople] = useState<Person[]>(entity.data.people || []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPerson, setNewPerson] = useState({
    name: '',
    role: '',
    ownership: 0,
  });
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  // Initialize nodes for the entity and people
  const initialNodes: Node[] = [
    {
      id: 'entity',
      type: 'default',
      data: { label: entity.data.name || 'Entity' },
      position: { x: 250, y: 50 },
      style: {
        background: '#3b82f6',
        color: 'white',
        border: '2px solid #1e40af',
        borderRadius: '8px',
        padding: '10px',
        fontSize: '14px',
        fontWeight: 'bold',
      },
    },
    ...people.map((person, index) => ({
      id: person.id,
      type: 'default',
      data: {
        label: (
          <div>
            <div className="font-semibold">{person.name}</div>
            <div className="text-xs">{person.role}</div>
            {person.ownership > 0 && (
              <div className="text-xs mt-1">{person.ownership}% ownership</div>
            )}
          </div>
        ),
      },
      position: { x: 50 + (index * 150), y: 200 },
      style: {
        background: person.isBeneficialOwner ? '#10b981' : '#f3f4f6',
        color: person.isBeneficialOwner ? 'white' : '#1f2937',
        border: person.isBeneficialOwner ? '2px solid #059669' : '2px solid #d1d5db',
        borderRadius: '8px',
        padding: '10px',
        fontSize: '12px',
        minWidth: '120px',
      },
    })),
  ];

  const initialEdges: Edge[] = people.map((person) => ({
    id: `e-entity-${person.id}`,
    source: 'entity',
    target: person.id,
    label: person.role,
    animated: person.isBeneficialOwner,
    style: { stroke: person.isBeneficialOwner ? '#10b981' : '#9ca3af' },
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const updateGraph = useCallback((updatedPeople: Person[]) => {
    const newNodes: Node[] = [
      {
        id: 'entity',
        type: 'default',
        data: { label: entity.data.name || 'Entity' },
        position: { x: 250, y: 50 },
        style: {
          background: '#3b82f6',
          color: 'white',
          border: '2px solid #1e40af',
          borderRadius: '8px',
          padding: '10px',
          fontSize: '14px',
          fontWeight: 'bold',
        },
      },
      ...updatedPeople.map((person, index) => ({
        id: person.id,
        type: 'default',
        data: {
          label: (
            <div>
              <div className="font-semibold">{person.name}</div>
              <div className="text-xs">{person.role}</div>
              {person.ownership > 0 && (
                <div className="text-xs mt-1">{person.ownership}% ownership</div>
              )}
            </div>
          ),
        },
        position: { x: 50 + (index * 150), y: 200 },
        style: {
          background: person.isBeneficialOwner ? '#10b981' : '#f3f4f6',
          color: person.isBeneficialOwner ? 'white' : '#1f2937',
          border: person.isBeneficialOwner ? '2px solid #059669' : '2px solid #d1d5db',
          borderRadius: '8px',
          padding: '10px',
          fontSize: '12px',
          minWidth: '120px',
        },
      })),
    ];

    const newEdges: Edge[] = updatedPeople.map((person) => ({
      id: `e-entity-${person.id}`,
      source: 'entity',
      target: person.id,
      label: person.role,
      animated: person.isBeneficialOwner,
      style: { stroke: person.isBeneficialOwner ? '#10b981' : '#9ca3af' },
    }));

    setNodes(newNodes);
    setEdges(newEdges);
  }, [entity.data.name, setNodes, setEdges]);

  const handleAddPerson = () => {
    if (!newPerson.name || !newPerson.role) {
      toast.error('Please fill in all fields');
      return;
    }

    const isBeneficialOwner = newPerson.ownership >= 25;
    const person: Person = {
      id: `person-${Date.now()}`,
      name: newPerson.name,
      role: newPerson.role,
      ownership: newPerson.ownership,
      isBeneficialOwner,
    };

    const updatedPeople = [...people, person];
    setPeople(updatedPeople);
    updateGraph(updatedPeople);
    
    setNewPerson({ name: '', role: '', ownership: 0 });
    setShowAddForm(false);

    if (isBeneficialOwner) {
      toast.success('Beneficial owner identified!', {
        description: `${newPerson.name} owns ${newPerson.ownership}% and will be highlighted.`
      });
    } else {
      toast.success('Person added to structure');
    }
  };

  const handleRemovePerson = (id: string) => {
    const updatedPeople = people.filter(p => p.id !== id);
    setPeople(updatedPeople);
    updateGraph(updatedPeople);
    toast.success('Person removed');
  };

  const handleSubmit = () => {
    if (people.length === 0) {
      toast.error('Please add at least one person to the ownership structure');
      return;
    }

    const hasBeneficialOwner = people.some(p => p.isBeneficialOwner);
    if (!hasBeneficialOwner && entity.type === 'company') {
      toast.error('Please identify who has ultimate control of this entity');
      return;
    }

    onComplete({ people });
  };

  const getRoleOptions = () => {
    switch (entity.type) {
      case 'company':
        return ['Director', 'Shareholder', 'Secretary', 'Director & Shareholder'];
      case 'trust':
        return ['Trustee', 'Appointor', 'Beneficiary', 'Guardian'];
      case 'sole_trader':
        return ['Owner', 'Partner'];
      default:
        return ['Owner', 'Partner'];
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <CardTitle>Who Controls This Entity?</CardTitle>
            <CardDescription>
              Add directors, shareholders, trustees, or other controlling parties
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Ownership Graph */}
        <Card className="border-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Ownership Structure</CardTitle>
              <Badge variant="outline" className="text-xs">
                Live Preview
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div style={{ height: '300px' }}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                fitView
                attributionPosition="bottom-right"
              >
                <Background />
                <Controls />
              </ReactFlow>
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded" />
            <span className="text-slate-300">Beneficial Owner (≥25%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded border-2 border-gray-400" />
            <span className="text-slate-300">Other Roles</span>
          </div>
        </div>

        {/* People List */}
        <div className="space-y-3">
          {people.map((person) => (
            <Card key={person.id} className={person.isBeneficialOwner ? 'border-green-500 bg-green-50' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      person.isBeneficialOwner ? 'bg-green-500' : 'bg-gray-200'
                    }`}>
                      {person.isBeneficialOwner ? (
                        <Crown className="w-5 h-5 text-white" />
                      ) : (
                        <User className="w-5 h-5 text-slate-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{person.name}</span>
                        {person.isBeneficialOwner && (
                          <Badge className="bg-green-500">Beneficial Owner</Badge>
                        )}
                      </div>
                      <div className="text-sm text-slate-300 flex items-center gap-3 mt-1">
                        <span>{person.role}</span>
                        {person.ownership > 0 && (
                          <>
                            <span>•</span>
                            <span>{person.ownership}% ownership</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemovePerson(person.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Person Form */}
        {showAddForm ? (
          <Card className="border-blue-500 bg-blue-50 animate-in fade-in slide-in-from-top-4">
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="personName">Full Name *</Label>
                <Input
                  id="personName"
                  value={newPerson.name}
                  onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select
                  value={newPerson.role}
                  onValueChange={(value) => setNewPerson({ ...newPerson, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {getRoleOptions().map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="ownership">Ownership Percentage (if applicable)</Label>
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                    onClick={() => setShowTooltip(showTooltip === 'ownership' ? null : 'ownership')}
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </div>
                {showTooltip === 'ownership' && (
                  <Card className="bg-blue-100 border-blue-300">
                    <CardContent className="p-3 text-sm text-blue-900">
                      Ownership of 25% or more automatically identifies this person as a Beneficial Owner for AML/CTF compliance.
                    </CardContent>
                  </Card>
                )}
                <div className="flex items-center gap-3">
                  <Input
                    id="ownership"
                    type="number"
                    min="0"
                    max="100"
                    value={newPerson.ownership}
                    onChange={(e) => setNewPerson({ ...newPerson, ownership: parseInt(e.target.value) || 0 })}
                  />
                  <span className="text-slate-300">%</span>
                </div>
                {newPerson.ownership >= 25 && (
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-2 flex items-center gap-2">
                      <Crown className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-900">
                        Will be identified as Beneficial Owner
                      </span>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button onClick={handleAddPerson} className="flex-1">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Add Person
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Button
            onClick={() => setShowAddForm(true)}
            variant="outline"
            className="w-full border-dashed border-2 h-12"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Person
          </Button>
        )}

        {/* Warning if no beneficial owner */}
        {people.length > 0 && !people.some(p => p.isBeneficialOwner) && entity.type === 'company' && (
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-900">
                <p className="font-semibold mb-1">Who has ultimate control?</p>
                <p>
                  If no person owns 25% or more, please identify who has ultimate control through other means 
                  (e.g., voting rights, board appointment power).
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-3 pt-4">
          <Button className="flex-1" size="lg" onClick={handleSubmit} disabled={people.length === 0}>
            Continue to Verification
            <CheckCircle className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
