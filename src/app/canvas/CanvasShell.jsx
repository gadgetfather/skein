'use client';

import dynamic from 'next/dynamic';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useCanvasSync } from '../../lib/supabase/useCanvasSync';
import AccountSync from '../../ui/AccountSync';

// Keep the canvas mounted in the shared layout while child routes change. This
// preserves pan/zoom, timers, and in-progress edits across drawer/map navigation.
const CanvasApp = dynamic(() => import('../../App'), { ssr: false });

export default function CanvasShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [cloudLoad, setCloudLoad] = useState(null);

  const accountPlacement = /^\/canvas\/interests\/[^/]+\/?$/.test(pathname)
    ? 'drawer'
    : /^\/canvas\/interests\/[^/]+\/details\/?$/.test(pathname)
      ? 'expanded'
      : pathname === '/canvas'
        ? 'canvas'
        : 'hidden';

  const receiveCloudDocument = useCallback(document => {
    setCloudLoad({ document, revision: Date.now() });
  }, []);

  const sync = useCanvasSync(receiveCloudDocument);

  const navigate = (href, { replace = false } = {}) => {
    if (replace) router.replace(href);
    else router.push(href);
  };

  return (
    <>
      <CanvasApp
        pathname={pathname}
        navigate={navigate}
        cloudDocument={cloudLoad?.document || null}
        cloudRevision={cloudLoad?.revision || null}
        onDocumentChange={sync.onDocumentChange}
        syncUserId={sync.user?.id || null}
      />
      <AccountSync sync={sync} placement={accountPlacement} />
      {children}
    </>
  );
}
