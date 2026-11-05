import React from 'react';
import { Sparkles, Film, Image as ImageIcon, Zap, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  hasApiKey: boolean;
  onOpenPresets?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ hasApiKey }) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                OmniBrand
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Studio
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              AI Logo Designer & Cinematic Video Animator
            </p>
          </div>
        </div>

        {/* AI Capabilities Badges */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
            <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-medium text-slate-200">Gemini 3 Pro</span>
            <span className="text-slate-400 text-[10px] bg-slate-900/80 px-1.5 py-0.5 rounded">1K • 2K • 4K</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
            <Film className="w-3.5 h-3.5 text-purple-400" />
            <span className="font-medium text-slate-200">Omni Flash 1.2</span>
            <span className="text-slate-400 text-[10px] bg-slate-900/80 px-1.5 py-0.5 rounded">16:9 • 9:16</span>
          </div>

          {/* API Key Status Pill */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border ${
              hasApiKey
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
            }`}
            title={hasApiKey ? 'Gemini API Key active' : 'API Key not detected - Sample showcase available'}
          >
            {hasApiKey ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">AI Engine Ready</span>
                <span className="sm:hidden">Ready</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Demo & Sample Mode</span>
                <span className="sm:hidden">Demo</span>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
