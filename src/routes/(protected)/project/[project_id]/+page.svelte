<script lang="ts">
	import DocumentChat from '$lib/components/DocumentChat.svelte';
	import KnowledgeBase from '$lib/components/KnowledgeBase.svelte';
	import Tools from '$lib/components/Tools.svelte';
	import { getProject } from '$lib/remote/projects.remote.js';

	let { params } = $props();

	const project = $derived(await getProject(params.project_id));
</script>

<main class="flex h-[90dvh] flex-col p-2">
	<h1 class="mb-4 ml-4 text-3xl font-bold">{project.name}</h1>
	<div class="flex h-full gap-4 overflow-scroll">
		<KnowledgeBase projectId={params.project_id} />
		<DocumentChat projectId={params.project_id} />
		<Tools />
	</div>
</main>
