import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../Common/Modal';
import axios from 'axios';
import { HeartIcon, StarIcon } from '../Common/Icons';
import { useToast } from '../../../Contexts/ToastContext';

const BuildVisibility = ({ build, setBuild }) => {
  const { t } = useTranslation('pages');
  const { addToast } = useToast();
  const [publishing, setPublishing] = useState(false);

  const publish = async () => {
    try {
      const res = await axios.patch(`/api/builds/${build.id}/publish`);

      setBuild((prev) => ({
        ...prev,
        is_public: res.data.is_public,
      }));

      addToast(res.data.success, { type: 'success' });
    } catch (err) {
      addToast(err.response?.data?.error ?? err.message, { type: 'danger' });
    } finally {
      setPublishing(false);
    }
  };

  return (
    <>
      <div className="border border-border bg-background p-2 flex justify-between md:gap-6 gap-2 md:flex-row flex-col">
        {build.is_public ? (
          <>
            <p className="mt-auto text-text">
              {t('components.saved.buildVisibility.publicStatus')}
              <span className="text-success">
                {' '}
                {t('components.saved.buildVisibility.publicLabel')}
              </span>
            </p>

            <div className="flex gap-4">
              <div className="flex gap-2">
                <HeartIcon filled className={'text-danger'} />
                <span>{build.likes_count}</span>
              </div>

              <div className="flex gap-2">
                <StarIcon filled className={'text-alert'} />
                <span>{Math.round(build.reviews_avg_rating ?? 0)}</span>
              </div>
            </div>

            <button
              className="text-text cursor-pointer hover:text-danger transition text-nowrap text-left underline"
              onClick={() => setPublishing(true)}
            >
              {t('components.saved.buildVisibility.makePrivate')}
            </button>
          </>
        ) : (
          <>
            <p className="mt-auto text-text">
              {t('components.saved.buildVisibility.privateStatusPrefix')}
              <span className="text-danger">
                {' '}
                {t('components.saved.buildVisibility.privateLabel')}{' '}
              </span>
              {t('components.saved.buildVisibility.privateStatusSuffix')}
            </p>

            <button
              className="text-text cursor-pointer hover:text-success transition text-nowrap text-left underline"
              onClick={() => setPublishing(true)}
            >
              {t('components.saved.buildVisibility.publish')}
            </button>
          </>
        )}
      </div>

      {publishing && (
        <Modal close={() => setPublishing(false)}>
          <h1 className="text-text text-3xl mb-10 m-4 max-w-120">
            {t('components.saved.buildVisibility.confirmTitle', {
              action: build.is_public
                ? t('components.saved.buildVisibility.actionPrivate')
                : t('components.saved.buildVisibility.actionPublish'),
              name: build.name,
            })}
          </h1>

          <div className="flex gap-4 m-4">
            <button
              className="flex-1 p-4 bg-primary text-background cursor-pointer hover:bg-primary-light transition"
              onClick={publish}
            >
              {build.is_public
                ? t('components.saved.buildVisibility.makePrivateButton')
                : t('components.saved.buildVisibility.publishButton')}
            </button>
            <button
              className="flex-1 p-4 bg-surface text-text cursor-pointer hover:bg-secondary-light transition"
              onClick={() => setPublishing(false)}
            >
              {t('components.saved.buildVisibility.cancel')}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default BuildVisibility;
