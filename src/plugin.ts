import { readFile } from "node:fs/promises";
import { relative } from "node:path";
import type { Plugin, PluginBuild } from "esbuild";
import { glob } from "glob";
import { BLANK_LINE_MARKER } from "./constants.js";
import type { EsbuildPreserveWhitespaceOptions } from "./types.js";
import { log, removeMarkers } from "./utils.js";

function createPlugin(options: EsbuildPreserveWhitespaceOptions = {}): Plugin {
	const { verbose = false } = options;

	return {
		name: "esbuild-preserve-whitespace",
		setup(build: PluginBuild) {
			if (build.initialOptions.legalComments !== "inline") {
				throw new Error(
					"esbuild-preserve-whitespace plugin requires legalComments to be set to 'inline' in esbuild config.\n" +
						'Please add `legalComments: "inline"` to your esbuild configuration.',
				);
			}

			const projectRoot = build.initialOptions.absWorkingDir || process.cwd();
			const outdir = build.initialOptions.outdir || "dist";

			build.onLoad({ filter: /\.(ts|tsx)$/ }, async (args) => {
				if (args.path.endsWith(".d.ts")) return;

				const content = await readFile(args.path, "utf-8");
				const lines = content.split("\n");
				const modified = lines
					.map((line) => (line.trim() === "" ? BLANK_LINE_MARKER : line))
					.join("\n");

				log(`   ✓ ${relative(projectRoot, args.path)}`, verbose);

				return {
					contents: modified,
					loader: "ts",
				};
			});

			build.onEnd(async () => {
				log("Removing markers from output files...", verbose);

				const distFiles = await glob(`${outdir}/**/*.js`, {
					cwd: projectRoot,
					absolute: true,
					nodir: true,
				});

				log(`   Found ${distFiles.length} JavaScript files\n`, verbose);

				await Promise.all(
					distFiles.map(async (file) => {
						await removeMarkers(file, BLANK_LINE_MARKER);
						log(`   ✓ ${relative(projectRoot, file)}`, verbose);
					}),
				);

				log("esbuild-preserve-whitespace plugin completed successfully", verbose);
			});
		},
	};
}

export default createPlugin;
