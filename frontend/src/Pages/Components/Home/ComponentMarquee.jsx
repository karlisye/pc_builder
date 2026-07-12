import { useTranslation } from 'react-i18next';

const ROWS = [
  [
    { name: 'AMD Ryzen 5 5600X', price: 189 },
    { name: 'Intel Core i5-13600K', price: 349 },
    { name: 'AMD Ryzen 7 7800X3D', price: 429 },
    { name: 'Intel Core i7-14700K', price: 419 },
    { name: 'AMD Ryzen 9 7950X', price: 599 },
  ],
  [
    { name: 'NVIDIA RTX 4070', price: 649 },
    { name: 'AMD Radeon RX 7800 XT', price: 579 },
    { name: 'NVIDIA RTX 4090', price: 1899 },
    { name: 'AMD Radeon RX 7600', price: 299 },
    { name: 'NVIDIA RTX 4060 Ti', price: 449 },
  ],
  [
    { name: 'Corsair Vengeance 32GB', price: 89 },
    { name: 'Samsung 970 EVO Plus 1TB', price: 79 },
    { name: 'ASUS ROG Strix B550-F', price: 199 },
    { name: 'NZXT Kraken 240', price: 139 },
    { name: 'Seasonic Focus GX-750', price: 129 },
  ],
];

const seededAvailable = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return hash % 5 !== 0;
};

const MarqueeRow = ({ items, direction = 'left' }) => {
  const { t } = useTranslation('common');
  const doubled = [...items, ...items];

  return (
    <div className="flex w-full overflow-hidden">
      <div
        className={`flex ${direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'} w-max`}
      >
        {doubled.map((item, i) => {
          const available = seededAvailable(item.name + i);
          return (
            <div
              key={i}
              className="flex flex-col justify-center gap-0.5 sm:gap-1 px-3 sm:px-5 md:px-8 h-14 sm:h-16 md:h-20 shrink-0 border-r border-secondary whitespace-nowrap"
            >
              <span className="text-xs sm:text-sm md:text-lg font-bold text-white">
                {item.name}
              </span>
              <span className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs md:text-sm">
                <span className="font-semibold text-secondary-light">€{item.price}</span>
                <span className="text-muted">
                  {available ? t('stockStatus.in_stock') : t('stockStatus.out_of_stock')}
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ComponentMarquee = ({ className = '' }) => {
  return (
    <div
      className={`flex flex-col justify-center gap-1 sm:gap-2 md:gap-4 w-full min-w-0 ${className}`}
    >
      {ROWS.map((items, i) => (
        <MarqueeRow key={i} items={items} direction={i % 2 === 0 ? 'left' : 'right'} />
      ))}
    </div>
  );
};

export default ComponentMarquee;
