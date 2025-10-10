<script lang="ts">
	import { Spinner } from './ui/spinner';

	let { thing }: { thing: string } = $props();
</script>

<p class="flex items-center gap-1 font-mono italic">
	<Spinner class="h-1lh" />Loading {thing}...
</p>
