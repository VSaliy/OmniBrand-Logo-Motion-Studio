export type ImageSize = '1K' | '2K' | '4K';
export type VideoAspectRatio = '16:9' | '9:16';

export interface LogoPromptParams {
  companyName: string;
  industry?: string;
  description?: string;
  style?: string;
  colorPalette?: string;
  imageSize?: ImageSize;
}

export interface AnimationPromptParams {
  companyName?: string;
  animationStyle?: string;
  customPrompt?: string;
  aspectRatio?: VideoAspectRatio;
}

export const VALID_IMAGE_SIZES: ImageSize[] = ['1K', '2K', '4K'];
export const VALID_ASPECT_RATIOS: VideoAspectRatio[] = ['16:9', '9:16'];

export const LOGO_STYLES = [
  {
    id: 'modern-tech',
    label: 'Modern Tech & Geometric',
    description: 'Clean vector geometry, futuristic silhouette, precision lines',
    tags: ['Tech', 'SaaS', 'AI', 'Cyber']
  },
  {
    id: 'minimalist',
    label: 'Minimalist & Iconic',
    description: 'Ultra-simplified emblem, negative space, timeless elegance',
    tags: ['Design', 'Studio', 'Modern', 'Clean']
  },
  {
    id: 'luxury-monogram',
    label: 'Luxury Monogram & Foil',
    description: 'Interlocking typography, gold accents, high-end sophisticated crest',
    tags: ['Fashion', 'Jewelry', 'Hospitality', 'Real Estate']
  },
  {
    id: '3d-emblem',
    label: '3D Glossy Emblem',
    description: 'Polished metallic finish, subtle depth, premium app-icon feel',
    tags: ['Gaming', 'Fintech', 'Hardware', 'Automotive']
  },
  {
    id: 'organic-artisan',
    label: 'Organic & Hand-Crafted',
    description: 'Natural botanical motifs, warm earthy curves, artisan vibe',
    tags: ['Coffee', 'Wellness', 'Eco', 'Food']
  },
  {
    id: 'cyberpunk-neon',
    label: 'Cyberpunk & Electric Glow',
    description: 'High-contrast neon gradients, synthwave edge, dark backdrop',
    tags: ['Esports', 'Streaming', 'Nightlife', 'Music']
  }
];

export const ANIMATION_PRESETS = [
  {
    id: '3d-liquid-metal',
    label: '3D Liquid Chrome Reveal',
    description: 'Molten chrome ripples gather into solid 3D emblem with cinematic lighting reflection',
    prompt: 'Cinematic 3D logo reveal: Molten liquid silver and chrome ripples flow smoothly together from darkness, cooling and hardening into the crisp logo emblem. Soft studio rim lights sweep across the bevels and contours, casting realistic reflections and subtle shadows. Seamless, premium motion graphics finish.'
  },
  {
    id: 'neon-energy-pulse',
    label: 'Neon Energy & Circuit Trace',
    description: 'Luminous light beams trace the logo contour followed by an electric energy pulse',
    prompt: 'Dynamic neon logo animation: Glowing lasers and vibrant electric light trails trace the exact geometric outlines and contours of the logo. Once fully traced, a brilliant neon energy pulse bursts through the symbol, illuminating dark background mist with subtle lens flares and particle smoke.'
  },
  {
    id: 'particle-convergence',
    label: 'Stardust Particle Assembly',
    description: 'Millions of shimmering golden/cyan particles swirl and snap into position',
    prompt: 'Cosmic particle logo animation: Millions of luminous stardust particles and glowing embers swirl gracefully in a spiral vortex, then rapidly converge and coalesce to snap into the sharp, solid logo emblem. A gentle shockwave expands outward as the logo settles with floating ambient motes.'
  },
  {
    id: 'kinetic-slam-glow',
    label: 'Kinetic Slam & Ambient Float',
    description: 'Energetic zoom and slam with dimensional bounce, depth of field and soft hover',
    prompt: 'Bold kinetic logo intro: The logo flies in swiftly with dynamic motion blur, landing with a clean, punchy mechanical impact and subtle camera shake. As it locks into center frame, an elegant ambient glow radiates from behind, and the logo smoothly floats in a gentle looping cinematic hover.'
  },
  {
    id: 'luxury-gold-shimmer',
    label: 'Luxury Gold Leaf Shimmer',
    description: 'High-end embossed gold foil catching shifting highlights and light glints',
    prompt: 'Ultra-luxurious emblem reveal: The logo appears etched in embossed brushed gold on rich textured matte obsidian. Warm anamorphic light glints slowly pass across the metallic facets, highlighting micro-textures, specular gleams, and refined shadows with smooth cinematic camera drift.'
  }
];

/**
 * Builds an optimal prompt for gemini-3-pro-image-preview logo generation
 */
export function buildLogoPrompt(params: LogoPromptParams): string {
  const companyName = params.companyName.trim();
  const industry = params.industry?.trim() || 'Modern business';
  const description = params.description?.trim() || 'Innovative, distinctive company mark';
  const style = params.style || 'Modern Tech & Geometric';
  const colors = params.colorPalette?.trim() || 'Cohesive modern brand palette';

  return `Professional corporate logo design and brand identity emblem for "${companyName}".
Industry / Sector: ${industry}.
Company Concept & Mission: ${description}.
Design Style: ${style}.
Color Palette: ${colors}.
Key Requirements:
- Iconic, memorable, and visually balanced vector emblem or mark for "${companyName}".
- Clean geometry, crisp high-contrast silhouette, professional aesthetic suitable for modern tech, app icons, and corporate branding.
- Centered composition on a clean, solid, dark or neutral studio background with subtle ambient depth.
- No photorealistic clutter, no messy watercolor noise, no random watermarks, no distorted gibberish letters.
- High resolution, masterfully rendered visual identity mark.`;
}

/**
 * Builds an optimal animation prompt for gemini-omni-1.2-flash via Interactions API
 */
export function buildVideoAnimationPrompt(params: AnimationPromptParams): string {
  const preset = ANIMATION_PRESETS.find(p => p.id === params.animationStyle);
  const baseMotion = preset ? preset.prompt : (params.customPrompt || ANIMATION_PRESETS[0].prompt);
  const name = params.companyName ? ` for company "${params.companyName}"` : '';

  return `Smooth animated motion graphics video of this logo${name}. ${baseMotion} High production value, smooth 60fps cinematic frame rate, pristine lighting, perfectly centered framing, professional broadcast animation.`;
}

/**
 * Validates requested image size
 */
export function validateImageSize(size?: string): ImageSize {
  if (size === '2K' || size === '4K') {
    return size;
  }
  return '1K';
}

/**
 * Validates requested video aspect ratio
 */
export function validateAspectRatio(ratio?: string): VideoAspectRatio {
  if (ratio === '9:16') {
    return '9:16';
  }
  return '16:9';
}

/**
 * Default sample company logos for deterministic instant preview / offline test
 */
export interface SampleBrand {
  id: string;
  companyName: string;
  tagline: string;
  industry: string;
  style: string;
  colorPalette: string;
  description: string;
  svgLogo: string;
}

export const SAMPLE_BRANDS: SampleBrand[] = [
  {
    id: 'quantum-pulse',
    companyName: 'QuantumPulse AI',
    tagline: 'Next-Gen Neural Infrastructure',
    industry: 'Artificial Intelligence & Cloud',
    style: 'Modern Tech & Geometric',
    colorPalette: 'Electric Indigo & Cyan (#6366f1, #06b6d4)',
    description: 'Hyperscale neural compute engine accelerating frontier intelligence models with zero latency.',
    svgLogo: `<svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="qp-grad1" x1="50" y1="50" x2="350" y2="350" gradientUnits="userSpaceOnUse">
          <stop stop-color="#6366f1"/>
          <stop offset="0.5" stop-color="#8b5cf6"/>
          <stop offset="1" stop-color="#06b6d4"/>
        </linearGradient>
        <filter id="qp-glow" x="0" y="0" width="400" height="400" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="12" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>
      <rect width="400" height="400" rx="40" fill="#090d16"/>
      <circle cx="200" cy="200" r="140" stroke="#1e293b" stroke-width="2" stroke-dasharray="8 8"/>
      <g filter="url(#qp-glow)">
        <polygon points="200,80 290,140 290,260 200,320 110,260 110,140" fill="none" stroke="url(#qp-grad1)" stroke-width="8" stroke-linejoin="round"/>
        <polygon points="200,120 255,160 255,240 200,280 145,240 145,160" fill="rgba(99, 102, 241, 0.15)" stroke="#38bdf8" stroke-width="4" stroke-linejoin="round"/>
        <circle cx="200" cy="200" r="30" fill="url(#qp-grad1)"/>
        <line x1="200" y1="80" x2="200" y2="120" stroke="#06b6d4" stroke-width="4"/>
        <line x1="290" y1="140" x2="255" y2="160" stroke="#06b6d4" stroke-width="4"/>
        <line x1="290" y1="260" x2="255" y2="240" stroke="#06b6d4" stroke-width="4"/>
        <line x1="200" y1="320" x2="200" y2="280" stroke="#06b6d4" stroke-width="4"/>
        <line x1="110" y1="260" x2="145" y2="240" stroke="#06b6d4" stroke-width="4"/>
        <line x1="110" y1="140" x2="145" y2="160" stroke="#06b6d4" stroke-width="4"/>
      </g>
    </svg>`
  },
  {
    id: 'aura-botanica',
    companyName: 'Aura Botanica',
    tagline: 'Pure Botanical Elixirs',
    industry: 'Luxury Wellness & Skincare',
    style: 'Luxury Monogram & Foil',
    colorPalette: 'Warm Champagne Gold & Forest Emerald (#eab308, #10b981)',
    description: 'Wild-harvested organic botanical extracts formulated for holistic longevity and radiance.',
    svgLogo: `<svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ab-gold" x1="80" y1="80" x2="320" y2="320" gradientUnits="userSpaceOnUse">
          <stop stop-color="#fef08a"/>
          <stop offset="0.5" stop-color="#eab308"/>
          <stop offset="1" stop-color="#ca8a04"/>
        </linearGradient>
      </defs>
      <rect width="400" height="400" rx="40" fill="#04130c"/>
      <circle cx="200" cy="200" r="145" stroke="url(#ab-gold)" stroke-width="2" stroke-opacity="0.4"/>
      <circle cx="200" cy="200" r="135" stroke="url(#ab-gold)" stroke-width="1" stroke-dasharray="4 6"/>
      <!-- Stylized Monogram & Leaf -->
      <path d="M200 90 C250 140 280 200 240 270 C210 320 160 300 150 260 C140 210 170 140 200 90 Z" fill="rgba(234, 179, 8, 0.12)" stroke="url(#ab-gold)" stroke-width="6" stroke-linecap="round"/>
      <path d="M200 120 C180 180 170 230 200 290" stroke="url(#ab-gold)" stroke-width="4" stroke-linecap="round"/>
      <path d="M185 180 C210 190 230 185 245 170" stroke="url(#ab-gold)" stroke-width="3" stroke-linecap="round"/>
      <path d="M190 220 C215 230 230 225 240 210" stroke="url(#ab-gold)" stroke-width="3" stroke-linecap="round"/>
    </svg>`
  },
  {
    id: 'vortex-hyperwear',
    companyName: 'Vortex Athletics',
    tagline: 'Velocity Redefined',
    industry: 'High-Performance Sportswear',
    style: 'Cyberpunk & Electric Glow',
    colorPalette: 'Crimson Surge & Cyber Amber (#f43f5e, #fb923c)',
    description: 'Biomechanical athletic apparel engineered for Olympic sprinters and extreme endurance athletes.',
    svgLogo: `<svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="va-fire" x1="80" y1="100" x2="320" y2="300" gradientUnits="userSpaceOnUse">
          <stop stop-color="#f43f5e"/>
          <stop offset="0.6" stop-color="#fb7185"/>
          <stop offset="1" stop-color="#f97316"/>
        </linearGradient>
      </defs>
      <rect width="400" height="400" rx="40" fill="#0d0406"/>
      <g transform="translate(40, 40) scale(0.8)">
        <path d="M70 200 L160 80 L250 80 L180 200 Z" fill="url(#va-fire)"/>
        <path d="M150 320 L240 200 L330 200 L260 320 Z" fill="url(#va-fire)"/>
        <polygon points="210,140 270,140 230,220 170,220" fill="#ffffff" fill-opacity="0.9"/>
      </g>
    </svg>`
  }
];

export function svgToDataUrl(svg: string): string {
  const encoded = encodeURIComponent(svg.trim())
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');
  return `data:image/svg+xml;charset=utf-8,${encoded}`;
}
