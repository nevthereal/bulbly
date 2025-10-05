<script lang="ts">
	import DocumentChat from '$lib/components/DocumentChat.svelte';
	import KnowledgeBase from '$lib/components/KnowledgeBase.svelte';
</script>

<main class="flex h-[90dvh] gap-4 overflow-scroll p-2">
	<KnowledgeBase />
	<DocumentChat />
</main>
