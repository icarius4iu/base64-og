<script lang="ts">
	import './layout.css';
	import { page } from '$app/state';
	import { i18n, translations } from '$lib/i18n.svelte';
	import LangToggle from '$lib/components/LangToggle.svelte';

	let { children } = $props();

	let t = $derived(translations[i18n.lang]);
	let isEmbed = $derived(page.url.searchParams.get('embed') === 'true');
	let currentPath = $derived(page.url.pathname);

	let navItems = $derived([
		{ href: '/tools/text', label: t.nav.text },
		{ href: '/tools/image', label: t.nav.image },
		{ href: '/tools/file', label: t.nav.file },
		{ href: '/tools/url', label: t.nav.url },
		{ href: '/tools/validator', label: t.nav.validator }
	]);
</script>

<svelte:head>
	<meta
		name="description"
		content="Free online Base64 encoding and decoding tools — text, images, files, URL-safe. All processing in your browser."
	/>
</svelte:head>

{#if isEmbed}
	<div class="min-h-screen bg-zinc-950 text-zinc-100">
		{@render children()}
	</div>
{:else}
	<div class="flex min-h-screen bg-zinc-950 text-zinc-100">
		<aside class="w-56 shrink-0 bg-zinc-900 border-r border-zinc-800 flex flex-col fixed inset-y-0">
			<a
				href="/"
				class="flex items-center gap-2 px-4 py-5 text-base font-bold text-indigo-400 hover:text-indigo-300 transition-colors tracking-tight"
			>
				<span class="text-lg">⬡</span>
				base64.og
			</a>

			<nav class="flex-1 px-2 pb-4 overflow-y-auto">
				<p class="px-2 pt-1 pb-2 text-[10px] font-semibold text-zinc-600 uppercase tracking-widest">
					{t.nav.tools}
				</p>
				<ul class="space-y-0.5">
					{#each navItems as item}
						<li>
							<a
								href={item.href}
								class="flex items-center px-3 py-2 text-sm rounded-md transition-colors {currentPath.startsWith(
									item.href
								)
									? 'bg-indigo-500/10 text-indigo-400 font-medium'
									: 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'}"
							>
								{item.label}
							</a>
						</li>
					{/each}
				</ul>
			</nav>

			<div class="px-4 py-3 border-t border-zinc-800 flex items-center justify-between gap-2">
				<p class="text-[10px] text-zinc-600 leading-tight">{t.nav.clientSide}</p>
				<LangToggle />
			</div>
		</aside>

		<main class="flex-1 ml-56 overflow-auto">
			{@render children()}
		</main>
	</div>
{/if}
