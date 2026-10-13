import React, { useState } from 'react';
import { Sprout, Phone, Lock, User, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Auth({ onLogin, onRegister, error }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    password: '',
    state: '',
    district: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    onLogin({ phone_number: formData.phone, password: formData.password });
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    onRegister(
      {
        full_name: formData.fullName,
        phone_number: formData.phone,
        password: formData.password,
        state: formData.state,
        district: formData.district
      },
      () => setIsRegistering(false)
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Decorative Blur Gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-3">
            <Sprout className="w-8 h-8 text-slate-950" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">KisanSarthi</h1>
          <p className="text-slate-400 text-xs mt-1">Smart Agricultural Intelligence Platform</p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
            {error}
          </div>
        )}

        {isRegistering ? (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="Sahitya Singh"
                  className="w-full bg-slate-800/60 border border-slate-700/60 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  name="phone"
                  required
                  placeholder="9876543210"
                  className="w-full bg-slate-800/60 border border-slate-700/60 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-800/60 border border-slate-700/60 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">State</label>
                <input
                  type="text"
                  name="state"
                  placeholder="Uttar Pradesh"
                  className="w-full bg-slate-800/60 border border-slate-700/60 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl py-2.5 px-3.5 text-sm text-white placeholder-slate-500 outline-none transition-all"
                  value={formData.state}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">District</label>
                <input
                  type="text"
                  name="district"
                  placeholder="Basti"
                  className="w-full bg-slate-800/60 border border-slate-700/60 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl py-2.5 px-3.5 text-sm text-white placeholder-slate-500 outline-none transition-all"
                  value={formData.district}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold py-3 px-4 rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              Create Account <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  name="phone"
                  required
                  placeholder="Enter registered phone"
                  className="w-full bg-slate-800/60 border border-slate-700/60 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-800/60 border border-slate-700/60 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold py-3 px-4 rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              Sign In <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="mt-6 pt-6 border-t border-slate-800/80 text-center">
          <p className="text-xs text-slate-400">
            {isRegistering ? 'Already registered?' : 'New to KisanSarthi?'}{' '}
            <button
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors ml-1"
            >
              {isRegistering ? 'Sign In instead' : 'Create an Account'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}