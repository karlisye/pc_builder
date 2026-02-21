import { useBuild } from '../contexts/BuildContext';

const PcPartCard = ({ title, part }) => {
  const { setSelectedComponent, setIsModalActive } = useBuild();

  const handleSeeMore = () => {
    setSelectedComponent(part);
    setIsModalActive(true);
  };

  return (
    <div className="bg-primary p-6 rounded-xl border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-2xl bg-primary-light backdrop-blur-sm px-4 py-2 rounded-lg text-white">
          {title}
        </h3>
        <span className="px-3 py-1 bg-success-dark/50 text-success-light text-sm font-semibold rounded-full">
          {part.price}€
        </span>
      </div>

      <h4 className="font-bold text-xl text-white mb-4 truncate pr-2">{part.name}</h4>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 pt-4">
        <button
          className="flex-1 bg-primary-light text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:cursor-pointer hover:bg-primary-light/50"
          onClick={handleSeeMore}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          More Info
        </button>

        <a
          className="bg-success-light hover:bg-success-dark text-primary-dark font-semibold py-2 px-6 rounded-lg shadow-md"
          href={part.url}
          target="_blank"
        >
          Order Now
        </a>
      </div>
    </div>
  );
};

export default PcPartCard;
