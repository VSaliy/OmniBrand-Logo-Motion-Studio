import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LogoCreatorForm } from './components/LogoCreatorForm';
import { LogoShowcase, LogoItem } from './components/LogoShowcase';
import { MotionStudio } from './components/MotionStudio';
import {
  ImageSize,
  VideoAspectRatio,
  SAMPLE_BRANDS,
  SampleBrand,
  svgToDataUrl
} from './utils/logo-generator';
import { Sparkles, Film, AlertCircle, RefreshCw, X, ShieldAlert } from 'lucide-react';

export default function App() {
  const [hasApiKey, setHasApiKey] = useState<boolean>(true);
  const [isGeneratingLogo, setIsGeneratingLogo] = useState<boolean>(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Logo state initialized with first sample brand so user sees complete showcase immediately
  const initialBrand = SAMPLE_BRANDS[0];
  const initialLogoItem: LogoItem = {
    id: initialBrand.id,
    name: initialBrand.companyName,
    imageUrl: svgToDataUrl(initialBrand.svgLogo),
    imageSize: '2K',
    industry: initialBrand.industry,
    timestamp: Date.now(),
  };

  const [currentLogo, setCurrentLogo] = useState<LogoItem | null>(initialLogoItem);
  const [history, setHistory] = useState<LogoItem[]>([
    initialLogoItem,
    {
      id: SAMPLE_BRANDS[1].id,
      name: SAMPLE_BRANDS[1].companyName,
      imageUrl: svgToDataUrl(SAMPLE_BRANDS[1].svgLogo),
      imageSize: '2K',
      industry: SAMPLE_BRANDS[1].industry,
      timestamp: Date.now() - 1000,
    },
    {
      id: SAMPLE_BRANDS[2].id,
      name: SAMPLE_BRANDS[2].companyName,
      imageUrl: svgToDataUrl(SAMPLE_BRANDS[2].svgLogo),
      imageSize: '2K',
      industry: SAMPLE_BRANDS[2].industry,
      timestamp: Date.now() - 2000,
    }
  ]);

  // Check server status on mount
  useEffect(() => {
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.hasApiKey === 'boolean') {
          setHasApiKey(data.hasApiKey);
        }
      })
      .catch((err) => {
        console.warn('Status check notice:', err);
      });
  }, []);

  // 1. Generate Logo Handler using Gemini 3 Pro
  const handleGenerateLogo = async (params: {
    companyName: string;
    industry: string;
    description: string;
    style: string;
    colorPalette: string;
    imageSize: ImageSize;
  }) => {
    setIsGeneratingLogo(true);
    setApiError(null);

    try {
      const response = await fetch('/api/generate-logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate logo image.');
      }

      if (data.imageUrl) {
        const newItem: LogoItem = {
          id: `gen-${Date.now()}`,
          name: params.companyName,
          imageUrl: data.imageUrl,
          imageSize: data.imageSize || params.imageSize,
          industry: params.industry,
          timestamp: Date.now(),
        };

        setCurrentLogo(newItem);
        setHistory((prev) => [newItem, ...prev.filter((p) => p.name !== params.companyName)]);
      }
    } catch (err: any) {
      console.error('Logo generation error:', err);
      const errMsg = err?.message || 'An error occurred during image generation.';
      setApiError(errMsg);
    } finally {
      setIsGeneratingLogo(false);
    }
  };

  // 2. Upload Logo Handler
  const handleUploadLogo = (dataUrl: string, name: string) => {
    const uploadedItem: LogoItem = {
      id: `upload-${Date.now()}`,
      name: name || 'Uploaded Logo',
      imageUrl: dataUrl,
      imageSize: 'Uploaded',
      industry: 'Custom Brand',
      timestamp: Date.now(),
    };
    setCurrentLogo(uploadedItem);
    setHistory((prev) => [uploadedItem, ...prev]);
    setApiError(null);
  };

  // 3. Select Sample Brand
  const handleSelectSample = (sample: SampleBrand) => {
    const sampleItem: LogoItem = {
      id: sample.id,
      name: sample.companyName,
      imageUrl: svgToDataUrl(sample.svgLogo),
      imageSize: '2K',
      industry: sample.industry,
      timestamp: Date.now(),
    };
    setCurrentLogo(sampleItem);
    setApiError(null);
  };

  // 4. Animate Video Handler using Gemini Omni Flash via Interactions API
  const handleAnimateVideo = async (params: {
    imageData: string;
    animationStyle: string;
    customPrompt?: string;
    aspectRatio: VideoAspectRatio;
    companyName: string;
  }): Promise<string | null> => {
    setIsGeneratingVideo(true);
    setApiError(null);

    try {
      const response = await fetch('/api/animate-logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate animated video with Gemini Omni Flash.');
      }

      return data.videoUrl || null;
    } catch (err: any) {
      console.error('Video animation error:', err);
      const errMsg = err?.message || 'Failed to generate animated video.';
      setApiError(errMsg);
      return null;
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const scrollToMotionStudio = () => {
    const el = document.getElementById('motion-studio');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header hasApiKey={hasApiKey} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section */}
        <div className="relative text-center max-w-3xl mx-auto pt-2 pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Next-Generation AI Brand Identity Engine</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white mb-3">
            Design Your Logo. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-300 bg-clip-text text-transparent">
              Animate with Omni Flash.
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Generate 1K, 2K, and 4K vector-grade corporate marks using <strong>Gemini 3 Pro</strong>, then transform your static logo into a cinematic animated video in 16:9 or 9:16 using <strong>Gemini Omni Flash 1.2</strong>.
          </p>
        </div>

        {/* Global Error Banner (with actionable billing/api key advice) */}
        {apiError && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm flex items-start justify-between gap-3 shadow-lg">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-amber-100 mb-0.5">Gemini Service Notice</div>
                <p className="text-amber-200/90 leading-relaxed mb-1.5">{apiError}</p>
                <p className="text-[11px] text-amber-300/80">
                  Tip: Gemini 3 Pro and Gemini Omni Flash require a billing-enabled API key. You can select one in the <strong>Settings &gt; Secrets</strong> panel. In the meantime, you can explore instant animation and logo mockups using our built-in sample brands below!
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setApiError(null)}
              className="text-amber-400 hover:text-white p-1 rounded-lg"
              aria-label="Dismiss error notice"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Two-Column Creator & Showcase Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6">
            <LogoCreatorForm
              onGenerateLogo={handleGenerateLogo}
              onUploadLogo={handleUploadLogo}
              onSelectSample={handleSelectSample}
              isLoading={isGeneratingLogo}
            />
          </div>

          <div className="lg:col-span-6 sticky top-20">
            <LogoShowcase
              currentLogo={currentLogo}
              history={history}
              onSelectLogo={setCurrentLogo}
              onAnimateClick={scrollToMotionStudio}
            />
          </div>
        </div>

        {/* Motion Studio Section */}
        <MotionStudio
          currentLogoUrl={currentLogo?.imageUrl || null}
          companyName={currentLogo?.name || 'Company'}
          onAnimateVideo={handleAnimateVideo}
          isGeneratingVideo={isGeneratingVideo}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">OmniBrand Studio</span>
            <span>•</span>
            <span>Gemini 3 Pro Image (1K/2K/4K)</span>
            <span>•</span>
            <span>Gemini Omni Flash 1.2 (16:9 & 9:16)</span>
          </div>
          <div>Powered by Google Gemini Models & Interactions API</div>
        </div>
      </footer>
    </div>
  );
}
