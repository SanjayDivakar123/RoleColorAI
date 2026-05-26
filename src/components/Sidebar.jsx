import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Users, Layout, FileSearch, CalendarDays, FileBadge, BarChart3, Settings, ChevronLeft, ChevronRight } from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Briefcase, label: 'Jobs', path: '/jobs' },
  { icon: Users, label: 'Candidates', path: '/candidates' },
  { icon: Layout, label: 'Pipeline', path: '/pipeline' },
  { icon: FileSearch, label: 'Screening', path: '/screening' },
  { icon: CalendarDays, label: 'Interviews', path: '/interviews' },
  { icon: FileBadge, label: 'Offers', path: '/offers' },
  { icon: BarChart3, label: 'Reports', path: '/reports' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`h-screen bg-[#242E42] text-white transition-all duration-300 flex flex-col ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="p-4 flex items-center justify-between border-b border-gray-700">
        {!collapsed && (
          <div className="font-bold text-xl tracking-tight">
            <span className="text-white">RoleColor</span>
            <span className="text-[#28BCE8]">AI</span>
            <span className="text-gray-400 ml-1 text-sm font-normal">ATS</span>
          </div>
        )}
        {collapsed && <div className="font-bold text-xl text-[#28BCE8] mx-auto">RC</div>}
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 mx-2 rounded-md transition-colors ${
                  isActive
                    ? 'bg-white/10 border-l-4 border-[#28BCE8] pl-3'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white border-l-4 border-transparent'
                }`
              }
            >
              <item.icon className={`h-5 w-5 ${collapsed ? 'mx-auto' : 'mr-3'}`} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-white/5 mx-auto"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {!collapsed && (
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-[#28BCE8] flex items-center justify-center text-white font-bold text-sm">
              AD
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">RCF Admin</p>
              <p className="text-xs text-gray-400">v1.0.0</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
