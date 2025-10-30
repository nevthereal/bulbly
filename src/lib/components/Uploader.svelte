<script lang="ts">
	import { generateSvelteHelpers } from '@uploadthing/svelte';
	import { toast } from 'svelte-sonner';
	import { resolve } from '$app/paths';
	import type { MyRouter } from '$lib/server/uploadthing';
	import Input from './ui/input/input.svelte';
	import Button, { buttonVariants } from './ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Trash2, Upload } from '@lucide/svelte';
	import { getFiles } from '$lib/remote/files.remote';
	import { UploadManager } from '../upload.svelte';

	let { projectId }: { projectId: string } = $props();

	let open = $state(false);

	const uploadManager = new UploadManager();

	const { createUploadThing } = generateSvelteHelpers<MyRouter>({
		url: resolve('/(protected)/projects/[project_id]/upload', { project_id: projectId })
	});

	const { startUpload } = createUploadThing('uploader', {
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

<Dialog.Root bind:open>
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
			<div class="overflow-x-hidden">
				<ul>
					{#each uploadManager.files as f (f.name)}
						<li class="my-1 flex items-center justify-between gap-2">
							<div class="min-w-0 flex-1 overflow-x-auto">
								<span class="whitespace-nowrap">
									{f.name}
								</span>
							</div>
							<Button
								size="icon"
								variant="destructive"
								class="flex-shrink-0"
								onclick={() => uploadManager.removeFile(f.name)}
							>
								<Trash2 />
							</Button>
						</li>
					{/each}
				</ul>
			</div>

			<Dialog.Close
				class={buttonVariants()}
				disabled={uploadManager.isEmpty}
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
				<Upload /> Upload
			</Dialog.Close>
		{/if}
	</Dialog.Content>
</Dialog.Root>
