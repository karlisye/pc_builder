import { useState } from "react";
import { ArrowIcon } from "../Pages/Components/Common/Icons";
import { Link, usePage } from "@inertiajs/react";
import Layout from "../Layouts/Layout";

export default function ProfileLayout({ children }) {
  const [expanded, setExpanded] = useState(false);
  const { url } = usePage();

  return (
    <Layout>
      <div className="h-full flex flex-col lg:flex-row">
        <div className="w-full lg:w-120.5 bg-primary py-6 px-4">
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
            className={`grid transition-all lg:mt-4 ${
              expanded
                ? "grid-rows-[1fr] mt-4"
                : "grid-rows-[0fr] lg:grid-rows-[1fr]"
            }`}
          >
            <div className="gap-4 overflow-hidden px-px flex flex-col">
              <Link
                href="/profile"
                className={`p-4 border border-secondary text-white hover:bg-secondary ${
                  url === "/profile" || url.startsWith("/profile?")
                    ? "border-l-8"
                    : ""
                }`}
              >
                Overview
              </Link>
              <Link
                href="/profile/account"
                className={`p-4 border border-secondary text-white hover:bg-secondary ${
                  url.startsWith("/profile/account") ? "border-l-8" : ""
                }`}
              >
                Account
              </Link>
              <Link
                href="/profile/bookmarked"
                className={`p-4 border border-secondary text-white hover:bg-secondary ${
                  url.startsWith("/profile/bookmarked") ? "border-l-8" : ""
                }`}
              >
                Bookmarked
              </Link>
            </div>
          </div>
        </div>

        <div className="flex-1 px-4 pt-6">{children}</div>
      </div>
    </Layout>
  );
}
