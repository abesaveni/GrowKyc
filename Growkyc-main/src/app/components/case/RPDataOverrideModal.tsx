import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { X, Upload, AlertCircle, CheckCircle } from 'lucide-react';

interface RPDataOverrideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  formData: any;
  onInputChange: (field: string, value: string | boolean) => void;
}

export function RPDataOverrideModal({
  isOpen,
  onClose,
  onSave,
  formData,
  onInputChange
}: RPDataOverrideModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <CardTitle className="text-xl font-bold">Override RP Data Valuation</CardTitle>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-900">Override Warning</p>
              <p className="text-xs text-amber-700 mt-1">
                Overriding RP Data valuation requires justification and will be logged for audit purposes.
                This may trigger additional compliance requirements.
              </p>
            </div>
          </div>

          <div>
            <Label htmlFor="rpDataAvmMid">RP Data AVM Estimate (Mid)</Label>
            <Input
              id="rpDataAvmMid"
              value={`A$${parseFloat(formData.rpDataAvmMid || '0').toLocaleString()}`}
              disabled
              className="bg-gray-100"
            />
          </div>

          <div>
            <Label htmlFor="overrideValue">Manual Estimated Value (A$) *</Label>
            <Input
              id="overrideValue"
              type="number"
              value={formData.overrideValue}
              onChange={(e) => onInputChange('overrideValue', e.target.value)}
              placeholder="900000"
              required
            />
          </div>

          <div>
            <Label htmlFor="overrideReason">Reason for Override *</Label>
            <Textarea
              id="overrideReason"
              value={formData.overrideReason}
              onChange={(e) => onInputChange('overrideReason', e.target.value)}
              placeholder="Explain why you're overriding the RP Data valuation (e.g., recent renovations, superior finishes, unique features not captured in data)"
              rows={4}
              required
            />
          </div>

          <div>
            <Label htmlFor="overrideEvidence">Supporting Evidence</Label>
            <div className="mt-2 flex items-center gap-3">
              <Button variant="outline" className="flex-1">
                <Upload className="w-4 h-4 mr-2" />
                {formData.overrideEvidence ? 'Evidence Uploaded' : 'Upload Supporting Documents'}
              </Button>
              {formData.overrideEvidence && (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Photos, recent valuations, comparable sales evidence, etc.
            </p>
          </div>

          <label className="flex items-start gap-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.overrideFlag}
              onChange={(e) => onInputChange('overrideFlag', e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded mt-0.5"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900">I acknowledge this overrides RP Data *</p>
              <p className="text-sm text-gray-600 mt-1">
                I understand this override will be logged and may require additional documentation or senior approval.
              </p>
            </div>
          </label>

          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={onSave}
              className="flex-1 bg-orange-600 hover:bg-orange-700"
              disabled={!formData.overrideValue || !formData.overrideReason || !formData.overrideFlag}
            >
              Save Override
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
