import { useBuild } from '../contexts/BuildContext';

const PcPartCard = ({ title, part }) => {
  const { setSelectedComponent, setIsModalActive } = useBuild();

  const handleSeeMore = () => {
    setSelectedComponent(part);
    setIsModalActive(true);
  };
  return (
    <div className="bg-linear-to-br from-primary-light to-primary p-2 rounded-md">
      <h3 className="font-bold text-3xl text-white">{title}</h3>
      <p className="font-bold text-2xl text-slate-400">{part.name}</p>
      <div className="flex items-center justify-between">
        <span className="text-success-light font-bold text-2xl">{part.price}€</span>
        <div>
          <button className="text-white hover:text-success-light" onClick={handleSeeMore}>
            More
          </button>
          <a
            className="text-white hover:text-success-light"
            href={part.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Order Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default PcPartCard;
