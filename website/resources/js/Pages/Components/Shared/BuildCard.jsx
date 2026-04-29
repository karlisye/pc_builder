import { Link, usePage } from "@inertiajs/react";
import axios from "axios";
import React, { useState } from "react";
import { HeartIcon, SavedIcon, StarIcon } from "../Common/Icons";
import StarRating from "../Common/StarRating";

const BuildCard = ({ build }) => {
  const { user } = usePage().props.auth;

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [liked, setLiked] = useState(build.liked ?? false);
  const [bookmarked, setBookmarked] = useState(build.bookmarked ?? false);

  const [likesCount, setLikesCount] = useState(build.likes_count ?? 0);
  const [bookmarksCount, setBookmarksCount] = useState(
    build.bookmarks_count ?? 0,
  );
  const [userRating, setUserRating] = useState(
    build.reviews?.[0]?.rating ?? null,
  );

  const handleSave = async () => {
    const components = Object.fromEntries(
      Object.entries(build.components)
        .filter(([_, component]) => component !== null)
        .map(([type, component]) => [type, component.id]),
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

  const like = async () => {
    try {
      const res = await axios.post(`/api/builds/${build.id}/like`);
      if (res.status === 200) {
        setLiked((prev) => !prev);
        setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
      }
    } catch (err) {
      setError(err.response?.data?.error ?? "Failed to like");
    }
  };

  const bookmark = async () => {
    try {
      const res = await axios.post(`/api/builds/${build.id}/bookmark`);
      if (res.status === 200) {
        setBookmarked((prev) => !prev);
        setBookmarksCount((prev) => (bookmarked ? prev - 1 : prev + 1));
      }
    } catch (err) {
      setError(err.response?.data?.error ?? "Failed to bookmark");
    }
  };

  const submitReview = async (rating) => {
    setUserRating(rating);
    try {
      await axios.post(`/api/builds/${build.id}/review`, { rating });
    } catch (err) {
      setError(err.response?.data?.error ?? "Failed to submit review");
    }
  };

  return (
    <div className="w-full border flex flex-col border-border shadow hover:bg-background transition overflow-hidden">
      <div className="flex gap-2 items-center justify-between">
        <h1 className="text-2xl uppercase m-2 text-text font-semibold">
          {build.name}
        </h1>
        <p className="text-text font-semibold text-xl m-2">
          €{build.total_price}
        </p>
      </div>

      <div className="flex">
        <div className="flex-1 m-2 flex flex-col">
          <span className="text-muted font-medium">Notes</span>
          <p className="text-text mt-4">{build.notes}</p>

          <div className="p-2 border border-border mt-auto">
            <div className="flex justify-around">
              <span
                className="flex items-center gap-2"
                title={"Like this post"}
              >
                <button onClick={like}>
                  <HeartIcon
                    filled={liked}
                    className={
                      liked
                        ? "text-danger transition hover:text-danger/90"
                        : "transition text-muted hover:text-text"
                    }
                  />
                </button>

                <span className="text-muted">{likesCount ?? 0}</span>
              </span>
              <span
                className="flex items-center gap-2"
                title={"Bookmark this post"}
              >
                <button onClick={bookmark}>
                  <SavedIcon
                    filled={bookmarked}
                    className={
                      bookmarked
                        ? "text-alert transition hover:text-alert/90"
                        : "transition text-muted hover:text-text"
                    }
                  />
                </button>

                <span className="text-muted">{bookmarksCount ?? 0}</span>
              </span>

              <span
                className="flex items-center gap-2"
                title={"Average rating"}
              >
                <StarIcon filled className={"text-alert"} />

                <span className="text-muted">
                  {Math.round(build.reviews_avg_rating ?? 0)}
                </span>
              </span>
            </div>

            <div className="w-9/10 mx-auto border border-border my-2"></div>

            <div className="flex w-full justify-center">
              {/* {build.user_id !== user.id && ()} */}
              <StarRating value={userRating} onChange={submitReview} />
            </div>
          </div>
        </div>

        <div className="flex-2 m-2">
          <span className="text-muted font-medium">Components</span>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {build.components &&
              Object.entries(build.components).map(([key, component]) => {
                if (!component) return null;

                return (
                  <div key={key}>
                    <span className="text-muted uppercase text-sm">{key}</span>
                    <p className="text-text text-sm truncate">
                      {component.name}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {success && <p className="text-success ml-auto px-2">{success}</p>}
      {error && <p className="text-danger ml-auto px-2">{error}</p>}

      <div className="bg-primary mt-auto flex">
        <Link
          className="text-white px-8 py-4 flex-1 text-center hover:bg-primary-light cursor-pointer transition"
          href={`/builder?build=${build.id}`}
        >
          Continue
        </Link>

        <button
          className="text-white px-8 py-4 flex-1 hover:bg-primary-light cursor-pointer transition"
          onClick={handleSave}
        >
          Copy to saved
        </button>
      </div>
    </div>
  );
};

export default BuildCard;
