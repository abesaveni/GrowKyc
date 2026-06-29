import React from 'react';
import { ActionModal } from '../ui/ActionModal';
import { Textarea } from '../ui/textarea';
import { openEdd } from '../../api/cases';
import { toast } from '../../lib/toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  details: z.string().min(10, 'Please provide EDD details and justification'),
});

type FormData = z.infer<typeof schema>;

interface OpenEddModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseData: any;
  onActionSuccess?: () => void;
}

export const OpenEddModal: React.FC<OpenEddModalProps> = ({ isOpen, onClose, caseData, onActionSuccess }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await openEdd(caseData.id, data);
      toast.success('Enhanced Due Diligence (EDD) initiated successfully');
      onActionSuccess && onActionSuccess();
      onClose();
    } catch (e) {
      toast.error('Failed to initiate EDD workflow');
    }
  };

  return (
    <ActionModal
      title="Initiate Enhanced Due Diligence (EDD)"
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleSubmit(onSubmit)}
      confirmLabel="Initiate EDD"
    >
      <div className="text-sm text-slate-300 mb-2">Client: {caseData?.clientName || caseData?.borrowerName}</div>
      <Textarea
        placeholder="Enter EDD triggers, justification, and scope..."
        {...register('details')}
        className="mb-4"
      />
      {errors.details && (
        <p className="text-sm text-red-400">{errors.details.message}</p>
      )}
    </ActionModal>
  );
};
