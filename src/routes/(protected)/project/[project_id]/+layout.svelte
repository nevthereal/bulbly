<script lang="ts">
	import DocumentChat from '$lib/components/DocumentChat.svelte';
	import KnowledgeBase from '$lib/components/KnowledgeBase.svelte';
	import { getProject } from '$lib/projects.remote';
	import { FlaskConical } from '@lucide/svelte';

	let { params, children } = $props();

	const project = $derived(getProject());
</script>

<main class="flex h-[90dvh] flex-col p-2">
	<h1 class="mb-4 ml-4 text-3xl font-bold">{(await project).name}</h1>
	<div class="flex h-full gap-4 overflow-scroll">
		<KnowledgeBase projectId={params.project_id} />
		<DocumentChat projectId={params.project_id} />

		<div class="flex h-full w-lg flex-col rounded-2xl border p-6">
			<h1 class="flex items-center gap-2 border-b pb-2 text-2xl font-semibold">
				<FlaskConical /> Tools (WIP)
			</h1>
			{@render children()}
		</div>
	</div>
</main>
