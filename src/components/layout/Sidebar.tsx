'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, GitFork, Users, FolderOpen, BarChart3, Wifi, WifiOff } from 'lucide-react';

interface SidebarProps {
  isOnline: boolean;
  queueLength: number;
}

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/flows', label: 'Flows', icon: GitFork },
  { href: '/people', label: 'People', icon: Users },
  { href: '/projects', label: 'Projects', icon: FolderOpen },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export function Sidebar({ isOnline, queueLength }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#0A0A0A] border-r border-[rgba(212,168,67,0.1)] h-screen sticky top-0">
      <div className="p-6 border-b border-[rgba(212,168,67,0.1)]">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#D4A843] rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-sm">F</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">FIFS</h1>
            <p className="text-[#888] text-xs">Facility Flow System</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'bg-[rgba(212,168,67,0.15)] text-[#D4A843] border border-[rgba(212,168,67,0.2)]'
                  : 'text-[#888] hover:text-white hover:bg-[rgba(255,255,255,0.05)]'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[rgba(212,168,67,0.1)]">
        <div className="flex items-center gap-2 text-xs">
          {isOnline ? (
            <Wifi className="w-3.5 h-3.5 text-[#22C55E]" />
          ) : (
            <WifiOff className="w-3.5 h-3.5 text-[#EF4444]" />
          )}
          <span className={isOnline ? 'text-[#22C55E]' : 'text-[#EF4444]'}>
            {isOnline ? 'Online' : 'Offline'}
          </span>
          {queueLength > 0 && (
            <span className="text-[#EAB308] ml-auto">{queueLength} pending</span>
          )}
        </div>
      </div>
    </aside>
  );
}
