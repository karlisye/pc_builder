import axios from "axios";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useBuilder } from "../../../Contexts/BuilderContext";
import BudgetSlider from "./BudgetSlider";
import { Link } from "react-router-dom";
import { ArrowIcon } from "../Common/Icons";
import ClosedSection from "../Common/ClosedSection";
import { useAuth } from "../../../Contexts/AuthContext";
import { useToast } from "../../../Contexts/ToastContext";

const BuildGenerator = () => {
  const { t } = useTranslation("builder");
  const { user } = useAuth();
  const { addToast } = useToast();
  const {
    selectedComponents,
    setSelectedComponents,
    setCurrentCompToAdd,
    setBuildType,
    setWarnings,
    setNotes,
    buildIssues,
  } = useBuilder();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [budget, setBudget] = useState(1500);
  const [preferences, setPreferences] = useState({
    gpu: null,
    cpu: null,
    type: null,
    include_orderable: true,
  });
  const [info, setInfo] = useState("");

  const recommendedBudget =
    {
      gaming: 1000,
      office: 600,
      streaming: 1200,
      rendering: 1500,
    }[preferences.type] ?? 600;

  const updatePref = (key, value) => {
    const newPrefs = { ...preferences, [key]: value };
    setPreferences(newPrefs);

    const newRecommended =
      {
        gaming: 1000,
        office: 600,
        streaming: 1200,
        rendering: 1500,
      }[newPrefs.type] ?? 600;

    if (budget && budget < newRecommended) {
      setInfo(t("buildGenerator.recommendBudgetIncrease"));
    } else {
      setInfo("");
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setWarnings([]);
    setNotes([]);
    try {
      const selected = Object.fromEntries(
        Object.entries(selectedComponents)
          .filter(([_, component]) => component !== null)
          .map(([type, component]) => [type, component.dateks_id]),
      );

      const res = await axios.post("/api/builder", {
        selected,
        budget,
        preferences,
      });

      if (res.data.success) {
        setSelectedComponents((prev) => ({
          ...prev,
          ...res.data.build,
        }));
        setBuildType(res.data.type);
        setCurrentCompToAdd(null);
        setWarnings(res.data.warnings);
        setNotes(res.data.notes);
        addToast(t("buildGenerator.generateSuccess"), { type: "success" });
      } else {
        addToast(res.data.error, { type: "danger" });
      }
    } catch (err) {
      addToast(
        err.response?.data?.error ?? t("buildGenerator.somethingWentWrong"),
        { type: "danger" },
      );
    } finally {
      setLoading(false);
    }
  };

  const updateBudget = (value) => {
    setBudget(value);
    if (value && recommendedBudget > value) {
      setInfo(t("buildGenerator.recommendBudgetIncrease"));
    } else {
      setInfo("");
    }
  };

  // check if one of the selected components is incompatible
  const hasIncompatible = Object.values(selectedComponents).some(
    (component) => component !== null && component.compatible === false,
  );

  if (!user) {
    return (
      <div className="pt-4 border-t mt-4 border-secondary">
        <ClosedSection title={t("buildGenerator.title")}>
          <p className="text-muted text-sm">
            {t("buildGenerator.loginRequired")}{" "}
            <Link
              className="text-info/80 cursor-pointer hover:underline"
              to="/login"
            >
              {t("buildGenerator.loginLink")}
            </Link>
            .
          </p>
        </ClosedSection>
      </div>
    );
  }

  return (
    <div className="pt-4 border-t mt-4 border-secondary">
      <ClosedSection title={t("buildGenerator.title")}>
        <p className="text-muted text-sm">
          {t("buildGenerator.intro")}{" "}
          <Link
            className="text-info/80 cursor-pointer hover:underline"
            to="/guide"
          >
            {t("buildGenerator.guideLink")}
          </Link>{" "}
          {t("buildGenerator.guideSuffix")}
        </p>

        <BudgetSlider
          value={budget}
          onChange={updateBudget}
          recommended={recommendedBudget}
        />

        {info && (
          <div className="p-2 border bg-alert/10 border-alert/80">
            <p className="text-alert text-sm">{info}</p>
          </div>
        )}

        <p className="text-secondary-light text-sm mb-1 mt-4">
          {t("buildGenerator.preferences")}
        </p>

        <div className={`flex ${budget >= 500 || !budget ? "gap-2" : ""}`}>
          <div
            className={`flex flex-col transition-all p-px overflow-hidden ${budget >= 500 || !budget ? "flex-1" : "w-0"}`}
          >
            <label className="text-sm text-secondary-light" htmlFor="gpu">
              {t("buildGenerator.gpu")}
            </label>
            <select
              onChange={(e) => updatePref("gpu", e.target.value)}
              className="p-1 text-secondary-light text-sm border border-muted hover:outline focus:outline outline-secondary-light"
              value={preferences.gpu ?? ""}
            >
              <option value="">{t("buildGenerator.any")}</option>
              <option value="nvidia">{t("buildGenerator.nvidia")}</option>
              <option value="amd">{t("buildGenerator.amd")}</option>
              <option value="intel">{t("buildGenerator.intel")}</option>
            </select>
          </div>

          <div className="flex flex-col flex-1">
            <label className="text-sm text-secondary-light" htmlFor="gpu">
              {t("buildGenerator.cpu")}
            </label>
            <select
              onChange={(e) => updatePref("cpu", e.target.value)}
              className="p-1 text-secondary-light text-sm border border-muted hover:outline focus:outline outline-secondary-light"
              value={preferences.cpu ?? ""}
            >
              <option value="">{t("buildGenerator.any")}</option>
              <option value="amd">{t("buildGenerator.amd")}</option>
              <option value="intel">{t("buildGenerator.intel")}</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col flex-1">
          <label className="text-sm text-secondary-light" htmlFor="gpu">
            {t("buildGenerator.usage")}
          </label>
          <select
            onChange={(e) => updatePref("type", e.target.value)}
            className="p-1 text-secondary-light text-sm border border-muted hover:outline focus:outline outline-secondary-light"
            value={preferences.type ?? ""}
          >
            <option value="">{t("buildGenerator.any")}</option>
            {(budget > 500 || !budget) && (
              <option value="gaming">{t("buildGenerator.gaming")}</option>
            )}
            <option value="office">{t("buildGenerator.office")}</option>
            {(budget > 1500 || !budget) && (
              <option value="rendering">
                {t("buildGenerator.rendering")}
              </option>
            )}
            {(budget > 500 || !budget) && (
              <option value="streaming">
                {t("buildGenerator.streaming")}
              </option>
            )}
          </select>
        </div>

        <div className="flex gap-2 items-center">
          <input
            className="accent-secondary-light"
            id="include_orderable"
            type="checkbox"
            checked={preferences.include_orderable}
            onChange={(e) => updatePref("include_orderable", e.target.checked)}
          />
          <label
            className="text-secondary-light text-sm"
            htmlFor="include_orderable"
          >
            {t("buildGenerator.includeOnlyOrderable")}
          </label>
        </div>

        {hasIncompatible && (
          <div className="p-2 border bg-alert/10 border-alert/80">
            <p className="text-alert text-sm">
              {t("buildGenerator.incompatibleWarning")}
            </p>
          </div>
        )}

        <button
          className="p-4 mt-4 w-full bg-secondary-light text-text cursor-pointer hover:bg-secondary-light/50 transition disabled:opacity-50"
          onClick={handleGenerate}
          disabled={loading || hasIncompatible}
        >
          {loading ? (
            <p>{t("buildGenerator.generating")}</p>
          ) : (
            t("buildGenerator.generate")
          )}
        </button>
      </ClosedSection>
    </div>
  );
};

export default BuildGenerator;
