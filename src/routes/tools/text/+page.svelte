<script lang="ts">
	import { encodeText, decodeText } from '$lib/utils/base64';
	import type { Charset, LineWrap } from '$lib/utils/base64';
	import { i18n, translations } from '$lib/i18n.svelte';

	type Mode = 'encode' | 'decode';

	let t = $derived(translations[i18n.lang]);

	let mode: Mode = $state('encode');
	let input = $state('');
	let charset: Charset = $state('standard');
	let lineWrap: LineWrap = $state('none');
	let output = $state('');
	let error = $state('');
	let copied = $state(false);

	$effect(() => {
		if (!input.trim()) {
			output = '';
			error = '';
			return;
		}
		try {
			output =
				mode === 'encode'
					? encodeText(input, { charset, lineWrap })
					: decodeText(input, { charset });
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

	function swap() {
		const prev = output;
		mode = mode === 'encode' ? 'decode' : 'encode';
		input = prev;
	}
</script>

<svelte:head>
	<title>{t.text.title} — base64.og</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-6 py-10">
	<h1 class="text-2xl font-bold text-zinc-100 mb-1">{t.text.title}</h1>
	<p class="text-sm text-zinc-500 mb-8">{t.text.subtitle}</p>

	<!-- Mode tabs -->
	<div class="flex gap-1 mb-6 bg-zinc-900 p-1 rounded-lg w-fit border border-zinc-800">
		{#each [['encode', t.common.encode], ['decode', t.common.decode]] as [val, label]}
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

	<!-- Options -->
	<div class="flex flex-wrap gap-6 mb-6">
		<div>
			<p class="text-[10px] text-zinc-600 uppercase tracking-widest mb-2">{t.text.charset}</p>
			<div class="flex gap-1.5">
				{#each [['standard', t.text.standard], ['url-safe', 'URL-safe']] as [val, label]}
					<button
						onclick={() => (charset = val as Charset)}
						class="px-3 py-1 text-sm border rounded-md transition-colors {charset === val
							? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
							: 'border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'}"
					>
						{label}
					</button>
				{/each}
			</div>
		</div>

		{#if mode === 'encode'}
			<div>
				<p class="text-[10px] text-zinc-600 uppercase tracking-widest mb-2">{t.text.lineWrap}</p>
				<div class="flex gap-1.5">
					{#each [['none', t.text.none], ['76', t.text.chars76], ['64', t.text.chars64]] as [val, label]}
						<button
							onclick={() => (lineWrap = val as LineWrap)}
							class="px-3 py-1 text-sm border rounded-md transition-colors {lineWrap === val
								? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
								: 'border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'}"
						>
							{label}
						</button>
					{/each}
				</div>
			</div>
		{/if}
	</div>

	<!-- Input -->
	<div class="mb-4">
		<div class="flex items-center justify-between mb-2">
			<label for="text-input" class="text-sm font-medium text-zinc-300">
				{mode === 'encode' ? t.text.inputEncode : t.text.inputDecode}
			</label>
			<button
				onclick={() => {
					input = '';
					output = '';
					error = '';
				}}
				class="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
			>
				{t.common.clear}
			</button>
		</div>
		<textarea
			id="text-input"
			bind:value={input}
			placeholder={mode === 'encode' ? t.text.placeholderEncode : t.text.placeholderDecode}
			class="w-full h-44 bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-sm text-zinc-100 font-mono placeholder:text-zinc-700 focus:outline-none focus:border-indigo-500 resize-y transition-colors"
		></textarea>
		<p class="text-[11px] text-zinc-700 mt-1.5">
			{input.length.toLocaleString()} {t.common.characters}
		</p>
	</div>

	<!-- Actions -->
	<div class="flex gap-2 mb-6">
		<button
			onclick={swap}
			disabled={!output}
			class="px-4 py-2 border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-zinc-100 text-sm rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
		>
			{t.text.swap}
		</button>
	</div>

	<!-- Error -->
	{#if error}
		<div
			class="p-3.5 bg-red-500/8 border border-red-500/25 rounded-xl text-sm text-red-400 mb-4 font-mono"
		>
			{error}
		</div>
	{/if}

	<!-- Output -->
	{#if output}
		<div>
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-zinc-300">{t.common.result}</p>
				<button
					onclick={copy}
					class="text-xs px-3 py-1 border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-zinc-100 rounded-md transition-colors"
				>
					{copied ? t.common.copied : t.common.copy}
				</button>
			</div>
			<textarea
				readonly
				value={output}
				class="w-full h-44 bg-zinc-900/40 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-100 font-mono focus:outline-none resize-y"
			></textarea>
			<p class="text-[11px] text-zinc-700 mt-1.5">
				{output.length.toLocaleString()} {t.common.characters}
			</p>
		</div>
	{/if}
</div>
