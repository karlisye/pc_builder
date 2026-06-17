import React, { useState } from "react";
import Modal from "../Common/Modal";
import axios from "axios";
import { HeartIcon, SavedIcon, StarIcon } from "../Common/Icons";

const BuildVisibility = ({ build, setBuild }) => {
  const [publishing, setPublishing] = useState(false);
  const [success, setSuccess] = useState("");

  const publish = async () => {
    try {
      const res = await axios.patch(`/api/builds/${build.id}/publish`);

      setBuild((prev) => ({
        ...prev,
        is_public: res.data.is_public,
      }));

      setSuccess(res.data.success);
    } catch (err) {
      console.error(err);
    } finally {
      setPublishing(false);
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  return (
    <>
      <div className="border border-border bg-background p-2 flex justify-between md:gap-6 gap-2 md:flex-row flex-col">
        {build.is_public ? (
          <>
            <p className="mt-auto text-text">
              Your build is currently
              <span className="text-success"> public</span>
            </p>

            <div className="flex gap-4">
              <div className="flex gap-2">
                <HeartIcon filled className={"text-danger"} />
                <span>{build.likes_count}</span>
              </div>

              <div className="flex gap-2">
                <SavedIcon filled className={"text-alert"} />
                <span>{build.bookmarks_count}</span>
              </div>

              <div className="flex gap-2">
                <StarIcon filled className={"text-alert"} />
                <span>{Math.round(build.reviews_avg_rating ?? 0)}</span>
              </div>
            </div>

            <button
              className="text-text cursor-pointer hover:text-danger transition text-nowrap text-left underline"
              onClick={() => setPublishing(true)}
            >
              Make my build private
            </button>
          </>
        ) : (
          <>
            <p className="mt-auto text-text">
              Your build is currently
              <span className="text-danger"> not published </span>
              and can't be accessed by other people
            </p>

            <button
              className="text-text cursor-pointer hover:text-success transition text-nowrap text-left underline"
              onClick={() => setPublishing(true)}
            >
              Publish my build
            </button>
          </>
        )}
      </div>
      {success && <p className="block text-success">{success}</p>}

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

export default BuildVisibility;
