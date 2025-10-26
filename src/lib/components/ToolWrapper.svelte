<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<p class="my-2 flex items-center gap-2 text-muted-foreground select-none">
	{@render children?.()}
</p>
