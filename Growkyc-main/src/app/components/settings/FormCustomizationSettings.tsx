import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { 
  Plus,
  Trash2,
  GripVertical,
  Settings,
  FileText,
  CheckSquare,
  Type,
  Calendar,
  DollarSign,
  Hash,
  Mail,
  Phone,
  MapPin,
  User,
  Building,
  Link as LinkIcon
} from 'lucide-react';

interface CustomField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'email' | 'phone' | 'date' | 'select' | 'checkbox' | 'currency' | 'url';
  placeholder?: string;
  required: boolean;
  options?: string[];
  icon: any;
}

interface FormTemplate {
  id: string;
  name: string;
  description: string;
  customFields: CustomField[];
}

const fieldTypeIcons = {
  text: Type,
  textarea: FileText,
  number: Hash,
  email: Mail,
  phone: Phone,
  date: Calendar,
  select: CheckSquare,
  checkbox: CheckSquare,
  currency: DollarSign,
  url: LinkIcon
};

export function FormCustomizationSettings() {
  const [selectedForm, setSelectedForm] = useState<string>('case-creation');
  const [newFieldType, setNewFieldType] = useState<CustomField['type']>('text');
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldOptions, setNewFieldOptions] = useState('');

  const [formTemplates, setFormTemplates] = useState<FormTemplate[]>([
    {
      id: 'case-creation',
      name: 'Case Creation Form',
      description: 'Main form for creating mortgage in possession cases',
      customFields: [
        {
          id: 'cf1',
          label: 'Property Manager Name',
          type: 'text',
          placeholder: 'Enter property manager name',
          required: false,
          icon: User
        },
        {
          id: 'cf2',
          label: 'Insurance Policy Number',
          type: 'text',
          placeholder: 'Enter insurance policy number',
          required: true,
          icon: FileText
        },
        {
          id: 'cf3',
          label: 'Expected Settlement Amount',
          type: 'currency',
          placeholder: 'Enter expected amount',
          required: false,
          icon: DollarSign
        }
      ]
    },
    {
      id: 'borrower-details',
      name: 'Borrower Details Form',
      description: 'Form for collecting borrower information',
      customFields: [
        {
          id: 'cf4',
          label: 'Employer Name',
          type: 'text',
          placeholder: 'Enter employer name',
          required: false,
          icon: Building
        },
        {
          id: 'cf5',
          label: 'Years at Current Address',
          type: 'number',
          placeholder: 'Enter number of years',
          required: false,
          icon: Hash
        }
      ]
    },
    {
      id: 'property-details',
      name: 'Property Details Form',
      description: 'Form for property information',
      customFields: [
        {
          id: 'cf6',
          label: 'Property Management Company',
          type: 'text',
          placeholder: 'Enter management company',
          required: false,
          icon: Building
        },
        {
          id: 'cf7',
          label: 'Council Rates Account',
          type: 'text',
          placeholder: 'Enter council rates account number',
          required: false,
          icon: FileText
        },
        {
          id: 'cf8',
          label: 'Body Corporate Name',
          type: 'text',
          placeholder: 'Enter body corporate name',
          required: false,
          icon: Building
        }
      ]
    },
    {
      id: 'lender-details',
      name: 'Lender Details Form',
      description: 'Form for lender information',
      customFields: [
        {
          id: 'cf9',
          label: 'Internal Reference Number',
          type: 'text',
          placeholder: 'Enter internal reference',
          required: false,
          icon: Hash
        },
        {
          id: 'cf10',
          label: 'Relationship Manager',
          type: 'text',
          placeholder: 'Enter relationship manager name',
          required: false,
          icon: User
        }
      ]
    },
    {
      id: 'kyc-form',
      name: 'KYC Verification Form',
      description: 'Form for Know Your Customer verification',
      customFields: [
        {
          id: 'cf11',
          label: 'Source of Funds',
          type: 'select',
          required: true,
          options: ['Salary/Wages', 'Business Income', 'Investment Income', 'Inheritance', 'Sale of Asset', 'Other'],
          icon: DollarSign
        },
        {
          id: 'cf12',
          label: 'Purpose of Transaction',
          type: 'textarea',
          placeholder: 'Describe the purpose of this transaction',
          required: true,
          icon: FileText
        }
      ]
    }
  ]);

  const currentForm = formTemplates.find(f => f.id === selectedForm);

  const handleAddField = () => {
    if (!newFieldLabel.trim()) return;

    const newField: CustomField = {
      id: `cf${Date.now()}`,
      label: newFieldLabel,
      type: newFieldType,
      placeholder: `Enter ${newFieldLabel.toLowerCase()}`,
      required: false,
      icon: fieldTypeIcons[newFieldType],
      ...(newFieldType === 'select' && newFieldOptions.trim() ? {
        options: newFieldOptions.split(',').map(o => o.trim())
      } : {})
    };

    setFormTemplates(formTemplates.map(form => {
      if (form.id === selectedForm) {
        return {
          ...form,
          customFields: [...form.customFields, newField]
        };
      }
      return form;
    }));

    setNewFieldLabel('');
    setNewFieldOptions('');
  };

  const handleRemoveField = (fieldId: string) => {
    setFormTemplates(formTemplates.map(form => {
      if (form.id === selectedForm) {
        return {
          ...form,
          customFields: form.customFields.filter(f => f.id !== fieldId)
        };
      }
      return form;
    }));
  };

  const handleToggleRequired = (fieldId: string) => {
    setFormTemplates(formTemplates.map(form => {
      if (form.id === selectedForm) {
        return {
          ...form,
          customFields: form.customFields.map(f => 
            f.id === fieldId ? { ...f, required: !f.required } : f
          )
        };
      }
      return form;
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Form Customization</h2>
        <p className="text-gray-600 mt-1">
          Add custom fields to forms across the Grow MIP platform
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Form Selection Sidebar */}
        <div className="col-span-3">
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-lg">Forms</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {formTemplates.map((form) => (
                  <button
                    key={form.id}
                    onClick={() => setSelectedForm(form.id)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                      selectedForm === form.id ? 'bg-primary/10 border-l-4 border-primary' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-600" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-900 truncate">
                          {form.name}
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {form.customFields.length} custom field{form.customFields.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="col-span-9 space-y-6">
          {/* Current Form Info */}
          {currentForm && (
            <>
              <Card>
                <CardHeader className="border-b">
                  <div>
                    <CardTitle className="text-xl">{currentForm.name}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{currentForm.description}</p>
                  </div>
                </CardHeader>
              </Card>

              {/* Custom Fields */}
              <Card>
                <CardHeader className="border-b">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Custom Fields
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {currentForm.customFields.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p>No custom fields added yet</p>
                      <p className="text-sm mt-1">Add your first custom field below</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {currentForm.customFields.map((field, index) => {
                        const Icon = field.icon;
                        return (
                          <div
                            key={field.id}
                            className="flex items-center gap-4 p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
                          >
                            <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                            <div className="p-2 bg-gray-100 rounded">
                              <Icon className="w-4 h-4 text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-gray-900">{field.label}</p>
                                {field.required && (
                                  <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-semibold">
                                    Required
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-0.5">
                                Type: {field.type.charAt(0).toUpperCase() + field.type.slice(1)}
                                {field.options && ` â€¢ ${field.options.length} options`}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleRequired(field.id)}
                              >
                                {field.required ? 'Make Optional' : 'Make Required'}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveField(field.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Add New Field */}
              <Card className="border-2 border-primary/20">
                <CardHeader className="border-b bg-primary/5">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Add New Custom Field
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Field Label *
                      </label>
                      <Input
                        placeholder="e.g., Property Manager Contact"
                        value={newFieldLabel}
                        onChange={(e) => setNewFieldLabel(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Field Type *
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        value={newFieldType}
                        onChange={(e) => setNewFieldType(e.target.value as CustomField['type'])}
                      >
                        <option value="text">Text</option>
                        <option value="textarea">Text Area</option>
                        <option value="number">Number</option>
                        <option value="email">Email</option>
                        <option value="phone">Phone</option>
                        <option value="date">Date</option>
                        <option value="currency">Currency</option>
                        <option value="url">URL</option>
                        <option value="select">Dropdown</option>
                        <option value="checkbox">Checkbox</option>
                      </select>
                    </div>

                    {newFieldType === 'select' && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Dropdown Options (comma-separated)
                        </label>
                        <Input
                          placeholder="e.g., Option 1, Option 2, Option 3"
                          value={newFieldOptions}
                          onChange={(e) => setNewFieldOptions(e.target.value)}
                        />
                        <p className="text-xs text-gray-600 mt-1">
                          Separate each option with a comma
                        </p>
                      </div>
                    )}

                    <div className="flex gap-3 pt-2">
                      <Button
                        onClick={handleAddField}
                        disabled={!newFieldLabel.trim()}
                        className="gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Field to Form
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setNewFieldLabel('');
                          setNewFieldOptions('');
                          setNewFieldType('text');
                        }}
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

