<script lang="ts">
	import { generateSvelteHelpers } from '@uploadthing/svelte';
	import { toast } from 'svelte-sonner';
	import { resolve } from '$app/paths';
	import type { MyRouter } from '$lib/server/uploadthing';
	import Input from './ui/input/input.svelte';
	import Button, { buttonVariants } from './ui/button/button.svelte';
	import Spinner from './ui/spinner/spinner.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Trash2, Upload } from '@lucide/svelte';
	import { getFiles } from '$lib/remote/files.remote';

	let { projectId }: { projectId: string } = $props();

	let filesToBeUploaded: FileList | undefined = $state(undefined);
	let uploadProgress: number | null = $state(null);
	let open = $state(false);

	const { createUploadThing } = generateSvelteHelpers<MyRouter>({
		url: resolve('/(protected)/project/[project_id]/upload', { project_id: projectId })
	});

	const { startUpload, isUploading } = createUploadThing('uploader', {
		onUploadProgress: (progress) => {
			uploadProgress = progress;
		},
		uploadProgressGranularity: 'all',
		onClientUploadComplete: () => {
			filesToBeUploaded = undefined;
			uploadProgress = null;
			toast.success('Upload Completed');
			open = false;
		}
	});
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={buttonVariants()}>Add files to Knowledge Base</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Upload files</Dialog.Title>
		</Dialog.Header>
		<Input accept="image/*,.pdf" type="file" multiple bind:files={filesToBeUploaded} />
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
			<Button
				disabled={$isUploading || Array.from(filesToBeUploaded).length === 0}
				onclick={() => startUpload(arrayedFiles).then(() => getFiles(projectId).refresh())}
			>
				{#if !$isUploading}
					<Upload /> Upload
				{:else}
					<Spinner /> Uploading {uploadProgress?.toFixed(0)}%
				{/if}
			</Button>
		{/if}
	</Dialog.Content>
</Dialog.Root>
