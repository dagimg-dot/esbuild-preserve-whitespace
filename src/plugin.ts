import { relative } from "node:path";
import type { Plugin, PluginBuild } from "esbuild";
import { glob } from "glob";
import { extractConfig, validateConfig } from "./config.js";
import { BLANK_LINE_MARKER } from "./constants.js";
import type { EsbuildPreserveWhitespaceOptions } from "./types.js";
import { addMarkers, log, removeMarkers, restoreContent } from "./utils.js";

function createPlugin(options: EsbuildPreserveWhitespaceOptions = {}): Plugin {
	const { verbose = false } = options;

	return {
		name: "esbuild-preserve-whitespace",
		setup(build: PluginBuild) {
			const originalContents = new Map<string, string>();
			let distPattern: string;
			const projectRoot = build.initialOptions.absWorkingDir || process.cwd();

			build.onStart(async () => {
				validateConfig(build.initialOptions);

				const { srcPattern, distPattern: pattern } = extractConfig(
					build.initialOptions,
				);

				distPattern = pattern;

				log(`Starting esbuild-preserve-whitespace plugin...\n`, verbose);
				log(`Source pattern: ${srcPattern}`, verbose);
				log(`Output pattern: ${distPattern}\n`, verbose);

				let srcFiles: string[] = [];

				if (Array.isArray(srcPattern)) {
					for (const pattern of srcPattern) {
						const files = await glob(pattern, {
							cwd: projectRoot,
							absolute: true,
							nodir: true,
						});

						srcFiles.push(...files);
					}
				} else if (srcPattern) {
					srcFiles = await glob(srcPattern, {
						cwd: projectRoot,
						absolute: true,
						nodir: true,
					});
				}

				srcFiles = [...new Set(srcFiles)];

				log(`Found ${srcFiles.length} TypeScript files\n`, verbose);

				log("Adding whitespace markers...", verbose);

				await Promise.all(
					srcFiles.map(async (file) => {
						const originalContent = await addMarkers(file, BLANK_LINE_MARKER);
						originalContents.set(file, originalContent);
						log(`   ✓ ${relative(projectRoot, file)}`, verbose);
					}),
				);

				log("   All markers added successfully\n", verbose);
			});

			build.onEnd(async () => {
				try {
					log("Finding generated JavaScript files...", verbose);

					const distFiles = await glob(distPattern, {
						cwd: projectRoot,
						absolute: true,
						nodir: true,
					});

					log(`   Found ${distFiles.length} JavaScript files\n`, verbose);

					log("Removing markers from output files...", verbose);

					await Promise.all(
						distFiles.map(async (file) => {
							await removeMarkers(file, BLANK_LINE_MARKER);
							log(`   ✓ ${relative(projectRoot, file)}`, verbose);
						}),
					);

					log("   All markers removed from output\n", verbose);
				} finally {
					log("Restoring source files...", verbose);

					await Promise.all(
						Array.from(originalContents.entries()).map(
							async ([file, content]) => {
								await restoreContent(file, content);
								log(`   ✓ ${relative(projectRoot, file)}`, verbose);
							},
						),
					);

					log("   All source files restored\n", verbose);
					log(
						"esbuild-preserve-whitespace plugin completed successfully",
						verbose,
					);
				}
			});
		},
	};
}

export default createPlugin;
