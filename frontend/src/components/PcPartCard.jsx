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

      <div className="flex items-center gap-4 pt-4">
        <button
          className="flex-1 bg-primary-light text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:cursor-pointer hover:bg-primary-light/50"
          onClick={handleSeeMore}
        >
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
