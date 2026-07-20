'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  canvasDocumentHash,
  isCanvasDocumentEmpty,
  normalizeCanvasDocument,
  readLocalCanvasDocument,
  readSyncMeta,
  writeLocalCanvasDocument,
  writeSyncMeta,
} from '../canvas-document';
import { getSupabaseBrowserClient, isSupabaseConfigured } from './client';

const initialState = {
  ready: false,
  user: null,
  status: isSupabaseConfigured ? 'loading' : 'local',
  error: '',
  linkSent: false,
  conflict: null,
  lastSyncedAt: null,
};

export function useCanvasSync(onCloudDocument) {
  const [state, setState] = useState(initialState);
  const userRef = useRef(null);
  const conflictRef = useRef(null);
  const hydratedUserRef = useRef(null);
  const reconcilingUserRef = useRef(null);
  const saveTimerRef = useRef(null);
  const latestDocumentRef = useRef(null);
  const aliveRef = useRef(true);

  const applyCloudDocument = useCallback((document, userId, updatedAt) => {
    const normalized = normalizeCanvasDocument(document);
    const hash = canvasDocumentHash(normalized);
    writeLocalCanvasDocument(normalized);
    writeSyncMeta({ userId, lastSyncedHash: hash, lastRemoteUpdatedAt: updatedAt || null });
    onCloudDocument(normalized);
    if (aliveRef.current) {
      setState(current => ({ ...current, status: 'synced', error: '', conflict: null, lastSyncedAt: updatedAt || new Date().toISOString() }));
    }
    conflictRef.current = null;
  }, [onCloudDocument]);

  const saveDocument = useCallback(async (document, explicitUser = null) => {
    const supabase = getSupabaseBrowserClient();
    const user = explicitUser || userRef.current;
    if (!supabase || !user) return null;
    const normalized = normalizeCanvasDocument(document);
    const hash = canvasDocumentHash(normalized);
    if (aliveRef.current) setState(current => ({ ...current, status: 'saving', error: '' }));
    const { data, error } = await supabase
      .from('skein_canvases')
      .upsert({ user_id: user.id, document: normalized }, { onConflict: 'user_id' })
      .select('updated_at')
      .single();
    if (error) {
      if (aliveRef.current) setState(current => ({ ...current, status: 'error', error: error.message }));
      return null;
    }
    writeSyncMeta({ userId: user.id, lastSyncedHash: hash, lastRemoteUpdatedAt: data.updated_at });
    if (aliveRef.current) setState(current => ({ ...current, status: 'synced', error: '', lastSyncedAt: data.updated_at }));
    return data.updated_at;
  }, []);

  const reconcileUser = useCallback(async user => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase || !user) return;
    if (reconcilingUserRef.current === user.id) return;
    reconcilingUserRef.current = user.id;
    try {
    if (saveTimerRef.current) { clearTimeout(saveTimerRef.current); saveTimerRef.current = null; }
    hydratedUserRef.current = null;
    if (aliveRef.current) setState(current => ({ ...current, user, status: 'loading', error: '', conflict: null, linkSent: false }));
    const localDocument = readLocalCanvasDocument();
    const localHash = canvasDocumentHash(localDocument);
    const meta = readSyncMeta();
    const { data, error } = await supabase
      .from('skein_canvases')
      .select('document, updated_at')
      .eq('user_id', user.id)
      .maybeSingle();
    if (error) {
      if (aliveRef.current) setState(current => ({ ...current, ready: true, status: 'error', error: error.message }));
      return;
    }
    if (!data) {
      if (meta?.userId && meta.userId !== user.id && !isCanvasDocumentEmpty(localDocument)) {
        const cloudDocument = normalizeCanvasDocument(null);
        const conflict = { localDocument, cloudDocument, cloudUpdatedAt: null };
        conflictRef.current = conflict;
        hydratedUserRef.current = user.id;
        if (aliveRef.current) setState(current => ({ ...current, ready: true, status: 'conflict', conflict, error: '' }));
        return;
      }
      await saveDocument(localDocument, user);
      hydratedUserRef.current = user.id;
      if (aliveRef.current) setState(current => ({ ...current, ready: true }));
      return;
    }

    const cloudDocument = normalizeCanvasDocument(data.document);
    const cloudHash = canvasDocumentHash(cloudDocument);
    if (localHash === cloudHash) {
      writeSyncMeta({ userId: user.id, lastSyncedHash: cloudHash, lastRemoteUpdatedAt: data.updated_at });
      hydratedUserRef.current = user.id;
      if (aliveRef.current) setState(current => ({ ...current, ready: true, status: 'synced', lastSyncedAt: data.updated_at }));
      return;
    }
    if (isCanvasDocumentEmpty(localDocument) || (meta?.userId === user.id && meta.lastSyncedHash === localHash)) {
      applyCloudDocument(cloudDocument, user.id, data.updated_at);
      hydratedUserRef.current = user.id;
      if (aliveRef.current) setState(current => ({ ...current, ready: true }));
      return;
    }
    if (meta?.userId === user.id && meta.lastSyncedHash === cloudHash) {
      await saveDocument(localDocument, user);
      hydratedUserRef.current = user.id;
      if (aliveRef.current) setState(current => ({ ...current, ready: true }));
      return;
    }

    const conflict = { localDocument, cloudDocument, cloudUpdatedAt: data.updated_at };
    conflictRef.current = conflict;
    hydratedUserRef.current = user.id;
    if (aliveRef.current) {
      setState(current => ({ ...current, ready: true, status: 'conflict', conflict, error: '' }));
    }
    } finally {
      if (reconcilingUserRef.current === user.id) reconcilingUserRef.current = null;
    }
  }, [applyCloudDocument, saveDocument]);

  useEffect(() => {
    aliveRef.current = true;
    if (!isSupabaseConfigured) {
      setState(current => ({ ...current, ready: true, status: 'local' }));
      return () => { aliveRef.current = false; };
    }
    const supabase = getSupabaseBrowserClient();
    let cancelled = false;

    const boot = async () => {
      const params = new URLSearchParams(window.location.search);
      const tokenHash = params.get('token_hash');
      if (tokenHash) {
        const type = params.get('type') || 'email';
        const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
        if (error && aliveRef.current) setState(current => ({ ...current, status: 'error', error: error.message }));
        const cleanUrl = `${window.location.pathname}${window.location.hash || ''}`;
        window.history.replaceState({}, document.title, cleanUrl);
      }
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      const user = data.session?.user || null;
      userRef.current = user;
      if (user) await reconcileUser(user);
      else if (aliveRef.current) setState(current => ({ ...current, ready: true, user: null, status: 'local' }));
    };

    boot();
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      const user = session?.user || null;
      userRef.current = user;
      if (!user) {
        if (saveTimerRef.current) { clearTimeout(saveTimerRef.current); saveTimerRef.current = null; }
        hydratedUserRef.current = null;
        conflictRef.current = null;
        if (aliveRef.current) setState(current => ({ ...current, ready: true, user: null, status: 'local', conflict: null, linkSent: false, error: '' }));
        return;
      }
      if (event === 'SIGNED_IN' && hydratedUserRef.current !== user.id) reconcileUser(user);
    });

    return () => {
      cancelled = true;
      aliveRef.current = false;
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      listener.subscription.unsubscribe();
    };
  }, [reconcileUser]);

  const onDocumentChange = useCallback(document => {
    const user = userRef.current;
    if (!user || hydratedUserRef.current !== user.id || conflictRef.current) return;
    const normalized = normalizeCanvasDocument(document);
    latestDocumentRef.current = normalized;
    const hash = canvasDocumentHash(normalized);
    const meta = readSyncMeta();
    if (meta?.userId === user.id && meta.lastSyncedHash === hash) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    if (aliveRef.current) setState(current => ({ ...current, status: 'saving', error: '' }));
    saveTimerRef.current = setTimeout(() => saveDocument(latestDocumentRef.current), 900);
  }, [saveDocument]);

  const signIn = useCallback(async email => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return { error: new Error('Supabase is not configured.') };
    setState(current => ({ ...current, status: 'loading', error: '', linkSent: false }));
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/canvas` },
    });
    if (error) {
      setState(current => ({ ...current, status: 'error', error: error.message }));
      return { error };
    }
    setState(current => ({ ...current, status: 'local', linkSent: true, error: '' }));
    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    await supabase.auth.signOut({ scope: 'local' });
  }, []);

  const resolveConflict = useCallback(async choice => {
    const conflict = conflictRef.current;
    const user = userRef.current;
    if (!conflict || !user) return;
    if (choice === 'cloud') applyCloudDocument(conflict.cloudDocument, user.id, conflict.cloudUpdatedAt);
    else {
      const savedAt = await saveDocument(conflict.localDocument, user);
      if (!savedAt) return;
    }
    conflictRef.current = null;
    if (aliveRef.current) setState(current => ({ ...current, conflict: null, status: 'synced' }));
  }, [applyCloudDocument, saveDocument]);

  return {
    ...state,
    configured: isSupabaseConfigured,
    onDocumentChange,
    signIn,
    signOut,
    resolveConflict,
  };
}
