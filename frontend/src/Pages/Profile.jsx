import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Modal from "./Components/Common/Modal";
import axios from "axios";
import BuildsList from "./Components/Profile/BuildsList";
import { formatDate } from "../lib/formatDate";
import { useToast } from "../Contexts/ToastContext";

const Profile = () => {
  const { t } = useTranslation("profile");
  const { addToast } = useToast();
  const [user, setUser] = useState(null);
  const [publicBuildData, setPublicBuildData] = useState(null);
  const [privateBuildData, setPrivateBuildData] = useState(null);
  const [description, setDescription] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [build, setBuild] = useState(null);

  useEffect(() => {
    axios.get("/api/profile").then((res) => {
      setUser(res.data.user);
      setPublicBuildData(res.data.publicBuildData);
      setPrivateBuildData(res.data.privateBuildData);
      setDescription(res.data.user.description ?? "");
    });
  }, []);

  const fetchProfile = (publicPage = 1, privatePage = 1) =>
    axios
      .get("/api/profile", { params: { publicPage, privatePage } })
      .then((res) => {
        setPublicBuildData(res.data.publicBuildData);
        setPrivateBuildData(res.data.privateBuildData);
      });

  const publish = async () => {
    try {
      const res = await axios.patch(`/api/builds/${build.id}/publish`);
      fetchProfile();
      addToast(res.data.success, { type: "success" });
    } catch (err) {
      addToast(err.response?.data?.error ?? t("overview.publishError"), {
        type: "danger",
      });
    } finally {
      setPublishing(false);
    }
  };

  const handleSave = async () => {
    try {
      await axios.patch(`/api/users/${user.id}`, {
        description,
      });
      addToast(t("overview.saveSuccess"), { type: "success" });
    } catch (err) {
      addToast(err.response?.data?.message ?? t("overview.saveError"), {
        type: "danger",
      });
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
              {t("overview.activeSince", { date: formatDate(user?.created_at) })}
            </p>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-2xl font-semibold mb-2">{t("overview.aboutMeHeading")}</h2>
          <textarea
            className="border border-border text-muted w-full min-h-40 p-2 focus:outline outline-border"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("overview.aboutMePlaceholder")}
            id=""
          ></textarea>

          <div className="flex gap-2 items-center">
            <button
              className="px-8 py-2 bg-primary text-white mt-2 hover:bg-primary-light cursor-pointer disabled:text-white/50 disabled:bg-muted"
              onClick={handleSave}
              disabled={!description || description === user?.description}
            >
              {t("overview.save")}
            </button>
          </div>
        </div>

        <div className="my-6">
          <h2 className="text-2xl font-semibold mb-2">{t("overview.publicBuildsHeading")}</h2>
          <BuildsList
            buildData={publicBuildData}
            setBuild={setBuild}
            setPublishing={setPublishing}
            onPageChange={(page) => fetchProfile(page, privateBuildData?.current_page ?? 1)}
            isPublic
          />

          <h2 className="text-2xl font-semibold mb-2 mt-4">{t("overview.privateBuildsHeading")}</h2>
          <BuildsList
            buildData={privateBuildData}
            setBuild={setBuild}
            setPublishing={setPublishing}
            onPageChange={(page) => fetchProfile(publicBuildData?.current_page ?? 1, page)}
          />
        </div>
      </div>

      {publishing && (
        <Modal close={() => setPublishing(false)}>
          <h1 className="text-text text-3xl mb-10">
            {t("overview.publishConfirm", {
              action: build.is_public
                ? t("overview.publishActionPrivate")
                : t("overview.publishActionPublish"),
              name: build.name,
            })}
          </h1>

          <div className="flex gap-4">
            <button
              className="flex-1 p-4 bg-primary text-background cursor-pointer hover:bg-primary-light transition"
              onClick={publish}
            >
              {build.is_public ? t("overview.makePrivate") : t("overview.publish")}
            </button>
            <button
              className="flex-1 p-4 bg-surface text-text cursor-pointer hover:bg-secondary-light transition"
              onClick={() => setPublishing(false)}
            >
              {t("overview.cancel")}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Profile;
