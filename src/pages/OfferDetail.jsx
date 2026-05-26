import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useParams, useNavigate } from 'react-router-dom';
import RoleColorBadge from '../components/RoleColorBadge';
import { ArrowLeft, Edit, FileText, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '../components/Toast';

export default function OfferDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOffer = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('offers')
       .select(`*, candidates(name, rolecolor, email), jobs(title)`)
       .eq('id', id).single();
    if (!error && data) {
      setOffer(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (id) fetchOffer();
  }, [id]);

  const updateStatus = async (status) => {
     try {
        const { error } = await supabase.from('offers').update({ status }).eq('id', id);
        if (error) throw error;
        addToast(`Offer status updated to ${status}`);
        fetchOffer();
     } catch (error) {
        addToast(error.message, "error");
     }
  };

  if (loading) return <div className="p-8 animate-pulse"><div className="h-8 bg-gray-200 w-1/3 mb-4 rounded"></div><div className="h-32 bg-gray-200 w-full rounded"></div></div>;
  if (!offer) return <div className="p-8">Offer not found.</div>;

  const letterPreview = `Dear ${offer.candidates?.name},\n\nWe are thrilled to offer you the position of ${offer.jobs?.title} at RoleColorFinder. Your compensation will be $${offer.salary?.toLocaleString()} per year with ${offer.equity}% equity. We would like you to start on ${offer.start_date ? new Date(offer.start_date).toLocaleDateString() : 'TBD'}.\n\nBest regards,\nRCF Hiring Team`;

  return (
    <div className="h-full flex flex-col space-y-6 max-w-4xl mx-auto">
      <div>
        <button onClick={() => navigate('/offers')} className="text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-4 text-sm font-medium">
          <ArrowLeft size={16} /> Back to Offers
        </button>
        <div className="flex justify-between items-start">
           <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                 Offer for {offer.candidates?.name}
                 <RoleColorBadge color={offer.candidates?.rolecolor} />
              </h1>
              <p className="text-gray-600 font-medium">{offer.jobs?.title}</p>
           </div>
           <div>
               <span className={`px-3 py-1 font-medium text-sm rounded-full ${offer.status === 'Accepted' ? 'bg-green-100 text-green-700' : offer.status === 'Declined' ? 'bg-red-100 text-red-700' : offer.status === 'Sent' ? 'bg-blue-100 text-blue-700' : offer.status === 'Countered' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                 {offer.status}
               </span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
         {/* Actions & Metadata */}
         <div className="col-span-1 space-y-4">
            <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm space-y-4">
               <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Offer Details</h3>
               <div className="space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Base Salary</span><span className="font-medium text-gray-900">${offer.salary?.toLocaleString()}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Equity</span><span className="font-medium text-gray-900">{offer.equity}%</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Start Date</span><span className="font-medium text-gray-900">{offer.start_date ? new Date(offer.start_date).toLocaleDateString() : 'TBD'}</span></div>
               </div>
            </div>

            <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm">
               <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider mb-4">Update Status</h3>
               <div className="space-y-2">
                  {offer.status === 'Draft' ? (
                     <button onClick={() => updateStatus('Sent')} className="w-full py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">Mark as Sent</button>
                  ) : (
                     <>
                        <button onClick={() => updateStatus('Accepted')} className="w-full py-2 border border-green-500 text-green-700 hover:bg-green-50 rounded-md text-sm font-medium flex items-center justify-center gap-2"><CheckCircle size={16}/> Accepted</button>
                        <button onClick={() => updateStatus('Declined')} className="w-full py-2 border border-red-500 text-red-700 hover:bg-red-50 rounded-md text-sm font-medium flex items-center justify-center gap-2"><XCircle size={16}/> Declined</button>
                        <button onClick={() => updateStatus('Countered')} className="w-full py-2 border border-yellow-500 text-yellow-700 hover:bg-yellow-50 rounded-md text-sm font-medium">Countered</button>
                     </>
                  )}
               </div>
            </div>
         </div>

         {/* Letter Preview */}
         <div className="col-span-2">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
               <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
                  <FileText size={18} className="text-gray-400" />
                  <h2 className="text-sm font-bold text-gray-900">Offer Letter Preview</h2>
               </div>
               <div className="p-8 flex-1 bg-[#F8F9FB]">
                  <div className="bg-white border border-gray-200 shadow-sm rounded-md p-8 min-h-full font-serif text-gray-800 whitespace-pre-wrap leading-relaxed">
                     {letterPreview}
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
