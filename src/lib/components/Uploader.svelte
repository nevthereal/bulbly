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
	import { UploadManager } from './upload.svelte';

	let { projectId }: { projectId: string } = $props();

	const uploadManager = new UploadManager();

	const { createUploadThing } = generateSvelteHelpers<MyRouter>({
		url: resolve('/(protected)/project/[project_id]/upload', { project_id: projectId })
	});

	const { startUpload, isUploading } = createUploadThing('uploader', {
		onUploadProgress: (progress) => {
			uploadManager.setProgress(progress);
		},
		uploadProgressGranularity: 'all',
		onClientUploadComplete: () => {
			uploadManager.clear();
			toast.success('Upload Completed');
		},
		onUploadError: (e) => {
			toast.error(e.message);
		}
	});
</script>

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants()}>Add files to Knowledge Base</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Upload files</Dialog.Title>
		</Dialog.Header>
		<Input
			accept="image/*,.pdf,text/*"
			type="file"
			multiple
			onchange={(e) => {
				uploadManager.setFiles(e.currentTarget.files ?? undefined);
				e.currentTarget.value = '';
			}}
		/>
		{#if uploadManager.hasFiles}
			<ul>
				{#each uploadManager.files as f (f.name)}
					<li class="my-1 flex items-center justify-between">
						<span class="flex-shrink overflow-x-scroll">
							{f.name}
						</span>
						<Button
							size="icon"
							variant="destructive"
							onclick={() => uploadManager.removeFile(f.name)}
						>
							<Trash2 />
						</Button>
					</li>
				{/each}
			</ul>

			<Dialog.Close
				class={buttonVariants()}
				disabled={$isUploading || uploadManager.isEmpty}
				onclick={() =>
					toast.promise(
						startUpload(uploadManager.files).then(() => getFiles(projectId).refresh()),
						{
							loading: `Uploading ${uploadManager.files.length} files`,
							success: 'Upload completed',
							error: 'Could not complete upload'
						}
					)}
			>
				{#if !$isUploading}
					<Upload /> Upload
				{:else}
					<Spinner /> Uploading {uploadManager.progress?.toFixed(0)}%
				{/if}
			</Dialog.Close>
		{/if}
	</Dialog.Content>
</Dialog.Root>
