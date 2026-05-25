<script lang="ts">
	import { fileToBase64, base64ToBlob } from '$lib/utils/base64';

	type Mode = 'to-base64' | 'to-file';

	let mode: Mode = $state('to-base64');
	let dragging = $state(false);
	let selectedFile: File | null = $state(null);
	let b64Output = $state('');
	let b64Input = $state('');
	let downloadName = $state('decoded-file.bin');
	let downloadMime = $state('application/octet-stream');
	let error = $state('');
	let copied = $state(false);
	let loading = $state(false);

	async function handleFile(file: File) {
		selectedFile = file;
		loading = true;
		error = '';
		b64Output = '';
		try {
			b64Output = await fileToBase64(file);
		} catch {
			error = 'Failed to read file';
		} finally {
			loading = false;
		}
	}

	function onDrop(e: DragEvent) {
		e.preventDefault();
		dragging = false;
		const file = e.dataTransfer?.files[0];
		if (file) handleFile(file);
	}

	function onFileInput(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (file) handleFile(file);
	}

	function downloadFile() {
		if (!b64Input.trim()) {
			error = 'Paste a Base64 string first';
			return;
		}
		try {
			const blob = base64ToBlob(b64Input, downloadMime);
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = downloadName || 'decoded-file.bin';
			a.click();
			URL.revokeObjectURL(url);
		} catch {
			error = 'Invalid Base64 data — check the input';
		}
	}

	async function copy() {
		await navigator.clipboard.writeText(b64Output);
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 2000);
	}

	function formatBytes(n: number) {
		if (n < 1024) return `${n} B`;
		if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
		return `${(n / 1024 / 1024).toFixed(2)} MB`;
	}
</script>

<svelte:head>
	<title>File ↔ Base64 — base64.og</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-6 py-10">
	<h1 class="text-2xl font-bold text-zinc-100 mb-1">File ↔ Base64</h1>
	<p class="text-sm text-zinc-500 mb-8">Encode any file to Base64 or decode Base64 back to a downloadable file</p>

	<!-- Mode tabs -->
	<div class="flex gap-1 mb-6 bg-zinc-900 p-1 rounded-lg w-fit border border-zinc-800">
		{#each [['to-base64', 'File → Base64'], ['to-file', 'Base64 → File']] as [val, label]}
			<button
				onclick={() => {
					mode = val as Mode;
					b64Output = '';
					b64Input = '';
					selectedFile = null;
					error = '';
				}}
				class="px-4 py-1.5 text-sm rounded-md transition-colors {mode === val
					? 'bg-indigo-600 text-white font-medium'
					: 'text-zinc-400 hover:text-zinc-100'}"
			>
				{label}
			</button>
		{/each}
	</div>

	{#if mode === 'to-base64'}
		<!-- Drop zone -->
		<div
			role="button"
			tabindex="0"
			class="border-2 border-dashed rounded-xl p-12 text-center mb-6 transition-colors cursor-pointer select-none {dragging
				? 'border-indigo-500 bg-indigo-500/5'
				: 'border-zinc-700 hover:border-zinc-500 bg-zinc-900/30'}"
			ondragover={(e) => {
				e.preventDefault();
				dragging = true;
			}}
			ondragleave={() => (dragging = false)}
			ondrop={onDrop}
			onclick={() => document.getElementById('file-input')?.click()}
			onkeydown={(e) => e.key === 'Enter' && document.getElementById('file-input')?.click()}
		>
			<input id="file-input" type="file" class="hidden" onchange={onFileInput} />
			{#if loading}
				<p class="text-sm text-zinc-400">Reading file...</p>
			{:else if selectedFile}
				<p class="text-sm text-zinc-200 font-medium">{selectedFile.name}</p>
				<p class="text-xs text-zinc-500 mt-1">
					{selectedFile.type || 'unknown type'} · {formatBytes(selectedFile.size)}
				</p>
				<p class="text-xs text-zinc-600 mt-2">Click to replace</p>
			{:else}
				<p class="text-sm text-zinc-400">Drop any file here or click to browse</p>
				<p class="text-xs text-zinc-600 mt-1">All file types supported</p>
			{/if}
		</div>

		{#if b64Output}
			<div>
				<div class="flex items-center justify-between mb-2">
					<p class="text-sm font-medium text-zinc-300">
						Base64 output
						<span class="ml-2 text-xs text-zinc-600 font-normal">
							{b64Output.length.toLocaleString()} chars · ~{formatBytes(Math.floor(b64Output.length * 0.75))} decoded
						</span>
					</p>
					<button
						onclick={copy}
						class="text-xs px-3 py-1 border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-zinc-100 rounded-md transition-colors"
					>
						{copied ? 'Copied!' : 'Copy'}
					</button>
				</div>
				<textarea
					readonly
					value={b64Output}
					class="w-full h-52 bg-zinc-900/40 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-100 font-mono focus:outline-none resize-y"
				></textarea>
			</div>
		{/if}
	{:else}
		<div class="mb-4">
			<label for="file-b64-input" class="block text-sm font-medium text-zinc-300 mb-2">Base64 string</label>
			<textarea
				id="file-b64-input"
				bind:value={b64Input}
				placeholder="Paste Base64 encoded data..."
				class="w-full h-52 bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-sm text-zinc-100 font-mono placeholder:text-zinc-700 focus:outline-none focus:border-indigo-500 resize-y transition-colors"
			></textarea>
		</div>

		<div class="flex flex-wrap gap-3 mb-5">
			<div class="flex-1 min-w-52">
				<label for="file-download-name" class="block text-[10px] text-zinc-600 uppercase tracking-widest mb-1.5">Filename</label>
				<input
					id="file-download-name"
					bind:value={downloadName}
					type="text"
					class="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500 transition-colors"
				/>
			</div>
			<div class="flex-1 min-w-52">
				<label for="file-download-mime" class="block text-[10px] text-zinc-600 uppercase tracking-widest mb-1.5">MIME type</label>
				<input
					id="file-download-mime"
					bind:value={downloadMime}
					type="text"
					placeholder="application/octet-stream"
					class="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500 transition-colors"
				/>
			</div>
		</div>

		<button
			onclick={downloadFile}
			class="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
		>
			Download File
		</button>

		{#if error}
			<div
				class="mt-4 p-3.5 bg-red-500/8 border border-red-500/25 rounded-xl text-sm text-red-400"
			>
				{error}
			</div>
		{/if}
	{/if}
</div>
