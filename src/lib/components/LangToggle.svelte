<script lang="ts">
	import { i18n } from '$lib/i18n.svelte';
</script>

<button
	onclick={() => i18n.toggle()}
	aria-label="Toggle language"
	class="flex items-center gap-1.5 text-xs border border-zinc-700 rounded-md px-2.5 py-1 hover:border-zinc-500 transition-colors"
>
	<span class="font-medium {i18n.lang === 'es' ? 'text-indigo-400' : 'text-zinc-500'}">ES</span>
	<span class="text-zinc-700">|</span>
	<span class="font-medium {i18n.lang === 'en' ? 'text-indigo-400' : 'text-zinc-500'}">EN</span>
</button>
