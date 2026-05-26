import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import OfferModal from '../components/OfferModal';
import { useToast } from '../components/Toast';
import { Plus, Check, X, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Offers() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [metrics, setMetrics] = useState({ total: 0, accepted: 0, rate: 0 });

  const fetchOffers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('offers')
      .select(`*, candidates(name, rolecolor), jobs(title)`)
      .order('created_at', { ascending: false });

    if (!error && data) {
       setOffers(data);

       const total = data.filter(o => o.status !== 'Draft').length;
       const accepted = data.filter(o => o.status === 'Accepted').length;
       setMetrics({
          total,
          accepted,
          rate: total > 0 ? Math.round((accepted / total) * 100) : 0
       });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const updateStatus = async (id, status) => {
     try {
        const { error } = await supabase.from('offers').update({ status }).eq('id', id);
        if (error) throw error;
        addToast(`Offer marked as ${status}`);
        fetchOffers();
     } catch (e) {
        addToast(e.message, "error");
     }
  };

  const getStatusBadge = (status) => {
     const styles = {
        'Draft': 'bg-gray-100 text-gray-700',
        'Sent': 'bg-blue-100 text-blue-700',
        'Accepted': 'bg-green-100 text-green-700',
        'Declined': 'bg-red-100 text-red-700',
        'Countered': 'bg-yellow-100 text-yellow-700'
     };
     return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{status}</span>;
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Offer Management</h1>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700 font-medium text-sm">
          <Plus size={16} /> Create Offer
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4">
         <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-500 mb-1">Total Offers Sent</p>
            <p className="text-2xl font-bold text-gray-900">{metrics.total}</p>
         </div>
         <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-500 mb-1">Acceptance Rate</p>
            <p className="text-2xl font-bold text-green-600">{metrics.rate}%</p>
         </div>
         <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-500 mb-1">Avg Time to Accept</p>
            <p className="text-2xl font-bold text-gray-900">3.2 days</p> {/* Hardcoded for UI demo */}
         </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
              <tr>
                <th className="px-6 py-3 font-medium">Candidate</th>
                <th className="px-6 py-3 font-medium">Role</th>
                <th className="px-6 py-3 font-medium">Compensation</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Start Date</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                [1,2,3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="6" className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
                  </tr>
                ))
              ) : offers.length === 0 ? (
                 <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">No offers found.</td>
                 </tr>
              ) : (
                offers.map(offer => (
                  <tr key={offer.id} className="hover:bg-[#F8F9FB] transition-colors cursor-pointer" onClick={() => navigate(`/offers/${offer.id}`)}>
                    <td className="px-6 py-4 font-medium text-gray-900">
                       <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{backgroundColor: offer.candidates?.rolecolor === 'Red' ? '#EE2B2B' : offer.candidates?.rolecolor === 'Yellow' ? '#FFD033' : offer.candidates?.rolecolor === 'Green' ? '#27BD73' : '#28BCE8'}}></div>
                          {offer.candidates?.name}
                       </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{offer.jobs?.title}</td>
                    <td className="px-6 py-4">
                       <div className="font-medium text-gray-900">${offer.salary?.toLocaleString()}</div>
                       <div className="text-xs text-gray-500">{offer.equity}% equity</div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(offer.status)}</td>
                    <td className="px-6 py-4 text-gray-500">{offer.start_date ? new Date(offer.start_date).toLocaleDateString() : 'TBD'}</td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                       {offer.status === 'Sent' && (
                          <div className="flex justify-end gap-2">
                             <button onClick={() => updateStatus(offer.id, 'Accepted')} className="p-1 text-green-600 hover:bg-green-50 rounded" title="Mark Accepted"><Check size={18}/></button>
                             <button onClick={() => updateStatus(offer.id, 'Countered')} className="p-1 text-yellow-600 hover:bg-yellow-50 rounded" title="Countered"><ArrowUpRight size={18}/></button>
                             <button onClick={() => updateStatus(offer.id, 'Declined')} className="p-1 text-red-600 hover:bg-red-50 rounded" title="Declined"><X size={18}/></button>
                          </div>
                       )}
                       {offer.status === 'Draft' && (
                          <button onClick={() => updateStatus(offer.id, 'Sent')} className="text-sm font-medium text-blue-600 hover:underline">Send Now</button>
                       )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <OfferModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={() => { setIsModalOpen(false); fetchOffers(); }} />
    </div>
  );
}
