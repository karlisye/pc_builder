const GuideSidebar = ({ sections, active, onSelect }) => {
  return (
    <aside className="w-full lg:w-120 bg-primary py-6 px-4 shrink-0">
      <h1 className="text-4xl font-semibold text-white">GUIDE</h1>

      <div className="space-y-4 mt-8">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSelect(section.id)}
            className={`
              p-4 border border-secondary w-full text-white text-left
              transition-all cursor-pointer hover:bg-secondary
              ${active === section.id ? "border-l-10" : ""}
            `}
          >
            {section.label}
          </button>
        ))}
      </div>
    </aside>
  );
};

export default GuideSidebar;
