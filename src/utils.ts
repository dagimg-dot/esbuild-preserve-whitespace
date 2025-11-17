import { readFile, writeFile } from "node:fs/promises";
import { BLANK_LINE_MARKER } from "./constants.js";

function isBlankLine(line: string): boolean {
	return line.trim().length === 0;
}

export async function addMarkers(
	filePath: string,
	marker: string = BLANK_LINE_MARKER,
): Promise<string> {
	const content = await readFile(filePath, "utf-8");
	const lines = content.split("\n");
	const modifiedLines = lines.map((line) =>
		isBlankLine(line) ? marker : line,
	);
	await writeFile(filePath, modifiedLines.join("\n"), "utf-8");
	return content;
}

export async function removeMarkers(
	filePath: string,
	marker: string = BLANK_LINE_MARKER,
): Promise<void> {
	const content = await readFile(filePath, "utf-8");
	const escapedMarker = marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const cleanedContent = content.replace(
		new RegExp(`^\\s*${escapedMarker}\\s*$`, "gm"),
		"",
	);
	await writeFile(filePath, cleanedContent, "utf-8");
}

export async function restoreContent(
	filePath: string,
	originalContent: string,
): Promise<void> {
	await writeFile(filePath, originalContent, "utf-8");
}

export function log(data?: unknown, verbose = false): void {
	if (verbose) {
		console.log(data);
	}
}
