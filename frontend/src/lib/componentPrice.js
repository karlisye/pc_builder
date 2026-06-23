export const getCheapestPrice = (component) => {
  if (!component) return 0;

  if (component.listings?.length) {
    const cheapest = Math.min(
      ...component.listings.map((l) => parseFloat(l.price ?? Infinity)),
    );
    if (Number.isFinite(cheapest)) return cheapest;
  }

  return parseFloat(component.price ?? 0);
};
