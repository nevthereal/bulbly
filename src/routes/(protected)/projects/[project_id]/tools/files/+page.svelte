<script lang="ts">
	import { getFiles } from '$lib/remote/files.remote';
	import Loading from '$lib/components/Loading.svelte';
	import Muted from '$lib/components/Muted.svelte';
	import File from '$lib/components/File.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { resolve } from '$app/paths';

	let { params } = $props();
</script>

<h2 class="my-2 font-medium">Your files:</h2>
<div class="mb-2 flex-1 overflow-y-auto">
	<svelte:boundary onerror={(e) => console.error(e)}>
		{#snippet pending()}
			<Loading thing="files" />
		{/snippet}
		{#snippet failed()}
			<p>Failed to load files</p>
		{/snippet}
		<ul class="grid grid-cols-2 gap-2">
			{#each await getFiles(params.project_id) as file (file.id)}
				<File {file} />
			{:else}
				<Muted class="col-span-2 text-xs text-muted-foreground"
					>No files yet. Upload some below</Muted
				>
			{/each}
		</ul>
	</svelte:boundary>
</div>
<Button href={resolve('/(protected)/projects/[project_id]/tools/files/upload', params)}
	>Upload</Button
>
