export function HeartIcon({ size = 24, filled = false, color = 'currentColor', className }) {
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
        fill={filled ? color : 'none'}
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MenuIcon({ size = 24, className = 'transition' }) {
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
      className={`transition ${active ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export function TrashIcon({ size = 24, color = 'currentColor', className }) {
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
        d="M4 7H20M9 7V4.5C9 3.67 9.67 3 10.5 3H13.5C14.33 3 15 3.67 15 4.5V7M18.5 7L17.79 19.14C17.74 19.92 17.09 20.5 16.3 20.5H7.7C6.91 20.5 6.26 19.92 6.21 19.14L5.5 7"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="10"
        y1="11"
        x2="10"
        y2="16"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <line
        x1="14"
        y1="11"
        x2="14"
        y2="16"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
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

export function StarIcon({ size = 24, filled = false, color = 'currentColor', className }) {
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
        fill={filled ? color : 'none'}
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function InfoIcon({ size = 24, color = 'currentColor', className }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="12"
        y1="11"
        x2="12"
        y2="17"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="12" cy="7.5" r="0.5" fill={color} stroke={color} strokeWidth="1.2" />
    </svg>
  );
}

export function AlertIcon({ size = 24, color = 'currentColor', className }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="12"
        y1="7"
        x2="12"
        y2="13"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="12" cy="16.5" r="0.5" fill={color} stroke={color} strokeWidth="1.2" />
    </svg>
  );
}

export function CopyIcon({ size = 24, color = 'currentColor', className }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect
        x="9"
        y="9"
        width="12"
        height="12"
        rx="0"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M6 15H4.5C3.67 15 3 14.33 3 13.5V4.5C3 3.67 3.67 3 4.5 3H13.5C14.33 3 15 3.67 15 4.5V6"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DotsIcon({ size = 24, color = 'currentColor', className }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="5" cy="12" r="1.8" fill={color} />
      <circle cx="12" cy="12" r="1.8" fill={color} />
      <circle cx="19" cy="12" r="1.8" fill={color} />
    </svg>
  );
}
