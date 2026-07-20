export const CANVAS_DOCUMENT_VERSION = 1;

const STORAGE_KEYS = {
  nodes: 'skein.nodes.v1',
  edges: 'skein.edges.v1',
  groups: 'skein.groups.v1',
  sync: 'skein.sync.v1',
};

const emptyGroups = () => ({ customGroups: [], emptyFrames: {}, labelOverrides: {} });

function parseStored(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const value = JSON.parse(window.localStorage.getItem(key));
    return value == null ? fallback : value;
  } catch {
    return fallback;
  }
}

export function normalizeCanvasDocument(value) {
  const document = value && typeof value === 'object' ? value : {};
  const groups = document.groups && typeof document.groups === 'object' ? document.groups : {};
  return {
    version: CANVAS_DOCUMENT_VERSION,
    nodes: Array.isArray(document.nodes) ? document.nodes : [],
    edges: Array.isArray(document.edges) ? document.edges : [],
    groups: {
      customGroups: Array.isArray(groups.customGroups) ? groups.customGroups : [],
      emptyFrames: groups.emptyFrames && typeof groups.emptyFrames === 'object' ? groups.emptyFrames : {},
      labelOverrides: groups.labelOverrides && typeof groups.labelOverrides === 'object' ? groups.labelOverrides : {},
    },
  };
}

export function readLocalCanvasDocument() {
  return normalizeCanvasDocument({
    nodes: parseStored(STORAGE_KEYS.nodes, []),
    edges: parseStored(STORAGE_KEYS.edges, []),
    groups: parseStored(STORAGE_KEYS.groups, emptyGroups()),
  });
}

export function writeLocalCanvasDocument(value) {
  if (typeof window === 'undefined') return;
  const document = normalizeCanvasDocument(value);
  window.localStorage.setItem(STORAGE_KEYS.nodes, JSON.stringify(document.nodes));
  window.localStorage.setItem(STORAGE_KEYS.edges, JSON.stringify(document.edges));
  window.localStorage.setItem(STORAGE_KEYS.groups, JSON.stringify(document.groups));
}

export function canvasDocumentFromState(state) {
  return normalizeCanvasDocument({
    nodes: state.nodes,
    edges: state.edges,
    groups: {
      customGroups: state.customGroups,
      emptyFrames: state.emptyFrames,
      labelOverrides: state.labelOverrides,
    },
  });
}

export function isCanvasDocumentEmpty(document) {
  const value = normalizeCanvasDocument(document);
  return value.nodes.length === 0 && value.edges.length === 0 && value.groups.customGroups.length === 0;
}

export function canvasDocumentHash(document) {
  const input = JSON.stringify(normalizeCanvasDocument(document));
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

export function readSyncMeta() {
  return parseStored(STORAGE_KEYS.sync, null);
}

export function writeSyncMeta(meta) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEYS.sync, JSON.stringify(meta));
}

