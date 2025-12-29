export interface ImageToSvgConfig {
  /** Color to remove from background (e.g., '#ffffff' for white). If not specified, auto-detects. */
  backgroundColor?: string;
  /** Tolerance for background color matching (0-255). Default: 30 */
  colorTolerance?: number;
  /** Whether to invert colors (useful for dark logos). Default: false */
  invert?: boolean;
  /** Threshold for black/white conversion (0-255). Default: 128 */
  threshold?: number;
  /** Number of colors for posterization (2-256). Use for multi-color logos. Default: 2 */
  colorCount?: number;
  /** Turd policy for potrace tracing (how to resolve ambiguities) */
  turdPolicy?: 'black' | 'white' | 'left' | 'right' | 'minority' | 'majority';
  /** Curve optimization tolerance. Lower = more accurate curves. Default: 0.1 */
  optTolerance?: number;
  /** Suppress speckles of up to this many pixels. Lower = more detail. Default: 2 */
  turdSize?: number;
  /** Corner threshold (0 to 1.33). Lower = sharper corners. Default: 0.75 */
  alphaMax?: number;
  /** Upscale factor before tracing for smoother curves. Default: 2 */
  upscale?: number;
  /** Clean up gradient bleeding at edges. Higher = more aggressive cleanup. Default: 0 (disabled) */
  gradientCleanup?: number;
  /** Maximum number of colors to trace. Default: 8 */
  maxColors?: number;
}

export const defaultImageToSvgConfig: ImageToSvgConfig = {
  colorTolerance: 40,
  invert: false,
  threshold: 128,
  colorCount: 2,
  turdPolicy: 'minority',
  optTolerance: 0.5,
  turdSize: 8,
  alphaMax: 1.0,
  upscale: 1,
  gradientCleanup: 0,
  maxColors: 8,
};
