<script lang="ts">
	import { encodeText, decodeText, toUrlSafe, fromUrlSafe } from '$lib/utils/base64';

	type Mode = 'encode' | 'decode';

	let mode: Mode = $state('encode');
	let input = $state('');
	let output = $state('');
	let error = $state('');
	let copied = $state(false);
	let includePadding = $state(false);

	$effect(() => {
		if (!input.trim()) {
			output = '';
			error = '';
			return;
		}
		try {
			if (mode === 'encode') {
				let b64 = encodeText(input, { charset: 'standard' });
				let urlSafe = toUrlSafe(b64);
				if (includePadding) {
					const pad = urlSafe.length % 4;
					if (pad === 2) urlSafe += '==';
					else if (pad === 3) urlSafe += '=';
				}
				output = urlSafe;
			} else {
				output = decodeText(fromUrlSafe(input.trim().replace(/[\r\n\s]/g, '')));
			}
			error = '';
		} catch (e) {
			error = e instanceof Error ? e.message : 'Invalid input';
			output = '';
		}
	});

	async function copy() {
		await navigator.clipboard.writeText(output);
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 2000);
	}
</script>

<svelte:head>
	<title>URL-safe Base64 — base64.og</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-6 py-10">
	<h1 class="text-2xl font-bold text-zinc-100 mb-1">URL-safe Base64</h1>
	<p class="text-sm text-zinc-500 mb-1">
		RFC 4648 §5 — uses <code class="bg-zinc-800 px-1 rounded text-zinc-300 font-mono">-</code> and
		<code class="bg-zinc-800 px-1 rounded text-zinc-300 font-mono">_</code> instead of
		<code class="bg-zinc-800 px-1 rounded text-zinc-300 font-mono">+</code> and
		<code class="bg-zinc-800 px-1 rounded text-zinc-300 font-mono">/</code>, no padding by default
	</p>
	<p class="text-xs text-zinc-700 mb-8">
		Safe for URLs, filenames, JWT tokens, and query parameters without percent-encoding
	</p>

	<!-- Mode tabs -->
	<div class="flex gap-1 mb-6 bg-zinc-900 p-1 rounded-lg w-fit border border-zinc-800">
		{#each [['encode', 'Encode'], ['decode', 'Decode']] as [val, label]}
			<button
				onclick={() => {
					mode = val as Mode;
					output = '';
					error = '';
					input = '';
				}}
				class="px-5 py-1.5 text-sm rounded-md transition-colors {mode === val
					? 'bg-indigo-600 text-white font-medium'
					: 'text-zinc-400 hover:text-zinc-100'}"
			>
				{label}
			</button>
		{/each}
	</div>

	{#if mode === 'encode'}
		<label class="flex items-center gap-2 cursor-pointer mb-5">
			<input type="checkbox" bind:checked={includePadding} class="accent-indigo-500 w-4 h-4" />
			<span class="text-sm text-zinc-400">
				Include padding (<code class="bg-zinc-800 px-1 rounded text-zinc-300 font-mono">=</code>)
			</span>
		</label>
	{/if}

	<div class="mb-4">
		<div class="flex items-center justify-between mb-2">
			<label for="url-input" class="text-sm font-medium text-zinc-300">
				{mode === 'encode' ? 'Text to encode' : 'URL-safe Base64 to decode'}
			</label>
			<button
				onclick={() => {
					input = '';
					output = '';
					error = '';
				}}
				class="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
			>
				Clear
			</button>
		</div>
		<textarea
			id="url-input"
			bind:value={input}
			placeholder={mode === 'encode' ? 'Enter text...' : 'Paste URL-safe Base64 string...'}
			class="w-full h-44 bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-sm text-zinc-100 font-mono placeholder:text-zinc-700 focus:outline-none focus:border-indigo-500 resize-y transition-colors"
		></textarea>
		<p class="text-[11px] text-zinc-700 mt-1.5">{input.length.toLocaleString()} characters</p>
	</div>

	{#if error}
		<div
			class="p-3.5 bg-red-500/8 border border-red-500/25 rounded-xl text-sm text-red-400 mb-4 font-mono"
		>
			{error}
		</div>
	{/if}

	{#if output}
		<div>
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-zinc-300">Result</p>
				<button
					onclick={copy}
					class="text-xs px-3 py-1 border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-zinc-100 rounded-md transition-colors"
				>
					{copied ? 'Copied!' : 'Copy'}
				</button>
			</div>
			<textarea
				readonly
				value={output}
				class="w-full h-44 bg-zinc-900/40 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-100 font-mono focus:outline-none resize-y"
			></textarea>
			<p class="text-[11px] text-zinc-700 mt-1.5">{output.length.toLocaleString()} characters</p>
		</div>
	{/if}
</div>
