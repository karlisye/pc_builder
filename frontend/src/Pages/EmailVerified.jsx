import { Link } from "react-router-dom";
import React from "react";
import { useTranslation } from "react-i18next";

const EmailVerified = () => {
  const { t } = useTranslation("common");
  return (
    <div className="bg-primary h-full flex justify-center">
      <div className="text-center px-6 flex flex-col gap-4">
        <h1 className="text-2xl font-semibold text-white mt-4">
          {t("verifyEmail.verifiedTitle")}
        </h1>
        <p className="text-muted mt-2 text-sm">
          {t("verifyEmail.verifiedText")}
        </p>
        <Link
          to="/"
          className="px-8 py-4 text-sm font-medium bg-secondary-light text-text hover:bg-secondary-light/50 transition"
        >
          {t("verifyEmail.backHome")}
        </Link>
      </div>
    </div>
  );
};

export default EmailVerified;
