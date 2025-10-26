<script lang="ts">
	import { Workflow } from '@lucide/svelte';
	import { getFiles } from '$lib/remote/files.remote';
	import Loading from './Loading.svelte';
	import Muted from './Muted.svelte';
	import File from './File.svelte';
	import Uploader from './Uploader.svelte';

	let { projectId }: { projectId: string } = $props();
</script>

<div class="flex h-full w-lg flex-col rounded-2xl border p-6">
	<h1 class="flex items-center gap-2 border-b pb-2 text-2xl font-semibold">
		<Workflow /> Knowledge Base
	</h1>
	<h2 class="my-2 font-medium">Your files:</h2>
	<div class="mb-2 flex-1 overflow-y-auto">
		<svelte:boundary onerror={(e) => console.error(e)}>
			{#snippet pending()}
				<Loading thing="files" />
			{/snippet}
			{#snippet failed(e)}
				{JSON.stringify(e)}
			{/snippet}
			<ul class="grid grid-cols-2 gap-2">
				{#each await getFiles(projectId) as file (file.id)}
					<File {file} />
				{:else}
					<Muted class="col-span-2 text-xs text-muted-foreground"
						>No files yet. Upload some below</Muted
					>
				{/each}
			</ul>
		</svelte:boundary>
	</div>
	<Uploader {projectId} />
</div>
