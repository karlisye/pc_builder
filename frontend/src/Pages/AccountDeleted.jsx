import { Link } from 'react-router';
import React from "react";
import { useTranslation } from "react-i18next";
import { useLocalePath } from '../lib/localePath';

const AccountDeleted = () => {
  const lp = useLocalePath();
  const { t } = useTranslation("common");
  return (
    <div className="bg-primary h-full flex justify-center">
      <div className="text-center px-6 flex flex-col gap-4">
        <h1 className="text-2xl font-semibold text-white mt-4">
          {t("accountDeleted.title")}
        </h1>
        <p className="text-muted mt-2 text-sm">
          {t("accountDeleted.text")}
        </p>
        <Link
          to={lp('/')}
          className="px-8 py-4 text-sm font-medium bg-secondary-light text-text hover:bg-secondary-light/50 transition"
        >
          {t("accountDeleted.backHome")}
        </Link>
      </div>
    </div>
  );
};

export default AccountDeleted;
