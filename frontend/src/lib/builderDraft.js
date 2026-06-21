const STORAGE_KEY = 'pcbuilder.draft.v1';
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

const EMPTY_SLOTS = {
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

const isEmptyDraft = (draft) => {
  const hasComponent = Object.values(draft.selectedComponents ?? {}).some((c) => c !== null);
  return !hasComponent && !draft.buildName && !draft.buildNotes && !draft.buildType;
};

export const loadDraft = () => {
  let raw;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }

  if (!raw) return null;

  let draft;
  try {
    draft = JSON.parse(raw);
  } catch {
    clearDraft();
    return null;
  }

  if (!draft.savedAt || Date.now() - draft.savedAt > MAX_AGE_MS) {
    clearDraft();
    return null;
  }

  return {
    buildId: draft.buildId ?? undefined,
    selectedComponents: { ...EMPTY_SLOTS, ...(draft.selectedComponents ?? {}) },
    buildName: draft.buildName ?? '',
    buildNotes: draft.buildNotes ?? '',
    buildType: draft.buildType ?? '',
  };
};

export const saveDraft = ({ buildId, selectedComponents, buildName, buildNotes, buildType }) => {
  const draft = { buildId, selectedComponents, buildName, buildNotes, buildType };

  if (isEmptyDraft(draft)) {
    clearDraft();
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...draft, savedAt: Date.now() }));
  } catch {
    // localStorage unavailable (e.g. private mode) — fail silently
  }
};

export const clearDraft = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
};
