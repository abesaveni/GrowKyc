import React from 'react';
import { ActionModal } from '../ui/ActionModal';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';

import { requestMoreInfo } from '../../api/cases';
import { toast } from '../../lib/toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  description: z.string().min(10, 'Please provide details'),
  notify: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

interface RequestInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseData: any;
  onActionSuccess?: () => void;
}

export const RequestInfoModal: React.FC<RequestInfoModalProps> = ({ isOpen, onClose, caseData, onActionSuccess }) => {
  // No dispatcher – parent will handle state updates via onActionSuccess
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await requestMoreInfo(caseData.id, data);
      toast.success('Requested more information');
      onActionSuccess && onActionSuccess();
      onClose();
    } catch (e) {
      toast.error('Failed to request more information');
    }
  };

  return (
    <ActionModal
      title="Request More Information"
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleSubmit(onSubmit)}
      confirmLabel="Send Request"
    >
      <Textarea
        placeholder="Describe the information needed..."
        {...register('description')}
        className="mb-4"
      />
      {errors.description && (
        <p className="text-sm text-red-400">{errors.description.message}</p>
      )}
      <div className="flex items-center space-x-2">
        <Switch id="notify" {...register('notify')} />
        <label htmlFor="notify" className="text-sm text-slate-300">Notify client via email</label>
      </div>
    </ActionModal>
  );
};
