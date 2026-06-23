import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { HeartIcon, StarIcon } from '../Common/Icons';
import { formatPrice } from '../../../lib/componentPrice';
import { useAuth } from '../../../Contexts/AuthContext';
import { useToast } from '../../../Contexts/ToastContext';

const BuildCard = ({ build }) => {
  const { t } = useTranslation(['pages', 'common']);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

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

  return (
    <div className="w-full xl:w-80 border flex flex-col border-border shadow hover:bg-background transition relative">
      <div
        className="flex flex-row xl:flex-col cursor-pointer"
        onClick={() => navigate(`/shared/${build.id}`)}
      >
        <div className="w-28 h-28 xl:w-full xl:h-auto xl:aspect-square bg-surface shrink-0" />

        <div className="p-2 flex flex-col gap-1 flex-1 min-w-0">
          <h2 className="text-text font-semibold text-xl line-clamp-1">{build.name}</h2>

          <Link
            className="text-muted text-sm hover:underline"
            to={`/profile/${build.user?.id}`}
            onClick={(e) => e.stopPropagation()}
          >
            @{build.user?.name}
          </Link>

          <div className="flex gap-4 justify-between">
            <span className="text-text font-semibold">€{formatPrice(build.total_price)}</span>

            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1" title={t('components.buildCard.likeTitle')}>
                <HeartIcon filled size={18} className={'text-danger'} />
                <span className="text-muted text-sm">{build.likes_count ?? 0}</span>
              </span>
              <span
                className="flex items-center gap-1"
                title={t('components.buildCard.ratingTitle')}
              >
                <StarIcon filled size={18} className={'text-alert'} />
                <span className="text-muted text-sm">
                  {Math.round(build.reviews_avg_rating ?? 0)}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-primary mt-auto flex">
        <Link
          className="text-white py-4 px-8 flex-1 text-center hover:bg-primary-light cursor-pointer transition"
          to={`/builder?build=${build.id}&shared=true`}
          onClick={(e) => e.stopPropagation()}
        >
          {t('components.buildCard.continue')}
        </Link>

        {user && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSave();
            }}
            className="text-white py-4 px-8 flex-1 hover:bg-primary-light cursor-pointer transition"
          >
            {t('components.buildCard.copyToSaved')}
          </button>
        )}
      </div>
    </div>
  );
};

export default BuildCard;
