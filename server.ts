import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import {
  buildLogoPrompt,
  buildVideoAnimationPrompt,
  validateImageSize,
  validateAspectRatio
} from './src/utils/logo-generator.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Support base64 image uploads up to 50MB
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Helper to initialize Gemini client with User-Agent
  function getGeminiClient(): GoogleGenAI {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set. Please select or add an API key in the AI Studio Settings > Secrets panel.');
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  // Status check endpoint
  app.get('/api/status', (_req: Request, res: Response) => {
    res.json({
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
      imageModel: 'gemini-3-pro-image-preview',
      videoModel: 'gemini-omni-1.2-flash',
    });
  });

  // 1. Logo Generation Endpoint using gemini-3-pro-image-preview
  app.post('/api/generate-logo', async (req: Request, res: Response) => {
    try {
      const {
        companyName,
        industry,
        description,
        style,
        colorPalette,
        imageSize,
      } = req.body;

      if (!companyName || typeof companyName !== 'string' || !companyName.trim()) {
        return res.status(400).json({ error: 'Company name is required.' });
      }

      const validSize = validateImageSize(imageSize);
      const prompt = buildLogoPrompt({
        companyName,
        industry,
        description,
        style,
        colorPalette,
        imageSize: validSize,
      });

      console.log(`[LogoGen] Generating logo for "${companyName}" with size: ${validSize}...`);

      const ai = getGeminiClient();

      // Model call to gemini-3-pro-image-preview
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: '1:1',
            imageSize: validSize,
          },
        },
      });

      let imageUrl: string | null = null;
      let textFeedback = '';

      for (const part of response.candidates?.[0]?.content?.parts ?? []) {
        if (part.inlineData?.data) {
          const mime = part.inlineData.mimeType || 'image/png';
          imageUrl = `data:${mime};base64,${part.inlineData.data}`;
          break;
        } else if (part.text) {
          textFeedback += part.text + ' ';
        }
      }

      if (!imageUrl) {
        return res.status(502).json({
          error: 'The image generation model did not return image data.',
          details: textFeedback || 'No candidate image was generated.',
        });
      }

      console.log(`[LogoGen] Successfully generated logo for "${companyName}" (${validSize}).`);

      return res.json({
        success: true,
        imageUrl,
        imageSize: validSize,
        prompt,
        companyName,
      });
    } catch (err: any) {
      console.error('[LogoGen Error]:', err);
      const message = err?.message || 'Failed to generate logo image';
      const status = err?.status || (message.includes('GEMINI_API_KEY') ? 401 : 500);
      return res.status(status).json({
        error: message,
        code: err?.code || 'GENERATE_FAILED',
        isPaidModelError: message.includes('429') || message.includes('RESOURCE_EXHAUSTED') || message.includes('PERMISSION_DENIED'),
      });
    }
  });

  // 2. Video Animation Endpoint using gemini-omni-1.2-flash via Interactions API
  app.post('/api/animate-logo', async (req: Request, res: Response) => {
    try {
      const {
        imageData,
        mimeType,
        animationStyle,
        customPrompt,
        aspectRatio,
        companyName,
      } = req.body;

      if (!imageData || typeof imageData !== 'string') {
        return res.status(400).json({ error: 'Image data is required to animate.' });
      }

      const validRatio = validateAspectRatio(aspectRatio);
      const motionPrompt = buildVideoAnimationPrompt({
        companyName,
        animationStyle,
        customPrompt,
        aspectRatio: validRatio,
      });

      // Parse clean base64 data and mimeType
      let cleanBase64 = imageData;
      let resolvedMime = mimeType || 'image/png';

      if (imageData.startsWith('data:')) {
        const commaIdx = imageData.indexOf(',');
        const meta = imageData.substring(0, commaIdx);
        const match = meta.match(/data:([^;]+);base64/);
        if (match) {
          resolvedMime = match[1];
        }
        cleanBase64 = imageData.substring(commaIdx + 1);
      }

      // If svg, convert or check mime
      if (resolvedMime.includes('svg')) {
        // Omni flash prefers raster images (PNG/JPEG)
        resolvedMime = 'image/png';
      }

      console.log(`[VideoGen] Animating logo with Omni Flash (aspectRatio: ${validRatio})...`);

      const ai = getGeminiClient();

      // Call Gemini Interactions API with model: gemini-omni-1.2-flash
      const interaction = await ai.interactions.create({
        model: 'gemini-omni-1.2-flash',
        input: [
          {
            type: 'image',
            mime_type: resolvedMime,
            data: cleanBase64,
          },
          {
            type: 'text',
            text: motionPrompt,
          },
        ],
        background: false,
        store: false,
        stream: false,
        response_format: {
          type: 'video',
          aspect_ratio: validRatio, // '16:9' or '9:16'
        },
      }, { timeout: 300000 }); // 5 minutes timeout

      let videoUrl: string | null = null;
      const videoPart = interaction.output_video;

      if (videoPart?.data) {
        const mime = videoPart.mime_type || 'video/mp4';
        videoUrl = `data:${mime};base64,${videoPart.data}`;
      } else if ((videoPart as any)?.uri) {
        videoUrl = (videoPart as any).uri;
      } else {
        // Fallback: check interaction.steps
        for (const step of interaction.steps || []) {
          if (step.type === 'model_output') {
            const vContent = (step as any).content?.find((c: any) => c.type === 'video');
            if (vContent?.data) {
              const mime = vContent.mime_type || 'video/mp4';
              videoUrl = `data:${mime};base64,${vContent.data}`;
              break;
            } else if (vContent?.uri) {
              videoUrl = vContent.uri;
              break;
            }
          }
        }
      }

      if (!videoUrl) {
        return res.status(502).json({
          error: 'The video model did not return video output.',
          stepsCount: interaction.steps?.length || 0,
        });
      }

      console.log(`[VideoGen] Successfully generated video with Omni Flash.`);

      return res.json({
        success: true,
        videoUrl,
        aspectRatio: validRatio,
        prompt: motionPrompt,
      });
    } catch (err: any) {
      console.error('[VideoGen Error]:', err);
      const message = err?.message || 'Failed to animate logo into video';
      const status = err?.status || (message.includes('GEMINI_API_KEY') ? 401 : 500);
      return res.status(status).json({
        error: message,
        code: err?.code || 'ANIMATE_FAILED',
        isPaidModelError: message.includes('429') || message.includes('RESOURCE_EXHAUSTED') || message.includes('PERMISSION_DENIED'),
      });
    }
  });

  // Mount Vite middleware in development or static dist in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 OmniBrand Studio Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
