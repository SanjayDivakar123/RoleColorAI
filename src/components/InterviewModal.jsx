import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useToast } from './Toast';

export default function InterviewModal({ isOpen, onClose, onSave }) {
  const { addToast } = useToast();

  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [formData, setFormData] = useState({
    candidate_id: '',
    job_id: '',
    interviewer: '',
    scheduled_at: '',
    type: 'Video',
    notes: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchOptions();
    }
  }, [isOpen]);

  const fetchOptions = async () => {
    const [{ data: cands }, { data: jbs }] = await Promise.all([
       supabase.from('candidates').select('id, name').order('name'),
       supabase.from('jobs').select('id, title').eq('status', 'Open').order('title')
    ]);
    if (cands) setCandidates(cands);
    if (jbs) setJobs(jbs);

    if (cands?.length > 0) setFormData(prev => ({ ...prev, candidate_id: cands[0].id }));
    if (jbs?.length > 0) setFormData(prev => ({ ...prev, job_id: jbs[0].id }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('interviews').insert([{
         ...formData,
         scheduled_at: new Date(formData.scheduled_at).toISOString()
      }]);
      if (error) throw error;
      addToast("Interview scheduled successfully");
      onSave();
    } catch (error) {
      console.error(error);
      addToast("Error scheduling interview", "error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl">
          <h2 className="text-xl font-bold text-gray-900">Schedule Interview</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
        </div>

        <div className="p-6">
          <form id="interviewForm" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Candidate</label>
              <select required name="candidate_id" value={formData.candidate_id} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2">
                 {candidates.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Role</label>
              <select required name="job_id" value={formData.job_id} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2">
                 {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interviewer Name(s)</label>
              <input required type="text" name="interviewer" value={formData.interviewer} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" placeholder="e.g. John Smith" />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                 <input required type="datetime-local" name="scheduled_at" value={formData.scheduled_at} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                 <select name="type" value={formData.type} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2">
                    <option>Video</option><option>Phone</option><option>On-site</option>
                 </select>
               </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pre-interview Notes</label>
              <textarea name="notes" rows={3} value={formData.notes} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" placeholder="Any specific areas to probe?"></textarea>
            </div>

          </form>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl flex justify-end gap-3">
           <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 font-medium">Cancel</button>
           <button type="submit" form="interviewForm" className="px-4 py-2 bg-[#28BCE8] text-white rounded-md hover:bg-[#209bc2] font-medium">Schedule</button>
        </div>
      </div>
    </div>
  );
}
