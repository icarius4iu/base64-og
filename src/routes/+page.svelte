<script lang="ts">
	const tools = [
		{
			href: '/tools/text',
			label: 'Text Encode / Decode',
			description: 'Encode any UTF-8 text to Base64 or decode Base64 back to readable text.'
		},
		{
			href: '/tools/image',
			label: 'Image ↔ Base64',
			description: 'Convert PNG, JPG, GIF, WebP and SVG images to Base64 data URIs and back.'
		},
		{
			href: '/tools/file',
			label: 'File ↔ Base64',
			description: 'Encode any file to Base64 or decode a Base64 string back to a downloadable file.'
		},
		{
			href: '/tools/url',
			label: 'URL-safe Base64',
			description: 'RFC 4648 §5 encoding — safe for URLs, filenames and query params without percent-encoding.'
		},
		{
			href: '/tools/validator',
			label: 'Base64 Validator',
			description: 'Check if a string is valid Base64, identify its variant, and inspect decoded byte size.'
		}
	];
</script>

<svelte:head>
	<title>base64.og — Free Base64 Tools</title>
</svelte:head>

<div class="max-w-3xl mx-auto px-6 py-16">
	<div class="mb-12">
		<h1 class="text-3xl font-bold text-zinc-100 mb-3">Base64 Tools</h1>
		<p class="text-zinc-400 text-lg leading-relaxed">
			Fast, free, and open-source. Encode and decode Base64 for text, images, and files — entirely
			in your browser. Nothing leaves your machine.
		</p>
	</div>

	<div class="grid gap-3 sm:grid-cols-2">
		{#each tools as tool}
			<a
				href={tool.href}
				class="group block rounded-xl border border-zinc-800 bg-zinc-900 p-5 hover:border-indigo-500/40 hover:bg-zinc-800/60 transition-all duration-150"
			>
				<h2
					class="font-semibold text-zinc-100 group-hover:text-indigo-400 transition-colors mb-1.5"
				>
					{tool.label}
				</h2>
				<p class="text-sm text-zinc-500 leading-relaxed">{tool.description}</p>
			</a>
		{/each}
	</div>

	<div class="mt-12 p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
		<p class="text-xs text-zinc-500 leading-relaxed">
			<span class="text-zinc-400 font-medium">Embed any tool</span> in your own app by adding
			<code class="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300 font-mono">?embed=true</code>
			to the URL — the nav disappears and the tool renders standalone, ready for iframe integration.
		</p>
	</div>
</div>
