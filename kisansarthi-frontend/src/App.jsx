import React, { useState, useEffect } from 'react';
import { Sprout, LogOut, LayoutDashboard, UserCheck, Bell } from 'lucide-react';
import Auth from './components/Auth';
import WeatherWidget from './components/WeatherWidget';
import CropTracker from './components/CropTracker';

const API_URL = 'http://localhost:5000/api';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [crops, setCrops] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token && user) {
      fetchCrops();
    }
  }, [token]);

  const fetchCrops = async () => {
    try {
      const res = await fetch(`${API_URL}/crops`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCrops(data);
      } else {
        handleLogout();
      }
    } catch (err) {
      console.error('Failed to fetch crops', err);
    }
  };

  const handleLogin = async (credentials) => {
    setError('');
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Connection failed. Is backend running on port 5000?');
    }
  };

  const handleRegister = async (userData, onSuccess) => {
    setError('');
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (res.ok) {
        alert('Registration successful! Please log in.');
        onSuccess();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Registration failed.');
    }
  };

  const handleAddCrop = async (newCropData) => {
    try {
      const res = await fetch(`${API_URL}/crops`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newCropData)
      });
      if (res.ok) {
        fetchCrops();
      }
    } catch (err) {
      console.error('Failed to add crop', err);
    }
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    localStorage.clear();
  };

  if (!token) {
    return <Auth onLogin={handleLogin} onRegister={handleRegister} error={error} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans antialiased">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-slate-900 text-white border-b border-slate-800 px-6 py-3.5 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl flex items-center justify-center shadow-md shadow-emerald-500/20">
            <Sprout className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight leading-none text-white">KisanSarthi</h1>
            <span className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase">
              Decision Support Platform
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 px-3 py-1.5 rounded-full text-xs text-slate-300">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{user?.name}</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
        <WeatherWidget district={user?.district} />
        <CropTracker crops={crops} onAddCrop={handleAddCrop} />
      </main>
    </div>
  );
}