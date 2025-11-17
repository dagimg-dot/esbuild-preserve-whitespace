import createPlugin from "./plugin.js";

/**
 * Esbuild plugin for TypeScript transpilation with whitespace preservation
 *
 * - **legalComments** must be set to 'inline' in esbuild config
 *
 * @param {Object} options - The options for the plugin
 * @param {boolean} options.verbose - Whether to log verbose output
 *
 * @returns {Object} The esbuild plugin
 */
export const esbuildPreserveWhitespacePlugin = createPlugin;
export default createPlugin;
export type { EsbuildPreserveWhitespaceOptions } from "./types.js";
