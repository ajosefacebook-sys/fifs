'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  useEffect(() => { router.replace('/dashboard'); }, [router]);
  return (
    <div className="flex items-center justify-center h-screen bg-[#0A0A0A]">
      <div className="text-center">
        <div className="w-16 h-16 bg-[#D4A843] rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
          <span className="text-black font-bold text-2xl">F</span>
        </div>
        <p className="text-[#888] text-sm">Loading FIFS...</p>
      </div>
    </div>
  );
}
