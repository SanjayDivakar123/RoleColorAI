import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useParams, useNavigate } from 'react-router-dom';
import RoleColorBadge from '../components/RoleColorBadge';
import { ArrowLeft, Video, Phone, MapPin, Clock, User, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '../components/Toast';

export default function InterviewDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  const [feedbackForm, setFeedbackForm] = useState({
     rating: 0,
     rolecolor_alignment: 'Partial',
     feedback_notes: '',
     recommendation: ''
  });

  const fetchInterview = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('interviews')
       .select(`*, candidates(name, rolecolor, email), jobs(title, target_rolecolor)`)
       .eq('id', id).single();
    if (!error && data) {
      setInterview(data);
      if (data.feedback_rating) {
         setFeedbackForm({
            rating: data.feedback_rating,
            rolecolor_alignment: 'Partial', // Simplified for demo if not in schema
            feedback_notes: data.feedback_notes || '',
            recommendation: data.recommendation || ''
         });
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (id) fetchInterview();
  }, [id]);

  const submitFeedback = async () => {
     try {
        const { error } = await supabase.from('interviews').update({
           feedback_rating: feedbackForm.rating,
           feedback_notes: feedbackForm.feedback_notes,
           recommendation: feedbackForm.recommendation
        }).eq('id', id);

        if (error) throw error;
        addToast("Feedback submitted successfully");
        fetchInterview();
     } catch (error) {
        addToast(error.message, "error");
     }
  };

  if (loading) return <div className="p-8 animate-pulse"><div className="h-8 bg-gray-200 w-1/3 mb-4 rounded"></div><div className="h-32 bg-gray-200 w-full rounded"></div></div>;
  if (!interview) return <div className="p-8">Interview not found.</div>;

  return (
    <div className="h-full flex flex-col space-y-6 max-w-4xl mx-auto">
      <div>
        <button onClick={() => navigate('/interviews')} className="text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-4 text-sm font-medium">
          <ArrowLeft size={16} /> Back to Interviews
        </button>
        <div className="flex justify-between items-start">
           <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                 {interview.candidates?.name}
                 <RoleColorBadge color={interview.candidates?.rolecolor} />
              </h1>
              <p className="text-gray-600 font-medium">{interview.jobs?.title}</p>
           </div>
           {interview.feedback_rating ? (
              <span className="px-3 py-1 bg-green-100 text-green-700 font-medium text-sm rounded-full flex items-center gap-1">
                 <CheckCircle size={16} /> Feedback Submitted
              </span>
           ) : (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 font-medium text-sm rounded-full flex items-center gap-1">
                 <AlertTriangle size={16} /> Needs Feedback
              </span>
           )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
         {/* Metadata */}
         <div className="col-span-1 space-y-4">
            <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm space-y-4">
               <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Details</h3>
               <div className="flex items-start gap-3 text-sm text-gray-600">
                  <Clock size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>{new Date(interview.scheduled_at).toLocaleString()}</div>
               </div>
               <div className="flex items-start gap-3 text-sm text-gray-600">
                  <User size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>{interview.interviewer}</div>
               </div>
               <div className="flex items-start gap-3 text-sm text-gray-600">
                  {interview.type === 'Video' ? <Video size={18} className="text-gray-400 mt-0.5 flex-shrink-0"/> : interview.type === 'Phone' ? <Phone size={18} className="text-gray-400 mt-0.5 flex-shrink-0"/> : <MapPin size={18} className="text-gray-400 mt-0.5 flex-shrink-0"/>}
                  <div>{interview.type}</div>
               </div>
               <div className="pt-4 border-t border-gray-100">
                  <span className="block text-xs font-medium text-gray-500 mb-1">Pre-interview Notes</span>
                  <p className="text-sm text-gray-700">{interview.notes || 'None'}</p>
               </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl shadow-sm">
               <h3 className="font-bold text-blue-900 text-sm uppercase tracking-wider mb-2">Target Alignment</h3>
               <p className="text-sm text-blue-800 mb-2">The target RoleColor for this job is:</p>
               <RoleColorBadge color={interview.jobs?.target_rolecolor} />
            </div>
         </div>

         {/* Feedback Form */}
         <div className="col-span-2">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
               <div className="p-5 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-lg font-bold text-gray-900">Post-Interview Feedback</h2>
               </div>
               <div className="p-6 space-y-6">
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Overall Rating</label>
                     <div className="flex gap-2">
                        {[1,2,3,4,5].map(star => (
                           <button
                              key={star}
                              onClick={() => setFeedbackForm({...feedbackForm, rating: star})}
                              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${
                                 feedbackForm.rating >= star ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                              }`}
                           >
                              ★
                           </button>
                        ))}
                     </div>
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">RoleColor Alignment</label>
                     <p className="text-xs text-gray-500 mb-3">Did the candidate exhibit behaviors associated with the target RoleColor?</p>
                     <div className="flex gap-3">
                        {['Yes', 'Partial', 'No'].map(opt => (
                           <button
                              key={opt}
                              onClick={() => setFeedbackForm({...feedbackForm, rolecolor_alignment: opt})}
                              className={`flex-1 py-2 rounded-md border text-sm font-medium transition-colors ${
                                 feedbackForm.rolecolor_alignment === opt
                                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                                    : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                              }`}
                           >
                              {opt}
                           </button>
                        ))}
                     </div>
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Written Feedback</label>
                     <textarea
                        rows={4}
                        value={feedbackForm.feedback_notes}
                        onChange={e => setFeedbackForm({...feedbackForm, feedback_notes: e.target.value})}
                        className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-[#28BCE8] focus:border-[#28BCE8]"
                        placeholder="Provide specific examples from the interview..."
                     />
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-3">Final Recommendation</label>
                     <div className="flex gap-3">
                        {['Advance', 'Hold', 'Reject'].map(rec => (
                           <button
                              key={rec}
                              onClick={() => setFeedbackForm({...feedbackForm, recommendation: rec})}
                              className={`flex-1 py-3 rounded-lg border-2 text-sm font-bold transition-all ${
                                 feedbackForm.recommendation === rec
                                    ? rec === 'Advance' ? 'bg-green-50 border-green-500 text-green-700'
                                    : rec === 'Reject' ? 'bg-red-50 border-red-500 text-red-700'
                                    : 'bg-yellow-50 border-yellow-500 text-yellow-700'
                                    : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                              }`}
                           >
                              {rec.toUpperCase()}
                           </button>
                        ))}
                     </div>
                  </div>
               </div>
               <div className="p-5 border-t border-gray-200 bg-gray-50 flex justify-end">
                  <button onClick={submitFeedback} className="px-6 py-2 bg-[#242E42] text-white rounded-md hover:bg-[#1a2130] font-medium text-sm">
                     Submit Feedback
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
