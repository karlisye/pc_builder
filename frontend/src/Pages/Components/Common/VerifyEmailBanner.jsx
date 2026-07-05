import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../Contexts/AuthContext';
import { useToast } from '../../../Contexts/ToastContext';
import { CloseIcon } from './Icons';

const VerifyEmailBanner = () => {
  const { t } = useTranslation('common');
  const { resendVerification, verifyBannerVisible, dismissVerifyBanner } = useAuth();
  const { addToast } = useToast();
  const [sending, setSending] = useState(false);

  if (!verifyBannerVisible) return null;

  const handleResend = async () => {
    setSending(true);
    try {
      await resendVerification();
      addToast(t('verifyEmail.resendSuccess'), { type: 'success' });
    } catch (err) {
      addToast(err.response?.data?.message ?? t('verifyEmail.resendError'), { type: 'danger' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-primary border-b border-secondary px-6 py-2 flex flex-wrap items-center justify-center gap-3 text-center relative">
      <p className="text-background text-sm">{t('verifyEmail.banner')}</p>
      <button
        onClick={handleResend}
        disabled={sending}
        className="text-white text-sm underline hover:no-underline cursor-pointer disabled:opacity-50"
      >
        {t('verifyEmail.resend')}
      </button>
      <button
        onClick={dismissVerifyBanner}
        className="text-white/70 hover:text-white cursor-pointer sm:absolute sm:right-4 sm:top-1/2 sm:-translate-y-1/2"
        aria-label={t('close')}
      >
        <CloseIcon size={16} />
      </button>
    </div>
  );
};

export default VerifyEmailBanner;
