<script lang="ts">
	import type { Icon } from '@lucide/svelte';

	type Tool = {
		name: string;
		icon: Icon;
		description: string;
		link: string;
	};

	let tools: Tool[] = [];
</script>
