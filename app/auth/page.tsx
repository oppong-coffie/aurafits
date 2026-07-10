'use client';

import React, { useState, useEffect, useRef } from 'react';
import Footer from '../components/Footer';

interface LogEntry {
  timestamp: string;
  method: string;
  url: string;
  payload?: any;
  status?: number;
  response?: any;
}

export default function AuthPlayground() {
  // Navigation & UI State
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Form Fields
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  
  // Error States
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [generalError, setGeneralError] = useState<string>('');
  
  // Auth Session State
  const [user, setUser] = useState<any>(null);
  
  // Telemetry Console State
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Helper to add logs to the console
  const addLog = (method: string, url: string, payload?: any, status?: number, response?: any) => {
    const newLog: LogEntry = {
      timestamp: new Date().toLocaleTimeString(),
      method,
      url,
      payload,
      status,
      response,
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  // Fetch the current user session on mount
  useEffect(() => {
    const fetchSession = async () => {
      addLog('GET', '/api/auth/me');
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        
        addLog('GET', '/api/auth/me', undefined, res.status, data);
        
        if (res.ok && data.success) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error: any) {
        addLog('GET', '/api/auth/me', undefined, 500, { error: error.message || 'Network error' });
        setUser(null);
      }
    };
    
    fetchSession();
  }, []);

  // Handle Form Submission (Register / Login)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setGeneralError('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin 
      ? { email, password } 
      : { name, email, password };

    addLog('POST', endpoint, payload);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      addLog('POST', endpoint, payload, res.status, data);

      if (res.ok && data.success) {
        setUser(data.user);
        setName('');
        setEmail('');
        setPassword('');
      } else {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setGeneralError(data.message || 'An error occurred during authentication.');
        }
      }
    } catch (error: any) {
      addLog('POST', endpoint, payload, 500, { error: error.message || 'Network error' });
      setGeneralError('A network error occurred. Please check the API logs.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Log Out
  const handleSignOut = async () => {
    setIsLoading(true);
    addLog('POST', '/api/auth/logout');

    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      const data = await res.json();
      
      addLog('POST', '/api/auth/logout', undefined, res.status, data);

      if (res.ok && data.success) {
        setUser(null);
      } else {
        setGeneralError(data.message || 'Logout failed.');
      }
    } catch (error: any) {
      addLog('POST', '/api/auth/logout', undefined, 500, { error: error.message || 'Network error' });
    } finally {
      setIsLoading(false);
    }
  };

  // Clear API console logs
  const handleClearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 transition-colors duration-200">
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Side: Auth Card Form or Dashboard */}
        <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 shadow-sm rounded-3xl p-6 md:p-8 backdrop-blur-sm transition-colors duration-200">
          {!user ? (
            <>
              <div>
                <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight mb-1">PinkyShop Gateway</h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">Verify the secure stateless cookie authentication backend</p>
              </div>

              {/* Tab Navigation */}
              <div className="flex gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-6">
                <button 
                  className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition duration-150 text-center cursor-pointer ${
                    isLogin 
                      ? 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900 shadow-sm' 
                      : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-950/60'
                  }`}
                  onClick={() => {
                    setIsLogin(true);
                    setErrors({});
                    setGeneralError('');
                  }}
                >
                  Sign In
                </button>
                <button 
                  className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition duration-150 text-center cursor-pointer ${
                    !isLogin 
                      ? 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900 shadow-sm' 
                      : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-950/60'
                  }`}
                  onClick={() => {
                    setIsLogin(false);
                    setErrors({});
                    setGeneralError('');
                  }}
                >
                  Create Account
                </button>
              </div>

              {/* General Form Error Alert */}
              {generalError && (
                <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 rounded-xl p-3.5 text-sm mb-4 font-medium">
                  {generalError}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider" htmlFor="name">Full Name</label>
                    <input 
                      id="name"
                      type="text" 
                      className="w-full bg-slate-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-violet-500 focus:border-transparent rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-zinc-50 outline-none transition duration-150" 
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={!isLogin}
                    />
                    {errors.name && <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1 mt-1">⚠️ {errors.name[0]}</p>}
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider" htmlFor="email">Email Address</label>
                  <input 
                    id="email"
                    type="email" 
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-violet-500 focus:border-transparent rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-zinc-50 outline-none transition duration-150" 
                    placeholder="jane.doe@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  {errors.email && <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1 mt-1">⚠️ {errors.email[0]}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider" htmlFor="password">Password</label>
                  <input 
                    id="password"
                    type="password" 
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-violet-500 focus:border-transparent rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-zinc-50 outline-none transition duration-150" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  {errors.password && <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1 mt-1">⚠️ {errors.password[0]}</p>}
                </div>

                <button 
                  type="submit" 
                  className="w-full flex items-center justify-center gap-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-semibold rounded-xl py-3 transition shadow-sm cursor-pointer disabled:opacity-50 text-sm mt-2"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : isLogin ? 'Sign In' : 'Register Account'}
                </button>
              </form>
            </>
          ) : (
            /* Logged In View */
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center text-2xl font-bold mb-4 shadow-inner">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              
              <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 mb-1 tracking-tight">Welcome back, {user.name}!</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">{user.email}</p>
              
              <div className="w-full space-y-3.5 border-t border-b border-zinc-100 dark:border-zinc-800/60 py-5 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500 dark:text-zinc-400">User ID:</span>
                  <span className="font-mono text-xs text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-950 px-2 py-1 rounded border border-zinc-200/50 dark:border-zinc-800/55">{user.id}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500 dark:text-zinc-400">Session status:</span>
                  <span className="font-bold text-emerald-500 dark:text-emerald-450">Active JWT Cookie</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500 dark:text-zinc-400">Created At:</span>
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>

              <button 
                onClick={handleSignOut} 
                className="w-full bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-semibold rounded-2xl py-3 transition shadow-sm cursor-pointer text-sm"
                disabled={isLoading}
              >
                {isLoading ? 'Signing Out...' : 'Sign Out'}
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Real-time Telemetry logs console */}
        <div className="bg-zinc-950 border border-zinc-850 rounded-3xl p-6 shadow-xl flex flex-col h-[600px] text-zinc-100">
          <div className="flex justify-between items-center border-b border-zinc-850 pb-4 mb-4">
            <h3 className="flex items-center gap-2.5 font-bold text-sm text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              API Telemetry Console
            </h3>
            {logs.length > 0 && (
              <button onClick={handleClearLogs} className="text-xs text-zinc-500 hover:text-zinc-300 font-semibold hover:bg-zinc-900 px-3 py-1.5 rounded-lg transition duration-150">
                Clear Console
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-zinc-850 scrollbar-track-transparent">
            {logs.length === 0 ? (
              <div className="h-full flex items-center justify-center text-zinc-600 text-sm italic">
                Waiting for API requests...
              </div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-4 space-y-3 font-mono text-xs">
                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-zinc-500">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      log.method === 'GET' 
                        ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/50' 
                        : 'bg-blue-950/40 text-blue-400 border-blue-900/50'
                    }`}>
                      {log.method}
                    </span>
                    <span className="text-zinc-300 break-all font-semibold">{log.url}</span>
                    {log.status !== undefined && (
                      <span className={`px-2 py-0.5 rounded text-[10px] border ${
                        log.status < 400 
                          ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/50' 
                          : 'bg-rose-950/40 text-rose-400 border-rose-900/50'
                      }`}>
                        HTTP {log.status}
                      </span>
                    )}
                    <span className="ml-auto text-zinc-650">{log.timestamp}</span>
                  </div>

                  {log.payload && (
                    <div className="bg-zinc-950/80 border border-zinc-900 rounded-xl p-3 space-y-1">
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Request Payload:</div>
                      <pre className="overflow-x-auto text-zinc-350 leading-relaxed max-h-40 text-[11px] scrollbar-thin scrollbar-thumb-zinc-850 scrollbar-track-transparent">
                        {JSON.stringify(log.payload, null, 2)}
                      </pre>
                    </div>
                  )}

                  {log.response && (
                    <div className="bg-zinc-950/80 border border-zinc-900 rounded-xl p-3 space-y-1">
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Response Data:</div>
                      <pre className="overflow-x-auto text-zinc-350 leading-relaxed max-h-40 text-[11px] scrollbar-thin scrollbar-thumb-zinc-850 scrollbar-track-transparent">
                        {JSON.stringify(log.response, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={consoleEndRef} />
          </div>
        </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}
