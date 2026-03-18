import React, { useState } from "react";
import axios from "axios";
import { router } from "@inertiajs/react";
import ComponentInfo from "./Components/ComponentInfo";
import DetailPanel from "./Components/DetailPanel";

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

const SavedBuilds = ({ builds }) => {
  const [selectedBuild, setSelectedBuild] = useState(null);
  const [loadingBuild, setLoadingBuild] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ name: "", notes: "" });
  const [expandedSlot, setExpandedSlot] = useState(null);

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

  const handleDelete = async (e, id) => {
    e.stopPropagation();
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
    <div className="h-full flex flex-wrap">
      <div className="w-full lg:w-120 bg-primary pt-6 px-4">
        <h1 className="text-4xl font-semibold text-white mb-4">SAVED BUILDS</h1>
        <div className="space-y-4">
          {builds.length === 0 ? (
            <p className="text-muted">You have no saved builds yet.</p>
          ) : (
            builds.map((build) => (
              <div
                key={build.id}
                onClick={() => handleSelect(build)}
                className={`hover:bg-secondary border transition cursor-pointer p-2 flex justify-between items-center border-secondary-light ${
                  selectedBuild?.id === build.id ? "bg-secondary" : ""
                }`}
              >
                <div>
                  <h2 className="text-white font-semibold text-xl">
                    {build.name}
                  </h2>
                  <p className="text-muted text-sm">€{build.total_price}</p>
                </div>
                <button
                  onClick={(e) => handleDelete(e, build.id)}
                  className="text-muted hover:text-danger transition p-2 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 pt-6 px-4">
        {loadingBuild && <p className="text-muted">Loading...</p>}

        {!loadingBuild && !selectedBuild && (
          <p className="text-muted">Select a build to view details.</p>
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
                  className="bg-surface border border-border text-text p-2 w-full"
                />
                <textarea
                  value={editData.notes}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  placeholder="Notes"
                  className="bg-surface border border-border text-text p-2 w-full"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveEdit}
                    className="bg-primary text-white p-2 flex-1 hover:bg-primary-light transition cursor-pointer"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="bg-surface text-muted p-2 flex-1 hover:bg-secondary-light transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-text font-semibold text-3xl">
                    {selectedBuild.name}
                  </h2>
                  <p className="text-muted text-sm">
                    {new Date(selectedBuild.created_at).toLocaleDateString()}
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

            <p className="text-text font-semibold text-2xl">
              €{selectedBuild.total_price}
            </p>

            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {Object.entries(SLOT_LABELS).map(([slot, label]) => {
                const component = selectedBuild[slot];
                if (!component) return null;
                const isExpanded = expandedSlot === slot;
                return (
                  <div key={slot}>
                    <div
                      className={`border border-border transition-colors ${isExpanded ? "bg-secondary-light border-b-0" : ""}`}
                    >
                      <div
                        onClick={() => handleExpandSlot(slot)}
                        className="p-4 bg-surface hover:bg-secondary-light cursor-pointer transition-colors"
                      >
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
                    </div>

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
  );
};

export default SavedBuilds;
