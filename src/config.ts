import type { BuildOptions } from "esbuild";

export interface ExtractedConfig {
	srcPattern: string | string[];
	distPattern: string;
}

export function extractConfig(
	options: BuildOptions,
	_projectRoot?: string,
): ExtractedConfig {
	const { entryPoints, outdir } = options;

	let srcPattern: string | string[] | undefined;

	if (Array.isArray(entryPoints)) {
		srcPattern = entryPoints
			.map((entry) => {
				if (typeof entry === "string") {
					return entry;
				}
				if (entry && typeof entry === "object" && entry.in) {
					return entry.in;
				}
				return null;
			})
			.filter((pattern): pattern is string => Boolean(pattern));
	} else if (typeof entryPoints === "object" && entryPoints !== null) {
		srcPattern = Object.values(entryPoints);
	}

	if (Array.isArray(srcPattern)) {
		srcPattern = srcPattern.map((pattern) => {
			if (pattern.includes("**")) {
				return pattern;
			}
			if (pattern.endsWith(".ts") || pattern.endsWith(".tsx")) {
				const dir = pattern.split("/").slice(0, -1).join("/");
				return dir ? `${dir}/**/*.ts` : "**/*.ts";
			}
			return pattern;
		});
	}

	const distPattern = outdir ? `${outdir}/**/*.js` : "dist/**/*.js";

	return {
		srcPattern: srcPattern || [],
		distPattern,
	};
}

export function validateConfig(options: BuildOptions): void {
	if (options.legalComments !== "inline") {
		throw new Error(
			"esbuild-preserve-whitespace plugin requires legalComments to be set to 'inline' in esbuild config.\n" +
				'Please add `legalComments: "inline"` to your esbuild configuration.',
		);
	}
}
