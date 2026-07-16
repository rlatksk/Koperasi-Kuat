'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, ArrowsLeftRight, House } from '@phosphor-icons/react';

const links = [
  { href: '/', label: 'Dashboard', icon: House },
  { href: '/barang', label: 'Master Barang', icon: Package },
  { href: '/transaction', label: 'Transaksi', icon: ArrowsLeftRight },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col">
      <div className="px-6 py-5 border-b border-gray-100">
        <h1 className="text-sm font-bold text-blue-700 tracking-tight">Koperasi Kuat</h1>
        <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">Manajemen Stok</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                active
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon size={20} weight={active ? 'fill' : 'regular'} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
