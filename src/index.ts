#!/usr/bin/env node

import { program } from 'commander';
import { resolve, basename, dirname, join } from 'path';
import chalk from 'chalk';
import { defaultImageToSvgConfig, type ImageToSvgConfig } from './types.js';
import { processImageToSvg } from './utils/image-to-svg.js';

program
  .name('img-to-svg')
  .description('Convert raster images (PNG, JPEG, etc.) to SVG vectors')
  .version('1.0.0')
  .argument('<input>', 'Path to input image (PNG, JPEG, GIF, WebP, BMP, TIFF)')
  .option('-o, --output <path>', 'Output SVG file path (defaults to input name with .svg extension)')
  .option('-b, --background <color>', 'Background color to remove (hex, e.g., #ffffff). Auto-detects if not specified.')
  .option('--tolerance <number>', 'Color tolerance for background removal (0-255)', '60')
  .option('--threshold <number>', 'Threshold for black/white conversion (0-255)', '128')
  .option('--colors <number>', 'Number of colors for posterization (2-256, use for multi-color logos)', '2')
  .option('--invert', 'Invert colors (useful for dark logos on light backgrounds)')
  .option('--turd-policy <policy>', 'Turd policy for tracing - how to resolve ambiguities (black, white, left, right, minority, majority)', 'minority')
  .option('--opt-tolerance <number>', 'Curve optimization tolerance (higher = simpler paths)', '0.5')
  .option('--turd-size <number>', 'Suppress speckles up to this size in pixels (higher = cleaner)', '8')
  .option('--alpha-max <number>', 'Corner sharpness (0-1.33, lower = sharper corners)', '0.75')
  .option('--gradient-cleanup <number>', 'Clean up gradient bleeding at edges (0=off, 1-5=intensity). Use for logos with gradient text on solid backgrounds.', '0')
  .option('--max-colors <number>', 'Maximum number of colors to trace (reduces file size)', '2')
  .action(async (input, options) => {
    console.log(chalk.bold('\n🎨 Image to SVG Conversion\n'));

    try {
      const inputPath = resolve(input);

      // Determine output path
      let outputPath: string;
      if (options.output) {
        outputPath = resolve(options.output);
      } else {
        const inputDir = dirname(inputPath);
        const inputName = basename(inputPath, /\.(png|jpe?g|gif|webp|bmp|tiff?)$/i.exec(inputPath)?.[0] || '');
        outputPath = join(inputDir, `${inputName}.svg`);
      }

      console.log(chalk.dim(`Input:  ${inputPath}`));
      console.log(chalk.dim(`Output: ${outputPath}\n`));

      // Build conversion options
      const gradientCleanup = parseInt(options.gradientCleanup, 10);
      const maxColors = parseInt(options.maxColors, 10);
      const convertOptions: ImageToSvgConfig = {
        ...defaultImageToSvgConfig,
        backgroundColor: options.background,
        colorTolerance: parseInt(options.tolerance, 10),
        threshold: parseInt(options.threshold, 10),
        colorCount: parseInt(options.colors, 10),
        invert: options.invert || false,
        turdPolicy: options.turdPolicy as ImageToSvgConfig['turdPolicy'],
        optTolerance: parseFloat(options.optTolerance),
        turdSize: parseInt(options.turdSize, 10),
        alphaMax: parseFloat(options.alphaMax),
        gradientCleanup,
        maxColors,
      };

      console.log(chalk.dim('Processing...'));
      console.log(chalk.dim('  - Removing background'));
      if (gradientCleanup > 0) {
        console.log(chalk.dim(`  - Cleaning up gradient edges (intensity: ${gradientCleanup})`));
      }
      console.log(chalk.dim('  - Trimming transparent space'));
      console.log(chalk.dim('  - Vectorizing image\n'));

      const startTime = Date.now();
      await processImageToSvg(inputPath, outputPath, convertOptions);
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);

      console.log(chalk.green(`✓ SVG created successfully!`));
      console.log(chalk.dim(`  Output: ${outputPath}`));
      console.log(chalk.dim(`  Time: ${duration}s\n`));
    } catch (error) {
      if (error instanceof Error) {
        console.error(chalk.red(`\n✖ Error: ${error.message}\n`));
        if (error.message.includes('ENOENT')) {
          console.error(chalk.dim('Make sure the input image file exists.\n'));
        }
        if (error.message.includes('Input file is missing')) {
          console.error(chalk.dim('Supported formats: PNG, JPEG, GIF, WebP, BMP, TIFF\n'));
        }
      } else {
        console.error(chalk.red('\n✖ An unexpected error occurred\n'));
      }
      process.exit(1);
    }
  });

program.parse();
