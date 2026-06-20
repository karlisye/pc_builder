import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowIcon } from '../Common/Icons';
import { Link } from 'react-router-dom';
import BudgetSlider from './BudgetSlider';
import { useBuilder } from '../../../Contexts/BuilderContext';
import { useAuth } from '../../../Contexts/AuthContext';
import axios from 'axios';

const ComponentGenerator = () => {
  const { t } = useTranslation('builder');
  const { user } = useAuth();
  const { currentCompToAdd, selectedComponents, setSelectedComponents, setCurrentCompToAdd } =
    useBuilder();

  const [open, setOpen] = useState(false);
  const [budget, setBudget] = useState(150);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    gpu: null,
    cpu: null,
    include_orderable: true,
  });

  const updatePref = (key, value) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const selected = Object.fromEntries(
        Object.entries(selectedComponents)
          .filter(([_, component]) => component !== null)
          .map(([type, component]) => [type, component.dateks_id]),
      );

      const res = await axios.post(`/api/builder/${currentCompToAdd.toLowerCase()}`, {
        budget,
        selected,
        preferences,
      });

      if (res.data.success) {
        setSelectedComponents((prev) => ({
          ...prev,
          ...res.data.build,
        }));
        setOpen(false);
        setPreferences((prev) => Object.fromEntries(Object.keys(prev).map((k) => [k, null])));
        setCurrentCompToAdd(null);
      } else {
        setError(res.data.error);
      }
    } catch (err) {
      setError(err.response?.data?.error ?? t('componentGenerator.somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  };

  const hasIncompatible = Object.values(selectedComponents).some(
    (component) => component !== null && component.compatible === false,
  );

  if (!user) {
    return (
      <div className="pt-4 border-t mt-4 border-secondary">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="w-full flex justify-between items-center text-secondary-light hover:text-surface transition cursor-pointer"
        >
          <span className="text-sm">{t('componentGenerator.title')}</span>
          <ArrowIcon active={open} />
        </button>

        <div
          className={`grid transition-all overflow-hidden ${open ? 'grid-rows-[1fr] mt-3' : 'grid-rows-[0fr]'}`}
        >
          <div className="overflow-hidden">
            <p className="text-muted text-sm">
              {t('componentGenerator.loginRequired')}{' '}
              <Link className="text-info/80 cursor-pointer hover:underline" to="/login">
                {t('componentGenerator.loginLink')}
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-4 border-t mt-4 border-secondary">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex justify-between items-center text-secondary-light hover:text-surface transition cursor-pointer"
      >
        <span className="text-sm">{t('componentGenerator.title')}</span>
        <ArrowIcon active={open} />
      </button>

      <div
        className={`grid transition-all overflow-hidden ${open ? 'grid-rows-[1fr] mt-3' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden space-y-4">
          <p className="text-muted text-sm">
            {t('componentGenerator.intro')}{' '}
            <Link className="text-info/80 cursor-pointer hover:underline" to="/guide">
              {t('componentGenerator.guideLink')}
            </Link>{' '}
            {t('componentGenerator.guideSuffix')}
          </p>

          <BudgetSlider
            min={5}
            max={1000}
            step={5}
            showRemaining={false}
            value={budget}
            onChange={setBudget}
          />

          {currentCompToAdd === 'CPU' && (
            <>
              <p className="text-muted text-sm mb-1">{t('componentGenerator.preferences')}</p>
              <div className="flex flex-col flex-1">
                <label className="text-sm text-muted" htmlFor="cpu">
                  {t('componentGenerator.cpu')}
                </label>
                <select
                  onChange={(e) => updatePref('cpu', e.target.value)}
                  className="p-1 text-muted text-sm border hover:outline focus:outline outline-secondary-light"
                  value={preferences.cpu ?? ''}
                >
                  <option value="">{t('componentGenerator.any')}</option>
                  <option value="amd">{t('componentGenerator.amd')}</option>
                  <option value="intel">{t('componentGenerator.intel')}</option>
                </select>
              </div>
            </>
          )}

          {currentCompToAdd === 'GPU' && (
            <>
              <p className="text-muted text-sm mb-1">{t('componentGenerator.preferences')}</p>
              <div className="flex flex-col flex-1">
                <label className="text-sm text-muted" htmlFor="gpu">
                  {t('componentGenerator.gpu')}
                </label>
                <select
                  onChange={(e) => updatePref('gpu', e.target.value)}
                  className="p-1 text-muted text-sm border hover:outline focus:outline outline-secondary-light"
                  value={preferences.gpu ?? ''}
                >
                  <option value="">{t('componentGenerator.any')}</option>
                  <option value="nvidia">{t('componentGenerator.nvidia')}</option>
                  <option value="amd">{t('componentGenerator.amd')}</option>
                  <option value="intel">{t('componentGenerator.intel')}</option>
                </select>
              </div>
            </>
          )}

          <div className="flex gap-2 items-center">
            <input
              className="accent-secondary-light"
              id="include_orderable"
              type="checkbox"
              checked={preferences.include_orderable}
              onChange={(e) => updatePref('include_orderable', e.target.checked)}
            />
            <label className="text-secondary-light text-sm" htmlFor="include_orderable">
              {t('componentGenerator.includeOnlyOrderable')}
            </label>
          </div>

          {error && <p className="text-danger text-sm mb-2">{error}</p>}

          {hasIncompatible && (
            <div className="p-2 border bg-alert/10 border-alert/80">
              <p className="text-alert text-sm">{t('componentGenerator.incompatibleWarning')}</p>
            </div>
          )}

          <button
            className="p-4 w-full bg-secondary-light text-text cursor-pointer hover:bg-secondary-light/50 transition disabled:opacity-50"
            onClick={handleGenerate}
            disabled={loading || hasIncompatible}
          >
            {loading ? (
              <p>{t('componentGenerator.generating')}</p>
            ) : (
              t('componentGenerator.generate')
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComponentGenerator;
