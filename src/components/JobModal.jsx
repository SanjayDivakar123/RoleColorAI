import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useToast } from './Toast';

export default function JobModal({ isOpen, onClose, onSave, job }) {
  const { addToast } = useToast();
  const isEditing = !!job;

  const [formData, setFormData] = useState({
    title: '',
    department: 'Sales',
    location_type: 'On-site',
    status: 'Draft',
    target_rolecolor: 'Any',
    rolecolor_mix: { Red: 25, Yellow: 25, Green: 25, Blue: 25 },
    hiring_manager: '',
    compensation_min: '',
    compensation_max: '',
    start_date: '',
    description: ''
  });

  useEffect(() => {
    if (job) {
      setFormData({
        ...job,
        rolecolor_mix: typeof job.rolecolor_mix === 'string' ? JSON.parse(job.rolecolor_mix) : (job.rolecolor_mix || { Red: 25, Yellow: 25, Green: 25, Blue: 25 }),
      });
    } else {
      setFormData({
        title: '', department: 'Sales', location_type: 'On-site', status: 'Draft', target_rolecolor: 'Any',
        rolecolor_mix: { Red: 25, Yellow: 25, Green: 25, Blue: 25 }, hiring_manager: '', compensation_min: '', compensation_max: '', start_date: '', description: ''
      });
    }
  }, [job, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMixChange = (color, value) => {
     setFormData(prev => ({
       ...prev,
       rolecolor_mix: { ...prev.rolecolor_mix, [color]: parseInt(value) || 0 }
     }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Quick validation for mix (should ideally be perfectly 100, but relaxing for UI simplicity in this demo)
    const sum = Object.values(formData.rolecolor_mix).reduce((a,b)=>a+b, 0);
    if(sum !== 100) {
       addToast("RoleColor mix must sum to 100%", "error");
       return;
    }

    const payload = {
       ...formData,
       compensation_min: formData.compensation_min ? parseFloat(formData.compensation_min) : null,
       compensation_max: formData.compensation_max ? parseFloat(formData.compensation_max) : null,
    };

    try {
      if (isEditing) {
        const { error } = await supabase.from('jobs').update(payload).eq('id', job.id);
        if (error) throw error;
        addToast("Job updated successfully");
      } else {
        const { error } = await supabase.from('jobs').insert([payload]);
        if (error) throw error;
        addToast("Job created successfully");
      }
      onSave();
    } catch (error) {
      console.error(error);
      addToast(error.message, "error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto pt-10 pb-10">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl">
          <h2 className="text-xl font-bold text-gray-900">{isEditing ? 'Edit Job' : 'Create Job'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <form id="jobForm" onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                <input required name="title" value={formData.title} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select name="department" value={formData.department} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2">
                  <option>Sales</option><option>Engineering</option><option>Marketing</option>
                  <option>Operations</option><option>HR</option><option>Finance</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location Type</label>
                <select name="location_type" value={formData.location_type} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2">
                  <option>On-site</option><option>Hybrid</option><option>Remote</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2">
                  <option>Draft</option><option>Open</option><option>Paused</option><option>Closed</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hiring Manager</label>
                <input name="hiring_manager" value={formData.hiring_manager} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" />
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Start Date</label>
                <input type="date" name="start_date" value={formData.start_date || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Comp ($)</label>
                <input type="number" name="compensation_min" value={formData.compensation_min} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Comp ($)</label>
                <input type="number" name="compensation_max" value={formData.compensation_max} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-bold text-gray-900 mb-3">RoleColor Requirements</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Target RoleColor</label>
                <select name="target_rolecolor" value={formData.target_rolecolor} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2">
                  <option>Any</option><option>Red</option><option>Yellow</option><option>Green</option><option>Blue</option>
                </select>
              </div>

              <div className="space-y-3">
                 <label className="block text-sm font-medium text-gray-700">Ideal Mix (must sum to 100)</label>
                 {['Red', 'Yellow', 'Green', 'Blue'].map(color => (
                    <div key={color} className="flex items-center gap-3">
                       <span className="w-16 text-sm font-medium" style={{color: color === 'Red' ? '#EE2B2B' : color === 'Yellow' ? '#D4A810' : color === 'Green' ? '#27BD73' : '#28BCE8'}}>{color}</span>
                       <input type="range" min="0" max="100" value={formData.rolecolor_mix[color]} onChange={(e) => handleMixChange(color, e.target.value)} className="flex-1" />
                       <span className="w-10 text-sm text-right">{formData.rolecolor_mix[color]}%</span>
                    </div>
                 ))}
                 <div className="text-right text-xs text-gray-500 mt-1">
                    Total: {Object.values(formData.rolecolor_mix).reduce((a,b)=>a+b, 0)}%
                 </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
              <textarea name="description" rows={4} value={formData.description} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2"></textarea>
            </div>

          </form>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl flex justify-end gap-3">
           <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 font-medium">Cancel</button>
           <button type="submit" form="jobForm" className="px-4 py-2 bg-[#242E42] text-white rounded-md hover:bg-[#1a2130] font-medium">Save Job</button>
        </div>
      </div>
    </div>
  );
}
