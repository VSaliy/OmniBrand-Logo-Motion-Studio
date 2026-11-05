import React, { useState } from 'react';
import {
  Download,
  Copy,
  Sparkles,
  Film,
  Check,
  Maximize2,
  Smartphone,
  CreditCard,
  Shirt,
  Moon,
  Sun
} from 'lucide-react';

export interface LogoItem {
  id: string;
  name: string;
  imageUrl: string;
  imageSize?: string;
  industry?: string;
  timestamp: number;
}

interface LogoShowcaseProps {
  currentLogo: LogoItem | null;
  history: LogoItem[];
  onSelectLogo: (item: LogoItem) => void;
  onAnimateClick: () => void;
}

export const LogoShowcase: React.FC<LogoShowcaseProps> = ({
  currentLogo,
  history,
  onSelectLogo,
  onAnimateClick,
}) => {
  const [copied, setCopied] = useState(false);
  const [previewTab, setPreviewTab] = useState<'main' | 'dark' | 'light' | 'appicon' | 'card'>('main');

  if (!currentLogo) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-[380px]">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8 text-indigo-400" />
        </div>
        <h3 className="text-base font-bold text-slate-200 mb-2">
          Your Logo Showcase Will Appear Here
        </h3>
        <p className="text-xs text-slate-400 max-w-sm mb-4">
          Describe your company above and generate a high-resolution logo, or choose one of our sample brands to preview right now.
        </p>
      </div>
    );
  }

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentLogo.imageUrl;
    link.download = `${currentLogo.name.toLowerCase().replace(/\s+/g, '-')}-logo.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentLogo.imageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md flex flex-col justify-between">
      <div>
        {/* Header row */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-base text-slate-100 truncate">
                {currentLogo.name}
              </h3>
              {currentLogo.imageSize && (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-cyan-950 border border-cyan-800 text-cyan-300 flex-shrink-0">
                  {currentLogo.imageSize}
                </span>
              )}
            </div>
            {currentLogo.industry && (
              <p className="text-xs text-slate-400 truncate">{currentLogo.industry}</p>
            )}
          </div>

          <button
            type="button"
            onClick={onAnimateClick}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-xs shadow-md shadow-purple-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex-shrink-0"
            aria-label="Animate this logo into video"
          >
            <Film className="w-3.5 h-3.5" />
            <span>Animate with Omni Flash</span>
          </button>
        </div>

        {/* View mode switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/70 border border-slate-800/80 rounded-xl mb-4 overflow-x-auto">
          <button
            type="button"
            onClick={() => setPreviewTab('main')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              previewTab === 'main'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Studio Canvas</span>
          </button>

          <button
            type="button"
            onClick={() => setPreviewTab('dark')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              previewTab === 'dark'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Dark Backdrop</span>
          </button>

          <button
            type="button"
            onClick={() => setPreviewTab('light')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              previewTab === 'light'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Light Clean</span>
          </button>

          <button
            type="button"
            onClick={() => setPreviewTab('appicon')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              previewTab === 'appicon'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>App Icon</span>
          </button>

          <button
            type="button"
            onClick={() => setPreviewTab('card')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              previewTab === 'card'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Business Card</span>
          </button>
        </div>

        {/* Display Frame */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 min-h-[320px] sm:min-h-[380px] flex items-center justify-center p-6 bg-slate-950">
          {previewTab === 'main' && (
            <div className="w-full h-full flex flex-col items-center justify-center relative">
              {/* Subtle ambient light behind logo */}
              <div className="absolute w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
              <img
                src={currentLogo.imageUrl}
                alt={`${currentLogo.name} Logo`}
                className="max-h-[280px] max-w-[280px] sm:max-h-[320px] sm:max-w-[320px] object-contain drop-shadow-2xl transition-all hover:scale-105 duration-300 relative z-10 rounded-xl"
              />
            </div>
          )}

          {previewTab === 'dark' && (
            <div className="w-full h-full min-h-[300px] bg-neutral-950 rounded-xl p-8 flex items-center justify-center border border-neutral-800">
              <img
                src={currentLogo.imageUrl}
                alt={`${currentLogo.name} on dark background`}
                className="max-h-[240px] max-w-[240px] object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]"
              />
            </div>
          )}

          {previewTab === 'light' && (
            <div className="w-full h-full min-h-[300px] bg-slate-100 rounded-xl p-8 flex items-center justify-center border border-slate-200">
              <img
                src={currentLogo.imageUrl}
                alt={`${currentLogo.name} on light background`}
                className="max-h-[240px] max-w-[240px] object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)]"
              />
            </div>
          )}

          {previewTab === 'appicon' && (
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="w-36 h-36 rounded-[32px] bg-slate-900 border-2 border-slate-700/80 shadow-2xl shadow-indigo-950/50 p-4 flex items-center justify-center overflow-hidden">
                <img
                  src={currentLogo.imageUrl}
                  alt={`${currentLogo.name} App Icon`}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xs font-semibold text-slate-300">{currentLogo.name}</span>
            </div>
          )}

          {previewTab === 'card' && (
            <div className="w-full max-w-sm aspect-[1.75/1] bg-gradient-to-tr from-slate-900 to-slate-800 border border-slate-700/80 rounded-xl p-6 shadow-2xl flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="w-16 h-16 bg-slate-950/60 rounded-lg p-2 border border-slate-700/50 flex items-center justify-center">
                  <img
                    src={currentLogo.imageUrl}
                    alt={currentLogo.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="w-8 h-6 rounded bg-amber-400/20 border border-amber-400/40" />
              </div>
              <div>
                <div className="text-sm font-bold tracking-wider text-slate-100">{currentLogo.name.toUpperCase()}</div>
                <div className="text-[10px] text-slate-400 tracking-widest uppercase">Executive Brand Card</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions and History */}
      <div className="mt-5 space-y-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
            aria-label="Download Logo PNG"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PNG</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
            aria-label="Copy logo image data"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* History Strip */}
        {history.length > 1 && (
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Generated Logo Variations ({history.length}):
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {history.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectLogo(item)}
                  className={`w-14 h-14 rounded-xl border flex-shrink-0 p-1.5 bg-slate-950 transition-all ${
                    currentLogo.id === item.id
                      ? 'border-indigo-500 ring-2 ring-indigo-500/30'
                      : 'border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100'
                  }`}
                  title={item.name}
                >
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
