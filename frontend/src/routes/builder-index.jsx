import ComponentCard from '../Pages/Components/Builder/ComponentCard';
import { useBuilder } from '../Contexts/BuilderContext';
import { langFromParams } from '../lib/localePath';
import { pagesSeo, seoMeta } from '../lib/seoMeta';

export default function BuilderIndex() {
  const { selectedComponents } = useBuilder();

  return (
    <div className="flex flex-wrap mb-auto gap-8 justify-center">
      <ComponentCard name="CPU" component={selectedComponents.cpu} />
      <ComponentCard name="Motherboard" component={selectedComponents.motherboard} />
      <ComponentCard name="RAM" component={selectedComponents.ram} />
      <ComponentCard name="GPU" component={selectedComponents.gpu} />
      <ComponentCard name="PSU" component={selectedComponents.psu} />
      <ComponentCard name="SSD" component={selectedComponents.ssd} />
      <ComponentCard name="Case" component={selectedComponents.case} />
      <ComponentCard name="Cooler" component={selectedComponents.cooler} />
      <ComponentCard name="HDD" component={selectedComponents.hdd} />
      <ComponentCard name="Fan" component={selectedComponents.fan} />
    </div>
  );
}

export const meta = ({ params }) => {
  const lang = langFromParams(params);
  return seoMeta({ lang, path: '/builder', ...pagesSeo(lang, 'builder') });
};
