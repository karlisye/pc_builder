import { useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../Contexts/AuthContext';
import { useLocalePath } from '../../lib/localePath';

const ResetPassword = () => {
  const lp = useLocalePath();
  const { t } = useTranslation(['auth', 'pages']);
  const { resetPassword } = useAuth();
  const [searchParams] = useSearchParams();

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [data, setData] = useState({ password: '', password_confirmation: '' });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const set = (field) => (e) => setData((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!data.password) e.password = t('common.passwordRequired');
    else if (data.password.length < 8) e.password = t('common.passwordMinLength');
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/.test(data.password))
      e.password = t('common.passwordComplexity');
    if (!data.password_confirmation)
      e.password_confirmation = t('register.confirmPasswordRequired');
    else if (data.password !== data.password_confirmation)
      e.password_confirmation = t('register.passwordsDoNotMatch');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setProcessing(true);
    try {
      await resetPassword(token, email, data.password, data.password_confirmation);
      setDone(true);
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors) {
        setErrors(serverErrors);
      } else {
        setErrors({
          password: err.response?.data?.message ?? err.message ?? 'Something went wrong.',
        });
      }
    } finally {
      setProcessing(false);
    }
  };

  const invalidLink = !token || !email;

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="w-full md:w-200 px-8 py-6">
        <h1 className="text-3xl font-semibold mb-1">{t('resetPassword.title')}</h1>
        <div className="flex w-full shadow">
          <div className="w-full md:w-1/2 transition-all duration-300 bg-background">
            {invalidLink ? (
              <div className="flex flex-col my-2 mx-4 gap-4 py-4">
                <p className="text-text">{t('resetPassword.invalidLink')}</p>
                <Link className="text-info" to={lp('/forgot-password')}>
                  {t('resetPassword.requestNew')}
                </Link>
              </div>
            ) : done ? (
              <div className="flex flex-col my-2 mx-4 gap-4 py-4">
                <p className="text-text">{t('resetPassword.success')}</p>
                <Link className="text-info" to={lp('/login')}>
                  {t('resetPassword.signIn')}
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col my-2 mx-4">
                  <label className="text-text" htmlFor="password">
                    {t('resetPassword.newPasswordLabel')}
                  </label>
                  <input
                    className={`bg-surface flex-1 p-2 ${errors.password ? 'outline-1 outline-danger' : 'focus: outline-border'}`}
                    id="password"
                    type="password"
                    value={data.password}
                    onChange={set('password')}
                  />
                  {errors.password && <p className="text-danger">{errors.password}</p>}
                </div>

                <div className="flex flex-col my-2 mx-4">
                  <label className="text-text" htmlFor="password_confirmation">
                    {t('register.confirmPasswordLabel')}
                  </label>
                  <input
                    className={`bg-surface flex-1 p-2 ${errors.password_confirmation ? 'outline-1 outline-danger' : 'focus: outline-border'}`}
                    id="password_confirmation"
                    type="password"
                    value={data.password_confirmation}
                    onChange={set('password_confirmation')}
                  />
                  {errors.password_confirmation && (
                    <p className="text-danger">{errors.password_confirmation}</p>
                  )}
                </div>

                <div className="flex flex-col mx-4 my-4 gap-2">
                  <button
                    className="bg-primary hover:bg-primary-light transition cursor-pointer text-white p-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={processing}
                  >
                    {t('resetPassword.submit')}
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="w-0 md:w-1/2 transition-all duration-300 bg-primary flex flex-col overflow-hidden">
            <div className="border-4 border-secondary m-2 h-full flex items-center p-2">
              <span className="text-7xl font-bold text-surface whitespace-pre-line">
                {t('resetPassword.heroText')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
