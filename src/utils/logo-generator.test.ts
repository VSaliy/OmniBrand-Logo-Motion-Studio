import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildLogoPrompt,
  buildVideoAnimationPrompt,
  validateImageSize,
  validateAspectRatio,
  VALID_IMAGE_SIZES,
  VALID_ASPECT_RATIOS,
  ANIMATION_PRESETS,
  svgToDataUrl,
  SAMPLE_BRANDS
} from './logo-generator';

test('validateImageSize supports 1K, 2K, 4K and defaults to 1K', () => {
  assert.equal(validateImageSize('1K'), '1K');
  assert.equal(validateImageSize('2K'), '2K');
  assert.equal(validateImageSize('4K'), '4K');
  assert.equal(validateImageSize('invalid'), '1K');
  assert.equal(validateImageSize(undefined), '1K');
});

test('validateAspectRatio supports 16:9 and 9:16 and defaults to 16:9', () => {
  assert.equal(validateAspectRatio('16:9'), '16:9');
  assert.equal(validateAspectRatio('9:16'), '9:16');
  assert.equal(validateAspectRatio('4:3'), '16:9');
  assert.equal(validateAspectRatio(undefined), '16:9');
});

test('buildLogoPrompt contains company name, industry, and core requirements', () => {
  const prompt = buildLogoPrompt({
    companyName: 'Apex Robotics',
    industry: 'Autonomous Systems',
    description: 'Next gen drones and rovers',
    style: 'Modern Tech & Geometric',
    colorPalette: 'Electric Blue and Titanium Silver',
    imageSize: '2K'
  });

  assert.match(prompt, /Apex Robotics/);
  assert.match(prompt, /Autonomous Systems/);
  assert.match(prompt, /Modern Tech & Geometric/);
  assert.match(prompt, /Electric Blue and Titanium Silver/);
  assert.match(prompt, /vector emblem/);
});

test('buildVideoAnimationPrompt incorporates animation preset and company context', () => {
  const prompt = buildVideoAnimationPrompt({
    companyName: 'Apex Robotics',
    animationStyle: '3d-liquid-metal',
    aspectRatio: '16:9'
  });

  assert.match(prompt, /Apex Robotics/);
  assert.match(prompt, /Molten liquid silver and chrome ripples/);
  assert.match(prompt, /motion graphics/);
});

test('buildVideoAnimationPrompt handles custom prompt fallback', () => {
  const prompt = buildVideoAnimationPrompt({
    customPrompt: 'Exploding supernova with particle ring',
    aspectRatio: '9:16'
  });

  assert.match(prompt, /Exploding supernova with particle ring/);
});

test('SAMPLE_BRANDS array has valid presets and convertible SVG', () => {
  assert.ok(SAMPLE_BRANDS.length >= 3);
  for (const brand of SAMPLE_BRANDS) {
    assert.ok(brand.companyName.length > 0);
    assert.ok(brand.svgLogo.includes('<svg'));
    const dataUrl = svgToDataUrl(brand.svgLogo);
    assert.ok(dataUrl.startsWith('data:image/svg+xml'));
  }
});

test('Constants expose required prompt options', () => {
  assert.deepEqual(VALID_IMAGE_SIZES, ['1K', '2K', '4K']);
  assert.deepEqual(VALID_ASPECT_RATIOS, ['16:9', '9:16']);
  assert.ok(ANIMATION_PRESETS.length >= 4);
});
