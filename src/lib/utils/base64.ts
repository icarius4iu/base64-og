export type Charset = 'standard' | 'url-safe';
export type LineWrap = 'none' | '76' | '64';

export interface EncodeOptions {
	charset?: Charset;
	lineWrap?: LineWrap;
}

export interface ValidationResult {
	valid: boolean;
	type: 'standard' | 'url-safe' | null;
	length: number;
	decodedBytes: number | null;
	padding: number;
	error?: string;
}

// Encode UTF-8 text to Base64
export function encodeText(input: string, options: EncodeOptions = {}): string {
	const { charset = 'standard', lineWrap = 'none' } = options;

	const bytes = new TextEncoder().encode(input);
	let binary = '';
	const chunkSize = 8192;
	for (let i = 0; i < bytes.length; i += chunkSize) {
		binary += String.fromCharCode(...bytes.subarray(i, Math.min(i + chunkSize, bytes.length)));
	}

	let result = btoa(binary);

	if (charset === 'url-safe') {
		result = toUrlSafe(result);
	}

	if (lineWrap !== 'none') {
		result = wrapLines(result, lineWrap === '76' ? 76 : 64);
	}

	return result;
}

// Decode Base64 to UTF-8 text
export function decodeText(input: string, options: { charset?: Charset } = {}): string {
	const { charset = 'standard' } = options;

	let b64 = input.trim().replace(/[\r\n\s]/g, '');

	if (charset === 'url-safe' || b64.includes('-') || b64.includes('_')) {
		b64 = fromUrlSafe(b64);
	}

	const binary = atob(b64);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) {
		bytes[i] = binary.charCodeAt(i);
	}

	return new TextDecoder().decode(bytes);
}

// Read a File and return its Base64 string (no data URL prefix)
export function fileToBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			const result = reader.result as string;
			resolve(result.split(',')[1]);
		};
		reader.onerror = () => reject(new Error('Failed to read file'));
		reader.readAsDataURL(file);
	});
}

// Decode a Base64 string into a Blob for download
export function base64ToBlob(b64: string, mimeType = 'application/octet-stream'): Blob {
	const clean = fromUrlSafe(b64.trim().replace(/[\r\n\s]/g, ''));
	const binary = atob(clean);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) {
		bytes[i] = binary.charCodeAt(i);
	}
	return new Blob([bytes], { type: mimeType });
}

// Standard → URL-safe (removes padding by default per RFC 4648 §5)
export function toUrlSafe(b64: string): string {
	return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// URL-safe → Standard (re-adds padding)
export function fromUrlSafe(b64url: string): string {
	let b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
	const pad = b64.length % 4;
	if (pad === 2) b64 += '==';
	else if (pad === 3) b64 += '=';
	return b64;
}

function wrapLines(b64: string, len: number): string {
	const chunks: string[] = [];
	for (let i = 0; i < b64.length; i += len) {
		chunks.push(b64.slice(i, i + len));
	}
	return chunks.join('\n');
}

export function validate(input: string): ValidationResult {
	const cleaned = input.trim().replace(/[\r\n\s]/g, '');

	if (!cleaned) {
		return { valid: false, type: null, length: 0, decodedBytes: null, padding: 0, error: 'Empty input' };
	}

	const standardRe = /^[A-Za-z0-9+/]+={0,2}$/;
	const urlSafeRe = /^[A-Za-z0-9\-_]+=*$/;

	const padding = (cleaned.match(/=+$/) ?? [''])[0].length;

	if (standardRe.test(cleaned) && cleaned.length % 4 === 0) {
		const decodedBytes = Math.floor((cleaned.length * 3) / 4) - padding;
		return { valid: true, type: 'standard', length: cleaned.length, decodedBytes, padding };
	}

	if (urlSafeRe.test(cleaned)) {
		const padded = fromUrlSafe(cleaned);
		const decodedBytes = Math.floor((padded.length * 3) / 4) - (padded.match(/=+$/) ?? [''])[0].length;
		return { valid: true, type: 'url-safe', length: cleaned.length, decodedBytes, padding };
	}

	// Identify the bad character
	const badChar = cleaned.match(/[^A-Za-z0-9+/=\-_]/)?.[0];
	const error = badChar
		? `Invalid character: '${badChar}' (U+${badChar.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')})`
		: cleaned.length % 4 !== 0
			? 'Length is not a multiple of 4 (missing padding or corrupt data)'
			: 'Invalid Base64 — check padding or character set';

	return { valid: false, type: null, length: cleaned.length, decodedBytes: null, padding, error };
}
