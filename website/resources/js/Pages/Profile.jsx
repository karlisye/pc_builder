import React, { useState } from "react";
import ProfileOverview from "./Components/Profile/ProfileOverview";
import AccountSettings from "./Components/Profile/AccountSettings";
import { ArrowIcon } from "./Components/Common/Icons";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "account", label: "Account" },
];

const Profile = ({ user, builds }) => {
  const [active, setActive] = useState(sections[0].id);
  const [expanded, setExpanded] = useState(false);

  const contentMap = {
    overview: <ProfileOverview user={user} builds={builds} />,
    account: <AccountSettings user={user} />,
  };

  return (
    <div className="h-full flex flex-col lg:flex-row">
      <div className="w-full lg:w-120.5 bg-primary py-6 px-4 shrink-0">
        <div
          onClick={() => setExpanded((prev) => !prev)}
          className="flex gap-2 justify-between items-center"
        >
          <h1 className="text-4xl font-semibold text-white">PROFILE</h1>

          <span className="text-surface lg:opacity-0">
            <ArrowIcon active={expanded} size={24} />
          </span>
        </div>

        <div
          className={`grid transition-all lg:mt-4 ${expanded ? "grid-rows-[1fr] mt-4" : "grid-rows-[0fr] lg:grid-rows-[1fr]"}`}
        >
          <div className="space-y-4 overflow-hidden">
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
      </div>

      <div className="flex-1 px-4 pt-6">{contentMap[active]}</div>
    </div>
  );
};

export default Profile;
