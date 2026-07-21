'use client';

import { LazyMotion, MotionConfig, domAnimation } from 'motion/react';

export default function MotionProvider({ children }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig
        reducedMotion="user"
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
