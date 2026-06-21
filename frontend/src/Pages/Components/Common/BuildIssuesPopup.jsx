import { useTranslation } from "react-i18next";

const BuildIssuesPopup = ({ issues, x, y }) => {
  const { t } = useTranslation("pages");

  const popupWidth = 288;
  const offset = 12;

  const left =
    x + offset + popupWidth > window.innerWidth
      ? x - offset - popupWidth
      : x + offset;

  const top = y + offset;

  return (
    <div
      className="p-2 border border-danger/50 bg-background z-10 w-72 max-h-64 overflow-auto space-y-2"
      style={{
        position: "fixed",
        top,
        left,
        pointerEvents: "none",
      }}
    >
      <p className="font-medium text-danger">
        {t("components.buildCard.compatibilityIssues")}
      </p>
      {Object.entries(issues).map(([slot, slotIssues]) =>
        slotIssues.map((issue, i) => (
          <p key={`${slot}-${i}`} className="text-sm text-danger">
            <span className="capitalize font-medium">{slot}: </span>
            {issue}
          </p>
        )),
      )}
    </div>
  );
};

export default BuildIssuesPopup;
