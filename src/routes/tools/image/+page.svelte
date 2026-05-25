<script lang="ts">
	import { fileToBase64, base64ToBlob } from '$lib/utils/base64';
	import { i18n, translations } from '$lib/i18n.svelte';

	type Mode = 'to-base64' | 'to-image';

	let t = $derived(translations[i18n.lang]);

	let mode: Mode = $state('to-base64');
	let dragging = $state(false);
	let imageFile: File | null = $state(null);
	let previewSrc = $state('');
	let b64Output = $state('');
	let b64Input = $state('');
	let mimeType = $state('image/png');
	let error = $state('');
	let copied = $state(false);
	let loading = $state(false);
	let previewError = $state(false);

	async function handleFile(file: File) {
		if (!file.type.startsWith('image/')) {
			error = `${t.image.wrongType}: "${file.type || 'unknown'}"`;
			return;
		}
		imageFile = file;
		previewSrc = URL.createObjectURL(file);
		loading = true;
		error = '';
		try {
			b64Output = await fileToBase64(file);
		} catch {
			error = t.image.failedRead;
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

	function renderFromB64() {
		if (!b64Input.trim()) {
			error = t.file.noData;
			return;
		}
		const clean = b64Input.trim().replace(/[\r\n\s]/g, '');
		previewSrc = `data:${mimeType};base64,${clean}`;
		previewError = false;
		error = '';
	}

	function downloadImage() {
		if (!b64Input.trim()) {
			error = t.file.noData;
			return;
		}
		try {
			const blob = base64ToBlob(b64Input, mimeType);
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `image.${mimeType.split('/')[1].replace('jpeg', 'jpg')}`;
			a.click();
			URL.revokeObjectURL(url);
		} catch {
			error = t.file.invalidB64;
		}
	}

	async function copy() {
		await navigator.clipboard.writeText(b64Output);
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 2000);
	}

	function reset() {
		imageFile = null;
		previewSrc = '';
		b64Output = '';
		b64Input = '';
		error = '';
		previewError = false;
	}

	const mimeOptions = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'];
</script>

<svelte:head>
	<title>{t.image.title} — base64.og</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-6 py-10">
	<h1 class="text-2xl font-bold text-zinc-100 mb-1">{t.image.title}</h1>
	<p class="text-sm text-zinc-500 mb-8">{t.image.subtitle}</p>

	<!-- Mode tabs -->
	<div class="flex gap-1 mb-6 bg-zinc-900 p-1 rounded-lg w-fit border border-zinc-800">
		{#each [['to-base64', t.image.tabToBase64], ['to-image', t.image.tabToImage]] as [val, label]}
			<button
				onclick={() => {
					mode = val as Mode;
					reset();
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
			onclick={() => document.getElementById('img-input')?.click()}
			onkeydown={(e) => e.key === 'Enter' && document.getElementById('img-input')?.click()}
		>
			<input id="img-input" type="file" accept="image/*" class="hidden" onchange={onFileInput} />
			{#if loading}
				<p class="text-sm text-zinc-400">{t.common.processing}</p>
			{:else if imageFile}
				<p class="text-sm text-zinc-200 font-medium">{imageFile.name}</p>
				<p class="text-xs text-zinc-500 mt-1">
					{imageFile.type} · {(imageFile.size / 1024).toFixed(1)} KB
				</p>
				<p class="text-xs text-zinc-600 mt-2">{t.common.clickReplace}</p>
			{:else}
				<p class="text-sm text-zinc-400">{t.image.dropZone}</p>
				<p class="text-xs text-zinc-600 mt-1">{t.image.dropZoneSub}</p>
			{/if}
		</div>

		{#if previewSrc && !loading}
			<div class="mb-6">
				<p class="text-[10px] text-zinc-600 uppercase tracking-widest mb-2">{t.common.preview}</p>
				<img
					src={previewSrc}
					alt="Preview"
					class="max-h-48 rounded-lg border border-zinc-800 object-contain"
				/>
			</div>
		{/if}

		{#if b64Output}
			<div>
				<div class="flex items-center justify-between mb-2">
					<p class="text-sm font-medium text-zinc-300">
						{t.image.base64Output}
						<span class="ml-2 text-xs text-zinc-600 font-normal"
							>{b64Output.length.toLocaleString()} chars</span
						>
					</p>
					<button
						onclick={copy}
						class="text-xs px-3 py-1 border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-zinc-100 rounded-md transition-colors"
					>
						{copied ? t.common.copied : t.common.copy}
					</button>
				</div>
				<textarea
					readonly
					value={b64Output}
					class="w-full h-44 bg-zinc-900/40 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-100 font-mono focus:outline-none resize-y"
				></textarea>
			</div>
		{/if}
	{:else}
		<div class="mb-5">
			<p class="text-[10px] text-zinc-600 uppercase tracking-widest mb-2">{t.image.mimeType}</p>
			<div class="flex gap-1.5 flex-wrap">
				{#each mimeOptions as mime}
					<button
						onclick={() => (mimeType = mime)}
						class="px-3 py-1 text-sm border rounded-md transition-colors {mimeType === mime
							? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
							: 'border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'}"
					>
						{mime.split('/')[1]}
					</button>
				{/each}
			</div>
		</div>

		<div class="mb-4">
			<label for="img-b64-input" class="block text-sm font-medium text-zinc-300 mb-2">
				{t.image.base64String}
			</label>
			<textarea
				id="img-b64-input"
				bind:value={b64Input}
				placeholder={t.image.placeholderDecode}
				class="w-full h-44 bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-sm text-zinc-100 font-mono placeholder:text-zinc-700 focus:outline-none focus:border-indigo-500 resize-y transition-colors"
			></textarea>
		</div>

		<div class="flex gap-2 mb-6">
			<button
				onclick={renderFromB64}
				class="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
			>
				{t.image.renderImage}
			</button>
			<button
				onclick={downloadImage}
				disabled={!b64Input.trim()}
				class="px-4 py-2 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-zinc-100 text-sm rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
			>
				{t.common.download}
			</button>
		</div>

		{#if error}
			<div
				class="p-3.5 bg-red-500/8 border border-red-500/25 rounded-xl text-sm text-red-400 mb-4"
			>
				{error}
			</div>
		{/if}

		{#if previewSrc && !previewError}
			<div>
				<p class="text-[10px] text-zinc-600 uppercase tracking-widest mb-2">{t.common.preview}</p>
				<img
					src={previewSrc}
					alt="Decoded"
					class="max-w-full rounded-lg border border-zinc-800"
					onerror={() => {
						previewError = true;
						error = t.image.failedRender;
						previewSrc = '';
					}}
				/>
			</div>
		{/if}
	{/if}
</div>
