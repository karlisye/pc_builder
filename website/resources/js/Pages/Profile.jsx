import ProfileLayout from "../Layouts/ProfileLayout";
import React, { useState } from "react";
import { HeartIcon, SavedIcon, StarIcon } from "./Components/Common/Icons";
import { Link, router } from "@inertiajs/react";
import Modal from "./Components/Common/Modal";
import axios from "axios";
import BuildsList from "./Components/Profile/BuildsList";

const Profile = ({ user, publicBuildData, privateBuildData }) => {
  const [description, setDescription] = useState(
    user?.description ?? "Add an About Me",
  );
  const [publishing, setPublishing] = useState(false);
  const [build, setBuild] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  const handleSave = async () => {
    try {
      await axios.patch(`/api/users/${user.id}`, {
        description,
      });
      setSuccess("About Me saved");
    } catch (err) {
      setError(err.response.data.errors ?? "Failed to update About Me");
    } finally {
      setTimeout(() => {
        setError("");
        setSuccess("");
      }, 3000);
    }
  };

  return (
    <>
      <div>
        <div className="mb-4 flex gap-4 items-center">
          <span className="w-12 h-12 rounded-full bg-secondary-light flex items-center justify-center font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </span>

          <div>
            <h1 className="text-4xl font-semibold text-text uppercase">
              {user?.name}
            </h1>
            <p className="text-muted text-sm">
              Active since {new Date(user?.created_at).toDateString()}
            </p>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-2xl font-semibold mb-2">About Me</h2>
          <textarea
            className="border border-border text-muted w-full min-h-40 p-2 focus:outline outline-border"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            id=""
          ></textarea>

          <div className="flex gap-2 items-center">
            <button
              className="px-8 py-2 bg-primary text-white mt-2 hover:bg-primary-light cursor-pointer"
              onClick={handleSave}
            >
              Save
            </button>

            {error && <p className="text-danger">{error}</p>}
            {success && <p className="text-success">{success}</p>}
          </div>
        </div>

        <div className="my-6">
          <h2 className="text-2xl font-semibold mb-2">Public Builds</h2>
          <BuildsList
            buildData={publicBuildData}
            setBuild={setBuild}
            setPublishing={setPublishing}
            isPublic
          />

          <h2 className="text-2xl font-semibold mb-2 mt-4">Private Builds</h2>
          <BuildsList
            buildData={privateBuildData}
            setBuild={setBuild}
            setPublishing={setPublishing}
          />
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

Profile.layout = (page) => <ProfileLayout>{page}</ProfileLayout>;

export default Profile;
