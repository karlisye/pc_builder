import { useBuild } from "../contexts/BuildContext";

const PcPartCard = ({ title, component }) => {
  const {
    setSelectedComponent,
    setIsComponentModalActive,
    setIsAddActive,
    setCurrCompToAdd,
    setBuild,
    build
  } = useBuild();

  const typeMap = {
    "processor": "cpu",
    "motherboard": "motherboard",
    "ram": "ram",
    "cooler": "cooler",
    "graphics card": "gpu",
    "ssd": "ssd",
    "power supply": "psu",
    "case": "case",
    "fans": "fans",
  };

  const handleSeeMore = () => {
    setSelectedComponent(component);
    setIsComponentModalActive(true);
  };

  const handleAdd = () => {
    setIsAddActive(true);
    setCurrCompToAdd(title);
  };
  
  const handleRemove = () => {
    const type = typeMap[title.toLowerCase()];
    if (!type) return;
    setBuild((prev) => ({
      ...prev,
      [type]: null,
      total: (prev.total ?? 0) - component.price,
    }));
  };


  return (
    <div className="lg:w-1/3 md:w-1/2 w-full p-2">
      <div className="bg-primary-dark p-3 rounded-xl h-full">
        {component ? (
          <>
            <div className="flex lg:flex-col flex-row items-center lg:items-start justify-between mb-4 gap-2 relative">
              <h3 className="font-bold text-2xl bg-primary-light backdrop-blur-sm px-4 py-2 rounded-lg text-secondary">
                {title}
              </h3>
              <div>
                <span className="px-3 py-1 bg-success-dark/50 text-success-light text-sm font-semibold rounded-full">
                  {component.price}€
                </span>
              </div>

              <button
                className="w-8 h-8 text-secondary hover:cursor-pointer absolute top-0 right-0"
                onClick={handleRemove}
              >
                ✕
              </button>
            </div>

            <h4 className="font-bold text-xl text-white truncate" title={component.name}>
              {component.name}
            </h4>

            <div className="flex items-center gap-4 pt-4">
              <button
                className="flex-1 bg-primary-light text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:cursor-pointer hover:bg-primary-light/50"
                onClick={handleSeeMore}
              >
                More
              </button>
              <a
                className="bg-secondary hover:bg-secondary-dark text-primary-dark font-semibold py-2 px-6 rounded-lg shadow-md"
                href={component.url}
                target="_blank"
              >
                Order
              </a>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center gap-4">
            <h3 className="font-bold text-2xl bg-primary-light backdrop-blur-sm px-4 py-2 rounded-lg text-primary-dark">
              {title}
            </h3>

            <button className="bg-primary border-primary-lighter border-2 rounded-md p-2 text-primary-lighter hover:bg-primary-dark hover:cursor-pointer" title="Add this component to build" onClick={handleAdd}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PcPartCard;
