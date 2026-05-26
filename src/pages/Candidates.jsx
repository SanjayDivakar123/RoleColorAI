import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import CandidateDrawer from '../components/CandidateDrawer';
import RoleColorBadge from '../components/RoleColorBadge';
import { Search, Filter, Download } from 'lucide-react';

export default function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterColor, setFilterColor] = useState('All');
  const [filterStage, setFilterStage] = useState('All');

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [selectedCandidates, setSelectedCandidates] = useState([]);

  const fetchCandidates = async () => {
    setLoading(true);
    let query = supabase.from('candidates').select(`*, jobs(title)`);

    if (filterColor !== 'All') query = query.eq('rolecolor', filterColor);
    if (filterStage !== 'All') query = query.eq('stage', filterStage);

    const { data, error } = await query.order('created_at', { ascending: false });
    if (!error && data) {
       let filtered = data;
       if (search) {
         const s = search.toLowerCase();
         filtered = data.filter(c => c.name.toLowerCase().includes(s) || c.email.toLowerCase().includes(s));
       }
       setCandidates(filtered);
    }
    setLoading(false);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCandidates(candidates.map(c => c.id));
    } else {
      setSelectedCandidates([]);
    }
  };

  const handleSelectCandidate = (id) => {
    setSelectedCandidates(prev =>
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  const handleBulkReject = async () => {
    if (selectedCandidates.length === 0) return;
    try {
      const { error } = await supabase.from('candidates').update({ stage: 'Rejected' }).in('id', selectedCandidates);
      if (error) throw error;
      fetchCandidates();
      setSelectedCandidates([]);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [filterColor, filterStage, search]);

  const openDrawer = (id) => {
    setSelectedId(id);
    setDrawerOpen(true);
  };

  return (
    <div className="h-full flex flex-col space-y-6 relative">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Candidate Database</h1>
        <div className="flex items-center gap-2">
           {selectedCandidates.length > 0 && (
             <button onClick={handleBulkReject} className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-md font-medium text-sm hover:bg-red-100">
               Reject Selected ({selectedCandidates.length})
             </button>
           )}
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-md shadow-sm hover:bg-gray-50 font-medium text-sm">
             <Download size={16} /> Export CSV
           </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#28BCE8]"
          />
        </div>

        <div className="flex items-center gap-2 border border-gray-300 rounded-md p-1 bg-gray-50">
           <Filter size={16} className="text-gray-400 ml-2" />
           {['All', 'Red', 'Yellow', 'Green', 'Blue'].map(color => (
              <button
                key={color}
                onClick={() => setFilterColor(color)}
                className={`px-3 py-1 text-sm rounded-md font-medium transition-colors ${filterColor === color ? 'bg-white shadow-sm border border-gray-200 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              >
                 {color}
              </button>
           ))}
        </div>

        <select value={filterStage} onChange={e => setFilterStage(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 text-sm">
          <option value="All">All Stages</option>
          <option value="Applied">Applied</option>
          <option value="Screening">Screening</option>
          <option value="Interview R1">Interview R1</option>
          <option value="Final Review">Final Review</option>
          <option value="Offer">Offer</option>
          <option value="Hired">Hired</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
              <tr>
                <th className="px-6 py-3 font-medium w-8">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={candidates.length > 0 && selectedCandidates.length === candidates.length}
                    className="rounded text-[#28BCE8] focus:ring-[#28BCE8]"
                  />
                </th>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">RoleColor</th>
                <th className="px-6 py-3 font-medium">Applied Role</th>
                <th className="px-6 py-3 font-medium">Stage</th>
                <th className="px-6 py-3 font-medium">AI Score</th>
                <th className="px-6 py-3 font-medium">Date Added</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                [1,2,3,4,5].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="7" className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
                  </tr>
                ))
              ) : candidates.length === 0 ? (
                 <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">No candidates found.</td>
                 </tr>
              ) : (
                candidates.map(cand => (
                  <tr key={cand.id} className="hover:bg-[#F8F9FB] transition-colors cursor-pointer group" onClick={() => openDrawer(cand.id)}>
                    <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedCandidates.includes(cand.id)}
                        onChange={() => handleSelectCandidate(cand.id)}
                        className="rounded text-[#28BCE8] focus:ring-[#28BCE8]"
                      />
                    </td>
                    <td className="px-6 py-4">
                       <div className="font-medium text-gray-900 group-hover:text-[#28BCE8] transition-colors">{cand.name}</div>
                       <div className="text-gray-500 text-xs">{cand.email}</div>
                    </td>
                    <td className="px-6 py-4"><RoleColorBadge color={cand.rolecolor} /></td>
                    <td className="px-6 py-4 text-gray-600">{cand.jobs?.title || 'General'}</td>
                    <td className="px-6 py-4">
                       <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md border border-gray-200">
                          {cand.stage}
                       </span>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                             <div className="h-full bg-indigo-500" style={{width: `${cand.score || 0}%`}}></div>
                          </div>
                          <span className="font-medium text-gray-700">{cand.score || '-'}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{new Date(cand.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CandidateDrawer
         isOpen={drawerOpen}
         onClose={() => setDrawerOpen(false)}
         candidateId={selectedId}
         onUpdate={fetchCandidates}
      />
    </div>
  );
}
