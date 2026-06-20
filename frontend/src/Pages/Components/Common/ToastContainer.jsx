import React from 'react';
import { useToast } from '../../../Contexts/ToastContext';
import { CloseIcon } from './Icons';

const TYPE_CLASSES = {
  success: 'border-success/80 bg-success/10 text-success',
  danger: 'border-danger/80 bg-danger/10 text-danger',
  info: 'border-info/80 bg-info/10 text-info',
};

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-16 right-4 z-100 flex flex-col gap-2 w-90 max-w-[calc(100vw-2rem)]">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-3 border shadow flex items-start justify-between gap-3 ${
            TYPE_CLASSES[toast.type] ?? TYPE_CLASSES.info
          }`}
        >
          <p className="text-sm">{toast.message}</p>
          <button
            className="cursor-pointer shrink-0 opacity-80 hover:opacity-100"
            onClick={() => removeToast(toast.id)}
          >
            <CloseIcon size={18} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
