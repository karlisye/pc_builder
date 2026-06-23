import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import DetailPanel from "./Components/Saved/DetailPanel";
import Modal from "./Components/Common/Modal";
import BuildVisibility from "./Components/Saved/BuildVisibility";
import { ArrowIcon, CloseIcon, InfoIcon } from "./Components/Common/Icons";
import SidePanel from "./Components/Common/SidePanel";
import BuildIssuesPopup from "./Components/Common/BuildIssuesPopup";
import { formatDate } from "../lib/formatDate";
import { useToast } from "../Contexts/ToastContext";

const SLOT_KEYS = [
  "cpu",
  "motherboard",
  "ram",
  "gpu",
  "ssd",
  "hdd",
  "pc_case",
  "cooler",
  "psu",
  "fan",
];

const SavedBuilds = () => {
  const { t } = useTranslation("pages");
  const { addToast } = useToast();
  const [searchParams] = useSearchParams();
  const [builds, setBuilds] = useState([]);
  const [selectedBuild, setSelectedBuild] = useState(null);
  const [loadingBuild, setLoadingBuild] = useState(false);

  useEffect(() => {
    axios.get("/api/builds").then((res) => setBuilds(res.data));
  }, []);

  useEffect(() => {
    const buildId = searchParams.get("buildId");
    if (buildId) {
      handleSelect({ id: buildId });
    }
  }, [searchParams]);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ name: "", notes: "" });
  const [expandedSlot, setExpandedSlot] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [buildIssues, setBuildIssues] = useState({});
  const [issuesPopup, setIssuesPopup] = useState(null);

  useEffect(() => {
    if (!selectedBuild) {
      setBuildIssues({});
      return;
    }

    const selected = Object.fromEntries(
      SLOT_KEYS.map((slot) => [slot === "pc_case" ? "case" : slot, selectedBuild[slot]])
        .filter(([, component]) => component !== null && component !== undefined)
        .map(([key, component]) => [key, component.product_code]),
    );

    if (Object.keys(selected).length === 0) {
      setBuildIssues({});
      return;
    }

    axios
      .post("/api/builder/validate", { selected })
      .then((res) => setBuildIssues(res.data.issues))
      .catch(() => setBuildIssues({}));
  }, [selectedBuild]);

  const handleIssuesPopup = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setIssuesPopup({ x: rect.left, y: rect.bottom });
  };

  useEffect(() => {
    if (expanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [expanded]);

  const handleExpandSlot = (slot) => {
    setExpandedSlot((prev) => (prev === slot ? null : slot));
  };

  const handleSelect = async (build) => {
    setLoadingBuild(true);
    setEditing(false);
    setExpandedSlot(null);
    try {
      const res = await axios.get(`/api/builds/${build.id}`);
      setSelectedBuild(res.data);
      setEditData({ name: res.data.name, notes: res.data.notes ?? "" });
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBuild(false);
    }
  };

  const refreshBuilds = () =>
    axios.get("/api/builds").then((res) => setBuilds(res.data));

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`/api/builds/${id}`);
      if (selectedBuild?.id === id) setSelectedBuild(null);
      refreshBuilds();
      addToast(res.data.message, { type: "success" });
    } catch (err) {
      addToast(err.response?.data?.error ?? t("savedBuilds.deleteError"), {
        type: "danger",
      });
    }
  };

  const handleSaveEdit = async () => {
    try {
      const res = await axios.patch(
        `/api/builds/${selectedBuild.id}`,
        editData,
      );
      setSelectedBuild(res.data);
      setEditing(false);
      refreshBuilds();
    } catch (err) {
      console.error(err);
    }
  };

  const expandedComponent = expandedSlot ? selectedBuild?.[expandedSlot] : null;

  return (
    <>
      <div className="h-full flex">
        <SidePanel title={t("savedBuilds.sidePanelTitle")}>
          <div className="max-h-100">
            {builds.length === 0 ? (
              <p className="text-muted">{t("savedBuilds.noSavedBuilds")}</p>
            ) : (
              builds.map((build) => (
                <div
                  key={build.id}
                  onClick={() => handleSelect(build)}
                  className={`hover:bg-secondary border transition-all cursor-pointer p-2 flex justify-between items-center border-secondary mb-2 ${
                    selectedBuild?.id === build.id ? "border-l-10" : ""
                  }`}
                >
                  <div>
                    <h2 className="text-white font-semibold text-xl">
                      {build.name}
                    </h2>
                    <p className="text-muted text-sm">€{build.total_price}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleting(build.id);
                    }}
                    className="text-muted hover:text-danger transition p-2 cursor-pointer"
                  >
                    {t("savedBuilds.delete")}
                  </button>
                </div>
              ))
            )}
          </div>
        </SidePanel>

        <div className="flex-1 pt-6 px-4 mb-6">
          {loadingBuild && <p className="text-muted">{t("savedBuilds.loading")}</p>}

          {!loadingBuild && !selectedBuild && (
            <p className="font-medium text-text text-center">
              {t("savedBuilds.selectBuildPrompt")}
            </p>
          )}

          {!loadingBuild && selectedBuild && (
            <div className="space-y-6">
              {editing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="bg-surface border border-border text-text p-2 w-full focus:outline-1 outline-border"
                  />
                  <textarea
                    value={editData.notes}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    placeholder={t("savedBuilds.notesPlaceholder")}
                    className="bg-surface border border-border text-text p-2 w-full focus:outline-1 outline-border"
                  />
                  <div className="flex gap-4">
                    <button
                      onClick={handleSaveEdit}
                      className="bg-primary text-white p-4 flex-1 hover:bg-primary-light transition cursor-pointer"
                    >
                      {t("savedBuilds.save")}
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="bg-surface text-muted p-4 flex-1 hover:bg-secondary-light transition cursor-pointer"
                    >
                      {t("savedBuilds.cancel")}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex gap-4 items-center">
                      <h2 className="text-text font-semibold text-3xl uppercase">
                        {selectedBuild.name}
                      </h2>
                      {selectedBuild.type && (
                        <span className="py-0.5 px-3 text-text border border-border bg-secondary-light">
                          {selectedBuild.type}
                        </span>
                      )}
                      {Object.keys(buildIssues).length > 0 && (
                        <div
                          className="text-danger/80 hover:text-danger/60 transition flex gap-2"
                          onMouseEnter={handleIssuesPopup}
                          onMouseLeave={() => setIssuesPopup(null)}
                        >
                          <InfoIcon />
                        </div>
                      )}
                    </div>
                    <p className="text-muted text-sm">
                      {formatDate(selectedBuild.created_at)}
                    </p>
                    {selectedBuild.notes && (
                      <p className="text-muted mt-1">{selectedBuild.notes}</p>
                    )}
                  </div>
                  <button
                    onClick={() => setEditing(true)}
                    className="text-muted hover:text-text transition text-sm cursor-pointer"
                  >
                    {t("savedBuilds.edit")}
                  </button>
                </div>
              )}

              <div className="flex justify-between items-center">
                <p className="text-text font-semibold text-2xl">
                  €{selectedBuild.total_price}
                </p>
                <div className="flex items-center gap-4">
                  <Link
                    className="py-4 px-8 bg-primary text-white cursor-pointer hover:bg-primary-light transition"
                    to={`/builder?build=${selectedBuild.id}`}
                  >
                    {t("savedBuilds.continueBuild")}
                  </Link>
                  <button
                    className="py-4 px-8 bg-surface text-text cursor-pointer hover:bg-danger/50 transition"
                    onClick={() => setDeleting(selectedBuild.id)}
                  >
                    {t("savedBuilds.deleteBuild")}
                  </button>
                </div>
              </div>

              <BuildVisibility
                build={selectedBuild}
                setBuild={setSelectedBuild}
              />

              <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {SLOT_KEYS.map((slot) => {
                  const component = selectedBuild[slot];
                  if (!component) return null;
                  const isExpanded = expandedSlot === slot;
                  return (
                    <div key={slot}>
                      <div
                        onClick={() => handleExpandSlot(slot)}
                        className={`flex cursor-pointer transition-all border border-border ${isExpanded ? "bg-secondary-light hover:bg-secondary-light/80" : "bg-surface hover:bg-secondary-light"}`}
                      >
                        <div className="flex-1 m-4">
                          <div className="flex justify-between">
                            <span className="text-muted text-sm">{t(`savedBuilds.slotLabels.${slot}`)}</span>
                            <span className="text-muted text-sm">
                              €{component.price}
                            </span>
                          </div>
                          <span className="text-text line-clamp-1">
                            {component.name}
                          </span>
                        </div>
                      </div>

                      <div
                        className={`lg:hidden grid transition-all overflow-hidden ${
                          isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <DetailPanel
                            component={component}
                            slot={slot}
                            setExpandedSlot={setExpandedSlot}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div
                className={`hidden lg:grid transition-all overflow-hidden ${
                  expandedComponent ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  {expandedComponent && (
                    <DetailPanel
                      component={expandedComponent}
                      slot={expandedSlot}
                      setExpandedSlot={setExpandedSlot}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {issuesPopup && <BuildIssuesPopup issues={buildIssues} {...issuesPopup} />}

      {deleting && (
        <Modal close={() => setDeleting(null)}>
          <h1 className="text-text text-3xl mb-10">
            {t("savedBuilds.deleteConfirmTitle")}
          </h1>
          <div className="flex gap-4">
            <button
              className="flex-1 p-4 bg-primary text-background cursor-pointer hover:bg-primary-light transition"
              onClick={() => {
                handleDelete(deleting);
                setDeleting(null);
              }}
            >
              {t("savedBuilds.delete")}
            </button>
            <button
              className="flex-1 p-4 bg-surface text-text cursor-pointer hover:bg-secondary-light transition"
              onClick={() => setDeleting(null)}
            >
              {t("savedBuilds.cancel")}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default SavedBuilds;
