import React from 'react';
import { ActionModal } from '../ui/ActionModal';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';

import { flagInvestigation } from '../../api/cases';
import { toast } from '../../lib/toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  reason: z.string().min(5, 'Provide a reason'),
  notify: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

interface FlagInvestigationModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseData: any;
  onActionSuccess?: () => void;
}

export const FlagInvestigationModal: React.FC<FlagInvestigationModalProps> = ({ isOpen, onClose, caseData, onActionSuccess }) => {
  // No dispatcher – parent will handle state updates via onActionSuccess
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await flagInvestigation(caseData.id, data);
      toast.success('Case flagged for investigation');
      onActionSuccess && onActionSuccess();
      onClose();
    } catch (e) {
      toast.error('Failed to flag investigation');
    }
  };

  return (
    <ActionModal
      title="Flag for Investigation"
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleSubmit(onSubmit)}
      confirmLabel="Flag"
    >
      <Textarea
        placeholder="Reason for investigation..."
        {...register('reason')}
        className="mb-4"
      />
      {errors.reason && <p className="text-sm text-red-600">{errors.reason.message}</p>}
      <div className="flex items-center space-x-2">
        <Switch id="notify" {...register('notify')} />
        <label htmlFor="notify" className="text-sm text-gray-700">Notify compliance team</label>
      </div>
    </ActionModal>
  );
};
