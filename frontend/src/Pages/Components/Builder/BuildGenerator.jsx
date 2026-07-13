import axios from "axios";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useBuilder, useBuildMeta } from "../../../Contexts/BuilderContext";
import BudgetSlider from "./BudgetSlider";
import { Link } from 'react-router';
import ClosedSection from "../Common/ClosedSection";
import { useAuth } from "../../../Contexts/AuthContext";
import { useToast } from "../../../Contexts/ToastContext";
import { useLocalePath } from "../../../lib/localePath";
import {
  selectedProductCodes,
  hasIncompatibleSelection,
  needsManualCheckSelection,
  missingRequiredSlots,
} from "../../../lib/buildSlots";

const RECOMMENDED_BUDGETS = {
  gaming: 1000,
  office: 600,
  streaming: 1200,
  rendering: 1500,
};

const MIN_TYPE_BUDGETS = {
  gaming: 500,
  streaming: 500,
  rendering: 1500,
};

const typeAvailableFor = (type, budget) =>
  !budget || !MIN_TYPE_BUDGETS[type] || budget >= MIN_TYPE_BUDGETS[type];

// artificial floor so generation always feels like it's doing real work, even
// when the request itself resolves almost instantly
const MIN_GENERATE_DURATION_MS = 3000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const BuildGenerator = () => {
  const { t } = useTranslation(["builder", "common"]);
  const { user, showVerifyBanner } = useAuth();
  const { addToast } = useToast();
  const {
    selectedComponents,
    setSelectedComponents,
    closePicker,
    setWarnings,
    setNotes,
    buildIssues,
    setSidePanelExpanded,
  } = useBuilder();
  const { setBuildType } = useBuildMeta();
  const lp = useLocalePath();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressDuration, setProgressDuration] = useState(0);
  const [budget, setBudget] = useState(1500);
  const [preferences, setPreferences] = useState({
    gpu: null,
    cpu: null,
    type: null,
    include_orderable: true,
  });
  const [info, setInfo] = useState("");

  const recommendedBudget = RECOMMENDED_BUDGETS[preferences.type] ?? 600;

  // a preference for a slot that's already filled has nothing left to influence, and would
  // otherwise sit stale in state — clear it as soon as that component gets selected
  useEffect(() => {
    if (selectedComponents.gpu && preferences.gpu !== null) {
      setPreferences((prev) => ({ ...prev, gpu: null }));
    }
    if (selectedComponents.cpu && preferences.cpu !== null) {
      setPreferences((prev) => ({ ...prev, cpu: null }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponents.gpu, selectedComponents.cpu]);

  const updateInfo = (newBudget, newType) => {
    const recommended = RECOMMENDED_BUDGETS[newType] ?? 600;
    if (newBudget && newBudget < recommended) {
      setInfo(t("buildGenerator.recommendBudgetIncrease"));
    } else {
      setInfo("");
    }
  };

  const updatePref = (key, value) => {
    const newPrefs = { ...preferences, [key]: value };
    setPreferences(newPrefs);
    updateInfo(budget, newPrefs.type);
  };

  const updateBudget = (value) => {
    setBudget(value);
    const newType =
      preferences.type && !typeAvailableFor(preferences.type, value) ? null : preferences.type;
    if (newType !== preferences.type) {
      setPreferences((prev) => ({ ...prev, type: newType }));
    }
    updateInfo(value, newType);
  };

  const handleGenerate = async () => {
    setLoading(true);
    setWarnings([]);
    setNotes([]);
    setProgress(0);
    setProgressDuration(0);
    // commit the 0% state first, then animate to 90% over the full minimum
    // duration on the next frame — the rest of the bar fills once we know
    // the real result, whether that lands before or after the floor
    requestAnimationFrame(() => {
      setProgressDuration(MIN_GENERATE_DURATION_MS);
      setProgress(90);
    });

    try {
      const selected = selectedProductCodes(selectedComponents);

      const [res] = await Promise.all([
        axios.post("/api/builder", { selected, budget, preferences }),
        sleep(MIN_GENERATE_DURATION_MS),
      ]);

      setProgressDuration(200);
      setProgress(100);

      if (res.data.success) {
        setSelectedComponents((prev) => ({
          ...prev,
          ...res.data.build,
        }));
        setBuildType(res.data.type);
        closePicker();
        setSidePanelExpanded(false);
        setWarnings(res.data.warnings);
        setNotes(res.data.notes);
        addToast(t("buildGenerator.generateSuccess"), { type: "success" });
        document
          .getElementById("side-panel-scroll")
          ?.scrollTo({ top: 0, behavior: "smooth" });
        document
          .getElementById("page-scroll")
          ?.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        addToast(res.data.error, { type: "danger" });
      }
    } catch (err) {
      setProgressDuration(200);
      setProgress(100);
      if (err.response?.status === 403) {
        showVerifyBanner();
        addToast(t("common:verifyEmail.gatedAction"), { type: "danger" });
      } else {
        addToast(
          err.response?.data?.error ?? t("buildGenerator.somethingWentWrong"),
          { type: "danger" },
        );
      }
    } finally {
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
        setProgressDuration(0);
      }, 250);
    }
  };

  const hasIncompatible = hasIncompatibleSelection(selectedComponents, buildIssues);

  // a selected component's compatibility with the rest of the build could not be fully
  // verified (missing spec data) — the auto-builder can't assume it fits, so block generation
  const needsManualCheck = needsManualCheckSelection(selectedComponents);

  // nothing left for the generator to fill in
  const allSlotsFilled = missingRequiredSlots(selectedComponents).length === 0;

  if (!user) {
    return (
      <div className="pt-4 border-t mt-4 border-secondary">
        <ClosedSection title={t("buildGenerator.title")}>
          <p className="text-muted text-sm">
            {t("buildGenerator.loginRequired")}{" "}
            <Link
              className="text-info/80 cursor-pointer hover:underline"
              to={lp("/login")}
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
            to={lp("/guide")}
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

        {(!selectedComponents.gpu || !selectedComponents.cpu) && (
          <div className={`flex ${budget >= 500 || !budget ? "gap-2" : ""}`}>
            {!selectedComponents.gpu && (
              <div
                className={`flex flex-col transition-all p-px overflow-hidden ${budget >= 500 || !budget ? "flex-1" : "w-0"}`}
              >
                <label className="text-sm text-secondary-light" htmlFor="build_gpu_pref">
                  {t("buildGenerator.gpu")}
                </label>
                <select
                  id="build_gpu_pref"
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
            )}

            {!selectedComponents.cpu && (
              <div className="flex flex-col flex-1">
                <label className="text-sm text-secondary-light" htmlFor="build_cpu_pref">
                  {t("buildGenerator.cpu")}
                </label>
                <select
                  id="build_cpu_pref"
                  onChange={(e) => updatePref("cpu", e.target.value)}
                  className="p-1 text-secondary-light text-sm border border-muted hover:outline focus:outline outline-secondary-light"
                  value={preferences.cpu ?? ""}
                >
                  <option value="">{t("buildGenerator.any")}</option>
                  <option value="amd">{t("buildGenerator.amd")}</option>
                  <option value="intel">{t("buildGenerator.intel")}</option>
                </select>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col flex-1">
          <label className="text-sm text-secondary-light" htmlFor="build_usage_pref">
            {t("buildGenerator.usage")}
          </label>
          <select
            id="build_usage_pref"
            onChange={(e) => updatePref("type", e.target.value)}
            className="p-1 text-secondary-light text-sm border border-muted hover:outline focus:outline outline-secondary-light"
            value={preferences.type ?? ""}
          >
            <option value="">{t("buildGenerator.any")}</option>
            {typeAvailableFor("gaming", budget) && (
              <option value="gaming">{t("buildGenerator.gaming")}</option>
            )}
            <option value="office">{t("buildGenerator.office")}</option>
            {typeAvailableFor("rendering", budget) && (
              <option value="rendering">
                {t("buildGenerator.rendering")}
              </option>
            )}
            {typeAvailableFor("streaming", budget) && (
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

        {!hasIncompatible && needsManualCheck && (
          <div className="p-2 border bg-alert/10 border-alert/80">
            <p className="text-alert text-sm">
              {t("buildGenerator.manualCheckWarning")}
            </p>
          </div>
        )}

        {!hasIncompatible && !needsManualCheck && allSlotsFilled && (
          <div className="p-2 border bg-alert/10 border-alert/80">
            <p className="text-alert text-sm">
              {t("buildGenerator.allSlotsFilledWarning")}
            </p>
          </div>
        )}

        <button
          className="p-4 mt-4 w-full bg-secondary-light text-text cursor-pointer hover:bg-secondary-light/50 transition disabled:opacity-50"
          onClick={handleGenerate}
          disabled={loading || hasIncompatible || needsManualCheck || allSlotsFilled}
        >
          {loading ? (
            <p>{t("buildGenerator.generating")}</p>
          ) : (
            t("buildGenerator.generate")
          )}
        </button>

        {loading && (
          <div
            className="h-1 w-full bg-muted/30 overflow-hidden mt-2"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            aria-label={t("buildGenerator.generating")}
          >
            <div
              className="h-full bg-secondary-light"
              style={{ width: `${progress}%`, transition: `width ${progressDuration}ms ease-out` }}
            />
          </div>
        )}
      </ClosedSection>
    </div>
  );
};

export default React.memo(BuildGenerator);
