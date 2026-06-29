import React from 'react';
import { ActionModal } from '../ui/ActionModal';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';

import { rejectCase } from '../../api/cases';
import { toast } from '../../lib/toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  reason: z.enum(['Incomplete Documentation', 'Risk Too High', 'Regulatory Issue', 'Other']),
  notes: z.string().optional(),
  notify: z.boolean(),
});

type FormData = z.infer<typeof schema>;

interface RejectClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseData: any;
  onActionSuccess?: () => void;
}

export const RejectClientModal: React.FC<RejectClientModalProps> = ({ isOpen, onClose, caseData, onActionSuccess }) => {
  // No dispatcher; parent handles state updates via onActionSuccess
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await rejectCase(caseData.id, data);
      toast.success('Client rejected');
      onActionSuccess && onActionSuccess();
      onClose();
    } catch (e) {
      toast.error('Failed to reject client');
    }
  };

  return (
    <ActionModal
      title="Reject Client"
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleSubmit(onSubmit)}
      confirmLabel="Reject"
    >
      <div className="text-sm text-slate-300 mb-2">Client: {caseData?.clientName || caseData?.borrowerName}</div>
      
      <select
        {...register('reason')}
        className="border-input flex h-9 w-full rounded-md border px-3 py-1 text-sm bg-input-background transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] mb-4"
        defaultValue="Incomplete Documentation"
      >
        <option value="Incomplete Documentation">Incomplete Documentation</option>
        <option value="Risk Too High">Risk Too High</option>
        <option value="Regulatory Issue">Regulatory Issue</option>
        <option value="Other">Other</option>
      </select>
      {errors.reason && <p className="text-sm text-red-400 mb-2">{errors.reason.message}</p>}

      <Textarea
        {...register('notes')}
        placeholder="Rejection notes (optional)"
        className="mt-4"
      />
      <div className="flex items-center space-x-2 mt-4">
        <Switch id="notify" {...register('notify')} />
        <label htmlFor="notify" className="text-sm text-slate-300">Notify client</label>
      </div>
    </ActionModal>
  );
};
