import React from "react";
import { Link } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import Note from "./Note";
import { AddIcon, CloseIcon } from "../Common/Icons";

const AddButton = () => (
  <button className="bg-surface border border-secondary-light p-1 text-muted hover:bg-secondary-light transition cursor-pointer">
    <AddIcon size={12} />
  </button>
);

const CloseButton = () => (
  <button className="p-1 bg-secondary text-muted hover:bg-danger/20 hover:text-danger cursor-pointer transition border border-secondary-light">
    <CloseIcon size={12} />
  </button>
);

const BuilderSection = () => {
  const { t } = useTranslation("pages");
  return (
    <div className="max-w-4xl mx-auto px-6 pb-10">
      <h1 className="text-4xl font-semibold mb-8 text-text">
        {t("guides.builderSection.title")}
      </h1>

      <div className="space-y-5">
        <h2 className="text-2xl font-semibold text-text">
          {t("guides.builderSection.selectingComponentsHeading")}
        </h2>

        <p className="text-text">
          <Trans
            t={t}
            i18nKey="guides.builderSection.step1"
            components={{
              buildLink: (
                <Link
                  className="text-info hover:underline font-medium"
                  to="/builder"
                />
              ),
              buildButton: <span className="font-medium" />,
            }}
          />
        </p>

        <p className="text-text">
          <Trans
            t={t}
            i18nKey="guides.builderSection.step2"
            components={{
              addButton: <AddButton />,
            }}
          />
        </p>

        <div>
          <p className="text-text">{t("guides.builderSection.step3")}</p>
          <Note>{t("guides.builderSection.step3Note")}</Note>
        </div>

        <div>
          <p className="text-text">
            <Trans
              t={t}
              i18nKey="guides.builderSection.step4"
              components={{ selectText: <span className="font-medium" /> }}
            />
          </p>
          <Note>{t("guides.builderSection.step4Note")}</Note>
        </div>

        <p className="text-text">{t("guides.builderSection.step5")}</p>

        <h2 className="text-2xl font-semibold text-text">
          {t("guides.builderSection.savingHeading")}
        </h2>

        <p className="text-text">{t("guides.builderSection.step6")}</p>

        <div>
          <p className="text-text">
            <Trans
              t={t}
              i18nKey="guides.builderSection.step7"
              components={{ saveButtonText: <span className="font-medium" /> }}
            />
          </p>
          <Note>
            <Trans
              t={t}
              i18nKey="guides.builderSection.step7Note"
              components={{
                closeIcon: <CloseButton />,
              }}
            />
          </Note>
        </div>
      </div>
    </div>
  );
};

export default BuilderSection;
