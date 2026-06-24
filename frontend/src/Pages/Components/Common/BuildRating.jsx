import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { StarIcon } from './Icons';
import { useAuth } from '../../../Contexts/AuthContext';
import { useToast } from '../../../Contexts/ToastContext';

const BuildRating = ({ buildId, initialRating }) => {
  const { t } = useTranslation('pages');
  const { user } = useAuth();
  const { addToast } = useToast();

  const [rating, setRating] = useState(initialRating ?? null);
  const [hovered, setHovered] = useState(null);

  const submitRating = async (value) => {
    try {
      const res = await axios.post(`/api/shared/${buildId}/review`, { rating: value });
      setRating(res.data.rating);
    } catch (err) {
      addToast(err.response?.data?.error ?? t('buildRating.error'), { type: 'danger' });
    }
  };

  return (
    <div className="space-y-2">
      <h2 className="text-text font-semibold text-2xl">{t('buildRating.title')}</h2>

      {user ? (
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onClick={() => submitRating(value)}
              onMouseEnter={() => setHovered(value)}
              onMouseLeave={() => setHovered(null)}
              className="cursor-pointer"
            >
              <StarIcon
                filled={value <= (hovered ?? rating ?? 0)}
                size={28}
                className={value <= (hovered ?? rating ?? 0) ? 'text-alert' : 'text-muted'}
              />
            </button>
          ))}

          {rating != null && (
            <span className="text-muted text-sm ml-2">
              {t('buildRating.yourRating', { rating })}
            </span>
          )}
        </div>
      ) : (
        <p className="text-secondary-light">
          {t('buildRating.loginToRate')}{' '}
          <Link className="text-info/80 cursor-pointer hover:underline" to="/login">
            {t('buildRating.loginLink')}
          </Link>
        </p>
      )}
    </div>
  );
};

export default BuildRating;
