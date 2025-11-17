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

1. **Before build**: Scans TypeScript files and temporarily replaces blank lines with special marker comments (`//! _BLANK_LINE_`)
2. **During build**: esbuild processes the files, preserving the marker comments since `legalComments: "inline"` is set
3. **After build**: Removes marker comments from output files and restores original source files

This approach ensures that blank lines are preserved in the final JavaScript output while maintaining clean source files.

## Requirements

- `legalComments: "inline"` must be set in your esbuild configuration

