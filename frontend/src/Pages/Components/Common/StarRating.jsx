import { useState } from "react";
import { StarIcon } from "./Icons";

const StarRating = ({ value, onChange, readonly = false }) => {
  const [hovered, setHovered] = useState(null);
  const display = hovered ?? value;

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => setHovered(null)}
          className="transition disabled:cursor-default"
        >
          <span className={display >= star ? "text-alert" : "text-muted"}>
            <StarIcon filled={display >= star} />
          </span>
        </button>
      ))}
    </div>
  );
};

export default StarRating;
