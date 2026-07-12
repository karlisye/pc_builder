import { useState } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../Contexts/AuthContext';
import { useLocalePath } from '../../lib/localePath';
import Turnstile from '../Components/Common/Turnstile';

const ForgotPassword = () => {
  const lp = useLocalePath();
  const { t } = useTranslation(['auth', 'pages']);
  const { forgotPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [sent, setSent] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState(null);

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = t('common.emailRequired');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = t('common.emailInvalid');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setProcessing(true);
    try {
      await forgotPassword(email, turnstileToken);
      setSent(true);
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors) {
        setErrors(serverErrors);
      } else {
        setErrors({ email: err.response?.data?.message ?? err.message ?? 'Something went wrong.' });
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="w-full md:w-200 px-8 py-6">
        <h1 className="text-3xl font-semibold mb-1">{t('forgotPassword.title')}</h1>
        <div className="flex w-full shadow">
          <div className="w-full md:w-1/2 transition-all duration-300 bg-background">
            {sent ? (
              <div className="flex flex-col my-2 mx-4 gap-4 py-4">
                <p className="text-text">{t('forgotPassword.sent')}</p>
                <Link className="text-info" to={lp('/login')}>
                  {t('forgotPassword.backToLogin')}
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <p className="text-text my-2 mx-4">{t('forgotPassword.intro')}</p>
                <div className="flex flex-col my-2 mx-4">
                  <label className="text-text" htmlFor="email">
                    {t('common.emailLabel')}
                  </label>
                  <input
                    className={`bg-surface flex-1 p-2 ${errors.email ? 'outline-1 outline-danger' : 'focus: outline-border'}`}
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && <p className="text-danger">{errors.email}</p>}
                </div>

                <div className="flex flex-col mx-4 my-4 gap-2">
                  <Turnstile onToken={setTurnstileToken} onExpire={() => setTurnstileToken(null)} />
                  <button
                    className="bg-primary hover:bg-primary-light transition cursor-pointer text-white p-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={
                      processing || (!!import.meta.env.VITE_TURNSTILE_SITE_KEY && !turnstileToken)
                    }
                  >
                    {t('forgotPassword.submit')}
                  </button>
                  <Link className="text-info" to={lp('/login')}>
                    {t('forgotPassword.backToLogin')}
                  </Link>
                </div>
              </form>
            )}
          </div>

          <div className="w-0 md:w-1/2 transition-all duration-300 bg-primary flex flex-col overflow-hidden">
            <div className="border-4 border-secondary m-2 h-full flex items-center p-2">
              <span className="text-7xl font-bold text-surface whitespace-pre-line">
                {t('forgotPassword.heroText')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
