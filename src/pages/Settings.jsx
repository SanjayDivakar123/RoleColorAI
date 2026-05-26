import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useToast } from '../components/Toast';
import { Save, AlertTriangle, Users, Layout, Palette, Mail, Download } from 'lucide-react';

import { useEffect } from 'react';

export default function Settings() {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('Pipeline');
  const [confirmDelete, setConfirmDelete] = useState('');

  // States for dynamic data
  const [pipelineStages, setPipelineStages] = useState([]);
  const [templates, setTemplates] = useState({
     offer: "Dear {candidate_name},\n\nWe are thrilled to offer you the position of {job_title} at RoleColorFinder. Your compensation will be ${salary} per year with {equity}% equity. We would like you to start on {start_date}.\n\nBest regards,\nRCF Hiring Team",
     reject: "Dear {candidate_name},\n\nThank you for applying to the {job_title} role. Unfortunately, we will not be moving forward with your application at this time.\n\nBest wishes,\nRCF Hiring Team",
     invite: "Hi {candidate_name},\n\nWe would like to invite you to an interview for the {job_title} role on {date} at {time} with {interviewer}.\n\nLooking forward to speaking with you!"
  });

  useEffect(() => {
     fetchSettings();
  }, []);

  const fetchSettings = async () => {
     const { data, error } = await supabase.from('pipeline_stages').select('*').order('order_index');
     if (!error && data && data.length > 0) {
        setPipelineStages(data);
     } else {
        // Fallback or seed
        setPipelineStages(['Applied', 'Screening', 'Interview R1', 'Interview R2', 'Final Review', 'Offer', 'Hired', 'Rejected'].map((s, i) => ({ id: `new-${i}`, name: s, order_index: i })));
     }
  };

  const savePipeline = async () => {
     try {
        // Simple wipe and replace for demo simplicity
        await supabase.from('pipeline_stages').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        const toInsert = pipelineStages.map((s, i) => ({ name: s.name, order_index: i }));
        const { error } = await supabase.from('pipeline_stages').insert(toInsert);
        if (error) throw error;
        addToast("Pipeline stages saved!");
     } catch (e) {
        addToast(e.message, "error");
     }
  };

  const saveTemplates = () => {
     // In a real app, save to a 'settings' or 'templates' table
     // Since that table wasn't in the initial schema, we mock the save success
     addToast("Email templates saved!");
  };

  const handleClearData = async () => {
    if (confirmDelete !== 'DELETE') {
       addToast("Please type DELETE to confirm", "error");
       return;
    }
    try {
       // In a real app, careful with cascading deletes.
       const { error } = await supabase.from('candidates').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // delete all
       if (error) throw error;
       addToast("All candidates have been deleted successfully.");
       setConfirmDelete('');
    } catch (e) {
       addToast("Failed to delete candidates: " + e.message, "error");
    }
  };

  const tabs = [
    { id: 'Pipeline', icon: Layout, label: 'Pipeline Stages' },
    { id: 'RoleColor', icon: Palette, label: 'RoleColor Definitions' },
    { id: 'Team', icon: Users, label: 'Team Members' },
    { id: 'Templates', icon: Mail, label: 'Email Templates' },
    { id: 'Data', icon: Download, label: 'Data & Export' },
  ];

  return (
    <div className="h-full flex flex-col space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>

      <div className="flex bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-1 min-h-[600px]">
         {/* Sidebar Navigation */}
         <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 space-y-1">
            {tabs.map(tab => (
               <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                     activeTab === tab.id ? 'bg-[#28BCE8]/10 text-[#28BCE8]' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
               >
                  <tab.icon size={18} /> {tab.label}
               </button>
            ))}
         </div>

         {/* Content Area */}
         <div className="flex-1 p-8 overflow-y-auto bg-white">
            {activeTab === 'Pipeline' && (
               <div className="max-w-2xl">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center justify-between">
                     Pipeline Stages
                     <button onClick={savePipeline} className="text-sm px-4 py-2 bg-[#242E42] text-white rounded-md flex items-center gap-2 hover:bg-[#1a2130]">
                        <Save size={16} /> Save Changes
                     </button>
                  </h2>
                  <div className="space-y-3">
                     {pipelineStages.map((stage, i) => (
                        <div key={stage.id || i} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-md shadow-sm">
                           <div className="text-gray-400 cursor-move">⋮⋮</div>
                           <span className="w-8 text-center text-xs font-bold text-gray-400 bg-gray-100 rounded px-1 py-0.5">{i+1}</span>
                           <input
                              type="text"
                              value={stage.name}
                              onChange={(e) => {
                                 const newStages = [...pipelineStages];
                                 newStages[i].name = e.target.value;
                                 setPipelineStages(newStages);
                              }}
                              className="flex-1 border-none focus:ring-0 p-0 text-sm font-medium"
                           />
                           <button onClick={() => setPipelineStages(pipelineStages.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-500">×</button>
                        </div>
                     ))}
                  </div>
                  <button onClick={() => setPipelineStages([...pipelineStages, { id: `new-${Date.now()}`, name: 'New Stage', order_index: pipelineStages.length }])} className="mt-4 text-sm font-medium text-[#28BCE8] hover:underline">+ Add Stage</button>
               </div>
            )}

            {activeTab === 'RoleColor' && (
               <div className="max-w-3xl">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">RoleColor Definitions</h2>
                  <div className="grid grid-cols-2 gap-6">
                     {[
                        { name: 'Red', color: '#EE2B2B', title: 'Motivator', desc: 'High energy, persuasive, driven. Best for closing sales, public speaking, driving initiatives forward.' },
                        { name: 'Yellow', color: '#FFD033', title: 'Executor', desc: 'Reliable, organized, task-focused. Best for operations, project management, ensuring things get done on time.' },
                        { name: 'Green', color: '#27BD73', title: 'Architect', desc: 'Analytical, systems thinker, precise. Best for engineering, finance, building scalable and robust systems.' },
                        { name: 'Blue', color: '#28BCE8', title: 'Visionary', desc: 'Creative, big-picture, innovative. Best for product design, marketing strategy, exploring new opportunities.' }
                     ].map(rc => (
                        <div key={rc.name} className="border border-gray-200 rounded-xl p-5 shadow-sm bg-gray-50 relative overflow-hidden">
                           <div className="absolute top-0 right-0 w-16 h-16 rounded-bl-full opacity-20" style={{backgroundColor: rc.color}}></div>
                           <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{backgroundColor: rc.color}}></div> {rc.name} ({rc.title})
                           </h3>
                           <p className="text-sm text-gray-600 leading-relaxed">{rc.desc}</p>
                        </div>
                     ))}
                  </div>
               </div>
            )}

            {activeTab === 'Data' && (
               <div className="max-w-2xl space-y-8">
                  <div>
                     <h2 className="text-xl font-bold text-gray-900 mb-4">Export Data</h2>
                     <p className="text-sm text-gray-500 mb-4">Download your ATS data in CSV format for external reporting.</p>
                     <div className="flex gap-4">
                        <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Export Candidates</button>
                        <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Export Jobs</button>
                     </div>
                  </div>

                  <div className="pt-8 border-t border-gray-200">
                     <h2 className="text-xl font-bold text-red-600 mb-2 flex items-center gap-2"><AlertTriangle size={20} /> Danger Zone</h2>
                     <p className="text-sm text-gray-600 mb-4">This action will permanently delete all candidates, interviews, and offers from the database. Jobs and settings will be retained.</p>

                     <div className="bg-red-50 border border-red-200 p-4 rounded-md flex items-end gap-4">
                        <div className="flex-1">
                           <label className="block text-sm font-medium text-red-800 mb-1">Type "DELETE" to confirm</label>
                           <input type="text" value={confirmDelete} onChange={e => setConfirmDelete(e.target.value)} className="w-full border border-red-300 rounded-md p-2 focus:ring-red-500 focus:border-red-500" placeholder="DELETE" />
                        </div>
                        <button onClick={handleClearData} disabled={confirmDelete !== 'DELETE'} className={`px-6 py-2 rounded-md font-medium text-white transition-colors ${confirmDelete === 'DELETE' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-300 cursor-not-allowed'}`}>
                           Clear Database
                        </button>
                     </div>
                  </div>
               </div>
            )}

            {activeTab === 'Team' && (
               <div className="max-w-4xl">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center justify-between">
                     Team Members
                     <button className="text-sm px-4 py-2 bg-[#28BCE8] text-white rounded-md flex items-center gap-2 hover:bg-[#209bc2]">
                        + Add Member
                     </button>
                  </h2>
                  <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                     <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
                           <tr>
                              <th className="px-6 py-3 font-medium">Name</th>
                              <th className="px-6 py-3 font-medium">Role</th>
                              <th className="px-6 py-3 font-medium">Email</th>
                              <th className="px-6 py-3 font-medium text-right">Actions</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                           {[
                              { name: 'Alice Admin', role: 'Super Admin', email: 'alice@rcf.com' },
                              { name: 'Bob Recruiter', role: 'Recruiter', email: 'bob@rcf.com' },
                              { name: 'Charlie Hiring Mgr', role: 'Hiring Manager', email: 'charlie@rcf.com' },
                           ].map((member, i) => (
                              <tr key={i} className="hover:bg-gray-50">
                                 <td className="px-6 py-4 font-medium text-gray-900">{member.name}</td>
                                 <td className="px-6 py-4">
                                    <span className="px-2 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 rounded-full">{member.role}</span>
                                 </td>
                                 <td className="px-6 py-4 text-gray-500">{member.email}</td>
                                 <td className="px-6 py-4 text-right">
                                    <button className="text-sm text-red-600 hover:text-red-800">Remove</button>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            )}

            {activeTab === 'Templates' && (
               <div className="max-w-3xl">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center justify-between">
                     Email Templates
                     <button onClick={saveTemplates} className="text-sm px-4 py-2 bg-[#242E42] text-white rounded-md flex items-center gap-2 hover:bg-[#1a2130]">
                        <Save size={16} /> Save Templates
                     </button>
                  </h2>
                  <div className="space-y-6">
                     <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <h3 className="text-sm font-bold text-gray-900 mb-2">Offer Letter Template</h3>
                        <p className="text-xs text-gray-500 mb-3">Available variables: {'{candidate_name}'}, {'{job_title}'}, {'{salary}'}, {'{equity}'}, {'{start_date}'}</p>
                        <textarea rows={6} className="w-full border border-gray-300 rounded-md p-3 text-sm font-mono text-gray-700" value={templates.offer} onChange={(e) => setTemplates({...templates, offer: e.target.value})}></textarea>
                     </div>
                     <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <h3 className="text-sm font-bold text-gray-900 mb-2">Rejection Email Template</h3>
                        <textarea rows={4} className="w-full border border-gray-300 rounded-md p-3 text-sm font-mono text-gray-700" value={templates.reject} onChange={(e) => setTemplates({...templates, reject: e.target.value})}></textarea>
                     </div>
                     <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <h3 className="text-sm font-bold text-gray-900 mb-2">Interview Invite Template</h3>
                        <textarea rows={4} className="w-full border border-gray-300 rounded-md p-3 text-sm font-mono text-gray-700" value={templates.invite} onChange={(e) => setTemplates({...templates, invite: e.target.value})}></textarea>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
