const PcPartCard = ({ title, part }) => {
  return (
    <div className="bg-primary-light p-2">
      <h3 className="font-bold text-3xl text-white">{title}</h3>
      <p className="font-bold text-2xl text-slate-400">{part.name}</p>
      <div className="flex items-center justify-between">
        <span className="text-success-light font-bold text-2xl">{part.price}€</span>
        <a
          className="text-white hover:text-success-light transition-colors"
          href={part.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Pasūtīt
        </a>
      </div>
    </div>
  );
};

export default PcPartCard;
