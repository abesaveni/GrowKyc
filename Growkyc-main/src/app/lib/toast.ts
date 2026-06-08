import { toast as sonnerToast } from 'sonner';

export const toast = {
  success: (message: string, description?: string) => {
    const fullMessage = description ? `${message} - ${description}` : message;
    sonnerToast.success(fullMessage);
  },
  error: (message: string, description?: string) => {
    const fullMessage = description ? `${message} - ${description}` : message;
    sonnerToast.error(fullMessage);
  },
  info: (message: string, description?: string) => {
    const fullMessage = description ? `${message} - ${description}` : message;
    sonnerToast.info(fullMessage);
  },
  warning: (message: string, description?: string) => {
    const fullMessage = description ? `${message} - ${description}` : message;
    sonnerToast.warning(fullMessage);
  },
  loading: (message: string) => {
    return sonnerToast.loading(message);
  },
  dismiss: (id?: string | number) => {
    sonnerToast.dismiss(id);
  },
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return sonnerToast.promise(promise, messages);
  }
};
