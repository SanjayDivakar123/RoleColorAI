import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { X, Mail, Phone, ExternalLink } from 'lucide-react';
import RoleColorBadge from './RoleColorBadge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const ROLE_COLORS = { Red: '#EE2B2B', Yellow: '#FFD033', Green: '#27BD73', Blue: '#28BCE8' };

import { useToast } from './Toast';

export default function CandidateDrawer({ isOpen, onClose, candidateId, onUpdate }) {
  const { addToast } = useToast();
  const [candidate, setCandidate] = useState(null);
  const [activeTab, setActiveTab] = useState('Profile');
  const [loading, setLoading] = useState(false);
  const [activity, setActivity] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [notesList, setNotesList] = useState([]);

  useEffect(() => {
    if (isOpen && candidateId) {
      fetchCandidate();
      fetchActivity();
    } else {
      setCandidate(null);
      setActiveTab('Profile');
      setActivity([]);
      setNotesList([]);
    }
  }, [isOpen, candidateId]);

  const fetchCandidate = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('candidates').select('*, jobs(title)').eq('id', candidateId).single();
    if (!error) {
       setCandidate(data);
       if (data.notes) {
          // simple check if notes is a JSON string of array or just a plain string
          try {
             const parsed = JSON.parse(data.notes);
             if (Array.isArray(parsed)) setNotesList(parsed);
             else setNotesList([{ text: data.notes, author: 'System', time: new Date().toISOString() }]);
          } catch (e) {
             setNotesList([{ text: data.notes, author: 'AI Analysis', time: new Date().toISOString() }]);
          }
       }
    }
    setLoading(false);
  };

  const fetchActivity = async () => {
     const { data } = await supabase.from('activity_log').select('*').eq('candidate_id', candidateId).order('created_at', { ascending: false });
     if (data) setActivity(data);
  };

  const addNote = async () => {
     if (!newNote.trim()) return;
     const newEntry = { text: newNote, author: 'RCF Admin', time: new Date().toISOString() };
     const updatedNotes = [newEntry, ...notesList];

     try {
        const { error } = await supabase.from('candidates').update({ notes: JSON.stringify(updatedNotes) }).eq('id', candidateId);
        if (error) throw error;
        setNotesList(updatedNotes);
        setNewNote('');

        await supabase.from('activity_log').insert([{ action: 'Added a note', candidate_id: candidateId, performed_by: 'RCF Admin' }]);
        fetchActivity();
     } catch (e) {
        addToast("Error saving note", "error");
     }
  };

  if (!isOpen) return null;

  const renderContent = () => {
    if (loading || !candidate) {
      return <div className="p-6 space-y-4 animate-pulse"><div className="h-20 bg-gray-200 rounded"></div><div className="h-40 bg-gray-200 rounded"></div></div>;
    }

    switch (activeTab) {
      case 'Profile':
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
               <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-500 block">Email</span><a href={`mailto:${candidate.email}`} className="text-[#28BCE8] flex items-center gap-1"><Mail size={14}/> {candidate.email}</a></div>
                  <div><span className="text-gray-500 block">Phone</span><a href={`tel:${candidate.phone}`} className="text-gray-900 flex items-center gap-1"><Phone size={14}/> {candidate.phone || 'N/A'}</a></div>
                  <div><span className="text-gray-500 block">Applied Role</span><span className="font-medium text-gray-900">{candidate.jobs?.title || 'General'}</span></div>
                  <div><span className="text-gray-500 block">Source</span><span className="text-gray-900">{candidate.source || 'Direct'}</span></div>
               </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {(candidate.tags || []).map(tag => (
                   <span key={tag} className="px-2 py-1 bg-gray-100 border border-gray-200 rounded-md text-xs text-gray-600">{tag}</span>
                ))}
                <button className="px-2 py-1 bg-white border border-dashed border-gray-300 rounded-md text-xs text-gray-400 hover:text-gray-600">+ Add Tag</button>
              </div>
            </div>
          </div>
        );
      case 'Assessment':
         // Mock Assessment Data based on RoleColor
         const scores = [
            { name: 'Red', score: candidate.rolecolor === 'Red' ? 85 : 30 },
            { name: 'Yellow', score: candidate.rolecolor === 'Yellow' ? 90 : 40 },
            { name: 'Green', score: candidate.rolecolor === 'Green' ? 88 : 35 },
            { name: 'Blue', score: candidate.rolecolor === 'Blue' ? 92 : 45 },
         ];

        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-100">
               <div>
                  <span className="text-sm text-gray-500 block">AI Match Score</span>
                  <span className="text-3xl font-bold text-gray-900">{candidate.score || 0}<span className="text-lg text-gray-400 font-normal">/100</span></span>
               </div>
               <RoleColorBadge color={candidate.rolecolor} className="text-sm px-3 py-1" />
            </div>

            <div>
               <h3 className="font-semibold text-gray-900 mb-4">Axis Breakdown</h3>
               <div className="h-48">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={scores} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={60} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip cursor={{fill: 'transparent'}} />
                      <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
                         {scores.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={ROLE_COLORS[entry.name]} />
                         ))}
                      </Bar>
                    </BarChart>
                 </ResponsiveContainer>
               </div>
            </div>

            <div>
               <h3 className="font-semibold text-gray-900 mb-2">AI Summary</h3>
               <p className="text-sm text-gray-600 leading-relaxed">
                 {candidate.notes || "This candidate exhibits strong traits associated with their primary RoleColor. They are likely to excel in environments that value these specific behavioral characteristics."}
               </p>
            </div>
          </div>
        );
      case 'Notes':
        return (
           <div className="space-y-6 flex flex-col h-full">
              <div>
                 <textarea
                    rows={3}
                    value={newNote}
                    onChange={e => setNewNote(e.target.value)}
                    placeholder="Add a note about this candidate..."
                    className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-[#28BCE8] focus:border-[#28BCE8]"
                 />
                 <div className="flex justify-end mt-2">
                    <button onClick={addNote} disabled={!newNote.trim()} className="px-4 py-2 bg-[#28BCE8] text-white rounded-md text-sm font-medium hover:bg-[#209bc2] disabled:bg-gray-300">
                       Add Note
                    </button>
                 </div>
              </div>

              <div className="flex-1 space-y-4">
                 {notesList.map((note, i) => (
                    <div key={i} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                       <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-900 text-sm">{note.author}</span>
                          <span className="text-xs text-gray-500">{new Date(note.time).toLocaleString()}</span>
                       </div>
                       <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.text}</p>
                    </div>
                 ))}
                 {notesList.length === 0 && (
                    <div className="text-center text-gray-500 py-8">No notes yet.</div>
                 )}
              </div>
           </div>
        );
      case 'Activity':
        return (
           <div className="space-y-6">
              <h3 className="font-semibold text-gray-900 mb-4">Timeline</h3>
              {activity.length > 0 ? (
                 <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
                    {activity.map((log) => (
                       <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white bg-[#28BCE8] text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                          <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-4 rounded border border-gray-200 bg-white shadow-sm">
                             <div className="flex items-center justify-between space-x-2 mb-1">
                                <div className="font-medium text-gray-900 text-sm">{log.action}</div>
                                <time className="text-xs font-medium text-gray-500">{new Date(log.created_at).toLocaleDateString()}</time>
                             </div>
                             <div className="text-xs text-gray-500">By {log.performed_by || 'System'}</div>
                          </div>
                       </div>
                    ))}
                 </div>
              ) : (
                 <div className="text-center text-gray-500 py-8">No activity recorded.</div>
              )}
           </div>
        );
      case 'Resume':
        return (
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
             {candidate.resume_url ? (
                <a href={candidate.resume_url} target="_blank" rel="noreferrer" className="flex flex-col items-center text-[#28BCE8] hover:text-blue-700">
                   <ExternalLink size={32} className="mb-2" />
                   <span className="font-medium">View Resume Document</span>
                </a>
             ) : (
                <div className="text-center text-gray-500">
                   <p>No resume uploaded</p>
                   <button className="mt-2 text-sm text-[#28BCE8] hover:underline">Upload PDF</button>
                </div>
             )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Overlay */}
      <div className={`fixed inset-0 bg-black/30 z-40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />

      {/* Drawer */}
      <div className={`fixed inset-y-0 right-0 w-[480px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-start bg-[#F8F9FB]">
           <div>
             {loading ? <div className="h-6 w-48 bg-gray-200 animate-pulse rounded mb-2"></div> : <h2 className="text-2xl font-bold text-gray-900 mb-1">{candidate?.name}</h2>}
             <div className="flex items-center gap-2">
                {candidate?.rolecolor && <RoleColorBadge color={candidate.rolecolor} />}
                {candidate?.stage && <span className="text-xs font-medium px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full">{candidate.stage}</span>}
             </div>
           </div>
           <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-white rounded-full p-1 shadow-sm"><X size={20} /></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6 mt-2">
          {['Profile', 'Assessment', 'Notes', 'Activity', 'Resume'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 pt-2 px-1 mr-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab ? 'border-[#28BCE8] text-[#28BCE8]' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
           {renderContent()}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-between">
           <button className="text-sm font-medium text-red-600 hover:text-red-800 px-3 py-2">Reject Candidate</button>
           <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 bg-white rounded-md text-gray-700 text-sm font-medium hover:bg-gray-50">Move Stage</button>
              <button className="px-4 py-2 bg-[#242E42] text-white rounded-md text-sm font-medium hover:bg-[#1a2130]">Schedule Int.</button>
           </div>
        </div>

      </div>
    </>
  );
}
