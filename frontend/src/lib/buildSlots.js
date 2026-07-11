export const EMPTY_SLOTS = {
  cpu: null,
  motherboard: null,
  ram: null,
  gpu: null,
  psu: null,
  ssd: null,
  hdd: null,
  case: null,
  fan: null,
  cooler: null,
};

export const isSlotOptional = (slot, selectedComponents) => {
  const key = slot.toLowerCase();
  if (['cpu', 'motherboard', 'ram', 'ssd', 'case'].includes(key)) return false;
  if (['hdd', 'fan'].includes(key)) return true;
  if (key === 'gpu') return !!selectedComponents.cpu?.integrated_graphics;
  if (key === 'cooler') return !!selectedComponents.cpu?.cooler_included;
  if (key === 'psu') return !!selectedComponents.case?.psu_included;
  return false;
};

export const missingRequiredSlots = (selectedComponents) =>
  Object.entries(selectedComponents)
    .filter(([slot, component]) => component === null && !isSlotOptional(slot, selectedComponents))
    .map(([slot]) => slot);

export const selectedProductCodes = (selectedComponents) =>
  Object.fromEntries(
    Object.entries(selectedComponents)
      .filter(([, component]) => component !== null)
      .map(([type, component]) => [type, component.product_code]),
  );

export const hasIncompatibleSelection = (selectedComponents, buildIssues = {}) =>
  Object.values(selectedComponents).some(
    (component) => component !== null && component.compatible === false,
  ) || Object.keys(buildIssues).length > 0;

export const needsManualCheckSelection = (selectedComponents) =>
  Object.values(selectedComponents).some(
    (component) => component !== null && component.needs_manual_check === true,
  );
