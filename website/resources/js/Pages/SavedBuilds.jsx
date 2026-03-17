import React from "react";
import axios from "axios";
import { router } from "@inertiajs/react";

const SavedBuilds = ({ builds }) => {
  const handleDelete = async (id) => {
    await axios.delete(`/api/builds/${id}`);
    router.reload();
  };

  return (
    <div>
      <div className="h-full flex flex-wrap">
        <div className="w-full lg:w-120 bg-primary pt-6 px-4">
          <h1 className="text-4xl font-semibold text-white mb-4">MY BUILDS</h1>

          <div className="space-y-4">
            {builds.length === 0 ? (
              <p className="text-muted">You have no saved builds yet.</p>
            ) : (
              builds.map((build) => (
                <div
                  key={build.id}
                  className="hover:bg-secondary border border-secondary-light transition cursor-pointer p-2 flex justify-between items-center"
                >
                  <div>
                    <h2 className="text-white font-semibold text-xl">
                      {build.name}
                    </h2>
                    <p className="text-muted text-sm">€{build.total_price}</p>
                    {build.notes && (
                      <p className="text-muted text-sm">{build.notes}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(build.id)}
                    className="text-muted hover:text-danger transition"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedBuilds;
