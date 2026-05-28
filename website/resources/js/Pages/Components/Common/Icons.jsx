export function SavedIcon({
  size = 24,
  filled = false,
  color = "currentColor",
  className,
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M5 3H19C19.552 3 20 3.448 20 4V21L12 17L4 21V4C4 3.448 4.448 3 5 3Z"
        fill={filled ? color : "none"}
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HeartIcon({
  size = 24,
  filled = false,
  color = "currentColor",
  className,
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12 21C12 21 3 14.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3
           11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.58 3
           23 5.42 23 8.5C23 14.5 14 21 12 21Z"
        fill={filled ? color : "none"}
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MenuIcon({ size = 24, className = "transition" }) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

export function ArrowIcon({ size = 16, active }) {
  return (
    <svg
      width={size}
      height={size}
      className={`transition ${active ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export function CloseIcon({ size = 24 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" y1="5" x2="19" y2="19" />
      <line x1="19" y1="5" x2="5" y2="19" />
    </svg>
  );
}

export function AddIcon({ size = 24 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export function StarIcon({
  size = 24,
  filled = false,
  color = "currentColor",
  className,
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        fill={filled ? color : "none"}
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}
