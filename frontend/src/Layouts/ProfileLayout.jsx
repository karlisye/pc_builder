import { Link, useLocation, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SidePanel from "../Pages/Components/Common/SidePanel";

export default function ProfileLayout() {
  const { t } = useTranslation("layout");
  const { pathname } = useLocation();

  return (
    <div className="h-full flex">
      <SidePanel title={t("profile.title")}>
        <Link
          to="/profile"
          className={`p-4 mb-2 border border-secondary text-white hover:bg-secondary ${pathname === "/profile" || pathname.startsWith("/profile?") ? "border-l-8" : ""}`}
        >
          {t("profile.overview")}
        </Link>
        <Link
          to="/profile/account"
          className={`p-4 mb-2 border border-secondary text-white hover:bg-secondary ${pathname.startsWith("/profile/account") ? "border-l-8" : ""}`}
        >
          {t("profile.account")}
        </Link>
        <Link
          to="/profile/liked"
          className={`p-4 border border-secondary text-white hover:bg-secondary ${pathname.startsWith("/profile/liked") ? "border-l-8" : ""}`}
        >
          {t("profile.liked")}
        </Link>
      </SidePanel>

      <div className="flex-1 px-4 pt-6">
        <Outlet />
      </div>
    </div>
  );
}
