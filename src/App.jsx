import React, { useState, useEffect } from 'react'
import { ShieldCheck, ShieldAlert, KeyRound, Check, X, Info } from 'lucide-react'
import Keypad from './components/Keypad'

export default function App() {
  const [pin, setPin] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [isShaking, setIsShaking] = useState(false)
  const isProd = import.meta.env.PROD
  const [demoMode, setDemoMode] = useState(!isProd) // Disable demo mode by default in production

  const maxDigits = 8
  const endpoint = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:3000/api/unlock'
  const labelSystemSecured = import.meta.env.VITE_LABEL_SYSTEM_SECURED || 'System Secured'
  const labelEnterPasscode = import.meta.env.VITE_LABEL_ENTER_PASSCODE || 'Enter Passcode'

  // Trigger shake animation helper
  const triggerShake = () => {
    setIsShaking(true)
    const timer = setTimeout(() => setIsShaking(false), 500)
    return () => clearTimeout(timer)
  }

  // Handle number press from keypad
  const handleNumberPress = (num) => {
    if (isLoading || success) return
    
    // Clear error message when user starts typing again
    if (error) setError(null)

    if (pin.length < maxDigits) {
      setPin(prev => prev + num)
    }
  }

  // Handle clear/backspace
  const handleClear = () => {
    if (isLoading || success) return
    setPin(prev => prev.slice(0, -1))
  }

  // Handle submit/unlock request
  const handleSubmit = async () => {
    if (pin.length === 0 || isLoading || success) return

    setIsLoading(true)
    setError(null)
    setSuccess(false)

    if (demoMode && !isProd) {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1200))
      
      // PIN 1234 or 12345678 represents success in Demo Mode
      if (pin === '1234' || pin === '12345678') {
        handleSuccess('Welcome. Access Granted.')
      } else {
        handleFailure('Access Denied. Invalid PIN.')
      }
    } else {
      // Execute real fetch request to VITE_API_ENDPOINT
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ pin }),
        })

        const data = await response.json()

        if (response.ok && data.success) {
          handleSuccess(data.message || 'Access Granted.')
        } else {
          handleFailure(data.message || 'Access Denied. Invalid PIN.')
        }
      } catch (err) {
        handleFailure('Network error. Failed to connect to server.')
      }
    }
  }

  const handleSuccess = (msg) => {
    setSuccess(true)
    setError(null)
    setPin('')
    setIsLoading(false)
  }

  const handleFailure = (msg) => {
    setError(msg)
    setSuccess(false)
    setPin('')
    setIsLoading(false)
    triggerShake()
  }

  // Automatically reset the app state after 3 seconds on success
  useEffect(() => {
    if (success) {
      const resetTimer = setTimeout(() => {
        setSuccess(false)
        setError(null)
        setPin('')
      }, 3000)
      return () => clearTimeout(resetTimer)
    }
  }, [success])

  return (
    <div className="min-h-dvh bg-zinc-950 flex flex-col justify-between p-4 sm:p-6 relative overflow-x-hidden overflow-y-auto select-none">
      
      {/* Premium ambient glow background spots */}
      <div className="absolute top-[-10%] left-[-20%] w-[350px] h-[350px] md:w-[500px] md:h-[500px] bg-indigo-900/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-20%] w-[350px] h-[350px] md:w-[500px] md:h-[500px] bg-teal-950/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Top spacing spacer */}
      <div className="py-2 sm:py-4" />

      {/* Main Container Card (Strictly mobile-first max-w) */}
      <main className="w-full max-w-sm mx-auto my-auto bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-xl rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-8 shadow-2xl relative z-10 flex flex-col items-center">
        
        {/* Lock Status Banner */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800/60 mb-4 sm:mb-6 transition-all duration-300">
          {success ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] md:text-xs font-semibold text-emerald-400 uppercase tracking-widest">Entry Granted</span>
            </>
          ) : isLoading ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="text-[10px] md:text-xs font-semibold text-amber-400 uppercase tracking-widest">Verifying PIN</span>
            </>
          ) : (
            <>
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <span className="text-[10px] md:text-xs font-semibold text-zinc-400 uppercase tracking-widest">{labelSystemSecured}</span>
            </>
          )}
        </div>

        {/* Display Area */}
        <section
          aria-live="polite"
          className={`w-full py-4 sm:py-6 px-4 rounded-3xl border transition-all duration-300 flex flex-col items-center justify-center min-h-[110px] sm:min-h-[140px] mb-6 sm:mb-8 ${
            success
              ? 'bg-emerald-500/10 border-emerald-500/35 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.08)]'
              : error
              ? 'bg-rose-500/10 border-rose-500/35 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.08)]'
              : 'bg-zinc-950/50 border-zinc-800/60 text-zinc-100'
          } ${isShaking ? 'animate-shake' : ''}`}
        >
          {success ? (
            <div className="flex flex-col items-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center animate-bounce">
                <Check className="w-5 h-5 text-emerald-400 stroke-[3]" />
              </div>
              <p className="text-sm font-semibold tracking-wider uppercase text-emerald-400">UNLOCKED</p>
              <p className="text-[11px] text-emerald-500/80 font-medium">Welcome. Door is open.</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="w-10 h-10 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
                <X className="w-5 h-5 text-rose-400 stroke-[3]" />
              </div>
              <p className="text-sm font-semibold tracking-wider uppercase text-rose-400">ACCESS DENIED</p>
              <p className="text-[11px] text-rose-400/80 font-medium px-2 leading-tight">{error}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full">
              {/* Digit slot visualization */}
              <div className="flex justify-center space-x-3.5 mb-4">
                {Array.from({ length: maxDigits }).map((_, index) => (
                  <div
                    key={index}
                    className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                      index < pin.length
                        ? 'bg-zinc-100 scale-110 shadow-[0_0_8px_rgba(244,244,245,0.6)]'
                        : 'border border-zinc-700 bg-zinc-900/30'
                    }`}
                  />
                ))}
              </div>
              
              <div className="flex items-center space-x-1.5 text-zinc-500">
                <KeyRound className="w-3.5 h-3.5" />
                <span className="text-[11px] font-medium uppercase tracking-widest">
                  {pin.length === 0 ? labelEnterPasscode : `${pin.length} of ${maxDigits} digits`}
                </span>
              </div>
            </div>
          )}
        </section>

        {/* Keypad Layout */}
        <Keypad
          onNumberPress={handleNumberPress}
          onClear={handleClear}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          pinLength={pin.length}
        />

      </main>

      {/* Bottom spacing & Developer Utility Section (hidden in production) */}
      {!isProd && (
        <footer className="w-full max-w-sm mx-auto mt-4 sm:mt-6 relative z-10">
          <div className="bg-zinc-900/30 border border-zinc-800/40 rounded-2xl p-4 flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-zinc-400">
                <Info className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="text-[11px] font-semibold uppercase tracking-wider">Demo Sandbox</span>
              </div>
              
              {/* Toggle demo switch */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={demoMode}
                  onChange={(e) => {
                    setDemoMode(e.target.checked)
                    setError(null)
                    setPin('')
                  }}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 peer-checked:after:bg-white peer-checked:after:border-indigo-600"></div>
              </label>
            </div>

            <div className="text-[11px] text-zinc-500 space-y-1 leading-relaxed">
              {demoMode ? (
                <p>
                  💡 <span className="text-zinc-400 font-medium">Demo Mode Active:</span> Submit passcode <span className="text-indigo-400 font-semibold bg-indigo-950/40 px-1 py-0.5 rounded">1234</span> or <span className="text-indigo-400 font-semibold bg-indigo-950/40 px-1 py-0.5 rounded">12345678</span> to simulate entry success. Other codes fail.
                </p>
              ) : (
                <p>
                  🌐 <span className="text-zinc-400 font-medium">Live Endpoint Active:</span> Submitting HTTP POST requests to <code className="text-teal-400 break-all select-all font-mono bg-teal-950/30 px-1.5 py-0.5 rounded">{endpoint}</code>
                </p>
              )}
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}
