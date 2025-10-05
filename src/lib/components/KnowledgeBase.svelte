<script lang="ts">
	import { Trash2, Upload, Workflow } from '@lucide/svelte';

	import Input from './ui/input/input.svelte';
	import Button from './ui/button/button.svelte';
	import { Progress } from '$lib/components/ui/progress/index.js';

	import { generateSvelteHelpers } from '@uploadthing/svelte';
	import type { MyRouter } from '$lib/server/uploadthing';
	import { getProject } from '$lib/remote/projects.remote';
	import { toast } from 'svelte-sonner';

	let filesToBeUploaded: FileList | undefined = $state(undefined);
	let uploadProgress: number | null = $state(null);

	let { projectId }: { projectId: string } = $props();

	const { createUploadThing } = generateSvelteHelpers<MyRouter>({
		url: `/project/${projectId}/upload`
	});

	const { startUpload, isUploading } = createUploadThing('uploader', {
		onUploadProgress: (progress) => {
			uploadProgress = progress;
		},
		uploadProgressGranularity: 'all',
		onUploadBegin: (file) => {
			toast(`Starting upload of ${file}...`);
		},
		onClientUploadComplete: () => {
			filesToBeUploaded = undefined;
			uploadProgress = null;
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
		<Button disabled={$isUploading} onclick={() => startUpload(arrayedFiles)}
			><Upload /> Upload</Button
		>
		{#if uploadProgress}
			<Progress value={uploadProgress} />
		{/if}
	{/if}
</div>
