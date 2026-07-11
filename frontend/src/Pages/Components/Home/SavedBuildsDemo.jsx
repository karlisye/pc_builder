const BUILDS = [
  { name: 'Gaming PC', price: 1450 },
  { name: 'Budget Build', price: 650 },
  { name: 'Streaming Rig', price: 1780 },
  { name: 'Home Office PC', price: 520 },
];

const SavedBuildsDemo = ({ className = '' }) => {
  return (
    <div className={`w-full flex flex-col justify-center gap-3 ${className}`}>
      {BUILDS.map(({ name, price }) => (
        <div
          key={name}
          className="flex items-center justify-between gap-4 h-16 sm:h-20 px-4 sm:px-6 border-2 border-secondary-light bg-primary"
        >
          <span className="text-sm sm:text-lg font-bold text-surface truncate">{name}</span>
          <span className="text-sm sm:text-lg font-semibold text-secondary-light shrink-0">
            €{price}
          </span>
        </div>
      ))}
    </div>
  );
};

export default SavedBuildsDemo;
