import React from "react";
import { ArrowIcon, HeartIcon, SavedIcon, StarIcon } from "../Common/Icons";
import { Link, router } from "@inertiajs/react";

const BuildsList = ({
  buildData,
  setBuild,
  setPublishing,
  isPublic = false,
}) => {
  const builds = buildData.data;
  const links = buildData.links;

  const next = () => {
    const url = new URL(links[links.length - 1].url);
    const current = new URL(window.location.href);
    // merge current params with new ones
    current.searchParams.forEach((value, key) => {
      if (!url.searchParams.has(key)) url.searchParams.set(key, value);
    });
    router.get(url, {
      preserveState: true,
    });
  };

  const previous = () => {
    const url = new URL(links[0].url);
    const current = new URL(window.location.href);
    current.searchParams.forEach((value, key) => {
      if (!url.searchParams.has(key)) url.searchParams.set(key, value);
    });
    router.get(url, {
      preserveState: true,
    });
  };

  return (
    <div className="">
      <h2 className="text-2xl font-semibold mb-2">
        {isPublic ? "Public Builds" : "Private Builds"}
      </h2>

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

        <div className="space-y-4 flex-1">
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

                  {isPublic && (
                    <div className="flex gap-4 m-2">
                      <div className="flex gap-2">
                        <HeartIcon filled className={"text-danger"} />
                        <span className="text-text">{build.likes_count}</span>
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
                    className={`text-white flex-1 p-4 ${isPublic ? "hover:bg-danger/50" : "hover:bg-success/50"} transition cursor-pointer`}
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
  );
};

export default BuildsList;
