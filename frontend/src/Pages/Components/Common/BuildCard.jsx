import { Link } from 'react-router-dom';
import { useAuth } from '../../../Contexts/AuthContext';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HeartIcon, InfoIcon, SavedIcon, StarIcon } from '../Common/Icons';
import StarRating from '../Common/StarRating';
import Modal from '../Common/Modal';
import BuildIssuesPopup from '../Common/BuildIssuesPopup';
import { formatDate } from '../../../lib/formatDate';

const BuildCard = ({ build }) => {
  const { t } = useTranslation(['pages', 'common']);
  const { user } = useAuth();

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [privating, setPrivating] = useState(false);

  const [liked, setLiked] = useState(build.liked ?? false);
  const [bookmarked, setBookmarked] = useState(build.bookmarked ?? false);

  const [likesCount, setLikesCount] = useState(build.likes_count ?? 0);
  const [bookmarksCount, setBookmarksCount] = useState(build.bookmarks_count ?? 0);
  const [userRating, setUserRating] = useState(build.reviews?.[0]?.rating ?? null);

  const [buildIssues, setBuildIssues] = useState({});
  const [issuesPopup, setIssuesPopup] = useState(null);

  const handleIssuesPopup = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setIssuesPopup({ x: rect.left, y: rect.bottom });
  };

  const handleSave = async () => {
    const components = Object.fromEntries(
      Object.entries(build.components)
        .filter(([_, component]) => component !== null)
        .map(([type, component]) => [type, component.dateks_id]),
    );

    try {
      await axios.post('/api/builds', {
        name: build.name + ' (copy)',
        notes: build.notes,
        components,
      });
      setSuccess(t('components.buildCard.saveSuccess'));
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError(err.response?.data?.error ?? t('components.buildCard.saveError'));
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
      setError(err.response?.data?.error ?? t('components.buildCard.likeError'));
    }
  };

  const bookmark = async () => {
    try {
      const res = await axios.post(`/api/shared/${build.id}/bookmark`);
      if (res.status === 200) {
        setBookmarked((prev) => !prev);
        setBookmarksCount((prev) => (bookmarked ? prev - 1 : prev + 1));
      }
    } catch (err) {
      setError(err.response?.data?.error ?? t('components.buildCard.bookmarkError'));
    }
  };

  const submitReview = async (rating) => {
    setUserRating(rating);
    try {
      await axios.post(`/api/shared/${build.id}/review`, { rating });
    } catch (err) {
      setError(err.response?.data?.error ?? t('components.buildCard.reviewError'));
    }
  };

  const makePrivate = async () => {
    try {
      const res = await axios.patch(`/api/builds/${build.id}/publish`);
      setSuccess(res.data.success);
      setPrivating(false);
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      console.error(err);
    }
  };

  const validateCompatibility = async () => {
    const selected = Object.fromEntries(
      Object.entries(build.components)
        .filter(([_, c]) => c !== null)
        .map(([type, c]) => [type, c.dateks_id]),
    );

    if (Object.keys(selected).length === 0) {
      setBuildIssues({});
      return;
    }

    try {
      const res = await axios.post('/api/builder/validate', { selected });
      setBuildIssues(res.data.issues);
    } catch (err) {
      setBuildIssues({});
    }
  };

  useEffect(() => {
    validateCompatibility();
  }, []);

  return (
    <>
      <div className="w-full border flex flex-col border-border shadow hover:bg-background transition overflow-hidden">
        <div className="flex gap-2 items-center justify-between m-2">
          <div className="flex gap-2 items-center">
            <Link
              className="w-12 h-12 rounded-full bg-secondary-light flex items-center justify-center font-bold"
              to={`/profile/${build.user?.id}`}
            >
              {build.user.name?.charAt(0).toUpperCase()}
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

          <p className="text-text font-semibold text-xl">€{build.total_price}</p>
        </div>

        <div className="flex xl:flex-row flex-col max-h-100 overflow-y-auto">
          <div className="flex-1 m-2 flex flex-col gap-4">
            <span className="text-muted font-medium">{t('components.buildCard.notes')}</span>
            {build.notes ? (
              <p className="text-text">{build.notes}</p>
            ) : (
              <p className="italic text-sm text-muted">{t('components.buildCard.none')}</p>
            )}

            <div className="p-2 border border-border mt-auto">
              <div className="flex justify-around">
                <span
                  className="flex items-center gap-2"
                  title={t('components.buildCard.likeTitle')}
                >
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
                <span
                  className="flex items-center gap-2"
                  title={t('components.buildCard.bookmarkTitle')}
                >
                  <button onClick={bookmark}>
                    <SavedIcon
                      filled={bookmarked}
                      className={
                        bookmarked
                          ? 'text-alert transition hover:text-alert/90'
                          : 'transition text-muted hover:text-text'
                      }
                    />
                  </button>

                  <span className="text-muted">{bookmarksCount ?? 0}</span>
                </span>

                <span
                  className="flex items-center gap-2"
                  title={t('components.buildCard.ratingTitle')}
                >
                  <StarIcon filled className={'text-alert'} />

                  <span className="text-muted">{Math.round(build.reviews_avg_rating ?? 0)}</span>
                </span>
              </div>

              <div className="w-9/10 mx-auto border border-border my-2"></div>

              {build.user_id !== user.id ? (
                <div className="flex w-full justify-center">
                  <StarRating value={userRating} onChange={submitReview} />
                </div>
              ) : (
                <div className="flex justify-center">
                  <button
                    onClick={() => setPrivating(true)}
                    className="text-text hover:text-danger transition"
                  >
                    {t('components.buildCard.makePrivate')}
                  </button>
                </div>
              )}
            </div>
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
                      <a
                        target="_blank"
                        href={component.url}
                        className="text-text text-sm text-wrap hover:underline cursor-pointer"
                      >
                        {component.name}
                      </a>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {success && <p className="text-success ml-auto px-2">{success}</p>}
        {error && <p className="text-danger ml-auto px-2">{error}</p>}

        <div className="bg-primary mt-auto flex">
          <Link
            className="text-white px-8 py-4 flex-1 text-center hover:bg-primary-light cursor-pointer transition"
            to={`/builder?build=${build.id}&shared=true`}
          >
            {t('components.buildCard.continue')}
          </Link>

          <button
            className="text-white px-8 py-4 flex-1 hover:bg-primary-light cursor-pointer transition"
            onClick={handleSave}
          >
            {t('components.buildCard.copyToSaved')}
          </button>
        </div>
      </div>

      {issuesPopup && <BuildIssuesPopup issues={buildIssues} {...issuesPopup} />}

      {privating && (
        <Modal close={() => setPrivating(false)}>
          <h1 className="text-text text-3xl mb-10">
            {t('components.buildCard.privateConfirmTitle', { name: build.name })}
          </h1>

          <div className="flex gap-4">
            <button
              className="flex-1 p-4 bg-primary text-background cursor-pointer hover:bg-primary-light transition"
              onClick={makePrivate}
            >
              {t('components.buildCard.makePrivate')}
            </button>
            <button
              className="flex-1 p-4 bg-surface text-text cursor-pointer hover:bg-secondary-light transition"
              onClick={() => setPrivating(false)}
            >
              {t('components.buildCard.cancel')}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default BuildCard;
