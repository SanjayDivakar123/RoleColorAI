import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Briefcase, Users, CalendarDays, FileBadge } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ROLE_COLORS = {
  Red: '#EE2B2B',
  Yellow: '#FFD033',
  Green: '#27BD73',
  Blue: '#28BCE8'
};

export default function Dashboard() {
  const [metrics, setMetrics] = useState({ openRoles: 0, activeCandidates: 0, interviews: 0, offers: 0 });
  const [colorDistribution, setColorDistribution] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [topJobs, setTopJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch metrics
        const { count: openRoles } = await supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'Open');
        const { count: activeCandidates } = await supabase.from('candidates').select('*', { count: 'exact', head: true }).not('stage', 'in', '("Hired","Rejected")');
        // Simplified for mock: interviews this week -> all interviews, offers pending -> all offers
        const { count: interviews } = await supabase.from('interviews').select('*', { count: 'exact', head: true });
        const { count: offers } = await supabase.from('offers').select('*', { count: 'exact', head: true }).eq('status', 'Draft');

        setMetrics({
          openRoles: openRoles || 0,
          activeCandidates: activeCandidates || 0,
          interviews: interviews || 0,
          offers: offers || 0
        });

        // RoleColor Distribution
        const { data: candidates } = await supabase.from('candidates').select('rolecolor');
        const colorCounts = candidates?.reduce((acc, curr) => {
          if (curr.rolecolor) acc[curr.rolecolor] = (acc[curr.rolecolor] || 0) + 1;
          return acc;
        }, {});

        if (colorCounts) {
          setColorDistribution(
            Object.keys(colorCounts).map(key => ({ name: key, value: colorCounts[key] }))
          );
        }

        // Recent Activity
        const { data: activity } = await supabase.from('activity_log').select('*').order('created_at', { ascending: false }).limit(10);
        setRecentActivity(activity || []);

        // Top Jobs
        const { data: jobData } = await supabase.from('jobs').select('id, title');
        const { data: candData } = await supabase.from('candidates').select('applied_role_id');

        if (jobData && candData) {
           const jobCounts = candData.reduce((acc, curr) => {
             if (curr.applied_role_id) acc[curr.applied_role_id] = (acc[curr.applied_role_id] || 0) + 1;
             return acc;
           }, {});

           const mappedJobs = jobData.map(job => ({
             name: job.title,
             applicants: jobCounts[job.id] || 0
           })).sort((a, b) => b.applicants - a.applicants).slice(0, 5);
           setTopJobs(mappedJobs);
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
         <div className="grid grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-24 bg-white rounded-xl shadow-sm border border-gray-200 animate-pulse" />)}
         </div>
         <div className="grid grid-cols-2 gap-6">
            <div className="h-64 bg-white rounded-xl shadow-sm border border-gray-200 animate-pulse" />
            <div className="h-64 bg-white rounded-xl shadow-sm border border-gray-200 animate-pulse" />
         </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex gap-3">
           <button onClick={() => navigate('/jobs')} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-md shadow-sm hover:bg-gray-50 text-sm font-medium">Post a Job</button>
           <button onClick={() => navigate('/candidates')} className="px-4 py-2 bg-[#242E42] text-white rounded-md shadow-sm hover:bg-[#1a2130] text-sm font-medium">Add Candidate</button>
           <button onClick={() => navigate('/interviews')} className="px-4 py-2 bg-[#28BCE8] text-white rounded-md shadow-sm hover:bg-[#209bc2] text-sm font-medium">Schedule Interview</button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Open Roles', value: metrics.openRoles, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-100' },
          { label: 'Active Candidates', value: metrics.activeCandidates, icon: Users, color: 'text-green-600', bg: 'bg-green-100' },
          { label: 'Interviews This Week', value: metrics.interviews, icon: CalendarDays, color: 'text-purple-600', bg: 'bg-purple-100' },
          { label: 'Offers Pending', value: metrics.offers, icon: FileBadge, color: 'text-orange-600', bg: 'bg-orange-100' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center">
            <div className={`p-3 rounded-full ${stat.bg} ${stat.color} mr-4`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RoleColor Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">RoleColor Distribution</h2>
          <div className="h-64">
            {colorDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={colorDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                    {colorDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={ROLE_COLORS[entry.name] || '#ccc'} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">No candidate data available</div>
            )}
          </div>
        </div>

        {/* Top Jobs */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Jobs by Applicants</h2>
          <div className="h-64">
            {topJobs.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topJobs} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                  <RechartsTooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="applicants" fill="#242E42" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
               <div className="h-full flex items-center justify-center text-gray-500">No job data available</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
         <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
         {recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((log) => (
                <div key={log.id} className="flex items-start text-sm border-b border-gray-100 pb-3 last:border-0">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-[#28BCE8] mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-gray-900">{log.action}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{new Date(log.created_at).toLocaleString()} by {log.performed_by || 'System'}</p>
                  </div>
                </div>
              ))}
            </div>
         ) : (
            <div className="py-8 text-center text-gray-500">No recent activity</div>
         )}
      </div>

    </div>
  );
}
