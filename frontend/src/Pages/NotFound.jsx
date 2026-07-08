import { Link } from 'react-router';
import React from "react";
import { useTranslation } from "react-i18next";
import { useLocalePath } from '../lib/localePath';

const NotFound = () => {
  const lp = useLocalePath();
  const { t } = useTranslation("pages");
  return (
    <div className="bg-primary h-full flex justify-center">
      <div className="text-center px-6 flex flex-col gap-4">
        <p className="text-9xl font-bold text-muted opacity-30 select-none mt-4">
          404
        </p>
        <h1 className="text-2xl font-semibold text-white mt-2">
          {t("notFound.heading")}
        </h1>
        <p className="text-muted mt-2 text-sm">
          {t("notFound.description")}
        </p>
        <Link
          to={lp('/')}
          className="px-8 py-4 text-sm font-medium bg-secondary-light text-text hover:bg-secondary-light/50 transition"
        >
          {t("notFound.goHome")}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
