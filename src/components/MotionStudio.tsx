import React, { useState, useRef, useEffect } from 'react';
import {
  Film,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Download,
  Sliders,
  Check,
  Maximize,
  Monitor,
  Smartphone,
  Eye,
  Zap,
  Info,
  Clock
} from 'lucide-react';
import {
  VideoAspectRatio,
  ANIMATION_PRESETS,
  VALID_ASPECT_RATIOS
} from '../utils/logo-generator';

interface MotionStudioProps {
  currentLogoUrl: string | null;
  companyName: string;
  onAnimateVideo: (params: {
    imageData: string;
    animationStyle: string;
    customPrompt?: string;
    aspectRatio: VideoAspectRatio;
    companyName: string;
  }) => Promise<string | null>;
  isGeneratingVideo: boolean;
}

export const MotionStudio: React.FC<MotionStudioProps> = ({
  currentLogoUrl,
  companyName,
  onAnimateVideo,
  isGeneratingVideo,
}) => {
  const [aspectRatio, setAspectRatio] = useState<VideoAspectRatio>('16:9');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('3d-liquid-metal');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);

  // Video player state
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Realtime canvas/CSS motion preview state
  const [liveMotionMode, setLiveMotionMode] = useState<'pulse' | 'float' | 'spin' | 'wave'>('pulse');
  const [activeTab, setActiveTab] = useState<'ai-video' | 'live-engine'>('ai-video');
  const [recordingStatus, setRecordingStatus] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Video progress steps simulation
  const [progressStep, setProgressStep] = useState<string>('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGeneratingVideo) {
      const steps = [
        'Encoding logo keyframe for Gemini Omni Flash...',
        'Sending request to Interactions API (model: gemini-omni-1.2-flash)...',
        'Synthesizing cinematic 3D motion vectors and lighting...',
        'Compiling video stream into MP4 container...',
      ];
      let stepIdx = 0;
      setProgressStep(steps[0]);
      interval = setInterval(() => {
        stepIdx = (stepIdx + 1) % steps.length;
        setProgressStep(steps[stepIdx]);
      }, 4000);
    } else {
      setProgressStep('');
    }
    return () => clearInterval(interval);
  }, [isGeneratingVideo]);

  const handleStartGeneration = async () => {
    if (!currentLogoUrl) return;

    try {
      const resultVideoUrl = await onAnimateVideo({
        imageData: currentLogoUrl,
        animationStyle: isCustom ? '' : selectedPresetId,
        customPrompt: isCustom ? customPrompt : undefined,
        aspectRatio,
        companyName,
      });

      if (resultVideoUrl) {
        setVideoUrl(resultVideoUrl);
        setIsPlaying(true);
      }
    } catch (err) {
      console.error('Animation error:', err);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleRestart = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPlaying(true);
  };

  const handleDownloadVideo = () => {
    if (!videoUrl) return;
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = `${companyName.toLowerCase().replace(/\s+/g, '-')}-animated-${aspectRatio.replace(':', 'x')}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Instant WebM recording from Canvas for offline/demo export
  const handleExportLiveAnimation = () => {
    if (!currentLogoUrl) return;
    setRecordingStatus('Recording 4s animation clip...');

    const canvas = document.createElement('canvas');
    const width = aspectRatio === '16:9' ? 1280 : 720;
    const height = aspectRatio === '16:9' ? 720 : 1280;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const stream = canvas.captureStream(30);
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        setRecordingStatus(null);
      };

      recorder.start();

      let frame = 0;
      const totalFrames = 120; // 4 seconds at 30fps

      const render = () => {
        if (frame >= totalFrames) {
          recorder.stop();
          return;
        }

        ctx.fillStyle = '#090d16';
        ctx.fillRect(0, 0, width, height);

        // Ambient glow
        const glowRad = Math.sin(frame * 0.05) * 60 + 180;
        const grad = ctx.createRadialGradient(width / 2, height / 2, 10, width / 2, height / 2, glowRad);
        grad.addColorStop(0, 'rgba(99, 102, 241, 0.35)');
        grad.addColorStop(1, 'rgba(9, 13, 22, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, glowRad, 0, Math.PI * 2);
        ctx.fill();

        ctx.save();
        ctx.translate(width / 2, height / 2);

        // Motion physics depending on mode
        if (liveMotionMode === 'spin') {
          ctx.rotate((frame * 0.04));
        } else if (liveMotionMode === 'float') {
          const dy = Math.sin(frame * 0.08) * 20;
          ctx.translate(0, dy);
        } else if (liveMotionMode === 'pulse') {
          const scale = 1 + Math.sin(frame * 0.06) * 0.08;
          ctx.scale(scale, scale);
        }

        const logoSize = Math.min(width, height) * 0.45;
        ctx.drawImage(img, -logoSize / 2, -logoSize / 2, logoSize, logoSize);
        ctx.restore();

        frame++;
        requestAnimationFrame(render);
      };

      render();
    };
    img.src = currentLogoUrl;
  };

  return (
    <section id="motion-studio" className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
              <Film className="w-5 h-5" />
            </div>
            <h2 className="font-display font-bold text-lg text-slate-100">
              Logo Motion Studio
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Gemini Omni Flash 1.2
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Animate your logo into high-production video using the Gemini Interactions API.
          </p>
        </div>

        {/* View Switcher: AI Video vs Interactive Live Engine */}
        <div className="flex items-center gap-1 p-1 bg-slate-950/70 border border-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('ai-video')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'ai-video'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Omni Flash Video</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('live-engine')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'live-engine'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Interactive Motion</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Animation Controls */}
        <div className="lg:col-span-5 space-y-5">
          {/* ASPECT RATIO SELECTOR (16:9 Landscape or 9:16 Portrait) - Explicit prompt requirement */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-purple-400" />
                Video Aspect Ratio (Required)
              </span>
              <span className="text-[11px] text-purple-400 font-medium">
                {aspectRatio === '16:9' ? 'Landscape Video' : 'Portrait Video'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAspectRatio('16:9')}
                className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                  aspectRatio === '16:9'
                    ? 'bg-gradient-to-r from-purple-950/60 to-indigo-950/50 border-purple-500 text-purple-200 ring-1 ring-purple-500/40'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
                aria-label="Select 16:9 landscape aspect ratio"
              >
                <div className="w-9 h-6 rounded bg-slate-800 border border-slate-700 flex items-center justify-center">
                  <Monitor className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <div className="text-xs font-bold">16:9 Landscape</div>
                  <div className="text-[10px] text-slate-400">Web, YouTube, Hero</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAspectRatio('9:16')}
                className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                  aspectRatio === '9:16'
                    ? 'bg-gradient-to-r from-purple-950/60 to-indigo-950/50 border-purple-500 text-purple-200 ring-1 ring-purple-500/40'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
                aria-label="Select 9:16 portrait aspect ratio"
              >
                <div className="w-6 h-9 rounded bg-slate-800 border border-slate-700 flex items-center justify-center">
                  <Smartphone className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <div className="text-xs font-bold">9:16 Portrait</div>
                  <div className="text-[10px] text-slate-400">Reels, Shorts, TikTok</div>
                </div>
              </button>
            </div>
          </div>

          {/* Animation Motion Style Presets */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-200">
                Motion Choreography Preset
              </label>
              <button
                type="button"
                onClick={() => setIsCustom(!isCustom)}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
              >
                {isCustom ? 'Use Presets' : 'Custom Motion Prompt'}
              </button>
            </div>

            {!isCustom ? (
              <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                {ANIMATION_PRESETS.map((p) => {
                  const isSelected = selectedPresetId === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPresetId(p.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-indigo-950/40 border-indigo-500 ring-1 ring-indigo-500/30 text-white'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold">{p.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2">
                        {p.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div>
                <textarea
                  rows={4}
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Describe your desired animation in detail (e.g. 3D logo floats onto a glassy surface with liquid metallic ripple and glowing lens flares)..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-slate-100 text-xs placeholder:text-slate-500 outline-none transition-all resize-none"
                />
              </div>
            )}
          </div>

          {/* Action Button: Generate with Gemini Omni Flash */}
          <div className="space-y-2">
            <button
              type="button"
              disabled={isGeneratingVideo || !currentLogoUrl}
              onClick={handleStartGeneration}
              className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg ${
                isGeneratingVideo || !currentLogoUrl
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white shadow-purple-500/25 active:scale-[0.99]'
              }`}
              aria-label="Generate animated video with Gemini Omni Flash"
            >
              {isGeneratingVideo ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Generating Omni Flash Video...</span>
                </>
              ) : (
                <>
                  <Film className="w-4 h-4" />
                  <span>Generate Animated Video ({aspectRatio})</span>
                </>
              )}
            </button>

            {isGeneratingVideo && (
              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs text-purple-300 flex items-center gap-2 animate-pulse">
                <Clock className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span className="truncate">{progressStep || 'Synthesizing motion frames with Gemini Omni Flash...'}</span>
              </div>
            )}

            {!currentLogoUrl && (
              <p className="text-[11px] text-amber-400 text-center">
                Please generate or upload a logo first to enable video animation.
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Video & Motion Stage */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 min-h-[380px] flex flex-col items-center justify-center relative overflow-hidden">
            {activeTab === 'ai-video' ? (
              videoUrl ? (
                /* HTML5 Video Player */
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <div
                    className={`relative rounded-xl overflow-hidden border border-slate-700 bg-black shadow-2xl flex items-center justify-center ${
                      aspectRatio === '16:9'
                        ? 'w-full aspect-[16/9] max-h-[380px]'
                        : 'w-auto aspect-[9/16] h-[360px] sm:h-[420px]'
                    }`}
                  >
                    <video
                      ref={videoRef}
                      src={videoUrl}
                      autoPlay
                      loop={isLooping}
                      playsInline
                      className="w-full h-full object-contain"
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    />
                  </div>

                  {/* Player Controls Bar */}
                  <div className="w-full flex items-center justify-between mt-3 px-2 py-1 bg-slate-900/90 rounded-xl border border-slate-800 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={togglePlay}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                        aria-label={isPlaying ? 'Pause video' : 'Play video'}
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>

                      <button
                        type="button"
                        onClick={handleRestart}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                        aria-label="Replay video"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsLooping(!isLooping)}
                        className={`px-2 py-1 rounded-lg text-[11px] font-semibold border ${
                          isLooping
                            ? 'bg-purple-600/30 text-purple-300 border-purple-500/50'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        Loop
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 font-mono">
                        {aspectRatio} Omni Flash
                      </span>

                      <button
                        type="button"
                        onClick={handleDownloadVideo}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium hover:opacity-90"
                        aria-label="Download generated video"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download MP4</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Empty Video Stage */
                <div className="text-center p-8 max-w-sm">
                  <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-3">
                    <Film className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-200 mb-1">
                    No Video Generated Yet
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">
                    Choose an aspect ratio ({aspectRatio}) and choreography preset, then click &quot;Generate Animated Video&quot; to render via Gemini Omni Flash 1.2.
                  </p>
                  {currentLogoUrl && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('live-engine')}
                      className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Or preview instant interactive animation now</span>
                    </button>
                  )}
                </div>
              )
            ) : (
              /* Interactive Live Motion Engine */
              <div className="w-full h-full flex flex-col items-center justify-center">
                <div
                  className={`relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center p-6 ${
                    aspectRatio === '16:9'
                      ? 'w-full aspect-[16/9] max-h-[360px]'
                      : 'w-auto aspect-[9/16] h-[360px] sm:h-[420px]'
                  }`}
                >
                  {currentLogoUrl ? (
                    <div className="relative w-full h-full flex items-center justify-center p-4">
                      <div className="absolute w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
                      <img
                        src={currentLogoUrl}
                        alt="Animated Logo"
                        className={`max-h-[220px] max-w-[220px] object-contain drop-shadow-2xl relative z-10 ${
                          liveMotionMode === 'pulse' ? 'animate-pulse-glow' : ''
                        } ${liveMotionMode === 'float' ? 'animate-float-logo' : ''} ${
                          liveMotionMode === 'spin' ? 'animate-spin-slow' : ''
                        }`}
                      />
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500">Logo required for motion</span>
                  )}
                </div>

                {/* Live Motion Mode Chooser */}
                <div className="w-full flex items-center justify-between mt-3 px-2 py-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
                  <div className="flex items-center gap-1">
                    {(['pulse', 'float', 'spin'] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setLiveMotionMode(mode)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-all ${
                          liveMotionMode === mode
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleExportLiveAnimation}
                    disabled={!currentLogoUrl || Boolean(recordingStatus)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{recordingStatus || 'Export WebM Video'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
