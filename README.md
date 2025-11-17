# esbuild-preserve-whitespace

Esbuild plugin for TypeScript transpilation with whitespace preservation

## Installation

- npm
```bash
npm install -D esbuild-preserve-whitespace
```

- yarn
```bash
yarn add -D esbuild-preserve-whitespace
```

- pnpm
```bash
pnpm add -D esbuild-preserve-whitespace
```

- bun

```bash
bun add -D esbuild-preserve-whitespace
```

## Usage

```ts
import { esbuildPreserveWhitespacePlugin } from "esbuild-preserve-whitespace";
```

```ts
esbuild.build({
  legalComments: "inline",
  plugins: [esbuildPreserveWhitespacePlugin()],
});
```

## Development

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.3.1. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
