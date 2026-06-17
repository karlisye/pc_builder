import { Link, useLocation, Outlet } from "react-router-dom";
import SidePanel from "../Pages/Components/Common/SidePanel";

export default function ProfileLayout() {
  const { pathname } = useLocation();

  return (
    <div className="h-full flex">
      <SidePanel title={"PROFILE"}>
        <Link
          to="/profile"
          className={`p-4 mb-2 border border-secondary text-white hover:bg-secondary ${pathname === "/profile" || pathname.startsWith("/profile?") ? "border-l-8" : ""}`}
        >
          Overview
        </Link>
        <Link
          to="/profile/account"
          className={`p-4 mb-2 border border-secondary text-white hover:bg-secondary ${pathname.startsWith("/profile/account") ? "border-l-8" : ""}`}
        >
          Account
        </Link>
        <Link
          to="/profile/bookmarked"
          className={`p-4 border border-secondary text-white hover:bg-secondary ${pathname.startsWith("/profile/bookmarked") ? "border-l-8" : ""}`}
        >
          Bookmarked
        </Link>
      </SidePanel>

      <div className="flex-1 px-4 pt-6">
        <Outlet />
      </div>
    </div>
  );
}
