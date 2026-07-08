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
