import React, { useState } from "react";
import axios from "axios";
import { Link, router } from "@inertiajs/react";
import DetailPanel from "./Components/Saved/DetailPanel";
import Modal from "./Components/Common/Modal";
import BuildVisibility from "./Components/Saved/BuildVisibility";
import { ArrowIcon } from "./Components/Common/Icons";

const SLOT_LABELS = {
  cpu: "CPU",
  motherboard: "Motherboard",
  ram: "RAM",
  gpu: "GPU",
  ssd: "SSD",
  hdd: "HDD",
  pc_case: "Case",
  cooler: "Cooler",
  psu: "PSU",
  fan: "Fan",
};

const SavedBuilds = ({ builds, selected }) => {
  const [selectedBuild, setSelectedBuild] = useState(
    selected ? selected : null,
  );
  const [loadingBuild, setLoadingBuild] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ name: "", notes: "" });
  const [expandedSlot, setExpandedSlot] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const [expanded, setExpanded] = useState(false);

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

  const handleDelete = async (id) => {
    await axios.delete(`/api/builds/${id}`);
    if (selectedBuild?.id === id) setSelectedBuild(null);
    router.reload();
  };

  const handleSaveEdit = async () => {
    try {
      const res = await axios.patch(
        `/api/builds/${selectedBuild.id}`,
        editData,
      );
      setSelectedBuild(res.data);
      setEditing(false);
      router.reload();
    } catch (err) {
      console.error(err);
    }
  };

  const expandedComponent = expandedSlot ? selectedBuild?.[expandedSlot] : null;

  return (
    <>
      <div className="flex flex-col lg:h-full lg:flex-row">
        <div className="w-full lg:w-120.5 bg-primary py-6 px-4">
          <div
            onClick={() => setExpanded((prev) => !prev)}
            className="flex gap-2 justify-between items-center"
          >
            <h1 className="text-4xl font-semibold text-white">SAVED BUILDS</h1>

            <span className="text-surface lg:opacity-0">
              <ArrowIcon active={expanded} size={24} />
            </span>
          </div>

          <div
            className={`grid transition-all lg:mt-4 ${expanded ? "grid-rows-[1fr] mt-4" : "grid-rows-[0fr] lg:grid-rows-[1fr]"}`}
          >
            <div className="space-y-4 overflow-hidden">
              {builds.length === 0 ? (
                <p className="text-muted">You have no saved builds yet.</p>
              ) : (
                builds.map((build) => (
                  <div
                    key={build.id}
                    onClick={() => handleSelect(build)}
                    className={`hover:bg-secondary border transition-all cursor-pointer p-2 flex justify-between items-center border-secondary ${
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
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 pt-6 px-4 mb-6">
          {loadingBuild && <p className="text-muted">Loading...</p>}

          {!loadingBuild && !selectedBuild && (
            <p className="font-medium text-text text-center">
              Select a build to view details.
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
                    placeholder="Notes"
                    className="bg-surface border border-border text-text p-2 w-full focus:outline-1 outline-border"
                  />
                  <div className="flex gap-4">
                    <button
                      onClick={handleSaveEdit}
                      className="bg-primary text-white p-4 flex-1 hover:bg-primary-light transition cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="bg-surface text-muted p-4 flex-1 hover:bg-secondary-light transition cursor-pointer"
                    >
                      Cancel
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
                    </div>
                    <p className="text-muted text-sm">
                      {new Date(selectedBuild.created_at).toDateString()}
                    </p>
                    {selectedBuild.notes && (
                      <p className="text-muted mt-1">{selectedBuild.notes}</p>
                    )}
                  </div>
                  <button
                    onClick={() => setEditing(true)}
                    className="text-muted hover:text-text transition text-sm cursor-pointer"
                  >
                    Edit
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
                    href={`/builder?build=${selectedBuild.id}`}
                  >
                    Continue Build
                  </Link>
                  <button
                    className="py-4 px-8 bg-surface text-text cursor-pointer hover:bg-danger/50 transition"
                    onClick={() => setDeleting(selectedBuild.id)}
                  >
                    Delete Build
                  </button>
                </div>
              </div>

              <BuildVisibility
                build={selectedBuild}
                setBuild={setSelectedBuild}
              />

              <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {Object.entries(SLOT_LABELS).map(([slot, label]) => {
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
                            <span className="text-muted text-sm">{label}</span>
                            <span className="text-muted text-sm">
                              €{component.price}
                            </span>
                          </div>
                          <span className="text-text line-clamp-1">
                            {component.name}
                          </span>
                        </div>

                        <a
                          className={`flex items-center transition text-text border-l border-border ${isExpanded ? "px-8 bg-success/30 hover:bg-success/50" : "w-0 overflow-hidden"}`}
                          target="_blank"
                          href={component.url}
                        >
                          Buy
                        </a>
                      </div>

                      {/* show details right under */}
                      <div
                        className="lg:hidden overflow-hidden transition-all"
                        style={{ maxHeight: isExpanded ? "500px" : "0px" }}
                      >
                        <DetailPanel
                          component={component}
                          slot={slot}
                          setExpandedSlot={setExpandedSlot}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* show details under all */}
              <div
                className="hidden lg:block overflow-hidden transition-all"
                style={{ maxHeight: expandedComponent ? "500px" : "0px" }}
              >
                {expandedComponent && (
                  <DetailPanel
                    component={expandedComponent}
                    slot={expandedSlot}
                    setExpandedSlot={setExpandedSlot}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {deleting && (
        <Modal close={() => setDeleting(null)}>
          <h1 className="text-text text-3xl mb-10">
            Are you sure you want to delete this build?
          </h1>
          <div className="flex gap-4">
            <button
              className="flex-1 p-4 bg-primary text-background cursor-pointer hover:bg-primary-light transition"
              onClick={() => {
                handleDelete(deleting);
                setDeleting(null);
              }}
            >
              Delete
            </button>
            <button
              className="flex-1 p-4 bg-surface text-text cursor-pointer hover:bg-secondary-light transition"
              onClick={() => setDeleting(null)}
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default SavedBuilds;
