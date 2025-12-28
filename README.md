# img-to-svg

Convert raster images (PNG, JPEG, GIF, WebP, BMP, TIFF) to SVG vectors with automatic background removal and color preservation.

## Features

- **Automatic background detection and removal** - Intelligently detects solid color backgrounds and removes them
- **Color preservation** - Maintains original colors from the source image
- **Multi-color support** - Handles images with multiple colors through posterization
- **High-quality vectorization** - Uses potrace for smooth, accurate vector tracing
- **Upscaling for smoother curves** - Pre-upscales images before tracing for better quality
- **Configurable tracing parameters** - Fine-tune the vectorization for optimal results

## Installation

```bash
npm install
npm run build
```

## Usage

### Basic conversion

```bash
node dist/index.js image.png
# Output: image.svg (same directory as input)
```

### Specify output path

```bash
node dist/index.js image.png -o logo.svg
```

### With explicit background color

```bash
node dist/index.js image.png -b "#ffffff"
```

### Multi-color image with posterization

```bash
node dist/index.js photo.jpg --colors 8
```

## CLI Options

| Option | Description |
|--------|-------------|
| `-o, --output <path>` | Output SVG file path (defaults to input name with .svg extension) |
| `-b, --background <color>` | Background color to remove (hex). Auto-detects if not specified |
| `--tolerance <number>` | Color tolerance for background removal (0-255, default: 30) |
| `--threshold <number>` | Threshold for black/white conversion (0-255, default: 128) |
| `--colors <number>` | Number of colors for posterization (2-256, default: 2) |
| `--invert` | Invert colors (useful for dark logos on light backgrounds) |
| `--turd-policy <policy>` | How to resolve tracing ambiguities (black, white, left, right, minority, majority) |
| `--opt-tolerance <number>` | Curve optimization tolerance (lower = sharper, default: 0.1) |
| `--turd-size <number>` | Suppress speckles up to this size in pixels (default: 2) |
| `--alpha-max <number>` | Corner sharpness (0-1.33, lower = sharper, default: 0.75) |
| `--upscale <number>` | Upscale factor before tracing (1-4, default: 2) |

## How It Works

The conversion process follows three stages:

1. **Background Removal** - Detects and removes solid color backgrounds by sampling corner pixels and making matching colors transparent
2. **Alpha Trimming** - Removes transparent edges around the image content
3. **Vectorization** - Traces the image using potrace, preserving original colors by creating separate paths for each unique color

## Supported Input Formats

- PNG
- JPEG / JPG
- GIF
- WebP
- BMP
- TIFF

## Requirements

- Node.js >= 18.0.0

## License

MIT
