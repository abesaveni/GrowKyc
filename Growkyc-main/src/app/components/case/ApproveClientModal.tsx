import React from 'react';
import { ActionModal } from '../ui/ActionModal';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';

import { approveCase } from '../../api/cases';
import { toast } from '../../lib/toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  notes: z.string().optional(),
  notify: z.boolean(),
});

type FormData = z.infer<typeof schema>;

interface ApproveClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseData: any; // using any for Case type (import if available)
  onActionSuccess?: () => void;
}

export const ApproveClientModal: React.FC<ApproveClientModalProps> = ({ isOpen, onClose, caseData, onActionSuccess }) => {
  // No dispatcher; parent can handle state updates via onActionSuccess
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await approveCase(caseData.id, data);
      toast.success('Client approved');
      onActionSuccess && onActionSuccess();
      onClose();
    } catch (e) {
      toast.error('Failed to approve client');
    }
  };

  return (
    <ActionModal
      title="Approve Client"
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleSubmit(onSubmit)}
      confirmLabel="Approve"
    >
      <div className="text-sm text-gray-600 mb-2">Client: {caseData?.clientName || caseData?.borrowerName}</div>
      <Textarea
        placeholder="Approval notes (optional)"
        {...register('notes')}
        className="mb-4"
      />
      <div className="flex items-center space-x-2">
        <Switch id="notify" {...register('notify')} />
        <label htmlFor="notify" className="text-sm text-gray-700">Notify client</label>
      </div>
    </ActionModal>
  );
};
