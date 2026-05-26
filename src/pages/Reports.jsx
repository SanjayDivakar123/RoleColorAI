import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Download, Calendar } from 'lucide-react';

const ROLE_COLORS = { Red: '#EE2B2B', Yellow: '#FFD033', Green: '#27BD73', Blue: '#28BCE8' };

export default function Reports() {
  const [dateRange, setDateRange] = useState('90');
  const [loading, setLoading] = useState(true);

  const [timeToHireData, setTimeToHireData] = useState([]);
  const [funnelData, setFunnelData] = useState([]);
  const [sourceData, setSourceData] = useState([]);
  const [interviewerData, setInterviewerData] = useState([]);
  const [matchAccuracyData, setMatchAccuracyData] = useState([]);
  const [offerAcceptanceData, setOfferAcceptanceData] = useState([]);

  const SOURCE_COLORS = ['#0077b5', '#242E42', '#27BD73', '#8884d8'];

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
       const [{ data: candidates }, { data: interviews }, { data: offers }] = await Promise.all([
          supabase.from('candidates').select('*, jobs(department, target_rolecolor)'),
          supabase.from('interviews').select('*'),
          supabase.from('offers').select('*, candidates(rolecolor)')
       ]);

       if (candidates) {
          const stages = { 'Applied': 0, 'Screening': 0, 'Interview R1': 0, 'Interview R2': 0, 'Final Review': 0, 'Offer': 0, 'Hired': 0 };
          candidates.forEach(c => {
             const stageIdx = Object.keys(stages).indexOf(c.stage);
             if (stageIdx >= 0) {
                Object.keys(stages).forEach((s, idx) => {
                   if (idx <= stageIdx) stages[s]++;
                });
             }
          });
          setFunnelData(Object.entries(stages).map(([stage, count]) => ({ stage, count })).filter(d => d.count > 0));

          const sources = {};
          candidates.forEach(c => {
             const s = c.source || 'Direct';
             sources[s] = (sources[s] || 0) + 1;
          });
          setSourceData(Object.entries(sources).map(([name, value]) => ({ name, value })));

          const deptTTH = {};
          candidates.filter(c => c.stage === 'Hired').forEach(c => {
             const dept = c.jobs?.department || 'General';
             const days = Math.ceil(Math.abs(new Date() - new Date(c.created_at)) / (1000 * 60 * 60 * 24));
             if (!deptTTH[dept]) deptTTH[dept] = { Red: 0, Yellow: 0, Green: 0, Blue: 0, count: 0 };
             if (c.rolecolor) {
                deptTTH[dept][c.rolecolor] += days;
             }
             deptTTH[dept].count++;
          });
          const tthFormatted = Object.entries(deptTTH).map(([dept, vals]) => ({
             dept,
             Red: vals.count > 0 ? Math.round(vals.Red / vals.count) : 0,
             Yellow: vals.count > 0 ? Math.round(vals.Yellow / vals.count) : 0,
             Green: vals.count > 0 ? Math.round(vals.Green / vals.count) : 0,
             Blue: vals.count > 0 ? Math.round(vals.Blue / vals.count) : 0,
          }));
          setTimeToHireData(tthFormatted);

          let matched = 0; let mismatched = 0;
          candidates.filter(c => c.stage === 'Hired').forEach(c => {
             if (c.rolecolor && c.jobs?.target_rolecolor && c.jobs.target_rolecolor !== 'Any') {
                if (c.rolecolor === c.jobs.target_rolecolor) matched++;
                else mismatched++;
             }
          });
          setMatchAccuracyData([
             { name: 'Matched', value: matched },
             { name: 'Mismatched', value: mismatched }
          ]);
       }

       if (interviews && offers) {
          const intStats = {};
          interviews.forEach(i => {
             if (!intStats[i.interviewer]) intStats[i.interviewer] = { int: 0, off: 0 };
             intStats[i.interviewer].int++;
          });
          offers.forEach(o => {
             const candidateInterviews = interviews.filter(i => i.candidate_id === o.candidate_id);
             candidateInterviews.forEach(i => {
                if (intStats[i.interviewer]) intStats[i.interviewer].off++;
             });
          });
          const intFormatted = Object.entries(intStats).map(([name, stats]) => ({
             name,
             int: stats.int,
             off: stats.off,
             rate: stats.int > 0 ? Math.round((stats.off / stats.int) * 100) + '%' : '0%'
          }));
          setInterviewerData(intFormatted);
       }

       if (offers) {
          const accStats = { Red: { sent: 0, acc: 0 }, Yellow: { sent: 0, acc: 0 }, Green: { sent: 0, acc: 0 }, Blue: { sent: 0, acc: 0 } };
          offers.forEach(o => {
             const rc = o.candidates?.rolecolor;
             if (rc && accStats[rc]) {
                if (o.status !== 'Draft') accStats[rc].sent++;
                if (o.status === 'Accepted') accStats[rc].acc++;
             }
          });
          const accFormatted = Object.entries(accStats).map(([color, stats]) => ({
             color,
             Rate: stats.sent > 0 ? Math.round((stats.acc / stats.sent) * 100) : 0
          }));
          setOfferAcceptanceData(accFormatted);
       }

    } catch (e) {
       console.error("Error fetching reports", e);
    } finally {
       setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6 overflow-y-auto pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-3 py-2 shadow-sm text-sm">
              <Calendar size={16} className="text-gray-400" />
              <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="bg-transparent focus:outline-none font-medium text-gray-700">
                 <option value="30">Last 30 Days</option>
                 <option value="90">Last 90 Days</option>
                 <option value="180">Last 180 Days</option>
                 <option value="365">Last 365 Days</option>
              </select>
           </div>
           <button className="flex items-center gap-2 px-4 py-2 bg-[#28BCE8] text-white rounded-md shadow-sm hover:bg-[#209bc2] font-medium text-sm">
             <Download size={16} /> Export All
           </button>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-gray-500">Loading reports...</div>
      ) : (
      <div className="grid grid-cols-2 gap-6">
         {/* Time to Hire */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-lg font-semibold text-gray-900">Avg. Time-to-Hire (Days)</h2>
               <button className="text-gray-400 hover:text-gray-600"><Download size={16}/></button>
            </div>
            <div className="h-72">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeToHireData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} />
                     <XAxis dataKey="dept" tickLine={false} axisLine={false} />
                     <YAxis tickLine={false} axisLine={false} />
                     <Tooltip cursor={{fill: '#f3f4f6'}} />
                     <Bar dataKey="Red" stackId="a" fill={ROLE_COLORS.Red} barSize={40} />
                     <Bar dataKey="Yellow" stackId="a" fill={ROLE_COLORS.Yellow} />
                     <Bar dataKey="Green" stackId="a" fill={ROLE_COLORS.Green} />
                     <Bar dataKey="Blue" stackId="a" fill={ROLE_COLORS.Blue} radius={[4, 4, 0, 0]} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Pipeline Funnel */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-lg font-semibold text-gray-900">Pipeline Funnel Conversion</h2>
               <button className="text-gray-400 hover:text-gray-600"><Download size={16}/></button>
            </div>
            <div className="h-72">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={funnelData} layout="vertical" margin={{top: 10, right: 30, left: 20, bottom: 0}}>
                     <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                     <XAxis type="number" hide />
                     <YAxis dataKey="stage" type="category" tickLine={false} axisLine={false} />
                     <Tooltip />
                     <Area type="monotone" dataKey="count" stroke="#28BCE8" fill="#e0f2fe" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Source Attribution */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-lg font-semibold text-gray-900">Candidate Sources</h2>
               <button className="text-gray-400 hover:text-gray-600"><Download size={16}/></button>
            </div>
            <div className="h-72">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                     <Pie data={sourceData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {sourceData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={SOURCE_COLORS[index % SOURCE_COLORS.length]} />
                        ))}
                     </Pie>
                     <Tooltip />
                  </PieChart>
               </ResponsiveContainer>
               <div className="flex justify-center gap-4 mt-4">
                  {sourceData.map((s, i) => (
                     <div key={s.name} className="flex items-center text-xs text-gray-500">
                        <div className="w-3 h-3 rounded-full mr-1" style={{backgroundColor: SOURCE_COLORS[i]}}></div> {s.name}
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Interview-to-Offer Table */}
         <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
               <h2 className="text-lg font-semibold text-gray-900">Interview-to-Offer Rate</h2>
               <button className="text-gray-400 hover:text-gray-600"><Download size={16}/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-0">
               <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 sticky top-0">
                     <tr>
                        <th className="px-6 py-3 font-medium">Interviewer</th>
                        <th className="px-6 py-3 font-medium text-right">Interviews</th>
                        <th className="px-6 py-3 font-medium text-right">Offers Extended</th>
                        <th className="px-6 py-3 font-medium text-right">Rate</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                     {interviewerData.map((row, i) => (
                        <tr key={i}>
                           <td className="px-6 py-3 font-medium text-gray-900">{row.name}</td>
                           <td className="px-6 py-3 text-right text-gray-600">{row.int}</td>
                           <td className="px-6 py-3 text-right text-gray-600">{row.off}</td>
                           <td className="px-6 py-3 text-right font-medium text-[#28BCE8]">{row.rate}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* RoleColor Match Accuracy */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-lg font-semibold text-gray-900">RoleColor Match Accuracy</h2>
               <button className="text-gray-400 hover:text-gray-600"><Download size={16}/></button>
            </div>
            <div className="h-72">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                     <Pie data={matchAccuracyData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        <Cell fill="#27BD73" />
                        <Cell fill="#EE2B2B" />
                     </Pie>
                     <Tooltip />
                  </PieChart>
               </ResponsiveContainer>
               <div className="flex justify-center gap-4 mt-4">
                  <div className="flex items-center text-xs text-gray-500"><div className="w-3 h-3 rounded-full mr-1 bg-[#27BD73]"></div> Matched</div>
                  <div className="flex items-center text-xs text-gray-500"><div className="w-3 h-3 rounded-full mr-1 bg-[#EE2B2B]"></div> Mismatched</div>
               </div>
            </div>
         </div>

         {/* Offer Acceptance Rate by RoleColor */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-lg font-semibold text-gray-900">Offer Acceptance Rate (%)</h2>
               <button className="text-gray-400 hover:text-gray-600"><Download size={16}/></button>
            </div>
            <div className="h-72">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={offerAcceptanceData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} />
                     <XAxis dataKey="color" tickLine={false} axisLine={false} />
                     <YAxis tickLine={false} axisLine={false} />
                     <Tooltip cursor={{fill: '#f3f4f6'}} />
                     <Bar dataKey="Rate" barSize={40}>
                        {offerAcceptanceData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={ROLE_COLORS[entry.color]} />
                        ))}
                     </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

      </div>
      )}
    </div>
  );
}
