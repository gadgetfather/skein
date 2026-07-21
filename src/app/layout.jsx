import './globals.css';
import MotionProvider from '../ui/motion/MotionProvider';

export const metadata = {
  title: 'Skein — parallel interests, one calm canvas',
  description:
    'Brain-dump every project, hobby, and someday-maybe. Skein weaves them into one calm map — then, when you are overwhelmed, quietly tells you the single thing to do next.',
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🧶</text></svg>",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,400..700;1,400..700&family=Caveat:wght@400..700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body><MotionProvider>{children}</MotionProvider></body>
    </html>
  );
}
