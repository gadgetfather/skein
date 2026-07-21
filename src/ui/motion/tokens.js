export const motionEase = {
  out: [0.22, 1, 0.36, 1],
  in: [0.4, 0, 1, 1],
};

export const motionDuration = {
  fast: 0.14,
  base: 0.22,
  panel: 0.28,
};

export const fadeBackdrop = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.18 } },
  exit: { opacity: 0, transition: { duration: 0.14 } },
};

export const modalSurface = {
  initial: { opacity: 0, y: 8, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: motionDuration.base, ease: motionEase.out },
  },
  exit: {
    opacity: 0,
    y: 5,
    scale: 0.985,
    transition: { duration: 0.16, ease: motionEase.in },
  },
};

export const panelSurface = {
  initial: { opacity: 0, x: 24 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: motionDuration.panel, ease: motionEase.out },
  },
  exit: {
    opacity: 0,
    x: 18,
    transition: { duration: 0.2, ease: motionEase.in },
  },
};

export const popoverSurface = {
  initial: { opacity: 0, y: -6, scale: 0.985 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.18, ease: motionEase.out },
  },
  exit: {
    opacity: 0,
    y: -4,
    scale: 0.99,
    transition: { duration: 0.13, ease: motionEase.in },
  },
};
