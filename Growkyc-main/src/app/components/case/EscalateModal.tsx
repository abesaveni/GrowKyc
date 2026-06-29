import React from 'react';
import { ActionModal } from '../ui/ActionModal';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { escalateCase } from '../../api/cases';
import { toast } from '../../lib/toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  level: z.enum(['High', 'Medium', 'Low']),
  notes: z.string().optional(),
  notify: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

interface EscalateModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseData: any;
  onActionSuccess?: () => void;
}

export const EscalateModal: React.FC<EscalateModalProps> = ({ isOpen, onClose, caseData, onActionSuccess }) => {
  // No dispatcher; parent handles state updates via onActionSuccess
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await escalateCase(caseData.id, data);
      toast.success('Case escalated');
      onActionSuccess && onActionSuccess();
      onClose();
    } catch (e) {
      toast.error('Failed to escalate case');
    }
  };

  return (
    <ActionModal
      title="Escalate Case"
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleSubmit(onSubmit)}
      confirmLabel="Escalate"
    >
      <div className="text-sm text-gray-600 mb-2">Client: {caseData?.clientName || caseData?.borrowerName}</div>

      <select
        {...register('level')}
        className="border-input flex h-9 w-full rounded-md border px-3 py-1 text-sm bg-input-background transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] mb-4"
        defaultValue="Medium"
      >
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      {errors.level && <p className="text-sm text-red-600 mb-2">{errors.level.message}</p>}

      <Textarea
        {...register('notes')}
        placeholder="Additional notes (optional)"
        className="mt-4"
      />
      <div className="flex items-center space-x-2 mt-4">
        <Switch id="notify" {...register('notify')} />
        <label htmlFor="notify" className="text-sm text-gray-700">Notify senior team</label>
      </div>
    </ActionModal>
  );
};
