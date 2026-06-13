const descriptions = {
  RAM: {
    fullName: "Random Access Memory",
    description:
      "Short-term working memory. Holds data the CPU is actively using.",
  },
  GPU: {
    fullName: "Graphics Processing Unit",
    description:
      "Renders graphics and visuals. Handles parallel processing tasks.",
  },
  PSU: {
    fullName: "Power Supply Unit",
    description: "Converts wall power into voltages the components need.",
  },
  SSD: {
    fullName: "Solid State Drive",
    description: "Fast permanent storage. Loads your OS and apps quickly.",
  },
  HDD: {
    fullName: "Hard Disk Drive",
    description:
      "Optional large, slower storage. Good for bulk files and backups.",
  },
  Case: {
    fullName: "Computer Case",
    description: "Houses and protects all components, and manages airflow.",
  },
  Fan: {
    fullName: "Case Fan",
    description: "Moves air through the case to prevent heat buildup.",
  },
  Cooler: {
    fullName: "CPU Cooler",
    description: "Sits on the CPU and pulls heat away from it.",
  },
  CPU: {
    fullName: "Central Processing Unit",
    description: "The brain. Executes all instructions and runs your software.",
  },
  Motherboard: {
    fullName: "Motherboard",
    description: "The backbone. Connects and lets all components communicate.",
  },
};

const ComponentPopup = ({ component, x, y }) => {
  const { fullName, description } = descriptions[component] ?? {};

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
