'use client';

import * as m from 'motion/react-m';
import { motionEase } from './tokens';

const heroContainer = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.08, staggerChildren: 0.07 },
  },
};

const heroItem = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: motionEase.out },
  },
};

const previewContainer = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: motionEase.out,
      delayChildren: 0.12,
      staggerChildren: 0.07,
    },
  },
};

const previewItem = {
  hidden: { opacity: 0, y: 9, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.38, ease: motionEase.out },
  },
};

export function HeroSequence({ children, className }) {
  return (
    <m.div className={className} variants={heroContainer} initial="hidden" animate="visible">
      {children}
    </m.div>
  );
}

export function HeroItem({ children, className }) {
  return <m.div className={className} variants={heroItem}>{children}</m.div>;
}

export function PreviewSequence({ children, className }) {
  return (
    <m.div
      className={className}
      variants={previewContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </m.div>
  );
}

export function PreviewItem({ children, className }) {
  return <m.div className={className} variants={previewItem}>{children}</m.div>;
}

export function PreviewPath(props) {
  return (
    <m.path
      {...props}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: props.opacity ?? 0.8,
          transition: { duration: 0.45, ease: motionEase.out },
        },
      }}
    />
  );
}

export function ViewReveal({ children, className, amount = 0.18 }) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.48, ease: motionEase.out }}
    >
      {children}
    </m.div>
  );
}
