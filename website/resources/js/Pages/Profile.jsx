import React, { useState } from "react";
import ProfileOverview from "./Components/Profile/ProfileOverview";
import AccountSettings from "./Components/Profile/AccountSettings";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "account", label: "Account" },
];

const Profile = ({ user, builds }) => {
  const [active, setActive] = useState(sections[0].id);

  const contentMap = {
    overview: <ProfileOverview user={user} builds={builds} />,
    account: <AccountSettings user={user} />,
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="w-full lg:w-120.5 bg-primary py-6 px-4 shrink-0">
        <h1 className="text-4xl font-semibold text-white mb-4">PROFILE</h1>
        <div className="space-y-4 mt-4">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActive(section.id)}
              className={`
              p-4 border border-secondary w-full text-white text-left
              transition-all cursor-pointer hover:bg-secondary
              ${active === section.id ? "border-l-10" : ""}
            `}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 px-4 pt-6">{contentMap[active]}</div>
    </div>
  );
};

export default Profile;
