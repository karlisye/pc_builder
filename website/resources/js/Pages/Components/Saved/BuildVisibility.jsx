import React, { useState } from "react";
import Modal from "../Common/Modal";
import axios from "axios";
import { router } from "@inertiajs/react";

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
      <div className="border border-border bg-background p-2 flex justify-between">
        {build.is_public ? (
          <>
            <p className="text-text mt-auto">
              Your build is currently public...
            </p>
            <button
              className="py-4 px-8 bg-surface text-text cursor-pointer hover:bg-danger/50 transition text-nowrap"
              onClick={() => setPublishing(true)}
            >
              Make my build private
            </button>
          </>
        ) : (
          <>
            <p className="text-text mt-auto">
              Your build is currently not published and can't be accessed by
              other people...
            </p>
            <button
              className="py-4 px-8 bg-surface text-text cursor-pointer hover:bg-success/50 transition text-nowrap"
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
            Are you sure you want to publish {build.name} build?
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
