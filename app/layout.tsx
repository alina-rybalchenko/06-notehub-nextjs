// app/layout.tsx (server component)
import './globals.css';
import type { ReactNode } from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

export const metadata = {
  title: 'NoteHub',
  description: 'Next.js NoteHub app',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
