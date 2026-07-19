import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Link, useParams, useRouteLoaderData, useSearchParams } from 'react-router';
import { useBuilder } from '../../../Contexts/BuilderContext';
import axios from 'axios';
import AddComponentSkeleton from '../Skeletons/AddComponentSkeleton';
import ComponentInfo from '../Common/ComponentInfo';
import ListingsTable from '../Common/ListingsTable';
import { AddIcon, CloseIcon, InfoIcon } from '../Common/Icons';
import PaginationControls from '../Common/PaginationControls';
import ComponentGeneratorForm from './ComponentGeneratorForm';
import { formatPrice } from '../../../lib/componentPrice';
import { selectedProductCodes } from '../../../lib/buildSlots';

const RESERVED_PARAMS = new Set(['page', 'sort', 'search', 'build', 'shared']);

const AddComponent = () => {
  const { t } = useTranslation(['builder', 'common']);
  const { selectedComponents, setSelectedComponents, closePicker, detailHref } = useBuilder();
  const { type } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [expandedId, setExpandedId] = useState(null);
  const [chosenSources, setChosenSources] = useState({});
  const [pickBestOpen, setPickBestOpen] = useState(false);
  const pickBestRef = useRef(null);
  const pickBestButtonRef = useRef(null);
  const selectionInProgressRef = useRef(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        pickBestRef.current &&
        !pickBestRef.current.contains(event.target) &&
        !pickBestButtonRef.current.contains(event.target)
      ) {
        setPickBestOpen(false);
      }
    };

    if (pickBestOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [pickBestOpen]);

  const page = Number(searchParams.get('page') ?? 1);
  const sort = searchParams.get('sort') ?? '';
  const search = searchParams.get('search') ?? '';
  const filters = {};
  for (const [key, value] of searchParams.entries()) {
    if (!RESERVED_PARAMS.has(key)) filters[key] = value;
  }

  const selected = selectedProductCodes(selectedComponents);
  const selectedKey = JSON.stringify(selected);
  const filtersKey = JSON.stringify(filters);

  // The selection isn't in the URL, so reset pagination ourselves when it changes.
  useEffect(() => {
    // Selecting a part changes selectedKey immediately before the picker route
    // unmounts. Do not let this effect update the picker's URL during that
    // navigation, otherwise it can keep/reopen AddComponent (most visibly when
    // selecting an incompatible part from an expanded card on page 2+).
    if (selectionInProgressRef.current) return;

    if (Number(searchParams.get('page') ?? 1) > 1) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete('page');
          return next;
        },
        { replace: true, preventScrollReset: true },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKey]);

  const loaderData = useRouteLoaderData('routes/builder-picker');
  const queryKey = ['components', type, selectedKey, search, sort, filtersKey, page];
  const seed = loaderData?.seedKey === JSON.stringify(queryKey) ? loaderData.list : undefined;

  const { data, error, isPending, isPlaceholderData } = useQuery({
    queryKey,
    initialData: seed,
    queryFn: ({ signal }) =>
      axios
        .get(`/api/components/${type}`, {
          signal,
          params: {
            selected: selectedKey,
            page,
            search: search || undefined,
            sort: sort || undefined,
            ...filters,
          },
        })
        .then((res) => res.data),
    enabled: Boolean(type),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });

  const components = data?.data ?? [];
  const pagination = data
    ? { currentPage: data.current_page, lastPage: data.last_page, total: data.total }
    : null;
  const errorMessage = error
    ? (error.response?.data?.error ?? t('addComponent.failedToFetch'))
    : '';

  const setPage = (next) => {
    const value = typeof next === 'function' ? next(page) : next;
    setSearchParams((prev) => {
      const nextParams = new URLSearchParams(prev);
      if (value <= 1) nextParams.delete('page');
      else nextParams.set('page', String(value));
      return nextParams;
    });
  };

  const handleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleChooseStore = (component, source) => {
    setChosenSources((prev) => ({ ...prev, [component.product_code]: source }));
  };

  const handleSelect = (component) => {
    selectionInProgressRef.current = true;
    setSelectedComponents((prev) => ({
      ...prev,
      [type]: component,
    }));
    closePicker();
  };

  return (
    <div className="border border-border w-full min-w-0 hover:bg-background transition p-4 mb-auto">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <h1 className="order-1 text-3xl font-semibold text-text min-w-0 flex-1">
          {t('addComponent.title', {
            component: t(`common:components.${type}`),
          })}
        </h1>
        <button
          className="order-2 sm:order-3 w-10 h-10 text-muted hover:cursor-pointer bg-surface hover:bg-secondary-light transition p-2 shrink-0"
          onClick={closePicker}
          aria-label={t('common:close')}
        >
          <CloseIcon />
        </button>
        <div className="order-3 sm:order-2 w-full sm:w-auto shrink-0 relative">
          <button
            ref={pickBestButtonRef}
            onClick={() => setPickBestOpen((prev) => !prev)}
            className={`w-full sm:w-auto px-4 py-2 transition cursor-pointer whitespace-nowrap ${
              pickBestOpen
                ? 'bg-primary-light text-white'
                : 'bg-primary text-white hover:bg-primary-light'
            }`}
          >
            {t('addComponent.pickBest')}
          </button>

          {pickBestOpen && (
            <div
              ref={pickBestRef}
              className="absolute right-0 top-full mt-2 w-80 max-h-[70vh] overflow-y-auto bg-background border border-border shadow z-10 p-4"
            >
              <ComponentGeneratorForm />
            </div>
          )}
        </div>
      </div>

      {isPending && <AddComponentSkeleton />}
      {errorMessage && <p className="text-danger mt-4">{errorMessage}</p>}

      {!isPending && !errorMessage && (
        <div className={`mt-4 flex flex-col gap-2 ${isPlaceholderData ? 'opacity-60' : ''}`}>
          {components.length === 0 ? (
            <div className="mx-auto text-center">
              <p className="text-2xl font-semibold text-text">
                {t('addComponent.noComponentsFound')}
              </p>
              <span className="text-muted">{t('addComponent.tryAdjustingFilters')}</span>
            </div>
          ) : (
            components.map((component) => {
              const chosenSource =
                chosenSources[component.product_code] ?? component.listings?.[0]?.source;
              const chosenListing = component.listings?.find((l) => l.source === chosenSource);
              const effectiveComponent = chosenListing
                ? {
                    ...component,
                    price: chosenListing.price,
                    stock_status: chosenListing.stock_status,
                    stock_quantity: chosenListing.stock_quantity,
                    url: chosenListing.url,
                    selected_source: chosenListing.source,
                  }
                : component;

              return (
                <div key={component.id} className="border border-border min-w-0">
                  <div
                    onClick={() => handleExpand(component.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleExpand(component.id);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-expanded={expandedId === component.id}
                    className={`flex items-stretch gap-3 p-2 min-w-0 cursor-pointer transition ${component.compatible && !component.out_of_stock ? 'bg-surface hover:bg-secondary-light' : 'bg-muted/50 hover:bg-muted/80'}`}
                  >
                    <div className="sm:w-10 sm:h-10 w-20 h-20 bg-background shrink-0 flex items-center justify-center overflow-hidden">
                      {component.image_url && (
                        <img
                          src={component.image_url}
                          alt={component.name}
                          loading="lazy"
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 min-w-0 flex-1">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span
                          className={`font-medium flex-1 ${component.compatible && !component.out_of_stock ? 'text-text' : 'text-text/50'}`}
                        >
                          {component.name}
                          {type === 'motherboard' &&
                            (component.socket || component.memory_type) && (
                              <span className="text-text font-normal">
                                {' '}
                                (
                                {[component.socket, component.memory_type]
                                  .filter(Boolean)
                                  .join(', ')}
                                )
                              </span>
                            )}
                          {type === 'case' && component.form_factor && (
                            <span className="text-text font-normal">
                              {' '}
                              ({component.form_factor})
                            </span>
                          )}
                        </span>
                        {component.compatible && component.needs_manual_check && (
                          <span
                            className="relative group/manual-check text-alert shrink-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <InfoIcon size={18} />
                            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 hidden group-hover/manual-check:block bg-primary text-white text-xs p-1 whitespace-nowrap z-10">
                              {t('componentCard.checkManually')}
                            </span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
                        <span className="text-muted text-sm whitespace-nowrap">
                          {component.out_of_stock
                            ? t('addComponent.outOfStock')
                            : !component.compatible
                              ? component.case_includes_psu
                                ? t('addComponent.caseIncludesPsu')
                                : t('addComponent.notCompatible')
                              : t('addComponent.startingFrom', {
                                  price: formatPrice(component.price),
                                })}
                        </span>
                        {component.compatible && !component.out_of_stock && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelect(component);
                            }}
                            title={t('addComponent.select')}
                            aria-label={t('addComponent.select')}
                            className="text-surface hover:text-white bg-primary hover:bg-primary-light transition cursor-pointer p-1"
                          >
                            <AddIcon size={20} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`bg-background transition-all overflow-hidden grid ${
                      expandedId === component.id ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="p-3">
                        <div className="flex flex-col xl:flex-row gap-4">
                          <div className="w-full xl:w-80 h-80 bg-surface shrink-0 flex items-center justify-center overflow-hidden">
                            {component.image_url && (
                              <img
                                src={component.image_url}
                                alt={component.name}
                                loading="lazy"
                                className="w-full h-full object-contain"
                              />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <ComponentInfo component={effectiveComponent} />
                          </div>
                        </div>

                        {component.listings?.length > 0 && (
                          <div className="mt-3">
                            <h3 className="text-sm font-semibold text-text mb-2">
                              {t('componentCard.availabilityTitle')}
                            </h3>
                            <ListingsTable
                              listings={component.listings}
                              breakpoint="xl"
                              onVisit={(e, listing) => {
                                e.stopPropagation();
                                handleChooseStore(component, listing.source);
                              }}
                            />
                          </div>
                        )}

                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleSelect(effectiveComponent)}
                            className="p-4 bg-primary text-white hover:bg-primary-light transition cursor-pointer flex-1"
                          >
                            {t('addComponent.select')}
                          </button>
                          <Link
                            to={detailHref(type, component.product_code)}
                            className="p-4 bg-surface text-text hover:bg-secondary-light transition cursor-pointer text-center"
                          >
                            {t('addComponent.viewDetails')}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {pagination && pagination.lastPage > 1 && (
        <PaginationControls pagination={pagination} setPage={setPage} />
      )}
    </div>
  );
};

export default React.memo(AddComponent);
