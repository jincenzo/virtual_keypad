import React from 'react'
import { Delete, Lock, Loader2 } from 'lucide-react'

/**
 * Keypad component rendering a 3x4 layout.
 * 
 * Props:
 * - onNumberPress: function triggered when a numeric key is pressed
 * - onClear: function triggered when backspace is pressed
 * - onSubmit: function triggered when submit is pressed
 * - isLoading: boolean representing whether an API call is active
 * - pinLength: current number of digits entered
 */
export default function Keypad({ onNumberPress, onClear, onSubmit, isLoading, pinLength }) {
  const keys = [
    { num: '1', letters: ' ' },
    { num: '2', letters: 'A B C' },
    { num: '3', letters: 'D E F' },
    { num: '4', letters: 'G H I' },
    { num: '5', letters: 'J K L' },
    { num: '6', letters: 'M N O' },
    { num: '7', letters: 'P Q R S' },
    { num: '8', letters: 'T U V' },
    { num: '9', letters: 'W X Y Z' },
  ]

  const handleKeyPress = (num) => {
    if (isLoading) return
    onNumberPress(num)
  }

  return (
    <div className="grid grid-cols-3 gap-y-4 gap-x-5 md:gap-y-5 md:gap-x-6 justify-items-center w-full max-w-[280px] md:max-w-[320px] mx-auto">
      {/* 1 to 9 Keys */}
      {keys.map(({ num, letters }) => (
        <button
          key={num}
          type="button"
          disabled={isLoading}
          onClick={() => handleKeyPress(num)}
          className="w-16 h-16 md:w-20 md:h-20 rounded-full flex flex-col items-center justify-center bg-zinc-900/40 border border-zinc-800/80 hover:bg-zinc-800/50 hover:border-zinc-700 text-zinc-100 active:scale-90 active:bg-zinc-800 transition-all duration-100 ease-out select-none cursor-pointer disabled:opacity-40 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
        >
          <span className="text-2xl md:text-3xl font-medium tracking-tight leading-none">{num}</span>
          <span className="text-[9px] md:text-[10px] text-zinc-500 font-medium tracking-widest mt-1 uppercase leading-none h-[10px]">
            {letters}
          </span>
        </button>
      ))}

      {/* Row 4: Backspace, 0, Submit */}
      
      {/* Backspace Key */}
      <button
        type="button"
        disabled={isLoading}
        onClick={onClear}
        className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 active:scale-90 active:bg-zinc-800 transition-all duration-100 ease-out select-none cursor-pointer disabled:opacity-40 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        title="Backspace"
      >
        <Delete className="w-6 h-6 md:w-7 md:h-7 stroke-[1.5]" />
      </button>

      {/* 0 Key */}
      <button
        type="button"
        disabled={isLoading}
        onClick={() => handleKeyPress('0')}
        className="w-16 h-16 md:w-20 md:h-20 rounded-full flex flex-col items-center justify-center bg-zinc-900/40 border border-zinc-800/80 hover:bg-zinc-800/50 hover:border-zinc-700 text-zinc-100 active:scale-90 active:bg-zinc-800 transition-all duration-100 ease-out select-none cursor-pointer disabled:opacity-40 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
      >
        <span className="text-2xl md:text-3xl font-medium tracking-tight leading-none">0</span>
        <span className="text-[9px] md:text-[10px] text-zinc-500 font-medium tracking-widest mt-1 leading-none h-[10px]">
          +
        </span>
      </button>

      {/* Submit / Unlock Key */}
      <button
        type="button"
        disabled={isLoading || pinLength === 0}
        onClick={onSubmit}
        className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-white bg-indigo-600 hover:bg-indigo-500 active:scale-90 active:bg-indigo-700 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/35 transition-all duration-100 ease-out select-none cursor-pointer disabled:opacity-40 disabled:shadow-none disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
        title="Unlock Door"
      >
        {isLoading ? (
          <Loader2 className="w-6 h-6 md:w-7 md:h-7 animate-spin stroke-[2]" />
        ) : (
          <Lock className="w-6 h-6 md:w-7 md:h-7 stroke-[2]" />
        )}
      </button>
    </div>
  )
}
