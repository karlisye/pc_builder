import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Outlet, useNavigate, useParams, useSearchParams } from 'react-router';
import axios from 'axios';
import BuildDesc from '../Pages/Components/Builder/BuildDesc';
import BuildInfo from '../Pages/Components/Builder/BuildInfo';
import BuildGenerator from '../Pages/Components/Builder/BuildGenerator';
import ComponentFilters from '../Pages/Components/Builder/ComponentFilters';
import ComponentGenerator from '../Pages/Components/Builder/ComponentGenerator';
import SidePanel from '../Pages/Components/Common/SidePanel';
import { BuilderContext, BuildMetaContext } from '../Contexts/BuilderContext';
import { useToast } from '../Contexts/ToastContext';
import { loadDraft, saveDraft, clearDraft } from '../lib/builderDraft';
import { EMPTY_SLOTS, selectedProductCodes } from '../lib/buildSlots';
import { langFromParams, localePath } from '../lib/localePath';

const slotsFromBuild = (build) =>
  Object.fromEntries(
    Object.keys(EMPTY_SLOTS).map((slot) => [
      slot,
      (slot === 'case' ? build.pc_case : build[slot]) ?? null,
    ]),
  );

export default function BuilderLayout() {
  const { t } = useTranslation(['builder', 'common', 'pages']);
  const { addToast } = useToast();
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedComponents, setSelectedComponents] = useState({ ...EMPTY_SLOTS });
  const [buildId, setBuildId] = useState(undefined);
  const [buildName, setBuildName] = useState('');
  const [buildNotes, setBuildNotes] = useState('');
  const [warnings, setWarnings] = useState([]);
  const [notes, setNotes] = useState([]);
  const [buildIssues, setBuildIssues] = useState({});
  const [buildWarnings, setBuildWarnings] = useState({});
  const [validateFailed, setValidateFailed] = useState(false);
  const [buildType, setBuildType] = useState('');
  const [restoredDraft, setRestoredDraft] = useState(false);
  const [sidePanelExpanded, setSidePanelExpanded] = useState(false);

  const lang = langFromParams(params);
  const pickerType = params.type ?? null;
  const pickerOpen = Boolean(params.type) && !params.code;

  const buildParam = searchParams.get('build');
  const sharedParam = searchParams.get('shared');

  // Only ?build/?shared belong on intra-builder navigation; picker params
  // (page/sort/search/filters) must not leak onto other builder URLs.
  const buildSearch = useMemo(() => {
    const kept = new URLSearchParams();
    if (buildParam) kept.set('build', buildParam);
    if (sharedParam) kept.set('shared', sharedParam);
    const s = kept.toString();
    return s ? `?${s}` : '';
  }, [buildParam, sharedParam]);

  const builderIndexHref = useCallback(
    () => localePath(lang, '/builder') + buildSearch,
    [lang, buildSearch],
  );
  const pickerHref = useCallback(
    (slot) => localePath(lang, `/builder/components/${slot}`) + buildSearch,
    [lang, buildSearch],
  );
  const detailHref = useCallback(
    (slot, productCode) =>
      localePath(lang, `/builder/components/${slot}/${encodeURIComponent(productCode)}`) +
      buildSearch,
    [lang, buildSearch],
  );
  const closePicker = useCallback(() => {
    if (params.type) navigate(builderIndexHref());
  }, [params.type, navigate, builderIndexHref]);

  // Gates the draft autosave: 'blocked' until the URL/draft hydration has applied,
  // 'skip-once' swallows the save triggered by the hydration itself. Without this,
  // merely opening a shared/saved build link overwrites the user's local draft.
  const draftGateRef = useRef('blocked');
  const dirtyRef = useRef(false);

  useEffect(() => {
    draftGateRef.current = 'blocked';

    if (sharedParam) {
      axios
        .get('/api/builder', { params: { shared: sharedParam } })
        .then((res) => {
          const build = res.data.build;
          if (!build) {
            draftGateRef.current = 'open';
            addToast(t('sidePanel.loadBuildError'), { type: 'danger' });
            return;
          }

          draftGateRef.current = 'skip-once';
          setRestoredDraft(false);
          setSelectedComponents(slotsFromBuild(build));
          setBuildId(undefined);
          setBuildName(build.name ?? '');
          setBuildNotes(build.notes ?? '');
          setBuildType(build.type ?? '');
        })
        .catch(() => {
          draftGateRef.current = 'open';
          addToast(t('sidePanel.loadBuildError'), { type: 'danger' });
        });
      return;
    }

    if (!buildParam) {
      const draft = loadDraft();
      draftGateRef.current = 'skip-once';
      setRestoredDraft(Boolean(draft));
      setSelectedComponents(draft?.selectedComponents ?? { ...EMPTY_SLOTS });
      setBuildId(draft?.buildId ?? undefined);
      setBuildName(draft?.buildName ?? '');
      setBuildNotes(draft?.buildNotes ?? '');
      setBuildType(draft?.buildType ?? '');
      return;
    }

    axios
      .get('/api/builder', { params: { build: buildParam } })
      .then((res) => {
        const build = res.data.build;
        if (!build) {
          clearDraft();
          draftGateRef.current = 'skip-once';
          setRestoredDraft(false);
          setSelectedComponents({ ...EMPTY_SLOTS });
          setBuildId(undefined);
          setBuildName('');
          setBuildNotes('');
          setBuildType('');
          setSearchParams(
            (prev) => {
              const next = new URLSearchParams(prev);
              next.delete('build');
              return next;
            },
            { replace: true },
          );
          addToast(t('sidePanel.loadBuildError'), { type: 'danger' });
          return;
        }

        const draft = loadDraft();
        const hasMatchingDraft = draft && String(draft.buildId) === String(build.id);

        draftGateRef.current = 'skip-once';
        setRestoredDraft(Boolean(hasMatchingDraft));
        setSelectedComponents(hasMatchingDraft ? draft.selectedComponents : slotsFromBuild(build));
        setBuildId(build.id);
        setBuildName(hasMatchingDraft ? draft.buildName : (build.name ?? ''));
        setBuildNotes(hasMatchingDraft ? draft.buildNotes : (build.notes ?? ''));
        setBuildType(hasMatchingDraft ? draft.buildType : (build.type ?? ''));
      })
      .catch(() => {
        draftGateRef.current = 'open';
        addToast(t('sidePanel.loadBuildError'), { type: 'danger' });
      });
    // Deps are the two extracted params, not searchParams itself — picker
    // query churn (page/sort/filters) must not re-run hydration.
  }, [buildParam, sharedParam]);

  useEffect(() => {
    validateCompatibility();
  }, [selectedComponents]);

  const draftRef = useRef(null);
  draftRef.current = { buildId, selectedComponents, buildName, buildNotes, buildType };

  useEffect(() => {
    if (draftGateRef.current === 'blocked') return;
    if (draftGateRef.current === 'skip-once') {
      draftGateRef.current = 'open';
      return;
    }

    dirtyRef.current = true;
    const timer = setTimeout(() => {
      saveDraft(draftRef.current);
    }, 500);

    return () => clearTimeout(timer);
  }, [selectedComponents, buildName, buildNotes, buildType, buildId]);

  useEffect(() => {
    return () => {
      if (dirtyRef.current) saveDraft(draftRef.current);
    };
  }, []);

  // Sequence counter so a slow response can't overwrite the result of a newer one.
  const validateSeqRef = useRef(0);

  const validateCompatibility = async () => {
    const seq = ++validateSeqRef.current;
    const selected = selectedProductCodes(selectedComponents);

    if (Object.keys(selected).length === 0) {
      setBuildIssues({});
      setBuildWarnings({});
      setValidateFailed(false);
      return;
    }

    try {
      const res = await axios.post('/api/builder/validate', { selected });
      if (seq !== validateSeqRef.current) return;
      setBuildIssues(res.data.issues);
      setBuildWarnings(res.data.warnings ?? {});
      setValidateFailed(false);
    } catch (err) {
      if (seq !== validateSeqRef.current) return;
      // Keep the last known issues instead of clearing them — a failed check
      // must not make an incompatible build look clean.
      setValidateFailed(true);
      addToast(t('buildDesc.validateFailed'), { type: 'danger' });
    }
  };

  const handleNewBuild = () => {
    clearDraft();
    setRestoredDraft(false);
    setSelectedComponents({ ...EMPTY_SLOTS });
    setBuildId(undefined);
    setBuildName('');
    setBuildNotes('');
    setBuildType('');
    setWarnings([]);
    setNotes([]);
  };

  const builderValue = useMemo(
    () => ({
      pickerType,
      builderIndexHref,
      pickerHref,
      detailHref,
      closePicker,
      selectedComponents,
      setSelectedComponents,
      warnings,
      setWarnings,
      notes,
      setNotes,
      buildIssues,
      setBuildIssues,
      buildWarnings,
      setBuildWarnings,
      validateFailed,
      setSidePanelExpanded,
    }),
    [
      pickerType,
      builderIndexHref,
      pickerHref,
      detailHref,
      closePicker,
      selectedComponents,
      warnings,
      notes,
      buildIssues,
      buildWarnings,
      validateFailed,
    ],
  );

  const metaValue = useMemo(
    () => ({
      buildId,
      setBuildId,
      buildName,
      setBuildName,
      buildNotes,
      setBuildNotes,
      buildType,
      setBuildType,
      restoredDraft,
      setRestoredDraft,
    }),
    [buildId, buildName, buildNotes, buildType, restoredDraft],
  );

  return (
    <BuilderContext value={builderValue}>
      <BuildMetaContext value={metaValue}>
        <div className="h-full flex min-w-0">
          <SidePanel
            title={t('sidePanel.title')}
            expanded={sidePanelExpanded}
            onExpandedChange={setSidePanelExpanded}
            headerRight={
              (buildId || Object.values(selectedComponents).some((c) => c !== null)) && (
                <Link
                  className="px-6 py-2 border text-secondary-light cursor-pointer hover:text-muted transition text-sm"
                  to={localePath(lang, '/builder')}
                  onClick={handleNewBuild}
                >
                  {t('sidePanel.newBuild')}
                </Link>
              )
            }
          >
            {pickerOpen ? <ComponentFilters /> : <BuildDesc />}

            <BuildInfo />

            {pickerOpen ? <ComponentGenerator /> : <BuildGenerator />}

            <p className="text-muted text-sm pt-4 border-t mt-4 border-secondary">
              {t('sidePanel.guideHint')}{' '}
              <Link
                className="text-info/80 cursor-pointer hover:underline"
                to={localePath(lang, '/guide')}
              >
                {t('sidePanel.guideLink')}
              </Link>
              .
            </p>
          </SidePanel>

          <div className="flex-1 flex px-4 py-6 min-w-0">
            <Outlet />
          </div>
        </div>
      </BuildMetaContext>
    </BuilderContext>
  );
}
