import { readFile, writeFile } from "node:fs/promises";

export async function removeMarkers(
	filePath: string,
	marker: string,
): Promise<void> {
	const content = await readFile(filePath, "utf-8");
	const escapedMarker = marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const cleanedContent = content.replace(
		new RegExp(`^\\s*${escapedMarker}\\s*$`, "gm"),
		"",
	);
	await writeFile(filePath, cleanedContent, "utf-8");
}

export function log(data?: unknown, verbose = false): void {
	if (verbose) {
		console.log(data);
	}
}
