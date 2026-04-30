import React, { useState } from "react";
import { HeartIcon, SavedIcon, StarIcon } from "../Common/Icons";
import { Link, router } from "@inertiajs/react";
import Modal from "../Common/Modal";

const ProfileOverview = ({ user, builds }) => {
  const [description, setDescription] = useState(
    user.description ?? "Add an About Me",
  );
  const [publishing, setPublishing] = useState(false);
  const [build, setBuild] = useState(null);

  const publish = async () => {
    try {
      await axios.patch(`/api/builds/${build.id}/publish`);
      router.reload();
    } catch (err) {
      console.error(err);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <>
      <div>
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
          <h2 className="text-2xl font-semibold mb-2">About Me</h2>
          <textarea
            className="border border-border text-muted w-full min-h-40 p-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            id=""
          ></textarea>
        </div>

        <div className="grid xl:grid-cols-2 grid-cols-1 gap-4">
          <div className="">
            <h2 className="text-2xl font-semibold mb-2">Public Builds</h2>

            <div className="space-y-4">
              {builds.map((build) => {
                if (!build.is_public) return;
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
                        <span className="text-sm block text-muted">
                          Components
                        </span>
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
                        Make Private
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="">
            <h2 className="text-2xl font-semibold mb-2">Private Builds</h2>
            <div>
              {builds.map((build) => {
                if (build.is_public) return;
                return (
                  <div
                    key={build.id}
                    className="border border-border flex flex-col h-74"
                  >
                    <div className="h-17">
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
                    </div>

                    <div className="border border-border w-9/10 my-4 mx-auto"></div>

                    <div className="flex gap-4 m-2">
                      <div className="flex-1">
                        <span className="text-sm block text-muted">Notes</span>
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

                    <div className="mt-auto bg-primary flex">
                      <Link
                        className="text-white flex-1 p-4 hover:bg-primary-light transition cursor-pointer text-center"
                        href={`/builds?buildId=${build.id}`}
                      >
                        Edit
                      </Link>
                      <button
                        className="text-white flex-1 p-4 hover:bg-success/50 transition cursor-pointer"
                        onClick={() => {
                          setPublishing(true);
                          setBuild(build);
                        }}
                      >
                        Make Public
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {publishing && (
        <Modal close={() => setPublishing(false)}>
          <h1 className="text-text text-3xl mb-10">
            Are you sure you want to {build.is_public ? "private" : "publish"}{" "}
            {build.name} build?
          </h1>

          <div className="flex gap-4">
            <button
              className="flex-1 p-4 bg-primary text-background cursor-pointer hover:bg-primary-light transition"
              onClick={publish}
            >
              {build.is_public ? "Make Private" : "Publish"}
            </button>
            <button
              className="flex-1 p-4 bg-surface text-text cursor-pointer hover:bg-secondary-light transition"
              onClick={() => setPublishing(false)}
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ProfileOverview;
