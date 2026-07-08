import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ComponentCard from './Components/Builder/ComponentCard';
import ComponentDetail from './Components/Common/ComponentDetail';
import BuildDesc from './Components/Builder/BuildDesc';
import { BuilderContext, BuildMetaContext, PickerProvider } from '../Contexts/BuilderContext';
import AddComponent from './Components/Builder/AddComponent';
import ComponentFilters from './Components/Builder/ComponentFilters';
import BuildInfo from './Components/Builder/BuildInfo';
import { Link, useSearchParams } from 'react-router-dom';
import BuildGenerator from './Components/Builder/BuildGenerator';
import ComponentGenerator from './Components/Builder/ComponentGenerator';
import SidePanel from './Components/Common/SidePanel';
import axios from 'axios';
import { loadDraft, saveDraft, clearDraft } from '../lib/builderDraft';
import { EMPTY_SLOTS, selectedProductCodes } from '../lib/buildSlots';
import { useToast } from '../Contexts/ToastContext';
import Seo from './Components/Common/Seo';

const slotsFromBuild = (build) =>
  Object.fromEntries(
    Object.keys(EMPTY_SLOTS).map((slot) => [
      slot,
      (slot === 'case' ? build.pc_case : build[slot]) ?? null,
    ]),
  );

const Builder = () => {
  const { t } = useTranslation(['builder', 'common', 'pages']);
  const { addToast } = useToast();
  const [searchParams] = useSearchParams();
  const [currentCompToAdd, setCurrentCompToAdd] = useState(null);
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
  const [viewingComponent, setViewingComponent] = useState(null);

  // Gates the draft autosave: 'blocked' until the URL/draft hydration has applied,
  // 'skip-once' swallows the save triggered by the hydration itself. Without this,
  // merely opening a shared/saved build link overwrites the user's local draft.
  const draftGateRef = useRef('blocked');
  const dirtyRef = useRef(false);

  useEffect(() => {
    const buildParam = searchParams.get('build');
    const sharedParam = searchParams.get('shared');

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
          draftGateRef.current = 'open';
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
  }, [searchParams]);

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
      console.error(err);
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
    setViewingComponent(null);
  };

  const builderValue = useMemo(
    () => ({
      currentCompToAdd,
      setCurrentCompToAdd,
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
      viewingComponent,
      setViewingComponent,
    }),
    [
      currentCompToAdd,
      selectedComponents,
      warnings,
      notes,
      buildIssues,
      buildWarnings,
      validateFailed,
      viewingComponent,
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
        <PickerProvider>
          <Seo
            title={t('pages:seo.builder.title')}
            description={t('pages:seo.builder.description')}
          />
          <div className="h-full flex min-w-0">
            <SidePanel
              title={t('sidePanel.title')}
              headerRight={
                (buildId || Object.values(selectedComponents).some((c) => c !== null)) && (
                  <Link
                    className="px-6 py-2 border text-secondary-light cursor-pointer hover:text-muted transition text-sm"
                    to="/builder"
                    onClick={handleNewBuild}
                  >
                    {t('sidePanel.newBuild')}
                  </Link>
                )
              }
            >
              {currentCompToAdd ? <ComponentFilters /> : <BuildDesc />}

              <BuildInfo />

              {currentCompToAdd ? <ComponentGenerator /> : <BuildGenerator />}

              <p className="text-muted text-sm pt-4 border-t mt-4 border-secondary">
                {t('sidePanel.guideHint')}{' '}
                <Link className="text-info/80 cursor-pointer hover:underline" to="/guide">
                  {t('sidePanel.guideLink')}
                </Link>
                .
              </p>
            </SidePanel>

            <div className="flex-1 flex px-4 py-6 min-w-0">
              {currentCompToAdd ? (
                <AddComponent />
              ) : viewingComponent ? (
                <ComponentDetail
                  component={viewingComponent.component}
                  title={t(`common:components.${viewingComponent.name.toLowerCase()}`)}
                  onClose={() => setViewingComponent(null)}
                  actions={
                    <>
                      <button
                        className="px-8 py-4 bg-primary text-white hover:bg-primary-light transition cursor-pointer flex-1 sm:flex-none"
                        onClick={() => {
                          setCurrentCompToAdd(viewingComponent.name);
                          setViewingComponent(null);
                        }}
                      >
                        {t('componentCard.replace')}
                      </button>
                      <button
                        className="px-8 py-4 bg-surface text-text hover:bg-danger/50 transition cursor-pointer flex-1 sm:flex-none"
                        onClick={() => {
                          setSelectedComponents((prev) => ({
                            ...prev,
                            [viewingComponent.name.toLowerCase()]: null,
                          }));
                          setViewingComponent(null);
                        }}
                      >
                        {t('componentCard.remove')}
                      </button>
                    </>
                  }
                />
              ) : (
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
              )}
            </div>
          </div>
        </PickerProvider>
      </BuildMetaContext>
    </BuilderContext>
  );
};

export default Builder;
