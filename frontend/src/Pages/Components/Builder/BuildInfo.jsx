import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useBuilder, useBuildMeta } from "../../../Contexts/BuilderContext";
import { useAuth } from "../../../Contexts/AuthContext";
import axios from "axios";
import { CloseIcon } from "../Common/Icons";
import { Link, useSearchParams } from "react-router-dom";
import { clearDraft } from "../../../lib/builderDraft";
import { selectedProductCodes } from "../../../lib/buildSlots";
import { useToast } from "../../../Contexts/ToastContext";

// Tracks whether the restore nudge has already been shown this page load,
// so it only appears once on a real page refresh and not on every SPA nav.
let nudgeShownThisLoad = false;

const BuildInfo = () => {
  const { t } = useTranslation(["builder", "common"]);
  const { user, showVerifyBanner } = useAuth();
  const { addToast } = useToast();
  const {
    selectedComponents,
    setSelectedComponents,
    setCurrentCompToAdd,
    setWarnings,
    setBuildIssues,
    setNotes,
    buildIssues,
  } = useBuilder();
  const {
    buildId,
    setBuildId,
    buildName,
    setBuildName,
    buildNotes,
    setBuildNotes,
    buildType,
    setBuildType,
    restoredDraft,
    setRestoredDraft,
  } = useBuildMeta();
  const [, setSearchParams] = useSearchParams();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const hasComponents = Object.values(selectedComponents).some(
    (v) => v !== null,
  );

  useEffect(() => {
    if (nudgeShownThisLoad || !restoredDraft) return;

    nudgeShownThisLoad = true;
    addToast(t("buildInfo.restoredNudge"), { type: "info" });
  }, [restoredDraft, addToast, t]);

  const handleRemove = (name) => {
    setSelectedComponents((prev) => ({
      ...prev,
      [name.toLowerCase()]: null,
    }));
    setCurrentCompToAdd(null);
  };

  const handleSave = async (asNew = false) => {
    if (!buildName.trim()) {
      setError(t("buildInfo.enterBuildName"));
      return;
    }

    const components = selectedProductCodes(selectedComponents);

    if (Object.keys(components).length === 0) {
      setError(t("buildInfo.selectAtLeastOne"));
      return;
    }

    setSaving(true);
    setError("");

    try {
      const res = await axios.post("/api/builds", {
        build_id: asNew ? undefined : buildId,
        name: buildName,
        notes: buildNotes,
        type: buildType,
        components,
      });
      setBuildId(res.data.id);
      setSearchParams({ build: res.data.id });
      clearDraft();
      addToast(
        asNew ? t("buildInfo.savedAsNew") : t("buildInfo.savedSuccessfully"),
        { type: "success" },
      );
    } catch (err) {
      if (err.response?.status === 403) {
        showVerifyBanner();
        addToast(t("common:verifyEmail.gatedAction"), { type: "danger" });
      } else {
        addToast(err.response?.data?.error ?? t("buildInfo.failedToSave"), {
          type: "danger",
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleClear = () => {
    clearDraft();
    setRestoredDraft(false);
    setSelectedComponents((prev) =>
      Object.fromEntries(Object.keys(prev).map((key) => [key, null])),
    );
    setBuildName("");
    setBuildNotes("");
    setBuildType("");
    setWarnings([]);
    setBuildIssues({});
    setNotes([]);
  };

  return (
    <div className="space-y-4 mt-4">
      {hasComponents ? (
        Object.entries(selectedComponents)
          .filter(([_, value]) => value)
          .map(([key, value]) => (
            <div
              key={key}
              className="flex border border-muted hover:bg-primary-light transition relative"
            >
              <div className="overflow-hidden flex">
                <span className="capitalize text-secondary-light p-2 whitespace-nowrap shrink-0">
                  {t(`common:components.${key}`)}:{" "}
                </span>
                <span className="text-surface p-2 truncate">{value.name}</span>
              </div>
              <button
                className="p-2 bg-secondary text-muted hover:bg-danger/50 hover:text-danger/70 cursor-pointer transition border-l border-muted ml-auto"
                onClick={() => handleRemove(key)}
                aria-label={t("componentCard.remove")}
              >
                <CloseIcon />
              </button>

              {buildIssues[key]?.length > 0 && (
                <div className="bg-danger/10 absolute w-full h-full pointer-events-none border-2 border-danger/20"></div>
              )}
            </div>
          ))
      ) : (
        <p className="text-secondary-light mb-4">
          {t("buildInfo.selectComponents")}
        </p>
      )}

      {(buildId || hasComponents) && !user && (
        <div className="pt-4 border-t border-primary-light">
          <p className="text-secondary-light">
            {t("buildInfo.loginToSave")}{" "}
            <Link
              className="text-info/80 cursor-pointer hover:underline"
              to="/login"
            >
              {t("buildInfo.loginLink")}
            </Link>
            .
          </p>
        </div>
      )}

      {(buildId || hasComponents) && user && (
        <div className="space-y-4 pt-4 border-t border-primary-light">
          <div>
            <label className="text-secondary-light" htmlFor="name">
              {t("buildInfo.nameLabel")}
            </label>
            <input
              type="text"
              value={buildName}
              onChange={(e) => setBuildName(e.target.value)}
              id="name"
              placeholder={t("buildInfo.namePlaceholder")}
              className="bg-secondary-light focus:outline-1 outline-border text-text p-2 w-full"
            />

            {error && <p className="text-danger text-sm">{error}</p>}
          </div>

          <label className="text-secondary-light" htmlFor="notes">
            {t("buildInfo.notesLabel")}
          </label>
          <textarea
            className="bg-secondary-light focus:outline-1 outline-border text-text p-2 w-full"
            value={buildNotes}
            placeholder={t("buildInfo.notesPlaceholder")}
            onChange={(e) => setBuildNotes(e.target.value)}
            id="notes"
          ></textarea>

          <div className="flex flex-col flex-1">
            <label htmlFor="buildType" className="text-secondary-light">
              {t("buildInfo.buildTypeLabel")}
            </label>
            <select
              onChange={(e) => setBuildType(e.target.value)}
              className="p-2 text-secondary-light text-sm border hover:outline focus:outline outline-surface transition"
              value={buildType}
              id="buildType"
            >
              <option value="">{t("buildInfo.none")}</option>
              <option value="gaming">{t("buildInfo.gaming")}</option>
              <option value="office">{t("buildInfo.office")}</option>
              <option value="rendering">{t("buildInfo.rendering")}</option>
              <option value="streaming">{t("buildInfo.streaming")}</option>
            </select>
          </div>

          <div className="flex">
            <button
              onClick={() => handleSave()}
              disabled={saving}
              className="py-4 px-8 bg-secondary text-left text-white hover:bg-success/50 cursor-pointer disabled:opacity-50 transition flex-1"
            >
              {saving ? t("buildInfo.saving") : t("buildInfo.saveBuild")}
            </button>

            <button
              className="py-4 px-8 bg-secondary text-white hover:bg-danger/50 cursor-pointer disabled:opacity-50 transition"
              onClick={handleClear}
            >
              {t("buildInfo.clearBuild")}
            </button>
          </div>

          {buildId && (
            <button
              className="text-secondary-light hover:text-muted transition cursor-pointer border px-4 py-2 text-sm"
              onClick={() => handleSave(true)}
            >
              {t("buildInfo.saveAsNewBuild")}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BuildInfo;
