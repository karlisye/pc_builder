import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBuilder } from '../../../Contexts/BuilderContext';
import axios from 'axios';
import AddComponentSkeleton from '../Skeletons/AddComponentSkeleton';
import ComponentInfo from '../Common/ComponentInfo';
import { AddIcon, CloseIcon } from '../Common/Icons';
import PaginationControls from '../Common/PaginationControls';

const AddComponent = () => {
  const { t } = useTranslation(['builder', 'common']);
  const {
    currentCompToAdd,
    setCurrentCompToAdd,
    selectedComponents,
    search,
    filters,
    sort,
    setSelectedComponents,
    debouncedSearch,
  } = useBuilder();
  const [components, setComponents] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState(null);
  const [chosenSources, setChosenSources] = useState({});

  useEffect(() => {
    if (!currentCompToAdd) return;
    setPage(1);
  }, [currentCompToAdd, debouncedSearch, filters, sort]);

  useEffect(() => {
    if (!currentCompToAdd) return;
    fetchComponents(page);
  }, [currentCompToAdd, debouncedSearch, filters, sort, page]);

  const fetchComponents = async (pageNum = 1) => {
    setLoading(true);
    setError('');

    try {
      const selected = Object.fromEntries(
        Object.entries(selectedComponents)
          .filter(([_, component]) => component !== null)
          .map(([type, component]) => [type, component.product_code]),
      );

      const res = await axios.get(`/api/components/${currentCompToAdd.toLowerCase()}`, {
        params: {
          selected: JSON.stringify(selected),
          page: pageNum,
          search: search || undefined,
          sort: sort || undefined,
          ...filters,
        },
      });

      setComponents(res.data.data);
      setPagination({
        currentPage: res.data.current_page,
        lastPage: res.data.last_page,
        total: res.data.total,
      });
    } catch (err) {
      setError(err.response?.data?.error ?? t('addComponent.failedToFetch'));
    } finally {
      setLoading(false);
    }
  };

  const handleLeave = () => {
    setCurrentCompToAdd(null);
  };

  const handleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleChooseStore = (component, source) => {
    setChosenSources((prev) => ({ ...prev, [component.product_code]: source }));
  };

  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  const handleSelect = (component) => {
    setSelectedComponents((prev) => ({
      ...prev,
      [currentCompToAdd.toLowerCase()]: component,
    }));
    setCurrentCompToAdd(null);
  };

  return (
    <div className="border border-border w-full hover:bg-background transition p-4 mb-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-semibold text-text">
          {t('addComponent.title', {
            component: t(`common:components.${currentCompToAdd?.toLowerCase()}`),
          })}
        </h2>
        <button
          className="w-10 h-10 text-muted hover:cursor-pointer bg-surface hover:bg-secondary-light transition p-2"
          onClick={handleLeave}
        >
          <CloseIcon />
        </button>
      </div>

      {loading && <AddComponentSkeleton />}
      {error && <p className="text-danger mt-4">{error}</p>}

      {!loading && !error && (
        <div className="mt-4 flex flex-col gap-2">
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
                <div key={component.id} className="border border-border">
                  <div
                    key={component.id}
                    onClick={() => handleExpand(component.id)}
                    className={`flex justify-between items-center p-3 cursor-pointer transition ${component.compatible && !component.out_of_stock ? 'bg-surface hover:bg-secondary-light' : 'bg-muted/50 hover:bg-muted/80'}`}
                  >
                    <span
                      className={`font-medium ${component.compatible && !component.out_of_stock ? 'text-text' : 'text-text/50'}`}
                    >
                      {component.name}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="text-muted">
                        {component.out_of_stock
                          ? t('addComponent.outOfStock')
                          : !component.compatible
                            ? t('addComponent.notCompatible')
                            : t('addComponent.startingFrom', { price: component.price })}
                      </span>
                      {component.compatible && !component.out_of_stock && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelect(component);
                          }}
                          title={t('addComponent.select')}
                          className="text-surface hover:text-white bg-primary hover:bg-primary-light transition cursor-pointer p-1"
                        >
                          <AddIcon size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div
                    className={`bg-background transition-all overflow-hidden grid ${
                      expandedId === component.id ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="p-3">
                        <ComponentInfo component={effectiveComponent} />

                        {component.listings?.length > 0 && (
                          <div className="mt-3">
                            <h3 className="text-sm font-semibold text-text mb-2">
                              {t('componentCard.availabilityTitle')}
                            </h3>
                            <div className="flex flex-col gap-2">
                              {component.listings.map((listing) => (
                                <div
                                  key={listing.source}
                                  className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] items-center gap-2 border border-border bg-surface p-3 transition"
                                >
                                  <span className="text-text font-medium">
                                    {capitalize(listing.source)}
                                  </span>
                                  <span className="text-muted">€{listing.price}</span>
                                  <span className="text-muted">
                                    {listing.stock_status === 'in_stock'
                                      ? t('componentCard.inStockWithQty', {
                                          count: listing.stock_quantity,
                                        })
                                      : listing.stock_status === 'orderable'
                                        ? t('componentCard.orderableWithQty', {
                                            count: listing.stock_quantity,
                                          })
                                        : t('componentCard.outOfStock')}
                                  </span>
                                  <span className="text-muted text-sm">
                                    {listing.scraped_at
                                      ? t('componentCard.lastScraped', {
                                          date: new Date(listing.scraped_at).toLocaleDateString(),
                                        })
                                      : t('componentCard.neverScraped')}
                                  </span>
                                  <a
                                    href={listing.url}
                                    target="_blank"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleChooseStore(component, listing.source);
                                    }}
                                    className="px-4 py-2 bg-primary text-white text-sm hover:bg-primary-light transition cursor-pointer text-center"
                                  >
                                    {t('componentCard.seeInStore')}
                                  </a>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleSelect(effectiveComponent)}
                            className="p-4 bg-primary text-white hover:bg-primary-light transition cursor-pointer flex-1"
                          >
                            {t('addComponent.select')}
                          </button>
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

export default AddComponent;
