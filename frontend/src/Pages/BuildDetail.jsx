import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { HeartIcon, InfoIcon, StarIcon } from './Components/Common/Icons';
import Modal from './Components/Common/Modal';
import ComponentDetail from './Components/Common/ComponentDetail';
import BuildIssuesPopup from './Components/Common/BuildIssuesPopup';
import { formatDate } from '../lib/formatDate';
import { formatPrice } from '../lib/componentPrice';
import { useToast } from '../Contexts/ToastContext';
import { useAuth } from '../Contexts/AuthContext';

const BuildDetail = () => {
  const { t } = useTranslation(['pages', 'common']);
  const { addToast } = useToast();
  const { user } = useAuth();
  const { buildId } = useParams();

  const [build, setBuild] = useState(null);
  const [error, setError] = useState('');
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const [buildIssues, setBuildIssues] = useState({});
  const [issuesPopup, setIssuesPopup] = useState(null);
  const [viewingComponent, setViewingComponent] = useState(null);

  useEffect(() => {
    axios
      .get(`/api/shared/${buildId}`)
      .then((res) => {
        setBuild(res.data);
        setLiked(res.data.liked ?? false);
        setLikesCount(res.data.likes_count ?? 0);
      })
      .catch((err) => {
        setError(err.response?.data?.error ?? t('components.buildCard.saveError'));
      });
  }, [buildId]);

  useEffect(() => {
    if (!build) return;

    const selected = Object.fromEntries(
      Object.entries(build.components)
        .filter(([_, c]) => c !== null)
        .map(([type, c]) => [type, c.product_code]),
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

  const like = async () => {
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="w-full border flex flex-col border-border shadow overflow-hidden">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-2 m-2">
          <div className="flex gap-2 items-center">
            <Link
              className="w-12 h-12 rounded-full bg-secondary-light flex items-center justify-center font-bold"
              to={`/profile/${build.user?.id}`}
            >
              {build.user?.name?.charAt(0).toUpperCase()}
            </Link>

            <div>
              <div className="flex gap-2 items-center">
                <h1 className="text-2xl uppercase text-text font-semibold">{build.name}</h1>
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
                    <span className="hidden xl:block">
                      {t('components.buildCard.buildIncompatible')}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex gap-4 items-center">
                <Link className="text-muted" to={`/profile/${build.user?.id}`}>
                  @{build.user?.name}
                </Link>
                <p className="text-sm text-muted px-2">{formatDate(build.created_at)}</p>
              </div>
            </div>
          </div>

          <p className="text-text font-semibold text-xl xl:ml-auto">
            €{formatPrice(build.total_price)}
          </p>
        </div>

        <div className="flex items-center gap-6 m-2">
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

        <div className="flex xl:flex-row flex-col">
          <div className="flex-1 m-2 flex flex-col gap-4">
            <span className="text-muted font-medium">{t('components.buildCard.notes')}</span>
            {build.notes ? (
              <p className="text-text">{build.notes}</p>
            ) : (
              <p className="italic text-sm text-muted">{t('components.buildCard.none')}</p>
            )}
          </div>

          <div className="flex-2 m-2">
            <span className="text-muted font-medium">
              {t('components.buildCard.componentsLabel')}
            </span>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {build.components &&
                Object.entries(build.components).map(([key, component]) => {
                  if (!component) return null;

                  return (
                    <div key={key}>
                      <span className="text-muted uppercase text-sm block">
                        {t(`common:components.${key}`, { defaultValue: key })}
                      </span>
                      <button
                        onClick={() => setViewingComponent({ component, name: key })}
                        className="text-text text-sm text-wrap text-left hover:underline cursor-pointer"
                      >
                        {component.name}
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        <div className="bg-primary mt-auto flex">
          <Link
            className="text-white px-8 py-4 flex-1 text-center hover:bg-primary-light cursor-pointer transition"
            to={`/builder?build=${build.id}&shared=true`}
          >
            {t('components.buildCard.continue')}
          </Link>

          {user && (
            <button
              className="text-white px-8 py-4 flex-1 hover:bg-primary-light cursor-pointer transition"
              onClick={handleSave}
            >
              {t('components.buildCard.copyToSaved')}
            </button>
          )}
        </div>
      </div>

      {issuesPopup && <BuildIssuesPopup issues={buildIssues} {...issuesPopup} />}

      {viewingComponent && (
        <Modal close={() => setViewingComponent(null)}>
          <div className="w-[min(90vw,64rem)] max-h-[80vh] overflow-y-auto">
            <ComponentDetail
              component={viewingComponent.component}
              title={t(`common:components.${viewingComponent.name}`, {
                defaultValue: viewingComponent.name,
              })}
              onClose={() => setViewingComponent(null)}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BuildDetail;
