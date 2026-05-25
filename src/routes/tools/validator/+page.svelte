<script lang="ts">
	import { validate } from '$lib/utils/base64';

	let input = $state('');
	let result = $derived(input.trim() ? validate(input) : null);

	function formatBytes(n: number) {
		if (n < 1024) return `${n} B`;
		if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
		return `${(n / 1024 / 1024).toFixed(2)} MB`;
	}
</script>

<svelte:head>
	<title>Base64 Validator — base64.og</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-6 py-10">
	<h1 class="text-2xl font-bold text-zinc-100 mb-1">Base64 Validator</h1>
	<p class="text-sm text-zinc-500 mb-8">
		Check if a string is valid Base64, identify its variant, and inspect the decoded byte size
	</p>

	<div class="mb-6">
		<div class="flex items-center justify-between mb-2">
			<label for="validator-input" class="text-sm font-medium text-zinc-300">Input</label>
			{#if input}
				<button
					onclick={() => (input = '')}
					class="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
				>
					Clear
				</button>
			{/if}
		</div>
		<textarea
			id="validator-input"
			bind:value={input}
			placeholder="Paste any string to validate..."
			class="w-full h-52 bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-sm text-zinc-100 font-mono placeholder:text-zinc-700 focus:outline-none focus:border-indigo-500 resize-y transition-colors"
		></textarea>
	</div>

	{#if result}
		<div
			class="rounded-xl border p-6 transition-colors {result.valid
				? 'border-emerald-500/25 bg-emerald-500/5'
				: 'border-red-500/25 bg-red-500/5'}"
		>
			<!-- Status badge -->
			<div class="flex items-center gap-3 mb-5">
				<div
					class="w-2.5 h-2.5 rounded-full shrink-0 {result.valid
						? 'bg-emerald-500'
						: 'bg-red-500'}"
				></div>
				<span class="font-semibold text-base {result.valid ? 'text-emerald-400' : 'text-red-400'}">
					{result.valid ? 'Valid Base64' : 'Invalid Base64'}
				</span>
			</div>

			<dl class="space-y-3 text-sm">
				{#if result.type}
					<div class="flex gap-4 items-start">
						<dt class="text-zinc-600 w-28 shrink-0 pt-0.5">Variant</dt>
						<dd class="text-zinc-200 font-mono">
							{result.type === 'standard' ? 'Standard (RFC 4648 §4)' : 'URL-safe (RFC 4648 §5)'}
						</dd>
					</div>
				{/if}

				<div class="flex gap-4 items-start">
					<dt class="text-zinc-600 w-28 shrink-0 pt-0.5">Length</dt>
					<dd class="text-zinc-200 font-mono">{result.length.toLocaleString()} characters</dd>
				</div>

				{#if result.padding > 0}
					<div class="flex gap-4 items-start">
						<dt class="text-zinc-600 w-28 shrink-0 pt-0.5">Padding</dt>
						<dd class="text-zinc-200 font-mono">{result.padding} × <code class="bg-zinc-800 px-1 rounded">=</code></dd>
					</div>
				{/if}

				{#if result.decodedBytes !== null}
					<div class="flex gap-4 items-start">
						<dt class="text-zinc-600 w-28 shrink-0 pt-0.5">Decoded size</dt>
						<dd class="text-zinc-200 font-mono">
							{result.decodedBytes.toLocaleString()} bytes
							{#if result.decodedBytes >= 1024}
								<span class="text-zinc-500 ml-1">({formatBytes(result.decodedBytes)})</span>
							{/if}
						</dd>
					</div>

					<div class="flex gap-4 items-start">
						<dt class="text-zinc-600 w-28 shrink-0 pt-0.5">Overhead</dt>
						<dd class="text-zinc-200 font-mono">
							{result.decodedBytes > 0
								? ((result.length / result.decodedBytes - 1) * 100).toFixed(1)
								: '0'}%
							<span class="text-zinc-500 text-xs ml-1">vs raw bytes</span>
						</dd>
					</div>
				{/if}

				{#if result.error}
					<div class="flex gap-4 items-start">
						<dt class="text-zinc-600 w-28 shrink-0 pt-0.5">Error</dt>
						<dd class="text-red-400 font-mono">{result.error}</dd>
					</div>
				{/if}
			</dl>
		</div>
	{:else}
		<div
			class="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 text-center text-sm text-zinc-600"
		>
			Paste a string above to see validation results
		</div>
	{/if}
</div>
