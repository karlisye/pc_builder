import React from "react";

const ComponentInfo = ({ component }) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {Object.entries(component)
        .filter(
          ([key, value]) =>
            value !== null &&
            value !== "" &&
            ![
              "id",
              "dateks_id",
              "url",
              "scraped_at",
              "selected",
              "compatibility_warning",
            ].includes(key),
        )
        .map(([key, value]) => (
          <div key={key} className="flex flex-col wrap-anywhere">
            <span className="text-muted text-xs capitalize">
              {key.replace(/_/g, " ")}
            </span>
            <span className="text-text text-sm">
              {typeof value === "boolean"
                ? value
                  ? "Yes"
                  : "No"
                : value === "Nav"
                  ? "No"
                  : value === "Ir"
                    ? "Yes"
                    : value}
            </span>
          </div>
        ))}
    </div>
  );
};

export default ComponentInfo;
