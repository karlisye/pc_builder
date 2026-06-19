import { useTranslation } from "react-i18next";

const ComponentPopup = ({ component, x, y }) => {
  const { t } = useTranslation("builder");
  const key = component?.toLowerCase();
  const fullName = t(`componentPopup.${key}.fullName`, "");
  const description = t(`componentPopup.${key}.description`, "");

  // popup visibility out of bounds
  const popupWidth = 256;
  const popupHeight = 85;
  const offset = 12;

  const left =
    x + offset + popupWidth > window.innerWidth
      ? x - offset - popupWidth
      : x + offset;

  const top =
    y + offset + popupHeight > window.innerHeight
      ? y - offset - popupHeight
      : y + offset;

  return (
    <div
      className="p-2 border border-border bg-background z-10 w-64"
      style={{
        position: "fixed",
        top,
        left,
        pointerEvents: "none",
      }}
    >
      <p className="font-medium text-text">{component}</p>
      <p className="text-sm text-text mb-1">{fullName}</p>
      <p className="text-sm text-muted">{description}</p>
    </div>
  );
};

export default ComponentPopup;
