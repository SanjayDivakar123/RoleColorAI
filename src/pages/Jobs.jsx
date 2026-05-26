import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import JobModal from '../components/JobModal';
import RoleColorBadge from '../components/RoleColorBadge';
import { Search, Plus, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Jobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterDept, setFilterDept] = useState('All');
  const [filterColor, setFilterColor] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    let query = supabase.from('jobs').select(`*, candidates(count)`);

    if (filterStatus !== 'All') query = query.eq('status', filterStatus);
    if (filterDept !== 'All') query = query.eq('department', filterDept);
    if (filterColor !== 'All') query = query.eq('target_rolecolor', filterColor);

    const { data, error } = await query.order('created_at', { ascending: false });
    if (!error && data) {
       // Filter by search term locally
       let filtered = data;
       if (search) {
         const s = search.toLowerCase();
         filtered = data.filter(j => j.title.toLowerCase().includes(s) || j.department.toLowerCase().includes(s));
       }
       setJobs(filtered);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, [filterStatus, filterDept, filterColor, search]);

  const openModal = (job = null) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Job Requisitions</h1>
        <button onClick={() => openModal()} className="flex items-center gap-2 px-4 py-2 bg-[#28BCE8] text-white rounded-md shadow-sm hover:bg-[#209bc2] font-medium">
          <Plus size={18} /> Create Job
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text" placeholder="Search jobs..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#28BCE8]"
          />
        </div>

        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2">
          <option value="All">All Statuses</option>
          <option value="Open">Open</option>
          <option value="Draft">Draft</option>
          <option value="Paused">Paused</option>
          <option value="Closed">Closed</option>
        </select>

        <select value={filterDept} onChange={e => setFilterDept(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2">
          <option value="All">All Departments</option>
          <option value="Sales">Sales</option>
          <option value="Engineering">Engineering</option>
          <option value="Marketing">Marketing</option>
        </select>

        <select value={filterColor} onChange={e => setFilterColor(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2">
          <option value="All">All RoleColors</option>
          <option value="Red">Red</option>
          <option value="Yellow">Yellow</option>
          <option value="Green">Green</option>
          <option value="Blue">Blue</option>
          <option value="Any">Any</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
              <tr>
                <th className="px-6 py-3 font-medium">Title</th>
                <th className="px-6 py-3 font-medium">Department</th>
                <th className="px-6 py-3 font-medium">Location</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Target RoleColor</th>
                <th className="px-6 py-3 font-medium">Applicants</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                [1,2,3,4,5].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="7" className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
                  </tr>
                ))
              ) : jobs.length === 0 ? (
                 <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">No jobs found matching criteria.</td>
                 </tr>
              ) : (
                jobs.map(job => (
                  <tr key={job.id} className="hover:bg-[#F8F9FB] transition-colors cursor-pointer" onClick={() => navigate(`/jobs/${job.id}`)}>
                    <td className="px-6 py-4 font-medium text-gray-900">{job.title}</td>
                    <td className="px-6 py-4 text-gray-500">{job.department}</td>
                    <td className="px-6 py-4 text-gray-500">{job.location_type}</td>
                    <td className="px-6 py-4">
                       <span className={`px-2 py-1 text-xs rounded-full font-medium ${job.status==='Open' ? 'bg-green-100 text-green-700' : job.status==='Draft' ? 'bg-gray-100 text-gray-700' : 'bg-red-100 text-red-700'}`}>
                          {job.status}
                       </span>
                    </td>
                    <td className="px-6 py-4"><RoleColorBadge color={job.target_rolecolor} /></td>
                    <td className="px-6 py-4 text-gray-500">{job.candidates[0]?.count || 0}</td>
                    <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                       <button onClick={() => openModal(job)} className="text-gray-400 hover:text-[#28BCE8]"><MoreHorizontal size={18} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <JobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        job={editingJob}
        onSave={() => { setIsModalOpen(false); fetchJobs(); }}
      />
    </div>
  );
}
