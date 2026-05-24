import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import Layout from "../Layouts/Layout";
import { ArrowIcon, CloseIcon } from "../Pages/Components/Common/Icons";
import SidePanel from "../Pages/Components/Common/SidePanel";

export default function ProfileLayout({ children }) {
  const [expanded, setExpanded] = useState(false);
  const { url } = usePage();

  return (
    <Layout>
      <div className="h-full flex">
        <SidePanel title={"PROFILE"}>
          <Link
            href="/profile"
            className={`p-4 mb-2 border border-secondary text-white hover:bg-secondary ${url === "/profile" || url.startsWith("/profile?") ? "border-l-8" : ""}`}
          >
            Overview
          </Link>
          <Link
            href="/profile/account"
            className={`p-4 mb-2 border border-secondary text-white hover:bg-secondary ${url.startsWith("/profile/account") ? "border-l-8" : ""}`}
          >
            Account
          </Link>
          <Link
            href="/profile/bookmarked"
            className={`p-4 border border-secondary text-white hover:bg-secondary ${url.startsWith("/profile/bookmarked") ? "border-l-8" : ""}`}
          >
            Bookmarked
          </Link>
        </SidePanel>

        <div className="flex-1 px-4 pt-6">{children}</div>
      </div>
    </Layout>
  );
}
