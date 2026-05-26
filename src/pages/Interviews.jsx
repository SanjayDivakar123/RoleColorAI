import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import InterviewModal from '../components/InterviewModal';
import RoleColorBadge from '../components/RoleColorBadge';
import { Calendar as CalendarIcon, Clock, Video, Phone, MapPin, Plus, User } from 'lucide-react';
import { format, isSameDay, addDays, startOfWeek } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export default function Interviews() {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Weekly calendar state (starts Monday)
  const [currentDate, setCurrentDate] = useState(new Date());

  const fetchInterviews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('interviews')
      .select(`*, candidates(name, rolecolor), jobs(title)`)
      .order('scheduled_at', { ascending: true });

    if (!error && data) {
       setInterviews(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 5 }).map((_, i) => addDays(startDate, i));

  const getInterviewsForDay = (date) => {
     return interviews.filter(inv => isSameDay(new Date(inv.scheduled_at), date));
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Interviews</h1>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-[#242E42] text-white rounded-md shadow-sm hover:bg-[#1a2130] font-medium text-sm">
          <Plus size={16} /> Schedule Interview
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex-1 flex flex-col overflow-hidden">
         {/* Calendar Header */}
         <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-4">
               <button onClick={() => setCurrentDate(addDays(currentDate, -7))} className="p-1 hover:bg-gray-200 rounded">&lt;</button>
               <h2 className="text-lg font-bold text-gray-900">
                 {format(startDate, 'MMM d')} - {format(addDays(startDate, 4), 'MMM d, yyyy')}
               </h2>
               <button onClick={() => setCurrentDate(addDays(currentDate, 7))} className="p-1 hover:bg-gray-200 rounded">&gt;</button>
            </div>
            <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 bg-white border border-gray-300 rounded text-sm font-medium hover:bg-gray-50">Today</button>
         </div>

         {/* Calendar Grid */}
         <div className="flex-1 flex overflow-x-auto">
            {weekDays.map(day => (
               <div key={day.toISOString()} className="flex-1 min-w-[200px] border-r border-gray-200 last:border-r-0 flex flex-col">
                  <div className={`p-3 text-center border-b border-gray-200 ${isSameDay(day, new Date()) ? 'bg-indigo-50 text-indigo-700' : 'bg-white'}`}>
                     <div className="text-sm font-medium">{format(day, 'EEEE')}</div>
                     <div className="text-2xl font-bold mt-1">{format(day, 'd')}</div>
                  </div>
                  <div className="flex-1 p-2 bg-gray-50/50 space-y-2 overflow-y-auto">
                     {getInterviewsForDay(day).map(inv => (
                        <div key={inv.id} onClick={() => navigate(`/interviews/${inv.id}`)} className="bg-white border border-gray-200 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4" style={{borderLeftColor: inv.candidates?.rolecolor === 'Red' ? '#EE2B2B' : inv.candidates?.rolecolor === 'Yellow' ? '#FFD033' : inv.candidates?.rolecolor === 'Green' ? '#27BD73' : '#28BCE8'}}>
                           <div className="flex justify-between items-start mb-1">
                              <span className="font-semibold text-sm text-gray-900 truncate pr-2">{inv.candidates?.name}</span>
                           </div>
                           <div className="text-xs text-[#28BCE8] font-medium truncate mb-2">{inv.jobs?.title}</div>

                           <div className="space-y-1 text-xs text-gray-500">
                              <div className="flex items-center gap-1"><Clock size={12}/> {format(new Date(inv.scheduled_at), 'h:mm a')}</div>
                              <div className="flex items-center gap-1"><User size={12}/> {inv.interviewer}</div>
                              <div className="flex items-center gap-1">
                                 {inv.type === 'Video' ? <Video size={12}/> : inv.type === 'Phone' ? <Phone size={12}/> : <MapPin size={12}/>}
                                 {inv.type}
                              </div>
                           </div>
                        </div>
                     ))}
                     {getInterviewsForDay(day).length === 0 && (
                        <div className="text-center text-sm text-gray-400 py-8 italic">No interviews</div>
                     )}
                  </div>
               </div>
            ))}
         </div>
      </div>

      <InterviewModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={() => { setIsModalOpen(false); fetchInterviews(); }} />
    </div>
  );
}
