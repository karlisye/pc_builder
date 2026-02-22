import { useBuild } from '../contexts/BuildContext';

const PcPartCard = ({ title, part }) => {
  const { setSelectedComponent, setIsModalActive } = useBuild();

  const handleSeeMore = () => {
    setSelectedComponent(part);
    setIsModalActive(true);
  };

  return (
    <div className="lg:w-1/3 md:w-1/2 w-full">
      <div className='bg-primary-dark p-3 m-2 rounded-xl'>
        <div className="flex lg:flex-col flex-row items-center lg:items-start justify-between mb-4 gap-2">
          <h3 className="font-bold text-2xl bg-primary-light backdrop-blur-sm px-4 py-2 rounded-lg text-secondary">
            {title}
          </h3>
          <span className="px-3 py-1 bg-success-dark/50 text-success-light text-sm font-semibold rounded-full">
            {part.price}€
          </span>
        </div>

        <h4 className="font-bold text-xl text-white truncate" title={part.name}>
          {part.name}
        </h4>

        <div className="flex items-center gap-4 pt-4">
          <button
            className="flex-1 bg-primary-light text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:cursor-pointer hover:bg-primary-light/50"
            onClick={handleSeeMore}
          >
            More
          </button>

          <a
            className="bg-secondary-light hover:bg-secondary-dark text-primary-dark font-semibold py-2 px-6 rounded-lg shadow-md"
            href={part.url}
            target="_blank"
          >
            Order
          </a>
        </div>
      </div>
    </div>
  );
};

export default PcPartCard;
