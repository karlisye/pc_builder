import React from "react";
import { Link } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";

const SavedSection = () => {
  const { t } = useTranslation("pages");
  return (
    <div className="max-w-4xl mx-auto px-6 pb-10">
      <h1 className="text-4xl font-semibold mb-8 text-text">
        {t("guides.savedSection.title")}
      </h1>

      <div className="space-y-5">
        <h2 className="text-2xl font-semibold text-text">
          {t("guides.savedSection.viewingBuildsHeading")}
        </h2>

        <p className="text-text">
          <Trans
            t={t}
            i18nKey="guides.savedSection.step1"
            components={{
              savedLink: (
                <Link
                  className="text-info hover:underline font-medium"
                  to="/builds"
                />
              ),
              savedButton: <span className="font-medium" />,
            }}
          />
        </p>

        <p className="text-text">{t("guides.savedSection.step2")}</p>

        <h2 className="text-2xl font-semibold text-text">
          {t("guides.savedSection.viewingComponentsHeading")}
        </h2>

        <p className="text-text">{t("guides.savedSection.step3")}</p>

        <p className="text-text">
          <Trans
            t={t}
            i18nKey="guides.savedSection.step4"
            components={{
              seeInStore: <span className="font-medium" />,
              buy: <span className="font-medium" />,
            }}
          />
        </p>

        <h2 className="text-2xl font-semibold text-text">
          {t("guides.savedSection.editingHeading")}
        </h2>

        <p className="text-text">
          <Trans
            t={t}
            i18nKey="guides.savedSection.editStep1"
            components={{ edit: <span className="font-medium" /> }}
          />
        </p>

        <p className="text-text">{t("guides.savedSection.editStep2")}</p>

        <p className="text-text">
          <Trans
            t={t}
            i18nKey="guides.savedSection.editStep3"
            components={{
              save: <span className="font-semibold" />,
              cancel: <span className="font-semibold" />,
            }}
          />
        </p>

        <h2 className="text-2xl font-semibold text-text">
          {t("guides.savedSection.continuingHeading")}
        </h2>

        <p className="text-text">
          <Trans
            t={t}
            i18nKey="guides.savedSection.continueStep1"
            components={{ continueBuild: <span className="font-semibold" /> }}
          />
        </p>

        <h2 className="text-2xl font-semibold text-text">
          {t("guides.savedSection.deletingHeading")}
        </h2>

        <p className="text-text">
          <Trans
            t={t}
            i18nKey="guides.savedSection.deleteStep1"
            components={{ deleteBuild: <span className="font-semibold" /> }}
          />
        </p>

        <p className="text-text">{t("guides.savedSection.deleteStep2")}</p>
      </div>
    </div>
  );
};

export default SavedSection;
