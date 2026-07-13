import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouteLoaderData, useSearchParams } from 'react-router';
import axios from 'axios';
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
  const { type } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [open, setOpen] = useState(false);

  const [prevType, setPrevType] = useState(type);
  if (prevType !== type) {
    setPrevType(type);
    setSearch(searchParams.get('search') ?? '');
  }

  // Distinguishes our own debounced URL writes from external ones (back/forward,
  // links) so the input follows history navigation without fighting typing.
  const lastWrittenSearchRef = useRef(search);

  useEffect(() => {
    const urlSearch = searchParams.get('search') ?? '';
    if (urlSearch !== lastWrittenSearchRef.current) {
      lastWrittenSearchRef.current = urlSearch;
      setSearch(urlSearch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if ((searchParams.get('search') ?? '') === search) return;
      lastWrittenSearchRef.current = search;
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (search) next.set('search', search);
          else next.delete('search');
          next.delete('page');
          return next;
        },
        { replace: true, preventScrollReset: true },
      );
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const loaderData = useRouteLoaderData('routes/builder-picker');

  const { data: availableFilters = {}, isError } = useQuery({
    queryKey: ['component-filters', type],
    initialData: loaderData?.type === type ? loaderData.filterOptions : undefined,
    queryFn: ({ signal }) =>
      axios.get(`/api/components/${type}/filters`, { signal }).then((res) => res.data),
    enabled: Boolean(type),
    staleTime: 5 * 60_000,
  });

  const sort = searchParams.get('sort') ?? '';
  const filterValue = (key) => searchParams.get(key);
  const boolFilter = (key, fallback) => {
    const raw = searchParams.get(key);
    return raw === null ? fallback : raw === 'true';
  };

  const updateParams = (mutate, opts) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        mutate(next);
        next.delete('page');
        return next;
      },
      { preventScrollReset: true, ...opts },
    );
  };

  const updateFilter = (key, value) => {
    updateParams((next) => {
      if (value === undefined || value === null || value === '') next.delete(key);
      else next.set(key, String(value));
    });
  };

  const clearFilters = () => {
    setSearch('');
    lastWrittenSearchRef.current = '';
    setSearchParams((prev) => {
      const next = new URLSearchParams();
      const build = prev.get('build');
      const shared = prev.get('shared');
      if (build) next.set('build', build);
      if (shared) next.set('shared', shared);
      return next;
    });
  };

  const activeColumns = FILTER_CONFIG[type] ?? [];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('componentFilters.searchPlaceholder', {
            component: t(`common:components.${type}`),
          })}
          aria-label={t('componentFilters.searchPlaceholder', {
            component: t(`common:components.${type}`),
          })}
          className="bg-secondary text-white p-2 flex-1 outline-border focus:outline-1"
        />

        <select
          value={sort}
          onChange={(e) => updateFilter('sort', e.target.value)}
          aria-label={t('componentFilters.sort.recommended')}
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
            minValue={Number(filterValue('min_price') ?? availableFilters.price_min)}
            maxValue={Number(filterValue('max_price') ?? availableFilters.price_max)}
            format={(v) => `€${v}`}
            onChange={(newMin, newMax) => {
              updateParams((next) => {
                if (newMin <= availableFilters.price_min) next.delete('min_price');
                else next.set('min_price', String(newMin));
                if (newMax >= availableFilters.price_max) next.delete('max_price');
                else next.set('max_price', String(newMax));
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
              value={filterValue('brand') ?? ''}
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
                value={filterValue(column) ?? ''}
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
          const curMin = Number(filterValue(`${column}_min`) ?? boundsMin);
          const curMax = Number(filterValue(`${column}_max`) ?? boundsMax);
          return (
            <RangeSlider
              key={column}
              label={t(`componentFilters.labels.${column}`, column)}
              values={values}
              minValue={curMin}
              maxValue={curMax}
              onChange={(newMin, newMax) => {
                updateParams((next) => {
                  if (newMin <= boundsMin) next.delete(`${column}_min`);
                  else next.set(`${column}_min`, String(newMin));
                  if (newMax >= boundsMax) next.delete(`${column}_max`);
                  else next.set(`${column}_max`, String(newMax));
                });
              }}
            />
          );
        })}

        {isError && (
          <p className="text-danger text-sm">{t('componentFilters.failedToFetchFilters')}</p>
        )}
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
                checked={boolFilter('show_in_stock', true)}
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
                checked={boolFilter('show_orderable', true)}
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
                checked={boolFilter('show_compatible_only', false)}
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

export default React.memo(ComponentFilters);
