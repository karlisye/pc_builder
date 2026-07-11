import { useTranslation } from 'react-i18next';

const SLOTS = [
  { key: 'cpu', anim: 'animate-budget-slot-1' },
  { key: 'gpu', anim: 'animate-budget-slot-2' },
  { key: 'ram', anim: 'animate-budget-slot-3' },
  { key: 'ssd', anim: 'animate-budget-slot-4' },
];

const BudgetBuildDemo = ({ className = '' }) => {
  const { t } = useTranslation('common');

  return (
    <div className={`w-full flex flex-col justify-center gap-8 px-4 ${className}`}>
      <div className="relative h-2 rounded-full bg-secondary-light">
        <div className="absolute inset-y-0 left-0 rounded-full bg-primary animate-budget-fill" />
        <div className="absolute top-1/2 h-4 w-4 -translate-y-1/2 -translate-x-1/2 rounded-full bg-surface shadow-md animate-budget-handle" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {SLOTS.map(({ key, anim }) => (
          <div
            key={key}
            className={`flex items-center justify-center h-16 sm:h-20 border-2 border-secondary-light bg-primary text-xs sm:text-sm font-bold text-surface text-center px-2 ${anim}`}
          >
            {t(`components.${key}`)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetBuildDemo;
