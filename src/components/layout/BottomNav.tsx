'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, GitFork, Users, FolderOpen, BarChart3 } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/flows', label: 'Flows', icon: GitFork },
  { href: '/people', label: 'People', icon: Users },
  { href: '/projects', label: 'Projects', icon: FolderOpen },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0A0A0A] border-t border-[rgba(212,168,67,0.1)] z-40">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-all duration-200
                ${isActive ? 'text-[#D4A843]' : 'text-[#888] hover:text-white'}
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
