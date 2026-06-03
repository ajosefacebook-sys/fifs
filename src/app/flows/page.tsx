'use client';

import { useState } from 'react';
import { ProblemFlow } from '@/components/flows/ProblemFlow';
import { DailyFlow } from '@/components/flows/DailyFlow';
import { PeopleFlow } from '@/components/flows/PeopleFlow';
import { ProjectFlow } from '@/components/flows/ProjectFlow';

const tabs = [
  { key: 'problems', label: 'Problem Flow' },
  { key: 'checklist', label: 'Daily Flow' },
  { key: 'people', label: 'People Flow' },
  { key: 'projects', label: 'Project Flow' },
];

export default function FlowsPage() {
  const [activeTab, setActiveTab] = useState('problems');

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-1 mb-4">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              activeTab === tab.key
                ? 'bg-[#D4A843] text-black'
                : 'bg-[#1E1E1E] text-[#888] hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'problems' && <ProblemFlow />}
      {activeTab === 'checklist' && <DailyFlow />}
      {activeTab === 'people' && <PeopleFlow />}
      {activeTab === 'projects' && <ProjectFlow />}
    </div>
  );
}
