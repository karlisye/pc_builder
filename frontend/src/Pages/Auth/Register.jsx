import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../Contexts/AuthContext';
import Seo from '../Components/Common/Seo';

const Register = () => {
  const { t } = useTranslation(['auth', 'pages']);
  const { register } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  const set = (field) => (e) => setData((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!data.name.trim()) e.name = t('register.nameRequired');
    else if (data.name.trim().length < 3) e.name = t('register.nameMinLength');
    if (!data.email.trim()) e.email = t('common.emailRequired');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = t('common.emailInvalid');
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
      await register(data.name, data.email, data.password, data.password_confirmation);
      navigate('/');
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors) {
        setErrors(serverErrors);
      } else {
        setErrors({ name: err.response?.data?.message ?? err.message ?? 'Something went wrong.' });
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Seo title={t('pages:seo.register.title')} description={t('pages:seo.register.description')} />
      <div className="w-full md:w-200 px-8 py-6">
        <h1 className="text-3xl font-semibold mb-1">{t('register.title')}</h1>
        <div className="flex w-full shadow">
          <div className="w-full md:w-1/2 transition-all duration-300 bg-background">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col my-2 mx-4">
                <label className="text-text" htmlFor="name">
                  {t('register.nameLabel')}
                </label>
                <input
                  className={`bg-surface flex-1 p-2 ${errors.name ? 'outline-1 outline-danger' : 'focus: outline-border'}`}
                  id="name"
                  type="text"
                  value={data.name}
                  onChange={set('name')}
                />
                {errors.name && <p className="text-danger">{errors.name}</p>}
              </div>

              <div className="flex flex-col my-2 mx-4">
                <label className="text-text" htmlFor="email">
                  {t('common.emailLabel')}
                </label>
                <input
                  className={`bg-surface flex-1 p-2 ${errors.email ? 'outline-1 outline-danger' : 'focus: outline-border'}`}
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={set('email')}
                />
                {errors.email && <p className="text-danger">{errors.email}</p>}
              </div>

              <div className="flex flex-col my-2 mx-4">
                <label className="text-text" htmlFor="password">
                  {t('common.passwordLabel')}
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

              <div className="flex flex-col mx-4 my-4">
                <Link className="text-info" to="/login">
                  {t('register.alreadyHaveAccount')}
                </Link>
                <button
                  className="bg-primary hover:bg-primary-light transition cursor-pointer text-white p-4"
                  disabled={processing}
                >
                  {t('register.submit')}
                </button>
              </div>
            </form>
          </div>

          <div className="w-0 md:w-1/2 transition-all duration-300 bg-primary flex flex-col overflow-hidden">
            <div className="border-4 border-secondary m-2 h-full flex items-center justify-center p-2">
              <span className="text-7xl font-bold text-surface">{t('register.heroText')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
