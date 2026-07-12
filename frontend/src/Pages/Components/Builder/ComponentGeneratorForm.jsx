import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import BudgetSlider from './BudgetSlider';
import { useBuilder } from '../../../Contexts/BuilderContext';
import { useAuth } from '../../../Contexts/AuthContext';
import { useToast } from '../../../Contexts/ToastContext';
import axios from 'axios';
import { useLocalePath } from '../../../lib/localePath';
import {
  selectedProductCodes,
  hasIncompatibleSelection,
  needsManualCheckSelection,
} from '../../../lib/buildSlots';

const DEFAULT_PREFERENCES = {
  gpu: null,
  cpu: null,
  include_orderable: true,
};

// shorter than the full-build generator's floor — a single-slot regen is a
// smaller task, so it doesn't need as long to feel like real work
const MIN_GENERATE_DURATION_MS = 1500;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const ComponentGeneratorForm = () => {
  const { t } = useTranslation(['builder', 'common']);
  const { user, showVerifyBanner } = useAuth();
  const { addToast } = useToast();
  const { pickerType, selectedComponents, setSelectedComponents, closePicker, buildIssues } =
    useBuilder();
  const lp = useLocalePath();

  const [budget, setBudget] = useState(150);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressDuration, setProgressDuration] = useState(0);
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);

  const updatePref = (key, value) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    setProgress(0);
    setProgressDuration(0);
    // commit the 0% state first, then animate to 90% over the full minimum
    // duration on the next frame — the rest of the bar fills once we know
    // the real result, whether that lands before or after the floor
    requestAnimationFrame(() => {
      setProgressDuration(MIN_GENERATE_DURATION_MS);
      setProgress(90);
    });

    try {
      const selected = selectedProductCodes(selectedComponents);

      const [res] = await Promise.all([
        axios.post(`/api/builder/${pickerType}`, { budget, selected, preferences }),
        sleep(MIN_GENERATE_DURATION_MS),
      ]);

      setProgressDuration(200);
      setProgress(100);

      if (res.data.success) {
        setSelectedComponents((prev) => ({
          ...prev,
          ...res.data.build,
        }));
        setPreferences(DEFAULT_PREFERENCES);
        closePicker();
        addToast(t('componentGenerator.generateSuccess'), { type: 'success' });
        document.getElementById('side-panel-scroll')?.scrollTo({ top: 0, behavior: 'smooth' });
        document.getElementById('page-scroll')?.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        addToast(res.data.error, { type: 'danger' });
      }
    } catch (err) {
      setProgressDuration(200);
      setProgress(100);
      if (err.response?.status === 403) {
        showVerifyBanner();
        addToast(t('common:verifyEmail.gatedAction'), { type: 'danger' });
      } else {
        addToast(err.response?.data?.error ?? t('componentGenerator.somethingWentWrong'), {
          type: 'danger',
        });
      }
    } finally {
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
        setProgressDuration(0);
      }, 250);
    }
  };

  const hasIncompatible = hasIncompatibleSelection(selectedComponents, buildIssues);

  // a selected component's compatibility with the rest of the build could not be fully
  // verified (missing spec data) — the auto-builder can't assume it fits, so block generation
  const needsManualCheck = needsManualCheckSelection(selectedComponents);

  if (!user) {
    return (
      <p className="text-muted text-sm">
        {t('componentGenerator.loginRequired')}{' '}
        <Link className="text-info/80 cursor-pointer hover:underline" to={lp('/login')}>
          {t('componentGenerator.loginLink')}
        </Link>
        .
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-muted text-sm">
        {t('componentGenerator.intro')}{' '}
        <Link className="text-info/80 cursor-pointer hover:underline" to={lp('/guide')}>
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

      {pickerType === 'cpu' && (
        <>
          <p className="text-muted text-sm mb-1">{t('componentGenerator.preferences')}</p>
          <div className="flex flex-col flex-1">
            <label className="text-sm text-muted" htmlFor="comp_cpu_pref">
              {t('componentGenerator.cpu')}
            </label>
            <select
              id="comp_cpu_pref"
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

      {pickerType === 'gpu' && (
        <>
          <p className="text-muted text-sm mb-1">{t('componentGenerator.preferences')}</p>
          <div className="flex flex-col flex-1">
            <label className="text-sm text-muted" htmlFor="comp_gpu_pref">
              {t('componentGenerator.gpu')}
            </label>
            <select
              id="comp_gpu_pref"
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

      {hasIncompatible && (
        <div className="p-2 border bg-alert/10 border-alert/80">
          <p className="text-alert text-sm">{t('componentGenerator.incompatibleWarning')}</p>
        </div>
      )}

      {!hasIncompatible && needsManualCheck && (
        <div className="p-2 border bg-alert/10 border-alert/80">
          <p className="text-alert text-sm">{t('componentGenerator.manualCheckWarning')}</p>
        </div>
      )}

      <button
        className="p-4 w-full bg-secondary-light text-text cursor-pointer hover:bg-secondary-light/50 transition disabled:opacity-50"
        onClick={handleGenerate}
        disabled={loading || hasIncompatible || needsManualCheck}
      >
        {loading ? <p>{t('componentGenerator.generating')}</p> : t('componentGenerator.generate')}
      </button>

      {loading && (
        <div
          className="h-1 w-full bg-muted/30 overflow-hidden"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          aria-label={t('componentGenerator.generating')}
        >
          <div
            className="h-full bg-secondary-light"
            style={{ width: `${progress}%`, transition: `width ${progressDuration}ms ease-out` }}
          />
        </div>
      )}
    </div>
  );
};

export default React.memo(ComponentGeneratorForm);
