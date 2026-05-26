import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useParams, useNavigate } from 'react-router-dom';
import RoleColorBadge from '../components/RoleColorBadge';
import { ArrowLeft, Edit } from 'lucide-react';
import JobModal from '../components/JobModal';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [activeTab, setActiveTab] = useState('Applicants');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pipelineData, setPipelineData] = useState([]);

  const fetchJob = async () => {
    setLoading(true);
    const { data: jobData, error: jobError } = await supabase.from('jobs').select('*').eq('id', id).single();
    const { data: candData, error: candError } = await supabase.from('candidates').select('*').eq('applied_role_id', id).order('created_at', { ascending: false });

    if (!jobError && jobData) setJob(jobData);
    if (!candError && candData) {
       setCandidates(candData);

       // Calculate pipeline breakdown
       const stages = { 'Applied': 0, 'Screening': 0, 'Interview R1': 0, 'Interview R2': 0, 'Final Review': 0, 'Offer': 0, 'Hired': 0, 'Rejected': 0 };
       candData.forEach(c => {
          if (stages[c.stage] !== undefined) stages[c.stage]++;
       });
       setPipelineData(Object.entries(stages).map(([name, count]) => ({ name, count })).filter(s => s.count > 0 || ['Applied', 'Screening', 'Offer'].includes(s.name)));
    }
    setLoading(false);
  };

  useEffect(() => {
    if (id) fetchJob();
  }, [id]);

  if (loading) return <div className="p-8 animate-pulse"><div className="h-8 bg-gray-200 w-1/3 mb-4 rounded"></div><div className="h-32 bg-gray-200 w-full rounded"></div></div>;
  if (!job) return <div className="p-8">Job not found.</div>;

  return (
    <div className="h-full flex flex-col space-y-6">
      <div>
        <button onClick={() => navigate('/jobs')} className="text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-4 text-sm font-medium">
          <ArrowLeft size={16} /> Back to Jobs
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
               <span>{job.department}</span>
               <span>•</span>
               <span>{job.location_type}</span>
               <span>•</span>
               <RoleColorBadge color={job.target_rolecolor} />
               <span>•</span>
               <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${job.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{job.status}</span>
            </div>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md shadow-sm hover:bg-gray-50 font-medium text-sm">
             <Edit size={16} /> Edit Job
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex-1 flex flex-col overflow-hidden">
         <div className="flex border-b border-gray-200 bg-gray-50 px-6">
            {['Applicants', 'Pipeline', 'Job Description'].map(tab => (
               <button
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={`py-4 px-4 text-sm font-medium transition-colors border-b-2 ${activeTab === tab ? 'border-[#28BCE8] text-[#28BCE8]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
               >
                 {tab}
               </button>
            ))}
         </div>
         <div className="flex-1 overflow-y-auto p-0">
            {activeTab === 'Applicants' && (
               <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 sticky top-0">
                     <tr>
                        <th className="px-6 py-3 font-medium">Name</th>
                        <th className="px-6 py-3 font-medium">RoleColor</th>
                        <th className="px-6 py-3 font-medium">Stage</th>
                        <th className="px-6 py-3 font-medium">AI Score</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                     {candidates.length === 0 ? (
                        <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-500">No applicants yet.</td></tr>
                     ) : (
                        candidates.map(cand => (
                           <tr key={cand.id} className="hover:bg-[#F8F9FB] transition-colors cursor-pointer" onClick={() => navigate('/candidates')}>
                              <td className="px-6 py-4">
                                 <div className="font-medium text-gray-900">{cand.name}</div>
                                 <div className="text-gray-500 text-xs">{cand.email}</div>
                              </td>
                              <td className="px-6 py-4"><RoleColorBadge color={cand.rolecolor} /></td>
                              <td className="px-6 py-4"><span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md border border-gray-200">{cand.stage}</span></td>
                              <td className="px-6 py-4 font-medium text-gray-700">{cand.score || '-'}</td>
                           </tr>
                        ))
                     )}
                  </tbody>
               </table>
            )}
            {activeTab === 'Pipeline' && (
               <div className="p-6 h-96 max-w-3xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Current Pipeline Breakdown</h3>
                  {pipelineData.length > 0 ? (
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={pipelineData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                           <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                           <XAxis type="number" />
                           <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                           <Tooltip cursor={{fill: '#f3f4f6'}} />
                           <Bar dataKey="count" fill="#28BCE8" radius={[0, 4, 4, 0]} barSize={30} />
                        </BarChart>
                     </ResponsiveContainer>
                  ) : (
                     <div className="text-gray-500 text-center py-10">No pipeline data available.</div>
                  )}
               </div>
            )}
            {activeTab === 'Job Description' && (
               <div className="p-6 max-w-3xl prose prose-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Description</h3>
                  <div className="whitespace-pre-wrap text-gray-700">{job.description || 'No description provided.'}</div>

                  <h3 className="text-lg font-bold text-gray-900 mt-8 mb-4">Details</h3>
                  <ul className="list-disc pl-5 text-gray-700">
                     <li>Hiring Manager: {job.hiring_manager || 'Not assigned'}</li>
                     <li>Compensation: ${job.compensation_min?.toLocaleString() || 'TBD'} - ${job.compensation_max?.toLocaleString() || 'TBD'}</li>
                     <li>Target Start Date: {job.start_date ? new Date(job.start_date).toLocaleDateString() : 'TBD'}</li>
                  </ul>
               </div>
            )}
         </div>
      </div>

      <JobModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} job={job} onSave={() => { setIsModalOpen(false); fetchJob(); }} />
    </div>
  );
}
