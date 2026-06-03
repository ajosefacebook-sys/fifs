'use client';

import { useEffect, useState } from 'react';
import { useTaskStore } from '@/store/useTaskStore';
import { useStaffStore } from '@/store/useStaffStore';
import { vendorService } from '@/services/vendorService';
import { Category } from '@/types/task.types';
import { CATEGORY_MAP } from '@/constants/categories';
import { Card } from '@/components/shared/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Zap, Clock, FolderOpen, Users, Star, DollarSign } from 'lucide-react';

export function Analytics() {
  const { tasks, loadTasks } = useTaskStore();
  const { staff, loadStaff } = useStaffStore();
  const [vendors, setVendors] = useState<ReturnType<typeof vendorService.getAll>>([]);
  const [metrics, setMetrics] = useState({
    totalIssuesThisMonth: 0,
    avgResolutionTime: 0,
    topCategory: '',
    topStaff: '',
    bestVendor: '',
    totalCost: 0,
  });

  useEffect(() => {
    loadTasks(); loadStaff();
    setVendors(vendorService.getAll());
  }, [loadTasks, loadStaff]);

  useEffect(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const monthTasks = tasks.filter(t => t.createdAt >= monthStart);
    const resolvedTasks = tasks.filter(t => (t.status === 'resolved' || t.status === 'verified' || t.status === 'closed'));
    const avgTime = resolvedTasks.length > 0
      ? resolvedTasks.reduce((acc, t) => acc + (new Date(t.updatedAt).getTime() - new Date(t.createdAt).getTime()), 0) / resolvedTasks.length
      : 0;
    const categoryCounts: Record<string, number> = {};
    monthTasks.forEach(t => { categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1; });
    const topCat = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0];
    const topPerformer = [...staff].sort((a, b) => b.performanceScore - a.performanceScore)[0];
    const bestVendor = [...vendors].sort((a, b) => b.slaScore - a.slaScore)[0];
    const totalCost = vendors.reduce((acc, v) => acc + v.jobHistory.reduce((s, j) => s + j.cost, 0), 0);

    setMetrics({
      totalIssuesThisMonth: monthTasks.length,
      avgResolutionTime: Math.round(avgTime / (3600000)),
      topCategory: topCat ? CATEGORY_MAP[topCat[0] as Category]?.label || topCat[0] : 'N/A',
      topStaff: topPerformer?.name || 'N/A',
      bestVendor: bestVendor?.companyName || 'N/A',
      totalCost,
    });
  }, [tasks, staff, vendors]);

  const categoryData = Object.values(CATEGORY_MAP).map(cat => ({
    name: cat.label,
    count: tasks.filter(t => t.category === cat.value).length,
    color: cat.color,
  }));

  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const dateStr = d.toISOString().split('T')[0];
    const count = tasks.filter(t => {
      const created = t.createdAt.split('T')[0];
      return created === dateStr && (t.status === 'resolved' || t.status === 'verified' || t.status === 'closed');
    }).length;
    return {
      date: `${d.getDate()}/${d.getMonth() + 1}`,
      resolved: count,
    };
  });

  const statCards = [
    { label: 'Total Issues This Month', value: metrics.totalIssuesThisMonth, icon: Zap, color: '#D4A843' },
    { label: 'Avg Resolution Time', value: `${metrics.avgResolutionTime}h`, icon: Clock, color: '#06B6D4' },
    { label: 'Top Issue Category', value: metrics.topCategory, icon: FolderOpen, color: '#8B5CF6' },
    { label: 'Top Performer', value: metrics.topStaff, icon: Users, color: '#22C55E' },
    { label: 'Best Vendor SLA', value: metrics.bestVendor, icon: Star, color: '#EAB308' },
    { label: 'Total Maintenance Cost', value: `₦${(metrics.totalCost / 1000000).toFixed(1)}M`, icon: DollarSign, color: '#EF4444' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Card key={i}>
              <div className="flex items-center gap-2 mb-1">
                <Icon className="w-4 h-4" style={{ color: card.color }} />
                <p className="text-[#888] text-xs">{card.label}</p>
              </div>
              <p className="text-white text-lg font-bold truncate">{card.value}</p>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-white font-semibold text-sm mb-4">Issues by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#888', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#888', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1E1E1E', border: '1px solid rgba(212,168,67,0.2)', borderRadius: '12px', color: '#fff' }}
                  labelStyle={{ color: '#888' }}
                />
                <Bar dataKey="count" fill="#D4A843" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="text-white font-semibold text-sm mb-4">Issues Resolved (Last 30 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={last30Days} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: '#888', fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
                <YAxis tick={{ fill: '#888', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1E1E1E', border: '1px solid rgba(212,168,67,0.2)', borderRadius: '12px', color: '#fff' }}
                  labelStyle={{ color: '#888' }}
                />
                <Line type="monotone" dataKey="resolved" stroke="#D4A843" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
