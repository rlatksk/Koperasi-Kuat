import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Sidebar from '@/components/sidebar';
import { ToastProvider } from '@/components/toast';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Stock Management — PT KoperasiKuat',
  description: 'Stock management system',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased`}>
        <ToastProvider>
          <div className="flex">
            <Sidebar />
            <main className="ml-60 flex-1 p-8 min-h-screen">{children}</main>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
