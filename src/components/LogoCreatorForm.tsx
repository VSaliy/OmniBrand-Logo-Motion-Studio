import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Upload,
  Layers,
  Palette,
  Briefcase,
  Sliders,
  Check,
  Image as ImageIcon,
  ArrowRight,
  Info
} from 'lucide-react';
import {
  ImageSize,
  VALID_IMAGE_SIZES,
  LOGO_STYLES,
  SAMPLE_BRANDS,
  SampleBrand,
  svgToDataUrl
} from '../utils/logo-generator';

interface LogoCreatorFormProps {
  onGenerateLogo: (params: {
    companyName: string;
    industry: string;
    description: string;
    style: string;
    colorPalette: string;
    imageSize: ImageSize;
  }) => Promise<void>;
  onUploadLogo: (dataUrl: string, name: string) => void;
  onSelectSample: (sample: SampleBrand) => void;
  isLoading: boolean;
}

const COLOR_PRESETS = [
  { name: 'Electric Cyan & Indigo', value: 'Electric Cyan (#06b6d4), Deep Indigo (#4f46e5), and Dark Slate' },
  { name: 'Champagne Gold & Emerald', value: 'Champagne Gold (#eab308), Forest Emerald (#10b981), and Obsidian' },
  { name: 'Crimson Surge & Neon Coral', value: 'Crimson Red (#f43f5e), Sunset Orange (#f97316), and Pure White' },
  { name: 'Monochrome Luxe', value: 'Matte Titanium White, Gunmetal Gray, and Deep Carbon Black' },
  { name: 'Cyberpunk Purple & Pink', value: 'Vibrant Magenta (#d946ef), Cyber Violet (#8b5cf6), and Dark Navy' },
];

const INDUSTRY_SUGGESTIONS = [
  'Artificial Intelligence & Robotics',
  'Fintech & Digital Banking',
  'Luxury Skincare & Wellness',
  'Gaming & Esports Hardware',
  'Sustainable Energy & Cleantech',
  'Artisan Coffee & Craft Bakery',
  'Aerospace & Defense'
];

export const LogoCreatorForm: React.FC<LogoCreatorFormProps> = ({
  onGenerateLogo,
  onUploadLogo,
  onSelectSample,
  isLoading,
}) => {
  const [activeTab, setActiveTab] = useState<'generate' | 'upload'>('generate');

  // Generator form fields
  const [companyName, setCompanyName] = useState('Nexus Dynamics');
  const [tagline, setTagline] = useState('Intelligent Quantum Compute');
  const [industry, setIndustry] = useState('Artificial Intelligence & Robotics');
  const [description, setDescription] = useState('High-performance autonomous intelligence systems for space exploration and enterprise edge robotics.');
  const [style, setStyle] = useState('modern-tech');
  const [colorPalette, setColorPalette] = useState(COLOR_PRESETS[0].value);
  const [imageSize, setImageSize] = useState<ImageSize>('2K');
  const [formError, setFormError] = useState<string | null>(null);

  // Upload state
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [uploadedName, setUploadedName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      setFormError('Please enter your company or brand name.');
      return;
    }
    setFormError(null);

    const selectedStyleObj = LOGO_STYLES.find(s => s.id === style);
    const styleLabel = selectedStyleObj ? selectedStyleObj.label : style;

    await onGenerateLogo({
      companyName: companyName.trim(),
      industry: industry.trim(),
      description: `${description.trim()}${tagline ? ` Tagline: "${tagline.trim()}".` : ''}`,
      style: styleLabel,
      colorPalette,
      imageSize,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormError('Please select a valid image file (PNG, JPG, SVG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setUploadedPreview(dataUrl);
      const name = file.name.replace(/\.[^/.]+$/, '');
      setUploadedName(name);
      onUploadLogo(dataUrl, name);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setUploadedPreview(dataUrl);
      const name = file.name.replace(/\.[^/.]+$/, '');
      setUploadedName(name);
      onUploadLogo(dataUrl, name);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md">
      {/* Tab Switcher */}
      <div className="flex p-1 bg-slate-950/70 border border-slate-800/80 rounded-xl mb-6">
        <button
          type="button"
          onClick={() => setActiveTab('generate')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${
            activeTab === 'generate'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Design logo with AI"
        >
          <Sparkles className="w-4 h-4" />
          <span>Design with Gemini 3 Pro</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${
            activeTab === 'upload'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Upload existing photo or logo"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Existing Logo</span>
        </button>
      </div>

      {/* SAMPLE BRAND SHORTCUTS */}
      <div className="mb-6 p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Quick Test Brands (Instant Demo):
          </span>
          <span className="text-[11px] text-slate-400">Click to autofill & preview</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {SAMPLE_BRANDS.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => {
                setCompanyName(sample.companyName);
                setTagline(sample.tagline);
                setIndustry(sample.industry);
                setDescription(sample.description);
                setColorPalette(sample.colorPalette);
                const matchedStyle = LOGO_STYLES.find(s => s.label === sample.style);
                if (matchedStyle) setStyle(matchedStyle.id);
                onSelectSample(sample);
              }}
              className="text-left p-2.5 rounded-lg bg-slate-900 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/40 transition-all group"
            >
              <div className="text-xs font-bold text-slate-200 group-hover:text-indigo-300">
                {sample.companyName}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {sample.industry}
              </div>
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'generate' ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          {formError && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <Info className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{formError}</span>
            </div>
          )}

          {/* Company Name & Tagline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="company-name-input" className="block text-xs font-semibold text-slate-300 mb-1.5">
                Company / Brand Name <span className="text-rose-400">*</span>
              </label>
              <input
                id="company-name-input"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Apex Robotics, Aura Botanica"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-100 text-sm placeholder:text-slate-500 outline-none transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="tagline-input" className="block text-xs font-semibold text-slate-300 mb-1.5">
                Tagline / Slogan <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                id="tagline-input"
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Next-Gen Autonomous Systems"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-100 text-sm placeholder:text-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Industry Selection */}
          <div>
            <label htmlFor="industry-input" className="block text-xs font-semibold text-slate-300 mb-1.5">
              Industry & Market Domain
            </label>
            <input
              id="industry-input"
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g. Artificial Intelligence, Luxury Fashion, Specialty Coffee"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-100 text-sm placeholder:text-slate-500 outline-none transition-all mb-2"
            />
            <div className="flex flex-wrap gap-1.5">
              {INDUSTRY_SUGGESTIONS.map((ind) => (
                <button
                  key={ind}
                  type="button"
                  onClick={() => setIndustry(ind)}
                  className={`text-[11px] px-2.5 py-1 rounded-md border transition-all ${
                    industry === ind
                      ? 'bg-indigo-600/30 text-indigo-200 border-indigo-500/50'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  {ind}
                </button>
              ))}
            </div>
          </div>

          {/* Visual Style Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
              <span>Visual Aesthetics & Style</span>
              <span className="text-[11px] text-indigo-400 font-normal">Choose branding archetype</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {LOGO_STYLES.map((s) => {
                const isSelected = style === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setStyle(s.id)}
                    className={`text-left p-3 rounded-xl border transition-all relative ${
                      isSelected
                        ? 'bg-gradient-to-br from-indigo-950/60 to-purple-950/40 border-indigo-500 ring-1 ring-indigo-500/40'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                    <div className="text-xs font-bold text-slate-200 mb-1 pr-4">
                      {s.label}
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {s.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Scheme */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Color Palette</span>
              <span className="text-[11px] text-slate-400 font-normal">Brand harmony</span>
            </label>
            <input
              type="text"
              value={colorPalette}
              onChange={(e) => setColorPalette(e.target.value)}
              placeholder="e.g. Electric Cyan, Deep Indigo, Pure Obsidian"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-100 text-sm placeholder:text-slate-500 outline-none transition-all mb-2"
            />
            <div className="flex flex-wrap gap-1.5">
              {COLOR_PRESETS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => setColorPalette(p.value)}
                  className={`text-[11px] px-2.5 py-1 rounded-md border transition-all ${
                    colorPalette === p.value
                      ? 'bg-purple-600/30 text-purple-200 border-purple-500/50'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Concept Description */}
          <div>
            <label htmlFor="description-input" className="block text-xs font-semibold text-slate-300 mb-1.5">
              Brand Concept & Symbol Description
            </label>
            <textarea
              id="description-input"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe specific symbols, feelings, or elements you want in the logo (e.g. interlocking geometric vortex, cybernetic eagle, minimalist botanical leaf)..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-100 text-sm placeholder:text-slate-500 outline-none transition-all resize-none"
            />
          </div>

          {/* IMAGE SIZE AFFORDANCE (1K, 2K, 4K) - Explicit requirement */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/90">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-semibold text-slate-200">
                  Image Resolution Affordance (Gemini 3 Pro)
                </span>
              </div>
              <span className="text-[11px] text-cyan-400 font-medium bg-cyan-950/50 border border-cyan-800/60 px-2 py-0.5 rounded-full">
                Configurable Size
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {VALID_IMAGE_SIZES.map((size) => {
                const isSelected = imageSize === size;
                const dimension = size === '1K' ? '1024 × 1024' : size === '2K' ? '2048 × 2048' : '4096 × 4096';
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setImageSize(size)}
                    className={`py-2 px-3 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-600/30 to-indigo-600/30 border-cyan-400 text-cyan-200 shadow-sm shadow-cyan-500/20'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                    aria-label={`Select ${size} image size`}
                  >
                    <div className="text-sm font-bold">{size}</div>
                    <div className="text-[10px] text-slate-400">{dimension}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg ${
              isLoading
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 text-white hover:opacity-95 shadow-indigo-500/25 active:scale-[0.99]'
            }`}
            aria-label="Generate company logo"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating High-Resolution Logo with Gemini 3 Pro...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate {imageSize} Logo</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      ) : (
        /* UPLOAD PHOTO / LOGO TAB */
        <div className="space-y-4">
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-700 hover:border-indigo-500/70 bg-slate-950/60 rounded-2xl p-8 text-center cursor-pointer transition-all group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:scale-105 group-hover:bg-indigo-500/20 transition-all">
              <Upload className="w-7 h-7 text-indigo-400" />
            </div>

            <h3 className="text-sm font-bold text-slate-200 mb-1">
              Drag & Drop your logo or photo here
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Supports PNG, JPG, WebP, or SVG (Up to 25MB)
            </p>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300">
              Browse Local Files
            </span>
          </div>

          {uploadedPreview && (
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center p-1">
                  <img src={uploadedPreview} alt="Uploaded logo" className="max-w-full max-h-full object-contain" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-200">{uploadedName || 'Uploaded Logo'}</div>
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Ready for Animation in Motion Studio
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setUploadedPreview(null);
                  setUploadedName('');
                }}
                className="text-xs text-slate-400 hover:text-rose-400"
              >
                Clear
              </button>
            </div>
          )}

          <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-900/40 text-xs text-indigo-300 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
            <span>
              Upload any existing logo sketch, corporate emblem, or image photo. You can animate it directly into a high-framerate video using <strong>Gemini Omni Flash 1.2</strong> in the Motion Studio panel below.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
