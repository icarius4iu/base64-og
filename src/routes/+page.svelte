<script lang="ts">
	import { i18n, translations } from '$lib/i18n.svelte';

	let t = $derived(translations[i18n.lang]);

	let tools = $derived([
		{ href: '/tools/text', label: t.home.tools.text.label, description: t.home.tools.text.description },
		{ href: '/tools/image', label: t.home.tools.image.label, description: t.home.tools.image.description },
		{ href: '/tools/file', label: t.home.tools.file.label, description: t.home.tools.file.description },
		{ href: '/tools/url', label: t.home.tools.url.label, description: t.home.tools.url.description },
		{ href: '/tools/validator', label: t.home.tools.validator.label, description: t.home.tools.validator.description }
	]);
</script>

<svelte:head>
	<title>base64.og — {t.home.title}</title>
</svelte:head>

<div class="max-w-3xl mx-auto px-6 py-16">
	<div class="mb-12">
		<h1 class="text-3xl font-bold text-zinc-100 mb-3">{t.home.title}</h1>
		<p class="text-zinc-400 text-lg leading-relaxed">{t.home.description}</p>
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
			<span class="text-zinc-400 font-medium">{t.home.embedHint}</span>
			<code class="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300 font-mono mx-1">?embed=true</code>
			{t.home.embedHint2}
		</p>
	</div>
</div>
