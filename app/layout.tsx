import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mahjong Multiplayer',
  description: 'Mahjong Multiplayer landing page',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
