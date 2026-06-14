# esbuild-preserve-whitespace

[![npm version](https://badge.fury.io/js/esbuild-preserve-whitespace.svg)](https://badge.fury.io/js/esbuild-preserve-whitespace)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An esbuild plugin that preserves blank lines and whitespace during TypeScript transpilation by temporarily marking them with special comments that esbuild preserves.

## Installation

```bash
npm install -D esbuild-preserve-whitespace
```

```bash
yarn add -D esbuild-preserve-whitespace
```

```bash
pnpm add -D esbuild-preserve-whitespace
```

```bash
bun add -D esbuild-preserve-whitespace
```

## Usage

Add the plugin to your esbuild configuration. **Important**: You must set `legalComments: "inline"` in your esbuild options for this plugin to work.

### Basic Usage

```typescript
import { esbuildPreserveWhitespacePlugin } from "esbuild-preserve-whitespace";

await esbuild.build({
  // ... other esbuild options ...
  legalComments: "inline", // Required!
  plugins: [esbuildPreserveWhitespacePlugin()],
});
```

### With Options

```typescript
import { esbuildPreserveWhitespacePlugin } from "esbuild-preserve-whitespace";

await esbuild.build({
  // ... other esbuild options ...
  legalComments: "inline",
  plugins: [
    esbuildPreserveWhitespacePlugin({
      verbose: true, // Enable verbose logging
    }),
  ],
});
```

## Options

| Option  | Type      | Default | Description                  |
|---------|-----------|---------|------------------------------|
| verbose | `boolean` | `false` | Enable verbose build logging |

## How It Works

The plugin uses esbuild's **`onLoad`** callback to intercept file content **in memory** — no source files are ever modified on disk.

1. **During build**: When esbuild processes a TypeScript file, the `onLoad` callback reads it, replaces blank lines with `//! _BLANK_LINE_` markers, and returns the modified content to esbuild — entirely in memory.
2. **Transpile**: esbuild transpiles the modified content to JavaScript. Because `legalComments: "inline"` is set, the `//!` marker comments survive into the output.
3. **After build**: The `onEnd` callback scans the output directory and removes the marker comments from every generated `.js` file.

### Why this is safe

The plugin **never writes to your source files**. The old approach (v1.1.x) modified source files in-place during `onStart` and restored them in `onEnd`, which created a risk of leaving modified source files if the build process was interrupted. The new approach eliminates this entirely:

- Source files are **read-only** — only read, never written
- Content transformation happens in **memory** via esbuild's `onLoad` pipeline
- No `originalContents` map to track or restore
- No source file restoration step needed

### Performance

The `onLoad` approach is significantly faster because it eliminates:
- **Pre-build glob scan** of all source files (old: walked all entry points upfront)
- **Write markers** to source files (old: one write per file)
- **Restore source files** (old: one write per file)
- **Store original content** in memory map (old: every source in memory)

New flow per source file: **1 read** only.
Old flow per source file: **1 read + 2 writes** (write markers, restore original).

## Requirements

- `legalComments: "inline"` must be set in your esbuild configuration

