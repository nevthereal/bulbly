<script lang="ts">
	import { Trash2, Upload, Workflow } from '@lucide/svelte';

	import Input from './ui/input/input.svelte';
	import Button from './ui/button/button.svelte';
	import { generateSvelteHelpers } from '@uploadthing/svelte';
	import type { OurFileRouter } from '$lib/server/uploadthing';
	import { getProject } from '$lib/remote/projects.remote';

	let filesToBeUploaded: FileList | undefined = $state(undefined);

	let { projectId }: { projectId: string } = $props();

	const { createUploadThing } = generateSvelteHelpers<OurFileRouter>({
		url: `/project/${projectId}/upload`
	});

	const { startUpload, isUploading } = createUploadThing('imageUploader', {
		onUploadProgress: () => {},
		onUploadBegin: () => {},
		onClientUploadComplete: () => {
			filesToBeUploaded = undefined;
		}
	});

	const { files: kbFiles } = await getProject(projectId);
</script>

<div class="h-full w-lg rounded-2xl border p-6">
	<h1 class="flex items-center gap-2 border-b pb-2 text-2xl font-semibold">
		<Workflow /> Knowledge Base
	</h1>
	<Input type="file" multiple bind:files={filesToBeUploaded} />
	{#if filesToBeUploaded}
		{@const arrayedFiles = Array.from(filesToBeUploaded)}
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

							filesToBeUploaded = dt.files;
						}}><Trash2 /></Button
					>
				</li>
			{/each}
		</ul>
		<Button disabled={$isUploading && !filesToBeUploaded} onclick={() => startUpload(arrayedFiles)}
			><Upload /> Upload</Button
		>
	{/if}
</div>
