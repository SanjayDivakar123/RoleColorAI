import React, { useState } from 'react';

export default function PINGate({ onUnlock }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handlePinChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 4) {
      setPin(value);
      setError(false);
      if (value === '8132') {
        setTimeout(onUnlock, 300);
      } else if (value.length === 4) {
        setError(true);
        setTimeout(() => setPin(''), 800);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#242E42] flex flex-col items-center justify-center text-white">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2 tracking-tight">
          RoleColor<span className="text-[#28BCE8]">AI</span>
        </h1>
        <p className="text-gray-400 text-sm tracking-widest uppercase">
          Internal Access Only — RCF Team
        </p>
      </div>

      <div className={`transition-transform duration-200 ${error ? 'animate-shake' : ''}`}>
        <input
          type="password"
          value={pin}
          onChange={handlePinChange}
          className={`w-48 bg-transparent border-b-4 text-center text-5xl pb-2 focus:outline-none transition-colors ${
            error ? 'border-[#EE2B2B] text-[#EE2B2B]' : 'border-gray-500 text-white focus:border-[#28BCE8]'
          }`}
          placeholder="••••"
          autoFocus
        />
      </div>

      {error && (
        <p className="text-[#EE2B2B] mt-4 font-medium animate-fade-in">
          Access Denied
        </p>
      )}
    </div>
  );
}
