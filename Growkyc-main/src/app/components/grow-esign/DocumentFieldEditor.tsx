import React, { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import {
  FileSignature,
  FileText,
  Calendar,
  CheckSquare,
  Circle,
  List,
  Hash,
  AtSign,
  Phone,
  DollarSign,
  Paperclip,
  Image as ImageIcon,
  Type,
  AlignLeft,
  CheckCircle,
  X,
  Edit,
  Trash2,
  Users,
  Copy,
  ZoomIn,
  ZoomOut,
  Download,
  Upload,
  Save,
  ArrowLeft,
  Settings,
  Eye,
  GripVertical,
  Pencil,
  ToggleLeft,
  Radio
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { toast } from '../../lib/toast';

// All DocuSign-like field types
const FIELD_TYPES = [
  { 
    id: 'signature', 
    name: 'Signature', 
    icon: FileSignature, 
    color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    description: 'Signer\'s full signature',
    width: 200,
    height: 50
  },
  { 
    id: 'initials', 
    name: 'Initials', 
    icon: Pencil, 
    color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    description: 'Signer\'s initials',
    width: 80,
    height: 40
  },
  { 
    id: 'text', 
    name: 'Text', 
    icon: Type, 
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    description: 'Single line text input',
    width: 200,
    height: 30
  },
  { 
    id: 'textarea', 
    name: 'Text Area', 
    icon: AlignLeft, 
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    description: 'Multi-line text input',
    width: 300,
    height: 80
  },
  { 
    id: 'date', 
    name: 'Date Signed', 
    icon: Calendar, 
    color: 'bg-green-100 text-green-700 border-green-300',
    description: 'Date when document was signed',
    width: 150,
    height: 30
  },
  { 
    id: 'date_input', 
    name: 'Date Input', 
    icon: Calendar, 
    color: 'bg-green-100 text-green-700 border-green-300',
    description: 'Manual date entry by signer',
    width: 150,
    height: 30
  },
  { 
    id: 'checkbox', 
    name: 'Checkbox', 
    icon: CheckSquare, 
    color: 'bg-purple-100 text-purple-700 border-purple-300',
    description: 'Single checkbox',
    width: 20,
    height: 20
  },
  { 
    id: 'radio', 
    name: 'Radio Button', 
    icon: Circle, 
    color: 'bg-purple-100 text-purple-700 border-purple-300',
    description: 'Radio button group',
    width: 20,
    height: 20
  },
  { 
    id: 'dropdown', 
    name: 'Dropdown', 
    icon: List, 
    color: 'bg-indigo-100 text-indigo-700 border-indigo-300',
    description: 'Dropdown selection list',
    width: 200,
    height: 35
  },
  { 
    id: 'name', 
    name: 'Full Name', 
    icon: Users, 
    color: 'bg-cyan-100 text-cyan-700 border-cyan-300',
    description: 'Signer\'s full name',
    width: 200,
    height: 30
  },
  { 
    id: 'email', 
    name: 'Email', 
    icon: AtSign, 
    color: 'bg-cyan-100 text-cyan-700 border-cyan-300',
    description: 'Email address',
    width: 250,
    height: 30
  },
  { 
    id: 'phone', 
    name: 'Phone', 
    icon: Phone, 
    color: 'bg-cyan-100 text-cyan-700 border-cyan-300',
    description: 'Phone number',
    width: 180,
    height: 30
  },
  { 
    id: 'company', 
    name: 'Company', 
    icon: FileText, 
    color: 'bg-cyan-100 text-cyan-700 border-cyan-300',
    description: 'Company name',
    width: 200,
    height: 30
  },
  { 
    id: 'title', 
    name: 'Title/Position', 
    icon: FileText, 
    color: 'bg-cyan-100 text-cyan-700 border-cyan-300',
    description: 'Job title or position',
    width: 200,
    height: 30
  },
  { 
    id: 'number', 
    name: 'Number', 
    icon: Hash, 
    color: 'bg-orange-100 text-orange-700 border-orange-300',
    description: 'Numeric input',
    width: 120,
    height: 30
  },
  { 
    id: 'currency', 
    name: 'Currency', 
    icon: DollarSign, 
    color: 'bg-orange-100 text-orange-700 border-orange-300',
    description: 'Currency amount',
    width: 150,
    height: 30
  },
  { 
    id: 'ssn', 
    name: 'SSN/Tax ID', 
    icon: Hash, 
    color: 'bg-red-100 text-red-700 border-red-300',
    description: 'Social Security Number or Tax ID',
    width: 150,
    height: 30
  },
  { 
    id: 'attachment', 
    name: 'Attachment', 
    icon: Paperclip, 
    color: 'bg-gray-100 text-gray-700 border-gray-300',
    description: 'File attachment upload',
    width: 150,
    height: 40
  },
  { 
    id: 'image', 
    name: 'Image', 
    icon: ImageIcon, 
    color: 'bg-gray-100 text-gray-700 border-gray-300',
    description: 'Image upload',
    width: 150,
    height: 150
  },
  { 
    id: 'formula', 
    name: 'Formula', 
    icon: Hash, 
    color: 'bg-pink-100 text-pink-700 border-pink-300',
    description: 'Calculated field',
    width: 120,
    height: 30
  },
  { 
    id: 'approve', 
    name: 'Approve', 
    icon: CheckCircle, 
    color: 'bg-green-100 text-green-700 border-green-300',
    description: 'Approval button',
    width: 100,
    height: 35
  },
  { 
    id: 'decline', 
    name: 'Decline', 
    icon: X, 
    color: 'bg-red-100 text-red-700 border-red-300',
    description: 'Decline button',
    width: 100,
    height: 35
  },
  { 
    id: 'note', 
    name: 'Note', 
    icon: FileText, 
    color: 'bg-amber-100 text-amber-700 border-amber-300',
    description: 'Informational note for signer',
    width: 250,
    height: 60
  },
  { 
    id: 'witness_signature', 
    name: 'Witness Signature', 
    icon: Users, 
    color: 'bg-teal-100 text-teal-700 border-teal-300',
    description: 'Witness signature field',
    width: 200,
    height: 50
  },
  { 
    id: 'notary_seal', 
    name: 'Notary Seal', 
    icon: CheckCircle, 
    color: 'bg-purple-100 text-purple-700 border-purple-300',
    description: 'Notary seal placement',
    width: 100,
    height: 100
  }
];

interface DocumentField {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  page: number;
  assignedTo: string;
  label?: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
  formula?: string;
  validation?: string;
  maxLength?: number;
  defaultValue?: string;
  tooltip?: string;
  readonly?: boolean;
  conditional?: {
    field: string;
    value: any;
  };
}

interface Signer {
  id: string;
  name: string;
  email: string;
  role: string;
  color: string;
  order: number;
}

interface DocumentFieldEditorProps {
  documentId?: string;
  documentName?: string;
  onBack?: () => void;
  onSave?: (fields: DocumentField[]) => void;
}

export function DocumentFieldEditor({ documentId, documentName, onBack, onSave }: DocumentFieldEditorProps) {
  const [fields, setFields] = useState<DocumentField[]>([]);
  const [selectedField, setSelectedField] = useState<DocumentField | null>(null);
  const [draggedFieldType, setDraggedFieldType] = useState<string | null>(null);
  const [showFieldProperties, setShowFieldProperties] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [signers, setSigners] = useState<Signer[]>([
    { id: '1', name: 'John Smith', email: 'john@example.com', role: 'Signer 1', color: 'bg-blue-500', order: 1 },
    { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com', role: 'Signer 2', color: 'bg-green-500', order: 2 },
  ]);
  const [selectedSigner, setSelectedSigner] = useState<string>(signers[0].id);
  const [showAddSignerModal, setShowAddSignerModal] = useState(false);
  const [newSignerName, setNewSignerName] = useState('');
  const [newSignerEmail, setNewSignerEmail] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const documentRef = useRef<HTMLDivElement>(null);

  // Handle drag start from field palette
  const handleDragStart = (fieldType: string) => {
    setDraggedFieldType(fieldType);
    setIsDragging(true);
  };

  // Handle drop on document
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (!draggedFieldType || !documentRef.current) return;

    const rect = documentRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const fieldType = FIELD_TYPES.find(f => f.id === draggedFieldType);
    if (!fieldType) return;

    const newField: DocumentField = {
      id: `field-${Date.now()}-${Math.random()}`,
      type: draggedFieldType,
      x: Math.max(0, x - (fieldType.width / 2)),
      y: Math.max(0, y - (fieldType.height / 2)),
      width: fieldType.width,
      height: fieldType.height,
      page: currentPage,
      assignedTo: selectedSigner,
      required: false,
      label: fieldType.name,
    };

    setFields([...fields, newField]);
    setDraggedFieldType(null);
    toast.success(`${fieldType.name} field added`);
  };

  // Handle field selection
  const handleFieldClick = (field: DocumentField) => {
    setSelectedField(field);
    setShowFieldProperties(true);
  };

  // Handle field deletion
  const handleDeleteField = (fieldId: string) => {
    setFields(fields.filter(f => f.id !== fieldId));
    setSelectedField(null);
    setShowFieldProperties(false);
    toast.success('Field deleted');
  };

  // Handle field duplication
  const handleDuplicateField = (field: DocumentField) => {
    const newField = {
      ...field,
      id: `field-${Date.now()}-${Math.random()}`,
      x: field.x + 20,
      y: field.y + 20,
    };
    setFields([...fields, newField]);
    toast.success('Field duplicated');
  };

  // Update field properties
  const updateFieldProperty = (fieldId: string, property: string, value: any) => {
    setFields(fields.map(f => 
      f.id === fieldId ? { ...f, [property]: value } : f
    ));
    if (selectedField?.id === fieldId) {
      setSelectedField({ ...selectedField, [property]: value });
    }
  };

  // Add new signer
  const handleAddSigner = () => {
    if (!newSignerName || !newSignerEmail) {
      toast.error('Please enter name and email');
      return;
    }

    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-teal-500'];
    const newSigner: Signer = {
      id: `${Date.now()}`,
      name: newSignerName,
      email: newSignerEmail,
      role: `Signer ${signers.length + 1}`,
      color: colors[signers.length % colors.length],
      order: signers.length + 1
    };

    setSigners([...signers, newSigner]);
    setNewSignerName('');
    setNewSignerEmail('');
    setShowAddSignerModal(false);
    toast.success('Signer added');
  };

  // Get field type info
  const getFieldType = (typeId: string) => {
    return FIELD_TYPES.find(f => f.id === typeId);
  };

  // Get signer info
  const getSigner = (signerId: string) => {
    return signers.find(s => s.id === signerId);
  };

  // Save fields
  const handleSave = () => {
    if (fields.length === 0) {
      toast.error('Please add at least one field');
      return;
    }

    const requiredFieldsCount = fields.filter(f => f.required).length;
    const signatureFields = fields.filter(f => f.type === 'signature').length;

    toast.success(`Document saved with ${fields.length} fields (${requiredFieldsCount} required, ${signatureFields} signatures)`);
    onSave?.(fields);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Document Field Editor</h1>
              <p className="text-sm text-gray-600">{documentName || 'Untitled Document'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Zoom Controls */}
            <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-2">
              <Button variant="ghost" size="sm" onClick={() => setZoom(Math.max(50, zoom - 10))}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium w-12 text-center">{zoom}%</span>
              <Button variant="ghost" size="sm" onClick={() => setZoom(Math.min(200, zoom + 10))}>
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>

            <Button variant="outline" onClick={() => toast.info('Preview mode coming soon')}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save & Send
            </Button>
          </div>
        </div>

        {/* Signers Bar */}
        <div className="flex items-center gap-3 mt-4">
          <span className="text-sm font-medium text-gray-700">Assign fields to:</span>
          <div className="flex gap-2">
            {signers.map(signer => (
              <button
                key={signer.id}
                onClick={() => setSelectedSigner(signer.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedSigner === signer.id
                    ? `${signer.color} text-white shadow-lg`
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {signer.role}
              </button>
            ))}
            <Button variant="outline" size="sm" onClick={() => setShowAddSignerModal(true)}>
              <Users className="w-4 h-4 mr-2" />
              Add Signer
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-6 mt-3 text-sm text-gray-600">
          <span><strong>{fields.length}</strong> fields</span>
          <span><strong>{fields.filter(f => f.required).length}</strong> required</span>
          <span><strong>{fields.filter(f => f.type === 'signature').length}</strong> signatures</span>
          <span><strong>{signers.length}</strong> signers</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Field Palette - Left Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <h2 className="font-bold text-gray-900 mb-1">Field Types</h2>
            <p className="text-xs text-gray-600 mb-4">Drag fields onto the document</p>

            {/* Standard Fields */}
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Signature Fields</h3>
                <div className="space-y-2">
                  {FIELD_TYPES.filter(f => ['signature', 'initials', 'date', 'witness_signature', 'notary_seal'].includes(f.id)).map(field => {
                    const Icon = field.icon;
                    return (
                      <div
                        key={field.id}
                        draggable
                        onDragStart={() => handleDragStart(field.id)}
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 ${field.color} cursor-move hover:shadow-lg transition-all`}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{field.name}</p>
                          <p className="text-xs opacity-75 truncate">{field.description}</p>
                        </div>
                        <GripVertical className="w-4 h-4 opacity-50" />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Text Fields</h3>
                <div className="space-y-2">
                  {FIELD_TYPES.filter(f => ['text', 'textarea', 'name', 'email', 'phone', 'company', 'title'].includes(f.id)).map(field => {
                    const Icon = field.icon;
                    return (
                      <div
                        key={field.id}
                        draggable
                        onDragStart={() => handleDragStart(field.id)}
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 ${field.color} cursor-move hover:shadow-lg transition-all`}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{field.name}</p>
                          <p className="text-xs opacity-75 truncate">{field.description}</p>
                        </div>
                        <GripVertical className="w-4 h-4 opacity-50" />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Selection Fields</h3>
                <div className="space-y-2">
                  {FIELD_TYPES.filter(f => ['checkbox', 'radio', 'dropdown'].includes(f.id)).map(field => {
                    const Icon = field.icon;
                    return (
                      <div
                        key={field.id}
                        draggable
                        onDragStart={() => handleDragStart(field.id)}
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 ${field.color} cursor-move hover:shadow-lg transition-all`}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{field.name}</p>
                          <p className="text-xs opacity-75 truncate">{field.description}</p>
                        </div>
                        <GripVertical className="w-4 h-4 opacity-50" />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Data Fields</h3>
                <div className="space-y-2">
                  {FIELD_TYPES.filter(f => ['number', 'currency', 'ssn', 'date_input', 'formula'].includes(f.id)).map(field => {
                    const Icon = field.icon;
                    return (
                      <div
                        key={field.id}
                        draggable
                        onDragStart={() => handleDragStart(field.id)}
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 ${field.color} cursor-move hover:shadow-lg transition-all`}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{field.name}</p>
                          <p className="text-xs opacity-75 truncate">{field.description}</p>
                        </div>
                        <GripVertical className="w-4 h-4 opacity-50" />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Advanced Fields</h3>
                <div className="space-y-2">
                  {FIELD_TYPES.filter(f => ['attachment', 'image', 'approve', 'decline', 'note'].includes(f.id)).map(field => {
                    const Icon = field.icon;
                    return (
                      <div
                        key={field.id}
                        draggable
                        onDragStart={() => handleDragStart(field.id)}
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 ${field.color} cursor-move hover:shadow-lg transition-all`}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{field.name}</p>
                          <p className="text-xs opacity-75 truncate">{field.description}</p>
                        </div>
                        <GripVertical className="w-4 h-4 opacity-50" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Document Canvas - Center */}
        <div className="flex-1 overflow-auto bg-gray-100 p-8">
          <div className="max-w-4xl mx-auto">
            <div
              ref={documentRef}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className={`bg-white shadow-2xl relative ${isDragging ? 'ring-4 ring-blue-500' : ''}`}
              style={{
                width: `${8.5 * 96 * (zoom / 100)}px`,
                height: `${11 * 96 * (zoom / 100)}px`,
                transform: `scale(1)`,
                transformOrigin: 'top left'
              }}
            >
              {/* Sample Document Background */}
              <div className="absolute inset-0 p-12 text-gray-300 text-sm leading-relaxed pointer-events-none">
                <h1 className="text-2xl font-bold text-gray-400 mb-4">SAMPLE DOCUMENT</h1>
                <p className="mb-2">This is a sample document. Drag and drop fields from the left palette onto this document.</p>
                <p className="mb-2">You can add signature fields, text fields, checkboxes, and many other field types.</p>
                <p className="mb-4">Fields are assigned to specific signers and can be configured as required or optional.</p>
                
                <div className="border-t border-gray-200 my-6"></div>
                
                <p className="mb-2">Signer Name: _________________________________</p>
                <p className="mb-2">Date: _________________________________</p>
                <p className="mb-4">Signature: _________________________________</p>
              </div>

              {/* Dropped Fields */}
              {fields.filter(f => f.page === currentPage).map(field => {
                const fieldType = getFieldType(field.type);
                const signer = getSigner(field.assignedTo);
                const Icon = fieldType?.icon || FileText;

                return (
                  <div
                    key={field.id}
                    onClick={() => handleFieldClick(field)}
                    className={`absolute border-2 ${
                      selectedField?.id === field.id
                        ? 'border-blue-600 ring-2 ring-blue-300'
                        : `${fieldType?.color} border-dashed`
                    } cursor-pointer hover:shadow-lg transition-all group`}
                    style={{
                      left: `${field.x}px`,
                      top: `${field.y}px`,
                      width: `${field.width}px`,
                      height: `${field.height}px`,
                    }}
                  >
                    {/* Field Content */}
                    <div className="relative w-full h-full flex items-center justify-center">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span className="text-xs font-medium truncate">
                          {field.label || fieldType?.name}
                        </span>
                        {field.required && <span className="text-red-600 text-xs">*</span>}
                      </div>

                      {/* Signer Badge */}
                      <div className={`absolute -top-2 -right-2 ${signer?.color} text-white text-xs px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity`}>
                        {signer?.role}
                      </div>

                      {/* Action Buttons */}
                      <div className="absolute -top-8 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicateField(field);
                          }}
                          className="bg-blue-600 text-white p-1 rounded hover:bg-blue-700"
                          title="Duplicate"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedField(field);
                            setShowFieldProperties(true);
                          }}
                          className="bg-green-600 text-white p-1 rounded hover:bg-green-700"
                          title="Edit"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteField(field.id);
                          }}
                          className="bg-red-600 text-white p-1 rounded hover:bg-red-700"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Drop Zone Hint */}
              {isDragging && (
                <div className="absolute inset-0 bg-blue-50 bg-opacity-50 border-4 border-dashed border-blue-500 flex items-center justify-center pointer-events-none">
                  <div className="bg-white px-6 py-4 rounded-lg shadow-lg">
                    <p className="text-blue-600 font-semibold">Drop field here</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Field Properties - Right Sidebar */}
        {showFieldProperties && selectedField && (
          <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900">Field Properties</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowFieldProperties(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {/* Field Type */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Field Type</Label>
                  <div className={`p-3 rounded-lg border-2 ${getFieldType(selectedField.type)?.color}`}>
                    {getFieldType(selectedField.type)?.name}
                  </div>
                </div>

                {/* Assigned To */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Assigned To</Label>
                  <Select
                    value={selectedField.assignedTo}
                    onValueChange={(value) => updateFieldProperty(selectedField.id, 'assignedTo', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {signers.map(signer => (
                        <SelectItem key={signer.id} value={signer.id}>
                          {signer.role} - {signer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Label */}
                <div>
                  <Label htmlFor="field-label">Field Label</Label>
                  <Input
                    id="field-label"
                    value={selectedField.label || ''}
                    onChange={(e) => updateFieldProperty(selectedField.id, 'label', e.target.value)}
                    placeholder="Enter field label"
                  />
                </div>

                {/* Required */}
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Required Field</p>
                    <p className="text-xs text-gray-600">Signer must complete this field</p>
                  </div>
                  <Switch
                    checked={selectedField.required}
                    onCheckedChange={(checked) => updateFieldProperty(selectedField.id, 'required', checked)}
                  />
                </div>

                {/* Placeholder (for text fields) */}
                {['text', 'textarea', 'email', 'phone', 'number'].includes(selectedField.type) && (
                  <div>
                    <Label htmlFor="field-placeholder">Placeholder Text</Label>
                    <Input
                      id="field-placeholder"
                      value={selectedField.placeholder || ''}
                      onChange={(e) => updateFieldProperty(selectedField.id, 'placeholder', e.target.value)}
                      placeholder="Enter placeholder"
                    />
                  </div>
                )}

                {/* Default Value */}
                <div>
                  <Label htmlFor="field-default">Default Value</Label>
                  <Input
                    id="field-default"
                    value={selectedField.defaultValue || ''}
                    onChange={(e) => updateFieldProperty(selectedField.id, 'defaultValue', e.target.value)}
                    placeholder="Enter default value"
                  />
                </div>

                {/* Tooltip */}
                <div>
                  <Label htmlFor="field-tooltip">Tooltip/Help Text</Label>
                  <Textarea
                    id="field-tooltip"
                    value={selectedField.tooltip || ''}
                    onChange={(e) => updateFieldProperty(selectedField.id, 'tooltip', e.target.value)}
                    placeholder="Help text for signers"
                    rows={2}
                  />
                </div>

                {/* Dropdown Options */}
                {selectedField.type === 'dropdown' && (
                  <div>
                    <Label htmlFor="field-options">Dropdown Options (one per line)</Label>
                    <Textarea
                      id="field-options"
                      value={selectedField.options?.join('\n') || ''}
                      onChange={(e) => updateFieldProperty(selectedField.id, 'options', e.target.value.split('\n'))}
                      placeholder="Option 1&#10;Option 2&#10;Option 3"
                      rows={4}
                    />
                  </div>
                )}

                {/* Formula (for formula fields) */}
                {selectedField.type === 'formula' && (
                  <div>
                    <Label htmlFor="field-formula">Formula</Label>
                    <Input
                      id="field-formula"
                      value={selectedField.formula || ''}
                      onChange={(e) => updateFieldProperty(selectedField.id, 'formula', e.target.value)}
                      placeholder="e.g., field1 + field2"
                    />
                  </div>
                )}

                {/* Validation */}
                {['text', 'email', 'phone', 'number'].includes(selectedField.type) && (
                  <div>
                    <Label htmlFor="field-validation">Validation Pattern</Label>
                    <Select
                      value={selectedField.validation || 'none'}
                      onValueChange={(value) => updateFieldProperty(selectedField.id, 'validation', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="phone">Phone</SelectItem>
                        <SelectItem value="url">URL</SelectItem>
                        <SelectItem value="number">Number Only</SelectItem>
                        <SelectItem value="alpha">Letters Only</SelectItem>
                        <SelectItem value="alphanumeric">Letters & Numbers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Max Length */}
                {['text', 'textarea'].includes(selectedField.type) && (
                  <div>
                    <Label htmlFor="field-maxlength">Maximum Length</Label>
                    <Input
                      id="field-maxlength"
                      type="number"
                      value={selectedField.maxLength || ''}
                      onChange={(e) => updateFieldProperty(selectedField.id, 'maxLength', parseInt(e.target.value))}
                      placeholder="No limit"
                    />
                  </div>
                )}

                {/* Readonly */}
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Read Only</p>
                    <p className="text-xs text-gray-600">Signer cannot edit this field</p>
                  </div>
                  <Switch
                    checked={selectedField.readonly || false}
                    onCheckedChange={(checked) => updateFieldProperty(selectedField.id, 'readonly', checked)}
                  />
                </div>

                {/* Position & Size */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Position & Size</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="field-x" className="text-xs">X Position</Label>
                      <Input
                        id="field-x"
                        type="number"
                        value={Math.round(selectedField.x)}
                        onChange={(e) => updateFieldProperty(selectedField.id, 'x', parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="field-y" className="text-xs">Y Position</Label>
                      <Input
                        id="field-y"
                        type="number"
                        value={Math.round(selectedField.y)}
                        onChange={(e) => updateFieldProperty(selectedField.id, 'y', parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="field-width" className="text-xs">Width</Label>
                      <Input
                        id="field-width"
                        type="number"
                        value={selectedField.width}
                        onChange={(e) => updateFieldProperty(selectedField.id, 'width', parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="field-height" className="text-xs">Height</Label>
                      <Input
                        id="field-height"
                        type="number"
                        value={selectedField.height}
                        onChange={(e) => updateFieldProperty(selectedField.id, 'height', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleDuplicateField(selectedField)}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicate
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleDeleteField(selectedField.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Signer Modal */}
      <Dialog open={showAddSignerModal} onOpenChange={setShowAddSignerModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Signer</DialogTitle>
            <DialogDescription>Add a new signer to this document</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="signer-name">Full Name</Label>
              <Input
                id="signer-name"
                value={newSignerName}
                onChange={(e) => setNewSignerName(e.target.value)}
                placeholder="John Smith"
              />
            </div>
            <div>
              <Label htmlFor="signer-email">Email Address</Label>
              <Input
                id="signer-email"
                type="email"
                value={newSignerEmail}
                onChange={(e) => setNewSignerEmail(e.target.value)}
                placeholder="john@example.com"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddSignerModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSigner}>
              Add Signer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
