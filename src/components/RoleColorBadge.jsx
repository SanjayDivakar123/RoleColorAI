import React from 'react';

const colorMap = {
  Red: { bg: 'bg-[#EE2B2B]', text: 'text-white' },
  Yellow: { bg: 'bg-[#FFD033]', text: 'text-[#242E42]' },
  Green: { bg: 'bg-[#27BD73]', text: 'text-white' },
  Blue: { bg: 'bg-[#28BCE8]', text: 'text-white' },
  Any: { bg: 'bg-gray-200', text: 'text-gray-800' }
};

export default function RoleColorBadge({ color, className = '' }) {
  if (!color) return null;
  const style = colorMap[color] || { bg: 'bg-gray-200', text: 'text-gray-800' };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text} ${className}`}>
      {color}
    </span>
  );
}
