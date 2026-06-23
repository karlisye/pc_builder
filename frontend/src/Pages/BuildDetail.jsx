import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { HeartIcon, InfoIcon, StarIcon } from './Components/Common/Icons';
import Modal from './Components/Common/Modal';
import ComponentDetail from './Components/Common/ComponentDetail';
import BuildIssuesPopup from './Components/Common/BuildIssuesPopup';
import SidePanel from './Components/Common/SidePanel';
import ClosedSection from './Components/Common/ClosedSection';
import BuildComments from './Components/Common/BuildComments';
import { formatDate } from '../lib/formatDate';
import { formatPrice } from '../lib/componentPrice';
import { useToast } from '../Contexts/ToastContext';
import { useAuth } from '../Contexts/AuthContext';

const SLOT_KEYS = [
  'cpu',
  'motherboard',
  'ram',
  'gpu',
  'ssd',
  'hdd',
  'case',
  'cooler',
  'psu',
  'fan',
];

const BuildDetail = () => {
  const { t } = useTranslation(['pages', 'builder', 'common']);
  const { addToast } = useToast();
  const { user } = useAuth();
  const { buildId } = useParams();

  const [build, setBuild] = useState(null);
  const [error, setError] = useState('');
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const [buildIssues, setBuildIssues] = useState({});
  const [issuesPopup, setIssuesPopup] = useState(null);
  const [expandedSlot, setExpandedSlot] = useState(null);
  const [privating, setPrivating] = useState(false);

  useEffect(() => {
    axios
      .get(`/api/shared/${buildId}`)
      .then((res) => {
        setBuild(res.data);
        setLiked(res.data.liked ?? false);
        setLikesCount(res.data.likes_count ?? 0);
      })
      .catch((err) => {
        setError(err.response?.data?.error ?? t('buildDetail.notFoundError'));
      });
  }, [buildId]);

  useEffect(() => {
    if (!build) return;

    const selected = Object.fromEntries(
      SLOT_KEYS.map((slot) => [slot, build.components[slot]])
        .filter(([, component]) => component !== null)
        .map(([slot, component]) => [slot, component.product_code]),
    );

    if (Object.keys(selected).length === 0) {
      setBuildIssues({});
      return;
    }

    axios
      .post('/api/builder/validate', { selected })
      .then((res) => setBuildIssues(res.data.issues))
      .catch(() => setBuildIssues({}));
  }, [build]);

  const handleIssuesPopup = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setIssuesPopup({ x: rect.left, y: rect.bottom });
  };

  const handleExpandSlot = (slot) => {
    setExpandedSlot((prev) => (prev === slot ? null : slot));
  };

  const handleSave = async () => {
    const components = Object.fromEntries(
      Object.entries(build.components)
        .filter(([_, component]) => component !== null)
        .map(([type, component]) => [type, component.product_code]),
    );

    try {
      await axios.post('/api/builds', {
        name: build.name + ' (copy)',
        notes: build.notes,
        components,
      });
      addToast(t('components.buildCard.saveSuccess'), { type: 'success' });
    } catch (err) {
      addToast(err.response?.data?.error ?? t('components.buildCard.saveError'), {
        type: 'danger',
      });
    }
  };

  const makePrivate = async () => {
    try {
      const res = await axios.patch(`/api/builds/${build.id}/publish`);
      setBuild((prev) => ({ ...prev, is_public: res.data.is_public }));
      addToast(res.data.success, { type: 'success' });
    } catch (err) {
      addToast(err.response?.data?.error ?? err.message, { type: 'danger' });
    } finally {
      setPrivating(false);
    }
  };

  const like = async () => {
    if (!user) {
      addToast(t('components.buildCard.likeLoginRequired'), { type: 'danger' });
      return;
    }

    try {
      const res = await axios.post(`/api/shared/${build.id}/like`);
      if (res.status === 200) {
        setLiked((prev) => !prev);
        setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
      }
    } catch (err) {
      addToast(err.response?.data?.error ?? t('components.buildCard.likeError'), {
        type: 'danger',
      });
    }
  };

  if (error) {
    return <p className="text-danger text-center mt-6">{error}</p>;
  }

  if (!build) return null;

  const expandedComponent = expandedSlot ? build.components[expandedSlot] : null;

  return (
    <div className="h-full flex">
      <SidePanel title={t('buildDetail.sidePanelTitle')}>
        {Object.keys(buildIssues).length > 0 && (
          <div className="mb-4">
            <ClosedSection title={t('builder:buildDesc.compatibility')}>
              <div className="space-y-2">
                {Object.entries(buildIssues).map(([slot, issues]) =>
                  issues.map((issue, i) => (
                    <div
                      key={`${slot}-${i}`}
                      className="border border-danger/80 bg-danger/10 p-4 space-y-2"
                    >
                      <p className="text-danger text-sm">
                        <span className="font-medium">
                          {t(`common:components.${slot}`, { defaultValue: slot })}:{' '}
                        </span>
                        {issue}
                      </p>
                    </div>
                  )),
                )}
              </div>
            </ClosedSection>
          </div>
        )}

        <div className="flex">
          <Link
            className="block text-center p-4 bg-secondary text-white hover:bg-secondary-light transition cursor-pointer flex-1"
            to={`/builder?build=${build.id}&shared=true`}
          >
            {t('components.buildCard.continue')}
          </Link>

          {user && (
            <button
              onClick={handleSave}
              className="w-full p-4 bg-secondary text-white hover:bg-secondary-light transition cursor-pointer flex-1"
            >
              {t('components.buildCard.copyToSaved')}
            </button>
          )}
        </div>

        {user?.id === build.user_id && (
          <div className="mt-4 pt-4 border-t border-primary-light">
            <button
              onClick={() => setPrivating(true)}
              className="text-secondary-light hover:text-danger transition cursor-pointer"
            >
              {t('components.saved.buildVisibility.makePrivate')}
            </button>
          </div>
        )}
      </SidePanel>

      <div className="flex-1 pt-6 px-4 mb-6">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-between gap-2">
            <div>
              <div className="flex gap-4 items-center">
                <h2 className="text-text font-semibold text-3xl uppercase">{build.name}</h2>
                {build.type && (
                  <span className="py-0.5 px-3 text-text border border-border bg-secondary-light">
                    {build.type}
                  </span>
                )}
                {Object.keys(buildIssues).length > 0 && (
                  <div
                    className="text-danger/80 hover:text-danger/60 transition flex gap-2"
                    onMouseEnter={handleIssuesPopup}
                    onMouseLeave={() => setIssuesPopup(null)}
                  >
                    <InfoIcon />
                  </div>
                )}
              </div>
              <div className="flex gap-4 items-center">
                <Link className="text-muted" to={`/profile/${build.user?.id}`}>
                  @{build.user?.name}
                </Link>
                <p className="text-sm text-muted">{formatDate(build.created_at)}</p>
              </div>
            </div>
          </div>

          {build.notes && <p className="text-text">{build.notes}</p>}

          <div className="flex items-center gap-6">
            <p className="text-text font-semibold text-2xl">€{formatPrice(build.total_price)}</p>

            <span className="flex items-center gap-2" title={t('components.buildCard.likeTitle')}>
              <button onClick={like}>
                <HeartIcon
                  filled={liked}
                  className={
                    liked
                      ? 'text-danger transition hover:text-danger/90'
                      : 'transition text-muted hover:text-text'
                  }
                />
              </button>
              <span className="text-muted">{likesCount ?? 0}</span>
            </span>

            <span className="flex items-center gap-2" title={t('components.buildCard.ratingTitle')}>
              <StarIcon filled className={'text-alert'} />
              <span className="text-muted">{Math.round(build.reviews_avg_rating ?? 0)}</span>
            </span>
          </div>

          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {SLOT_KEYS.map((slot) => {
              const component = build.components[slot];
              if (!component) return null;
              const isExpanded = expandedSlot === slot;
              return (
                <div key={slot}>
                  <div
                    onClick={() => handleExpandSlot(slot)}
                    className={`flex cursor-pointer transition-all border border-border ${isExpanded ? 'bg-secondary-light hover:bg-secondary-light/80' : 'bg-surface hover:bg-secondary-light'}`}
                  >
                    <div className="flex-1 m-4">
                      <div className="flex justify-between">
                        <span className="text-muted text-sm">
                          {t(`common:components.${slot}`, { defaultValue: slot })}
                        </span>
                        <span className="text-muted text-sm">€{formatPrice(component.price)}</span>
                      </div>
                      <span className="text-text line-clamp-1">{component.name}</span>
                    </div>
                  </div>

                  <div
                    className={`lg:hidden grid transition-all overflow-hidden ${
                      isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <ComponentDetail
                        component={component}
                        title={t(`common:components.${slot}`, { defaultValue: slot })}
                        onClose={() => setExpandedSlot(null)}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            className={`hidden lg:grid transition-all overflow-hidden ${
              expandedComponent ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
            }`}
          >
            <div className="overflow-hidden">
              {expandedComponent && (
                <ComponentDetail
                  component={expandedComponent}
                  title={t(`common:components.${expandedSlot}`, { defaultValue: expandedSlot })}
                  onClose={() => setExpandedSlot(null)}
                />
              )}
            </div>
          </div>

          <BuildComments buildId={build.id} />
        </div>
      </div>

      {issuesPopup && <BuildIssuesPopup issues={buildIssues} {...issuesPopup} />}

      {privating && (
        <Modal close={() => setPrivating(false)}>
          <h1 className="text-text text-3xl mb-10 m-4 max-w-120">
            {t('components.saved.buildVisibility.confirmTitle', {
              action: t('components.saved.buildVisibility.actionPrivate'),
              name: build.name,
            })}
          </h1>

          <div className="flex gap-4 m-4">
            <button
              className="flex-1 p-4 bg-primary text-background cursor-pointer hover:bg-primary-light transition"
              onClick={makePrivate}
            >
              {t('components.saved.buildVisibility.makePrivateButton')}
            </button>
            <button
              className="flex-1 p-4 bg-surface text-text cursor-pointer hover:bg-secondary-light transition"
              onClick={() => setPrivating(false)}
            >
              {t('components.saved.buildVisibility.cancel')}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BuildDetail;
