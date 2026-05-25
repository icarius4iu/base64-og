export type Lang = 'es' | 'en';

class I18nState {
	lang = $state<Lang>('es');
	toggle() {
		this.lang = this.lang === 'es' ? 'en' : 'es';
	}
}

export const i18n = new I18nState();

export const translations = {
	es: {
		nav: {
			tools: 'Herramientas',
			text: 'Texto Encode / Decode',
			image: 'Imagen ↔ Base64',
			file: 'Archivo ↔ Base64',
			url: 'Base64 URL-safe',
			validator: 'Validador',
			clientSide: '100% en el cliente · Sin envío de datos'
		},
		home: {
			title: 'Herramientas Base64',
			description:
				'Rápido, gratuito y open-source. Codificá y decodificá Base64 para texto, imágenes y archivos — completamente en tu navegador. Nada sale de tu máquina.',
			embedHint:
				'Podés embeber cualquier herramienta en tu propia app agregando',
			embedHint2: 'a la URL — el menú desaparece y la herramienta se muestra sola, lista para integrar con iframe.',
			tools: {
				text: {
					label: 'Texto Encode / Decode',
					description: 'Codificá cualquier texto UTF-8 a Base64 o decodificá Base64 de vuelta a texto legible.'
				},
				image: {
					label: 'Imagen ↔ Base64',
					description: 'Convertí imágenes PNG, JPG, GIF, WebP y SVG a URIs Base64 y viceversa.'
				},
				file: {
					label: 'Archivo ↔ Base64',
					description: 'Codificá cualquier archivo a Base64 o decodificá una cadena Base64 a un archivo descargable.'
				},
				url: {
					label: 'Base64 URL-safe',
					description: 'Codificación RFC 4648 §5 — segura para URLs, nombres de archivo y parámetros sin percent-encoding.'
				},
				validator: {
					label: 'Validador Base64',
					description: 'Verificá si una cadena es Base64 válido, identificá su variante e inspeccioná el tamaño decodificado.'
				}
			}
		},
		common: {
			encode: 'Codificar',
			decode: 'Decodificar',
			copy: 'Copiar',
			copied: '¡Copiado!',
			clear: 'Limpiar',
			result: 'Resultado',
			preview: 'Previsualización',
			download: 'Descargar',
			processing: 'Procesando...',
			characters: 'caracteres',
			clickReplace: 'Hacé clic para reemplazar'
		},
		text: {
			title: 'Texto Encode / Decode',
			subtitle: 'Codificá texto UTF-8 a Base64 o decodificá Base64 de vuelta a texto',
			charset: 'Charset',
			standard: 'Estándar',
			lineWrap: 'Salto de línea',
			none: 'Ninguno',
			chars76: '76 chars',
			chars64: '64 chars',
			inputEncode: 'Texto a codificar',
			inputDecode: 'Base64 a decodificar',
			placeholderEncode: 'Ingresá cualquier texto acá...',
			placeholderDecode: 'Pegá una cadena Base64 para decodificar...',
			swap: 'Intercambiar ↕'
		},
		image: {
			title: 'Imagen ↔ Base64',
			subtitle: 'Convertí imágenes a URIs Base64 o mostrá Base64 como imagen',
			tabToBase64: 'Imagen → Base64',
			tabToImage: 'Base64 → Imagen',
			dropZone: 'Soltá una imagen acá o hacé clic para seleccionar',
			dropZoneSub: 'PNG, JPG, GIF, WebP, SVG compatibles',
			mimeType: 'Tipo MIME',
			base64Output: 'Salida Base64',
			base64String: 'Cadena Base64',
			renderImage: 'Mostrar imagen',
			placeholderDecode: 'Pegá los datos Base64 de la imagen...',
			failedRender: 'No se pudo mostrar la imagen — verificá el tipo MIME y los datos Base64',
			failedRead: 'No se pudo leer el archivo',
			wrongType: 'Se esperaba un archivo de imagen'
		},
		file: {
			title: 'Archivo ↔ Base64',
			subtitle: 'Codificá cualquier archivo a Base64 o decodificá Base64 a un archivo descargable',
			tabToBase64: 'Archivo → Base64',
			tabToFile: 'Base64 → Archivo',
			dropZone: 'Soltá cualquier archivo acá o hacé clic para seleccionar',
			dropZoneSub: 'Todos los tipos de archivo son compatibles',
			readingFile: 'Leyendo archivo...',
			base64Output: 'Salida Base64',
			base64String: 'Cadena Base64',
			filename: 'Nombre de archivo',
			mimeType: 'Tipo MIME',
			downloadFile: 'Descargar archivo',
			placeholderDecode: 'Pegá los datos Base64 codificados...',
			noData: 'Pegá una cadena Base64 primero',
			failedRead: 'No se pudo leer el archivo',
			invalidB64: 'Datos Base64 inválidos — verificá el input'
		},
		url: {
			title: 'Base64 URL-safe',
			subtitle:
				'RFC 4648 §5 — usa',
			subtitleMid: 'y',
			subtitleEnd: 'en lugar de',
			subtitleEnd2: 'y',
			subtitleEnd3: 'sin relleno por defecto',
			description: 'Seguro para URLs, nombres de archivo, tokens JWT y parámetros de consulta sin percent-encoding',
			includePadding: 'Incluir relleno',
			inputEncode: 'Texto a codificar',
			inputDecode: 'Base64 URL-safe a decodificar',
			placeholderEncode: 'Ingresá texto...',
			placeholderDecode: 'Pegá una cadena Base64 URL-safe...'
		},
		validator: {
			title: 'Validador Base64',
			subtitle: 'Verificá si una cadena es Base64 válido, identificá su variante e inspeccioná el tamaño decodificado',
			inputLabel: 'Input',
			placeholder: 'Pegá cualquier cadena para validar...',
			validBase64: 'Base64 válido',
			invalidBase64: 'Base64 inválido',
			variant: 'Variante',
			length: 'Longitud',
			padding: 'Padding',
			decodedSize: 'Tamaño decodificado',
			overhead: 'Overhead',
			vsRawBytes: 'vs bytes crudos',
			errorLabel: 'Error',
			emptyState: 'Pegá una cadena arriba para ver los resultados',
			standard: 'Estándar (RFC 4648 §4)',
			urlSafe: 'URL-safe (RFC 4648 §5)',
			bytes: 'bytes'
		}
	},

	en: {
		nav: {
			tools: 'Tools',
			text: 'Text Encode / Decode',
			image: 'Image ↔ Base64',
			file: 'File ↔ Base64',
			url: 'URL-safe Base64',
			validator: 'Validator',
			clientSide: '100% client-side · No data sent'
		},
		home: {
			title: 'Base64 Tools',
			description:
				'Fast, free, and open-source. Encode and decode Base64 for text, images, and files — entirely in your browser. Nothing leaves your machine.',
			embedHint: 'Embed any tool in your own app by adding',
			embedHint2: 'to the URL — the nav disappears and the tool renders standalone, ready for iframe integration.',
			tools: {
				text: {
					label: 'Text Encode / Decode',
					description: 'Encode any UTF-8 text to Base64 or decode Base64 back to readable text.'
				},
				image: {
					label: 'Image ↔ Base64',
					description: 'Convert PNG, JPG, GIF, WebP and SVG images to Base64 data URIs and back.'
				},
				file: {
					label: 'File ↔ Base64',
					description: 'Encode any file to Base64 or decode a Base64 string back to a downloadable file.'
				},
				url: {
					label: 'URL-safe Base64',
					description: 'RFC 4648 §5 encoding — safe for URLs, filenames and query params without percent-encoding.'
				},
				validator: {
					label: 'Base64 Validator',
					description: 'Check if a string is valid Base64, identify its variant, and inspect decoded byte size.'
				}
			}
		},
		common: {
			encode: 'Encode',
			decode: 'Decode',
			copy: 'Copy',
			copied: 'Copied!',
			clear: 'Clear',
			result: 'Result',
			preview: 'Preview',
			download: 'Download',
			processing: 'Processing...',
			characters: 'characters',
			clickReplace: 'Click to replace'
		},
		text: {
			title: 'Text Encode / Decode',
			subtitle: 'Encode UTF-8 text to Base64 or decode Base64 back to text',
			charset: 'Charset',
			standard: 'Standard',
			lineWrap: 'Line wrap',
			none: 'None',
			chars76: '76 chars',
			chars64: '64 chars',
			inputEncode: 'Text to encode',
			inputDecode: 'Base64 to decode',
			placeholderEncode: 'Enter any text here...',
			placeholderDecode: 'Paste a Base64 string to decode...',
			swap: 'Swap ↕'
		},
		image: {
			title: 'Image ↔ Base64',
			subtitle: 'Convert images to Base64 data URIs or render Base64 back to an image',
			tabToBase64: 'Image → Base64',
			tabToImage: 'Base64 → Image',
			dropZone: 'Drop an image here or click to browse',
			dropZoneSub: 'PNG, JPG, GIF, WebP, SVG supported',
			mimeType: 'MIME type',
			base64Output: 'Base64 output',
			base64String: 'Base64 string',
			renderImage: 'Render Image',
			placeholderDecode: 'Paste Base64 encoded image data...',
			failedRender: 'Failed to render image — verify MIME type and Base64 data',
			failedRead: 'Failed to read file',
			wrongType: 'Expected an image file'
		},
		file: {
			title: 'File ↔ Base64',
			subtitle: 'Encode any file to Base64 or decode Base64 back to a downloadable file',
			tabToBase64: 'File → Base64',
			tabToFile: 'Base64 → File',
			dropZone: 'Drop any file here or click to browse',
			dropZoneSub: 'All file types supported',
			readingFile: 'Reading file...',
			base64Output: 'Base64 output',
			base64String: 'Base64 string',
			filename: 'Filename',
			mimeType: 'MIME type',
			downloadFile: 'Download File',
			placeholderDecode: 'Paste Base64 encoded data...',
			noData: 'Paste a Base64 string first',
			failedRead: 'Failed to read file',
			invalidB64: 'Invalid Base64 data — check the input'
		},
		url: {
			title: 'URL-safe Base64',
			subtitle: 'RFC 4648 §5 — uses',
			subtitleMid: 'and',
			subtitleEnd: 'instead of',
			subtitleEnd2: 'and',
			subtitleEnd3: 'no padding by default',
			description:
				'Safe for URLs, filenames, JWT tokens, and query parameters without percent-encoding',
			includePadding: 'Include padding',
			inputEncode: 'Text to encode',
			inputDecode: 'URL-safe Base64 to decode',
			placeholderEncode: 'Enter text...',
			placeholderDecode: 'Paste URL-safe Base64 string...'
		},
		validator: {
			title: 'Base64 Validator',
			subtitle:
				'Check if a string is valid Base64, identify its variant, and inspect the decoded byte size',
			inputLabel: 'Input',
			placeholder: 'Paste any string to validate...',
			validBase64: 'Valid Base64',
			invalidBase64: 'Invalid Base64',
			variant: 'Variant',
			length: 'Length',
			padding: 'Padding',
			decodedSize: 'Decoded size',
			overhead: 'Overhead',
			vsRawBytes: 'vs raw bytes',
			errorLabel: 'Error',
			emptyState: 'Paste a string above to see validation results',
			standard: 'Standard (RFC 4648 §4)',
			urlSafe: 'URL-safe (RFC 4648 §5)',
			bytes: 'bytes'
		}
	}
} as const;

export type Translations = (typeof translations)[Lang];
