import axios from "axios";
import React, { useState } from "react";

const AccountSettings = ({ user }) => {
  const [editActive, setEditActive] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleEdit = async (e) => {
    e.preventDefault();

    if (!editActive) {
      setEditActive(true);
      return;
    }

    try {
      const res = await axios.patch(`/api/users/${user.id}`, {
        name,
        email,
      });
      if (res.status === 200) {
        setSuccess("Information updated");
        setError("");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      const errors = err.response?.data?.errors;
      setError(
        errors
          ? Object.values(errors).flat().join(", ")
          : "Failed to save personal information",
      );
    } finally {
      setEditActive(false);
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-semibold mb-4">Personal Information</h1>
      <form>
        <div className="grid xl:grid-cols-2 gap-4">
          <div className="">
            <label className="block text-muted" htmlFor="name">
              Name
            </label>
            <input
              className="p-2 bg-surface w-full disabled:text-muted focus:outline outline-border transition"
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!editActive}
            />
            {/* {errors.name && (
              <p className="text-danger text-sm">{errors.name}</p>
            )} */}
          </div>

          <div className="">
            <label className="block text-muted" htmlFor="email">
              Email
            </label>
            <input
              className="p-2 bg-surface w-full disabled:text-muted focus:outline outline-border transition"
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!editActive}
            />
            {/* {errors.email && (
              <p className="text-danger text-sm">{errors.email}</p>
            )} */}
          </div>
        </div>

        {success && <p className="text-success text-sm">{success}</p>}
        {error && <p className="text-danger text-sm">{error}</p>}

        <div className="space-x-2">
          <button
            className="py-2 px-6 bg-primary text-white hover:bg-primary-light cursor-pointer mt-2 transition"
            onClick={handleEdit}
          >
            {editActive ? "Save" : "Edit"}
          </button>

          {editActive && (
            <button
              className="py-2 px-6 bg-surface text-text hover:bg-secondary-light cursor-pointer mt-2 transition"
              onClick={(e) => {
                setEditActive(false);
                setName(user.name);
                setEmail(user.email);
                setError("");
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AccountSettings;
