import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import KanbanBoard from '../components/KanbanBoard';
import { Search, Filter } from 'lucide-react';

export default function Pipeline() {
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterJob, setFilterJob] = useState('All');
  const [filterColor, setFilterColor] = useState('All');

  const STAGES = ['Applied', 'Screening', 'Interview R1', 'Interview R2', 'Final Review', 'Offer', 'Hired', 'Rejected'];

  useEffect(() => {
    fetchData();
  }, [filterJob, filterColor]);

  const fetchData = async () => {
    setLoading(true);

    // Fetch Jobs for filter
    const { data: jobData } = await supabase.from('jobs').select('id, title').eq('status', 'Open');
    if (jobData) setJobs(jobData);

    // Fetch Candidates
    let query = supabase.from('candidates').select('*, jobs(title)');
    if (filterJob !== 'All') query = query.eq('applied_role_id', filterJob);
    if (filterColor !== 'All') query = query.eq('rolecolor', filterColor);

    const { data: candData, error } = await query;
    if (!error && candData) {
       setCandidates(candData);
    }
    setLoading(false);
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId) return;

    const newStage = destination.droppableId;

    // Optimistic update
    setCandidates(prev => prev.map(c => c.id === draggableId ? { ...c, stage: newStage } : c));

    // Persist
    const { error } = await supabase.from('candidates').update({ stage: newStage }).eq('id', draggableId);
    if (error) {
       console.error("Error updating stage", error);
       fetchData(); // Revert on error
    } else {
       // Log activity
       await supabase.from('activity_log').insert([{
         action: `Moved to ${newStage}`,
         candidate_id: draggableId,
         performed_by: 'RCF Admin'
       }]);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Pipeline</h1>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex gap-4 items-center">
        <div className="flex items-center gap-2">
           <span className="text-sm font-medium text-gray-500">Job:</span>
           <select value={filterJob} onChange={e => setFilterJob(e.target.value)} className="border border-gray-300 rounded-md px-3 py-1.5 text-sm">
             <option value="All">All Jobs</option>
             {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
           </select>
        </div>

        <div className="flex items-center gap-2">
           <span className="text-sm font-medium text-gray-500">Color:</span>
           <div className="flex items-center gap-1 border border-gray-300 rounded-md p-1 bg-gray-50">
              {['All', 'Red', 'Yellow', 'Green', 'Blue'].map(color => (
                 <button
                   key={color}
                   onClick={() => setFilterColor(color)}
                   className={`px-2 py-1 text-xs rounded font-medium transition-colors ${filterColor === color ? 'bg-white shadow-sm border border-gray-200 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                 >
                    {color}
                 </button>
              ))}
           </div>
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-x-auto pb-4">
         {loading ? (
            <div className="flex gap-4 h-full">
               {[1,2,3,4].map(i => <div key={i} className="w-72 bg-gray-200 rounded-xl animate-pulse flex-shrink-0"></div>)}
            </div>
         ) : (
            <KanbanBoard
               stages={STAGES}
               candidates={candidates}
               onDragEnd={handleDragEnd}
            />
         )}
      </div>
    </div>
  );
}
