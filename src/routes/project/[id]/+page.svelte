<script lang="ts">
	import DocumentChat from '$lib/components/DocumentChat.svelte';
	import KnowledgeBase from '$lib/components/KnowledgeBase.svelte';
	import * as Resizable from '$lib/components/ui/resizable/index.js';
</script>

<main class="h-[90dvh]">
	<Resizable.PaneGroup direction="horizontal" class="flex h-full gap-2">
		<Resizable.Pane maxSize={25}>
			<KnowledgeBase />
		</Resizable.Pane>
		<Resizable.Handle withHandle />
		<Resizable.Pane>
			<DocumentChat />
		</Resizable.Pane>
	</Resizable.PaneGroup>
</main>
