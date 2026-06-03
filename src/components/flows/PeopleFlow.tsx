'use client';

import { useState, useEffect } from 'react';
import { useStaffStore } from '@/store/useStaffStore';
import { Staff, Vendor } from '@/types/staff.types';
import { staffStatusConfig } from '@/utils/statusMapper';
import { vendorService } from '@/services/vendorService';
import { Card } from '@/components/shared/Card';
import { StatusPill } from '@/components/shared/StatusPill';
import { formatDate } from '@/utils/date';
import { X, Star, Briefcase, Calendar, Clock } from 'lucide-react';

export function PeopleFlow() {
  const { staff, selectedStaff, selectStaff, loadStaff } = useStaffStore();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [activeTab, setActiveTab] = useState<'staff' | 'vendors'>('staff');

  useEffect(() => { loadStaff(); setVendors(vendorService.getAll()); }, [loadStaff]);

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button onClick={() => setActiveTab('staff')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === 'staff' ? 'bg-[#D4A843] text-black' : 'bg-[#1E1E1E] text-[#888] hover:text-white'}`}>Staff</button>
        <button onClick={() => setActiveTab('vendors')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === 'vendors' ? 'bg-[#D4A843] text-black' : 'bg-[#1E1E1E] text-[#888] hover:text-white'}`}>Vendors</button>
      </div>

      {activeTab === 'staff' ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {staff.map(member => {
              const statusInfo = staffStatusConfig[member.status];
              return (
                <Card key={member.id} hover onClick={() => selectStaff(member.id)}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#D4A843] flex items-center justify-center text-black font-bold text-sm">
                      {member.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-semibold text-sm truncate">{member.name}</h4>
                      <p className="text-[#888] text-xs capitalize">{member.role.replace('-', ' ')}</p>
                    </div>
                    <StatusPill label={statusInfo.label} color={statusInfo.color} bg={statusInfo.bg} />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-[#888]">Score: <span className="text-[#D4A843] font-semibold">{member.performanceScore}%</span></span>
                    <span className="text-[#888]">{member.attendanceLog.length} records</span>
                  </div>
                </Card>
              );
            })}
          </div>

          {selectedStaff && (
            <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => selectStaff(null)}>
              <div className="bg-[#161616] border border-[rgba(212,168,67,0.2)] rounded-t-2xl md:rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="sticky top-0 bg-[#161616] border-b border-[rgba(212,168,67,0.1)] p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#D4A843] flex items-center justify-center text-black font-bold">{selectedStaff.avatar}</div>
                    <div>
                      <h2 className="text-white font-bold">{selectedStaff.name}</h2>
                      <p className="text-[#888] text-xs capitalize">{selectedStaff.role.replace('-', ' ')}</p>
                    </div>
                  </div>
                  <button onClick={() => selectStaff(null)} className="text-[#888] hover:text-white"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-4 space-y-4">
                  <div className="bg-[#1E1E1E] rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[#888] text-sm">Performance Score</span>
                      <span className="text-[#D4A843] font-bold text-lg">{selectedStaff.performanceScore}%</span>
                    </div>
                    <div className="h-2 bg-[#0A0A0A] rounded-full overflow-hidden">
                      <div className="h-full bg-[#D4A843] rounded-full transition-all" style={{ width: `${selectedStaff.performanceScore}%` }} />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-semibold text-sm mb-2 flex items-center gap-2"><Calendar className="w-4 h-4" /> Attendance Log</h3>
                    <div className="space-y-1.5">
                      {selectedStaff.attendanceLog.slice(0, 5).map(a => (
                        <div key={a.id} className="flex items-center justify-between text-xs text-[#888] bg-[#1E1E1E] rounded-lg px-3 py-2">
                          <span>{formatDate(a.date)}</span>
                          <span>{a.checkIn} - {a.checkOut || '--'}</span>
                          <span className={`font-medium ${a.status === 'present' ? 'text-[#22C55E]' : a.status === 'late' ? 'text-[#EAB308]' : 'text-[#EF4444]'}`}>{a.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedStaff.discipline.length > 0 && (
                    <div>
                      <h3 className="text-white font-semibold text-sm mb-2">Discipline / Alerts</h3>
                      {selectedStaff.discipline.map(d => (
                        <div key={d.id} className={`text-xs p-3 rounded-xl mb-1.5 ${d.type === 'commendation' ? 'bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.2)]' : 'bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)]'}`}>
                          <p className="text-white font-medium capitalize mb-1">{d.type}</p>
                          <p className="text-[#888]">{d.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {vendors.map(vendor => (
              <Card key={vendor.id} hover onClick={() => setSelectedVendor(vendor)}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-[rgba(212,168,67,0.2)] flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-[#D4A843]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold text-sm">{vendor.companyName}</h4>
                    <p className="text-[#888] text-xs">{vendor.trade}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-[#EAB308]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < Math.floor(vendor.rating) ? 'fill-current' : 'opacity-30'}`} />
                    ))}
                    <span className="text-[#888] ml-1">{vendor.rating}</span>
                  </div>
                  <span className="text-[#22C55E] font-medium">SLA: {vendor.slaScore}%</span>
                </div>
              </Card>
            ))}
          </div>

          {selectedVendor && (
            <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setSelectedVendor(null)}>
              <div className="bg-[#161616] border border-[rgba(212,168,67,0.2)] rounded-t-2xl md:rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="sticky top-0 bg-[#161616] border-b border-[rgba(212,168,67,0.1)] p-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-white font-bold">{selectedVendor.companyName}</h2>
                    <p className="text-[#888] text-xs">{selectedVendor.trade}</p>
                  </div>
                  <button onClick={() => setSelectedVendor(null)} className="text-[#888] hover:text-white"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#1E1E1E] rounded-xl p-3 text-center">
                      <p className="text-[#888] text-xs mb-1">Response Time</p>
                      <p className="text-[#D4A843] font-bold">{selectedVendor.responseTimeAvg} min</p>
                    </div>
                    <div className="bg-[#1E1E1E] rounded-xl p-3 text-center">
                      <p className="text-[#888] text-xs mb-1">SLA Compliance</p>
                      <p className="text-[#22C55E] font-bold">{selectedVendor.slaCompliance}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[#EAB308] mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(selectedVendor.rating) ? 'fill-current' : 'opacity-30'}`} />
                    ))}
                    <span className="text-white text-sm ml-1">{selectedVendor.rating}</span>
                  </div>

                  <div>
                    <h3 className="text-white font-semibold text-sm mb-2 flex items-center gap-2"><Clock className="w-4 h-4" /> Job History</h3>
                    {selectedVendor.jobHistory.map(job => (
                      <div key={job.id} className="bg-[#1E1E1E] rounded-xl p-3 mb-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white text-sm font-medium">{job.description}</span>
                          <div className="flex items-center gap-1 text-[#EAB308]">
                            <Star className="w-3 h-3 fill-current" />
                            <span className="text-white text-xs">{job.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-[#888]">
                          <span>{formatDate(job.date)}</span>
                          <span>₦{job.cost.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
