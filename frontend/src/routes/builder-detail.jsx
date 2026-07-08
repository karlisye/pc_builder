import { data, Link, useLoaderData, useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import ComponentDetail from '../Pages/Components/Common/ComponentDetail';
import { useBuilder } from '../Contexts/BuilderContext';
import { apiFetch } from '../lib/api.server';
import { EMPTY_SLOTS } from '../lib/buildSlots';
import { langFromParams, localePath } from '../lib/localePath';
import { pagesSeo, seoMeta } from '../lib/seoMeta';

const SITE_URL = import.meta.env.VITE_SITE_URL ?? 'https://pcbuilder.lv';

export async function loader({ params }) {
  if (!(params.type in EMPTY_SLOTS)) throw data(null, { status: 404 });

  const component = await apiFetch(
    `/api/components/${params.type}/${encodeURIComponent(params.code)}`,
    { lang: langFromParams(params) },
  );
  return { component };
}

export default function BuilderDetail() {
  const { component } = useLoaderData();
  const params = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation(['builder', 'common']);
  const { selectedComponents, setSelectedComponents, builderIndexHref, pickerHref } = useBuilder();
  const type = params.type;

  const isSelected = selectedComponents[type]?.product_code === component.product_code;

  const handleSelect = () => {
    setSelectedComponents((prev) => ({ ...prev, [type]: component }));
    navigate(builderIndexHref());
  };

  const handleRemove = () => {
    setSelectedComponents((prev) => ({ ...prev, [type]: null }));
    navigate(builderIndexHref());
  };

  return (
    <ComponentDetail
      component={component}
      title={t(`common:components.${type}`)}
      onClose={() => navigate(builderIndexHref())}
      actions={
        isSelected ? (
          <>
            <Link
              className="px-8 py-4 bg-primary text-white hover:bg-primary-light transition cursor-pointer flex-1 sm:flex-none text-center"
              to={pickerHref(type)}
            >
              {t('componentCard.replace')}
            </Link>
            <button
              className="px-8 py-4 bg-surface text-text hover:bg-danger/50 transition cursor-pointer flex-1 sm:flex-none"
              onClick={handleRemove}
            >
              {t('componentCard.remove')}
            </button>
          </>
        ) : (
          <button
            className="px-8 py-4 bg-primary text-white hover:bg-primary-light transition cursor-pointer flex-1 sm:flex-none"
            onClick={handleSelect}
          >
            {t('addComponent.select')}
          </button>
        )
      }
    />
  );
}

export const meta = ({ data: loaderData, params }) => {
  const lang = langFromParams(params);
  if (!loaderData?.component) {
    return seoMeta({ lang, path: '/builder', ...pagesSeo(lang, 'notFound'), noindex: true });
  }

  const { component } = loaderData;
  const path = `/builder/components/${params.type}/${encodeURIComponent(params.code)}`;
  const template = pagesSeo(lang, 'componentDetail');
  const listings = component.listings ?? [];
  const prices = listings.map((l) => Number(l.price)).filter((p) => p > 0);

  const tags = seoMeta({
    lang,
    path,
    title: template.title?.replace('{{name}}', component.name),
    description: template.description?.replace('{{name}}', component.name),
    image: component.image_url || undefined,
  });

  if (prices.length > 0) {
    tags.push({
      'script:ld+json': {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: component.name,
        ...(component.image_url ? { image: component.image_url } : {}),
        sku: component.product_code,
        ...(component.brand ? { brand: { '@type': 'Brand', name: component.brand } } : {}),
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'EUR',
          lowPrice: Math.min(...prices),
          highPrice: Math.max(...prices),
          offerCount: listings.length,
          offers: listings.map((l) => ({
            '@type': 'Offer',
            price: l.price,
            priceCurrency: 'EUR',
            url: l.url,
            availability: ['in_stock', 'orderable'].includes(l.stock_status)
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
            seller: { '@type': 'Organization', name: l.source },
          })),
        },
      },
    });
  }

  tags.push({
    'script:ld+json': {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Builder',
          item: `${SITE_URL}${localePath(lang, '/builder')}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: params.type.toUpperCase(),
          item: `${SITE_URL}${localePath(lang, `/builder/components/${params.type}`)}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: component.name,
          item: `${SITE_URL}${localePath(lang, path)}`,
        },
      ],
    },
  });

  return tags;
};
