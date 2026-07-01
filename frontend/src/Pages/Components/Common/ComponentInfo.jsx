import React from 'react';
import { useTranslation } from 'react-i18next';

const UNITS = {
  clock_rate: 'GHz',
  turbo_frequency: 'GHz',
  tdp: 'W',
  tdp_support: 'W',
  wattage: 'W',
  min_psu: 'W',
  psu_wattage: 'W',
  memory_max_speed: 'MHz',
  frequency: 'MHz',
  vram_freq: 'MHz',
  vram: 'GB',
  capacity: 'GB',
  max_memory_capacity: 'GB',
  read_speed: 'MB/s',
  write_speed: 'MB/s',
  max_gpu_length: 'mm',
  max_cpu_cooler_height: 'mm',
  rpm: 'RPM',
  rpm_min: 'RPM',
  rpm_max: 'RPM',
  voltage: 'V',
  bus: 'bit',
  size_mm: 'mm',
  noise_max_db: 'dB',
  fan_size_mm: 'mm',
  amps_12v: 'A',
  cache_mb: 'MB',
  height_mm: 'mm',
  max_psu_length: 'mm',
  max_radiator_size: 'mm',
};

const BOOLEAN_FIELDS = new Set([
  'integrated_graphics',
  'cooler_included',
  'wifi',
  'xmp',
  'pcie_5',
  'psu_included',
]);

const ComponentInfo = ({ component }) => {
  const { t } = useTranslation('common');

  const formatValue = (key, value) => {
    if (key === 'price') return `€${value}`;

    if (key === 'stock_status') {
      return t(`stockStatus.${value}`, value);
    }

    if (key === 'type') return String(value).toUpperCase();

    if (typeof value === 'boolean' || BOOLEAN_FIELDS.has(key))
      return value === true || value === 1 || value === '1' ? t('yes') : t('no');

    if (value === 'Nav') return t('no');
    if (value === 'Ir') return t('yes');

    if (UNITS[key] !== undefined && value !== null && value !== '') return `${value} ${UNITS[key]}`;

    return value;
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      {Object.entries(component)
        .filter(
          ([key, value]) =>
            value !== null &&
            value !== '' &&
            ![
              'id',
              'product_code',
              'url',
              'image_url',
              'scraped_at',
              'selected',
              'compatibility_warning',
              'compatible',
              'out_of_stock',
              'listings',
              'selected_source',
              'price',
              'stock_status',
              'stock_quantity',
            ].includes(key),
        )
        .map(([key, value]) => (
          <div key={key} className="flex flex-col wrap-anywhere">
            <span className="text-muted text-xs capitalize">
              {t(`fieldLabels.${key}`, { defaultValue: key.replace(/_/g, ' ') })}
            </span>
            <span className="text-text text-sm">{formatValue(key, value)}</span>
          </div>
        ))}
    </div>
  );
};

export default ComponentInfo;
