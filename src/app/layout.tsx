import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { ClientLayout } from './client-layout';
import './globals.css';

export const metadata: Metadata = {
  title: 'FIFS - Facility Intelligence Flow System',
  description: 'Enterprise Facility Management Operating System',
  keywords: ['facility management', 'maintenance', 'FIFS', 'facility intelligence'],
  authors: [{ name: 'FIFS Team' }],
  openGraph: {
    title: 'FIFS - Facility Intelligence Flow System',
    description: 'Enterprise Facility Management Operating System',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0A0A0A] text-white min-h-screen antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
