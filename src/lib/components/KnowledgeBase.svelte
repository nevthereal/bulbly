<script lang="ts">
	import { Trash2, Upload, Workflow } from '@lucide/svelte';

	import { createUploadThing } from '$lib/utils';
	import Input from './ui/input/input.svelte';
	import Button from './ui/button/button.svelte';

	let files: FileList | undefined = $state(undefined);

	const { startUpload, isUploading } = createUploadThing('imageUploader', {
		onClientUploadComplete: () => {
			alert('Upload Completed');
		}
	});
</script>

<div class="h-full w-lg rounded-2xl border p-6">
	<h1 class="flex items-center gap-2 border-b pb-2 text-2xl font-semibold">
		<Workflow /> Knowledge Base
	</h1>
	<Input type="file" multiple bind:files />
	{#if files}
		{@const arrayedFiles = Array.from(files)}
		<ul>
			{#each arrayedFiles as f (f)}
				<li class="my-1 flex items-center justify-between">
					{f.name}
					<Button
						size="icon"
						variant="destructive"
						onclick={() => {
							const dt = new DataTransfer();
							const filteredFiles = arrayedFiles.filter((filter) => filter.name != f.name);

							filteredFiles.forEach((i) => dt.items.add(i));

							files = dt.files;
						}}><Trash2 /></Button
					>
				</li>
			{/each}
		</ul>
		<Button disabled={$isUploading && !files} onclick={() => startUpload(arrayedFiles)}
			><Upload /> Upload</Button
		>
	{/if}
</div>
