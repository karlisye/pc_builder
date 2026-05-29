import React, { useState } from "react";
import { ArrowIcon, HeartIcon, SavedIcon, StarIcon } from "../Common/Icons";
import { Link, router } from "@inertiajs/react";

const PublicProfile = ({
  user,
  buildData,
  totalLikes,
  totalBookmarks,
  avgRating,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const builds = buildData.data;
  const links = buildData.links;

  const handleSave = async (build) => {
    console.log(builds);
    const components = Object.fromEntries(
      Object.entries(build.components)
        .filter(([_, component]) => component !== null)
        .map(([type, component]) => [type, component.dateks_id]),
    );

    try {
      await axios.post("/api/builds", {
        name: build.name + " (copy)",
        notes: build.notes,
        components,
      });
      setSuccess("Build saved successfully");
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      setError(err.response?.data?.error ?? "Failed to save build");
    }
  };

  const next = () => {
    router.get(links[links.length - 1].url);
  };

  const previous = () => {
    router.get(links[0].url);
  };

  return (
    <div className="h-full flex flex-col lg:flex-row">
      <div className="w-full lg:w-120.5 bg-primary py-6 px-4">
        <div
          onClick={() => setExpanded((prev) => !prev)}
          className="flex gap-2 justify-between items-center"
        >
          <h1 className="text-4xl font-semibold text-white uppercase">
            {user.name}'s profile
          </h1>

          <span className="text-surface lg:opacity-0">
            <ArrowIcon active={expanded} size={24} />
          </span>
        </div>

        <div
          className={`grid transition-all lg:mt-4 ${expanded ? "grid-rows-[1fr] mt-4" : "grid-rows-[0fr] lg:grid-rows-[1fr]"}`}
        >
          <div className="space-y-4 overflow-hidden">
            <div className="border border-secondary p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-secondary-light text-sm">
                  Total Likes
                </span>
                <div className="flex gap-1 items-center">
                  <span className="text-secondary-light font-semibold text-xl">
                    {totalLikes}
                  </span>
                  <HeartIcon className={"text-secondary-light"} size={20} />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-secondary-light text-sm">
                  Total Bookmarks
                </span>
                <div className="flex gap-1 items-center">
                  <span className="text-secondary-light font-semibold text-xl">
                    {totalBookmarks}
                  </span>
                  <SavedIcon className={"text-secondary-light"} size={20} />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-secondary-light text-sm">
                  Average Rating
                </span>
                <div className="flex gap-1 items-center">
                  <span className="text-secondary-light font-semibold text-xl">
                    {avgRating.toFixed(1)}
                  </span>
                  <StarIcon className={"text-secondary-light"} size={20} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-6 px-4 flex-1">
        <div className="mb-4 flex gap-4 items-center">
          <span className="w-12 h-12 rounded-full bg-secondary-light flex items-center justify-center font-bold">
            {user.name?.charAt(0).toUpperCase()}
          </span>

          <div>
            <h1 className="text-4xl font-semibold text-text uppercase">
              {user.name}
            </h1>
            <p className="text-muted text-sm">
              Active since {new Date(user.created_at).toDateString()}
            </p>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-2xl font-semibold mb-2">About {user.name}</h2>
          <p className="border border-border text-muted w-full min-h-40 p-2">
            {user.description ?? `${user.name}'s About Me is not set up yet...`}
          </p>
        </div>

        {builds.length === 0 ? (
          <p className="text-muted">{user.name} has no shared builds yet.</p>
        ) : (
          <div className="">
            <h2 className="text-2xl font-semibold mb-2">
              {user.name}'s shared builds
            </h2>
            {success && <p className="text-success ml-auto px-2">{success}</p>}
            {error && <p className="text-danger ml-auto px-2">{error}</p>}
            <div className="flex gap-1">
              <button
                className={`bg-primary hover:bg-primary-light flex items-center cursor-pointer overflow-hidden transition-all ${links[0].url ? "w-10" : "w-0"}`}
                onClick={previous}
                disabled={!links[0].url}
              >
                <span className="rotate-90 text-white p-2">
                  <ArrowIcon size={24} />
                </span>
              </button>

              <div className="flex-1 grid xl:grid-cols-2 grid-cols-1 gap-4">
                {builds.map((build) => {
                  return (
                    <div key={build.id} className="border border-border">
                      <div className="">
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

                        <div className="flex gap-4 m-2">
                          <div className="flex gap-2">
                            <HeartIcon filled className={"text-danger"} />
                            <span className="text-text">
                              {build.likes_count}
                            </span>
                          </div>

                          <div className="flex gap-2">
                            <SavedIcon filled className={"text-alert"} />
                            <span className="text-text">
                              {build.bookmarks_count}
                            </span>
                          </div>

                          <div className="flex gap-2">
                            <StarIcon filled className={"text-alert"} />
                            <span className="text-text">
                              {Math.round(build.reviews_avg_rating)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="border border-border w-9/10 my-4 mx-auto"></div>

                      <div className="flex gap-4 m-2 h-30 overflow-y-auto">
                        <div className="flex-1">
                          <span className="text-sm block text-muted">
                            Notes
                          </span>
                          {build.notes ? (
                            <p className="text-text text-sm">{build.notes}</p>
                          ) : (
                            <p className="text-text text-sm">-</p>
                          )}
                        </div>
                        <div className="flex-1">
                          <span className="text-sm block text-muted">
                            Components
                          </span>
                          <span className="text-text">{`[${build.selected_components_count}/10]`}</span>
                        </div>
                      </div>

                      <div className="bg-primary mt-auto flex">
                        <Link
                          className="text-white px-8 py-4 flex-1 text-center hover:bg-primary-light cursor-pointer transition"
                          href={`/builder?build=${build.id}&shared=true`}
                        >
                          Continue
                        </Link>

                        <button
                          className="text-white px-8 py-4 flex-1 hover:bg-primary-light cursor-pointer transition"
                          onClick={() => handleSave(build)}
                        >
                          Copy to saved
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                className={`bg-primary hover:bg-primary-light flex items-center cursor-pointer overflow-hidden transition-all ${links[links.length - 1].url ? "w-10" : "w-0"}`}
                onClick={next}
                disabled={!links[links.length - 1].url}
              >
                <span className="rotate-270 text-white p-2">
                  <ArrowIcon size={24} />
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicProfile;
