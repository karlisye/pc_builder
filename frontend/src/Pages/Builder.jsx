import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ComponentCard from './Components/Builder/ComponentCard';
import ComponentDetail from './Components/Common/ComponentDetail';
import BuildDesc from './Components/Builder/BuildDesc';
import { BuilderContext } from '../Contexts/BuilderContext';
import AddComponent from './Components/Builder/AddComponent';
import ComponentFilters from './Components/Builder/ComponentFilters';
import BuildInfo from './Components/Builder/BuildInfo';
import { Link, useSearchParams } from 'react-router-dom';
import BuildGenerator from './Components/Builder/BuildGenerator';
import ComponentGenerator from './Components/Builder/ComponentGenerator';
import SidePanel from './Components/Common/SidePanel';
import axios from 'axios';
import { loadDraft, saveDraft, clearDraft } from '../lib/builderDraft';
import { useToast } from '../Contexts/ToastContext';

const Builder = () => {
  const { t } = useTranslation(['builder', 'common']);
  const { addToast } = useToast();
  const [searchParams] = useSearchParams();
  const [currentCompToAdd, setCurrentCompToAdd] = useState(null);
  const [selectedComponents, setSelectedComponents] = useState({
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
  });
  const [buildId, setBuildId] = useState(undefined);
  const [buildName, setBuildName] = useState('');
  const [buildNotes, setBuildNotes] = useState('');
  const [warnings, setWarnings] = useState([]);
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [buildIssues, setBuildIssues] = useState({});
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState('price_asc');
  const [buildType, setBuildType] = useState('');
  const [restoredDraft, setRestoredDraft] = useState(false);
  const [viewingComponent, setViewingComponent] = useState(null);

  useEffect(() => {
    const buildParam = searchParams.get('build');

    if (!buildParam) {
      const draft = loadDraft();
      setRestoredDraft(Boolean(draft));
      setSelectedComponents(
        draft?.selectedComponents ?? {
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
        },
      );
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
          addToast(t('sidePanel.loadBuildError'), { type: 'danger' });
          return;
        }

        const draft = loadDraft();
        const hasMatchingDraft = draft && String(draft.buildId) === String(build.id);

        setRestoredDraft(Boolean(hasMatchingDraft));
        setSelectedComponents(
          hasMatchingDraft
            ? draft.selectedComponents
            : {
                cpu: build.cpu ?? null,
                motherboard: build.motherboard ?? null,
                ram: build.ram ?? null,
                gpu: build.gpu ?? null,
                psu: build.psu ?? null,
                ssd: build.ssd ?? null,
                hdd: build.hdd ?? null,
                case: build.pc_case ?? null,
                fan: build.fan ?? null,
                cooler: build.cooler ?? null,
              },
        );
        setBuildId(build.id);
        setBuildName(hasMatchingDraft ? draft.buildName : (build.name ?? ''));
        setBuildNotes(hasMatchingDraft ? draft.buildNotes : (build.notes ?? ''));
        setBuildType(hasMatchingDraft ? draft.buildType : (build.type ?? ''));
      })
      .catch(() => {
        addToast(t('sidePanel.loadBuildError'), { type: 'danger' });
      });
  }, [searchParams]);

  useEffect(() => {
    validateCompatibility();
  }, [selectedComponents]);

  const draftRef = useRef(null);
  draftRef.current = { buildId, selectedComponents, buildName, buildNotes, buildType };

  useEffect(() => {
    const timer = setTimeout(() => {
      saveDraft(draftRef.current);
    }, 500);

    return () => clearTimeout(timer);
  }, [selectedComponents, buildName, buildNotes, buildType, buildId]);

  useEffect(() => {
    return () => saveDraft(draftRef.current);
  }, []);

  const validateCompatibility = async () => {
    const selected = Object.fromEntries(
      Object.entries(selectedComponents)
        .filter(([_, c]) => c !== null)
        .map(([type, c]) => [type, c.product_code]),
    );

    if (Object.keys(selected).length === 0) {
      setBuildIssues({});
      return;
    }

    try {
      const res = await axios.post('/api/builder/validate', { selected });
      setBuildIssues(res.data.issues);
    } catch (err) {
      setBuildIssues({});
      console.error(err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleNewBuild = () => {
    clearDraft();
    setRestoredDraft(false);
    setSelectedComponents({
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
    });
    setBuildId(undefined);
    setBuildName('');
    setBuildNotes('');
    setBuildType('');
    setViewingComponent(null);
  };

  return (
    <BuilderContext
      value={{
        currentCompToAdd,
        setCurrentCompToAdd,
        selectedComponents,
        setSelectedComponents,
        search,
        setSearch,
        filters,
        setFilters,
        sort,
        setSort,
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
        debouncedSearch,
        setDebouncedSearch,
        warnings,
        setWarnings,
        notes,
        setNotes,
        buildIssues,
        setBuildIssues,
        viewingComponent,
        setViewingComponent,
      }}
    >
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
                      setFilters({});
                      setSearch('');
                      setSort('price_asc');
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
              <ComponentCard name="HDD" component={selectedComponents.hdd} />
              <ComponentCard name="Case" component={selectedComponents.case} />
              <ComponentCard name="Fan" component={selectedComponents.fan} />
              <ComponentCard name="Cooler" component={selectedComponents.cooler} />
            </div>
          )}
        </div>
      </div>
    </BuilderContext>
  );
};

export default Builder;
