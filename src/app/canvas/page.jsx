'use client';

import dynamic from 'next/dynamic';

// The canvas reads localStorage in its constructor and positions everything
// with pointer math, so it renders client-side only.
const CanvasApp = dynamic(() => import('../../App'), { ssr: false });

export default function CanvasPage() {
  return <CanvasApp />;
}
