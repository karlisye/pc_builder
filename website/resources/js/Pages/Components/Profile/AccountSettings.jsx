import { useForm } from "@inertiajs/react";
import React, { useState } from "react";

const AccountSettings = ({ user }) => {
  const { data, setData, errors, patch } = useForm({
    name: user.name,
    email: user.email,
  });

  const [editActive, setEditActive] = useState(false);

  const handleEdit = (e) => {
    e.preventDefault();

    if (!editActive) {
      setEditActive(true);
      return;
    }

    patch(`/api/users/${user.id}`);
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
              value={data.name}
              onChange={(e) => setData("name", e.target.value)}
              disabled={!editActive}
            />
            {errors.name && (
              <p className="text-danger text-sm">{errors.name}</p>
            )}
          </div>

          <div className="">
            <label className="block text-muted" htmlFor="email">
              Email
            </label>
            <input
              className="p-2 bg-surface w-full disabled:text-muted focus:outline outline-border transition"
              type="text"
              id="email"
              value={data.email}
              onChange={(e) => setData("email", e.target.value)}
              disabled={!editActive}
            />
            {errors.email && (
              <p className="text-danger text-sm">{errors.email}</p>
            )}
          </div>
        </div>

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
                setData("name", user.name);
                setData("email", user.email);
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
