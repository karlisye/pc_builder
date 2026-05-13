import React from "react";

const ComponentInfo = ({ component }) => {
  const formatValue = (key, value) => {
    if (key === "price") return `€${value}`;

    if (key === "stock_status") {
      return (
        {
          orderable: "Can Be Ordered",
          in_stock: "In Stock",
          out_of_stock: "Out Of Stock",
        }[value] ?? value
      );
    }

    if (key === "type") return String(value).toUpperCase();

    if (typeof value === "boolean") return value ? "Yes" : "No";

    if (value === "Nav") return "No";
    if (value === "Ir") return "Yes";

    return value;
  };

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
            <span className="text-text text-sm">{formatValue(key, value)}</span>
          </div>
        ))}
    </div>
  );
};

export default ComponentInfo;
