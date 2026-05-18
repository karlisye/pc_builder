import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import Layout from "../Layouts/Layout";
import { ArrowIcon, CloseIcon } from "../Pages/Components/Common/Icons";

export default function ProfileLayout({ children }) {
  const [expanded, setExpanded] = useState(false);
  const { url } = usePage();

  return (
    <Layout>
      <div className="h-full flex">
        <div className="lg:hidden fixed left-0 top-1/2 -translate-y-1/2 transition-transform -translate-x-4 hover:translate-x-0">
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="bg-primary text-white w-15 px-2 py-8 flex justify-end cursor-pointer hover:bg-primary-light transition"
          >
            <span className="rotate-270 ">
              <ArrowIcon size={32} />
            </span>
          </button>
        </div>

        <div
          className={`bg-primary flex flex-col fixed left-0 right-0 bottom-0 top-14 transition-transform lg:static lg:w-120.5 lg:translate-x-0 overflow-y-auto z-10 pb-6
            ${expanded ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        >
          <div className="flex justify-between gap-4 items-center pt-6 px-4">
            <h1 className="text-4xl font-semibold text-white">PROFILE</h1>
            <button
              className="w-10 h-10 lg:hidden text-secondary-light hover:cursor-pointer bg-primary hover:bg-primary-light transition p-2"
              onClick={() => setExpanded(false)}
            >
              <CloseIcon />
            </button>
          </div>

          <div className="flex flex-col gap-4 p-4">
            <Link
              href="/profile"
              className={`p-4 border border-secondary text-white hover:bg-secondary ${url === "/profile" || url.startsWith("/profile?") ? "border-l-8" : ""}`}
            >
              Overview
            </Link>
            <Link
              href="/profile/account"
              className={`p-4 border border-secondary text-white hover:bg-secondary ${url.startsWith("/profile/account") ? "border-l-8" : ""}`}
            >
              Account
            </Link>
            <Link
              href="/profile/bookmarked"
              className={`p-4 border border-secondary text-white hover:bg-secondary ${url.startsWith("/profile/bookmarked") ? "border-l-8" : ""}`}
            >
              Bookmarked
            </Link>
          </div>

          <div className="mt-auto pt-6 lg:hidden">
            <div className="p-4 border-t border-primary-light flex">
              <h2 className="text-6xl p-2 font-bold text-surface border border-secondary-light">
                PC BUILDER
              </h2>
            </div>
          </div>
        </div>

        <div className="flex-1 px-4 pt-6">{children}</div>
      </div>
    </Layout>
  );
}
