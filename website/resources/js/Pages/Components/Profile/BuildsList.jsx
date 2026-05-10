import React from "react";
import { HeartIcon, SavedIcon, StarIcon } from "../Common/Icons";
import { Link } from "@inertiajs/react";

const BuildsList = ({ builds, setBuild, setPublishing, isPublic = false }) => {
  return (
    <div className="">
      <h2 className="text-2xl font-semibold mb-2">
        {isPublic ? "Public Builds" : "Private Builds"}
      </h2>

      <div className="space-y-4">
        {builds.map((build) => {
          return (
            <div key={build.id} className="border border-border">
              <div className="h-15">
                <div className="flex gap-4 justify-between items-center mb-1 m-2">
                  <div className="flex gap-2 items-center">
                    <h3 className="uppercase text-xl font-semibold">
                      {build.name}
                    </h3>
                    {build.type && (
                      <span className="bg-secondary-light px-3 py-0.5 text-text border border-border text-sm">
                        {build.type}
                      </span>
                    )}
                  </div>

                  <span>€{build.total_price}</span>
                </div>

                {isPublic && (
                  <div className="flex gap-4 m-2">
                    <div className="flex gap-2">
                      <HeartIcon filled className={"text-danger"} />
                      <span className="text-text">{build.likes_count}</span>
                    </div>

                    <div className="flex gap-2">
                      <SavedIcon filled className={"text-alert"} />
                      <span className="text-text">{build.bookmarks_count}</span>
                    </div>

                    <div className="flex gap-2">
                      <StarIcon filled className={"text-alert"} />
                      <span className="text-text">
                        {Math.round(build.reviews_avg_rating)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="border border-border w-9/10 my-4 mx-auto"></div>

              <div className="flex gap-4 m-2 h-30 overflow-y-auto">
                <div className="flex-1">
                  <span className="text-sm block text-muted">Notes</span>
                  {build.notes ? (
                    <p className="text-text text-sm">{build.notes}</p>
                  ) : (
                    <p className="text-text text-sm">-</p>
                  )}
                </div>
                <div className="flex-1">
                  <span className="text-sm block text-muted">Components</span>
                  <span className="text-text">{`[${build.selected_components_count}/10]`}</span>
                </div>
              </div>

              <div className="mt-4 bg-primary flex">
                <Link
                  className="text-white flex-1 p-4 hover:bg-primary-light transition cursor-pointer text-center"
                  href={`/builds?buildId=${build.id}`}
                >
                  Edit
                </Link>
                <button
                  className="text-white flex-1 p-4 hover:bg-danger/50 transition cursor-pointer"
                  onClick={() => {
                    setPublishing(true);
                    setBuild(build);
                  }}
                >
                  {isPublic ? "Make Private" : "Make Public"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BuildsList;
