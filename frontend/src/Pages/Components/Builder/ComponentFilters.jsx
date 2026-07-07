import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useBuilder } from '../../../Contexts/BuilderContext';
import { ArrowIcon } from '../Common/Icons';
import RangeSlider from './RangeSlider';

const RANGE_FILTER_FIELDS = new Set([
  'cores',
  'capacity',
  'frequency',
  'vram',
  'min_psu',
  'wattage',
  'size_mm',
  'fan_size_mm',
  'tdp_support',
]);

const BOOLEAN_FILTERS = new Set([
  'integrated_graphics',
  'cooler_included',
  'wifi',
  'xmp',
  'pcie_5',
  'psu_included',
]);

const FILTER_CONFIG = {
  cpu: ['socket', 'memory_type', 'cores', 'integrated_graphics', 'cooler_included'],
  motherboard: ['socket', 'chipset', 'form_factor', 'memory_type', 'wifi'],
  ram: ['memory_type', 'modules_count', 'capacity', 'frequency', 'xmp'],
  gpu: ['gpu_family', 'vram', 'min_psu'],
  case: ['form_factor', 'psu_included'],
  cooler: ['tdp_support', 'fan_size_mm'],
  hdd: ['capacity', 'interface'],
  fan: ['size_mm', 'units_in_package'],
  psu: ['wattage', 'efficiency_rating', 'modular', 'psu_type', 'pcie_5'],
  ssd: ['capacity', 'type', 'form_factor', 'interface'],
};

const ComponentFilters = () => {
  const { t } = useTranslation(['builder', 'common']);
  const { search, setSearch, sort, setSort, filters, setFilters, currentCompToAdd } = useBuilder();
  const [availableFilters, setAvailableFilters] = useState({});
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!currentCompToAdd) return;
    setError('');
    setAvailableFilters({});
    fetchFilters();
  }, [currentCompToAdd]);

  const fetchFilters = async () => {
    try {
      const res = await axios.get(`/api/components/${currentCompToAdd.toLowerCase()}/filters`);
      setAvailableFilters(res.data);
    } catch (err) {
      console.error('Failed to fetch filters', err);
      setError(t('componentFilters.failedToFetchFilters'));
    }
  };

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setSearch('');
    setSort('');
    setFilters({});
  };

  const activeColumns = FILTER_CONFIG[currentCompToAdd.toLowerCase()] ?? [];

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('componentFilters.searchPlaceholder', {
            component: t(`common:components.${currentCompToAdd?.toLowerCase()}`),
          })}
          className="bg-secondary text-white p-2 flex-1 outline-border focus:outline-1"
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-secondary-light p-2 text-text outline-border focus:outline-1"
        >
          <option value="">{t('componentFilters.sort.recommended')}</option>
          <option value="price_asc">{t('componentFilters.sort.priceAsc')}</option>
          <option value="price_desc">{t('componentFilters.sort.priceDesc')}</option>
          <option value="name_asc">{t('componentFilters.sort.nameAsc')}</option>
          <option value="name_desc">{t('componentFilters.sort.nameDesc')}</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
        {availableFilters.price_min != null && availableFilters.price_max != null && (
          <RangeSlider
            fullWidth
            className="pb-3 mb-1 border-b border-secondary"
            label={t('componentFilters.price')}
            min={availableFilters.price_min}
            max={availableFilters.price_max}
            step={5}
            minValue={Number(filters['min_price'] ?? availableFilters.price_min)}
            maxValue={Number(filters['max_price'] ?? availableFilters.price_max)}
            format={(v) => `€${v}`}
            onChange={(newMin, newMax) => {
              setFilters((prev) => {
                const next = { ...prev };
                if (newMin <= availableFilters.price_min) delete next['min_price'];
                else next['min_price'] = newMin;
                if (newMax >= availableFilters.price_max) delete next['max_price'];
                else next['max_price'] = newMax;
                return next;
              });
            }}
          />
        )}

        {availableFilters['brand']?.length > 0 && (
          <div className="space-y-1">
            <label className="text-sm text-secondary-light" htmlFor="filter_brand">
              {t('componentFilters.labels.brand')}
            </label>
            <select
              id="filter_brand"
              value={filters['brand'] ?? ''}
              onChange={(e) => updateFilter('brand', e.target.value || undefined)}
              className="w-full bg-secondary-light p-2 text-text outline-border focus:outline-1"
            >
              <option value="">{t('componentFilters.all')}</option>
              {availableFilters['brand'].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        )}

        {activeColumns.map((column) => {
          const values = availableFilters[column] ?? [];
          if (values.length === 0 || RANGE_FILTER_FIELDS.has(column)) return null;

          return (
            <div className="space-y-1" key={column}>
              <label className="text-sm text-secondary-light" htmlFor={`filter_${column}`}>
                {t(`componentFilters.labels.${column}`, column)}
              </label>
              <select
                id={`filter_${column}`}
                value={filters[column] ?? ''}
                onChange={(e) => updateFilter(column, e.target.value || undefined)}
                className="w-full bg-secondary-light p-2 text-text outline-border focus:outline-1"
              >
                <option value="">{t('componentFilters.all')}</option>
                {values.map((value) => (
                  <option key={value} value={value}>
                    {BOOLEAN_FILTERS.has(column)
                      ? value === true || value === 1 || value === '1'
                        ? t('componentFilters.yes')
                        : t('componentFilters.no')
                      : column === 'gpu_family'
                        ? String(value).toUpperCase()
                        : value}
                  </option>
                ))}
              </select>
            </div>
          );
        })}

        {activeColumns.map((column) => {
          if (!RANGE_FILTER_FIELDS.has(column)) return null;
          const values = availableFilters[column] ?? [];
          if (values.length < 2) return null;
          const boundsMin = Math.min(...values);
          const boundsMax = Math.max(...values);
          const curMin = Number(filters[`${column}_min`] ?? boundsMin);
          const curMax = Number(filters[`${column}_max`] ?? boundsMax);
          return (
            <RangeSlider
              key={column}
              label={t(`componentFilters.labels.${column}`, column)}
              values={values}
              minValue={curMin}
              maxValue={curMax}
              onChange={(newMin, newMax) => {
                setFilters((prev) => {
                  const next = { ...prev };
                  if (newMin <= boundsMin) delete next[`${column}_min`];
                  else next[`${column}_min`] = newMin;
                  if (newMax >= boundsMax) delete next[`${column}_max`];
                  else next[`${column}_max`] = newMax;
                  return next;
                });
              }}
            />
          );
        })}

        {error && <p className="text-danger text-sm">{error}</p>}
      </div>

      <div>
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="w-full flex justify-between items-center text-secondary-light hover:text-surface transition cursor-pointer"
        >
          <span className="">{t('componentFilters.display')}</span>
          <ArrowIcon active={open} />
        </button>

        <div className={`grid transition-all ${open ? 'grid-rows-[1fr] mt-2' : 'grid-rows-[0fr]'}`}>
          <div className="grid grid-cols-2 gap-2 overflow-hidden">
            <div className="flex gap-2 items-center">
              <input
                className="accent-secondary-light"
                id="show_in_stock"
                type="checkbox"
                checked={filters['show_in_stock'] ?? true}
                onChange={(e) => updateFilter('show_in_stock', e.target.checked)}
              />
              <label className="text-secondary-light text-sm" htmlFor="show_in_stock">
                {t('componentFilters.inStock')}
              </label>
            </div>

            <div className="flex gap-2 items-center">
              <input
                className="accent-secondary-light"
                id="show_orderable"
                type="checkbox"
                checked={filters['show_orderable'] ?? true}
                onChange={(e) => updateFilter('show_orderable', e.target.checked)}
              />
              <label className="text-secondary-light text-sm" htmlFor="show_orderable">
                {t('componentFilters.canBeOrdered')}
              </label>
            </div>

            <div className="flex col-span-2 gap-2 items-center">
              <input
                className="accent-secondary-light"
                id="show_compatible_only"
                type="checkbox"
                checked={filters['show_compatible_only'] ?? false}
                onChange={(e) => updateFilter('show_compatible_only', e.target.checked)}
              />
              <label className="text-secondary-light text-sm" htmlFor="show_compatible_only">
                {t('componentFilters.compatibleOnly')}
              </label>
            </div>
          </div>
        </div>
      </div>

      <button
        className="w-full p-4 bg-secondary hover:bg-secondary-dark transition cursor-pointer text-white"
        onClick={clearFilters}
      >
        {t('componentFilters.clearFilters')}
      </button>
    </div>
  );
};

export default ComponentFilters;
