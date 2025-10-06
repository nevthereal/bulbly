<script lang="ts">
	import { FileText, Trash2, Upload, Workflow } from '@lucide/svelte';

	import Input from './ui/input/input.svelte';
	import Button, { buttonVariants } from './ui/button/button.svelte';
	import { Progress } from '$lib/components/ui/progress/index.js';
	import * as Dialog from '$lib/components/ui/dialog';

	import { generateSvelteHelpers } from '@uploadthing/svelte';
	import type { MyRouter } from '$lib/server/uploadthing';
	import { getProject } from '$lib/remote/projects.remote';
	import { toast } from 'svelte-sonner';

	let filesToBeUploaded: FileList | undefined = $state(undefined);
	let uploadProgress: number | null = $state(null);
	let open = $state(false);

	let { projectId }: { projectId: string } = $props();
	const { files: kbFiles } = await getProject(projectId);

	const { createUploadThing } = generateSvelteHelpers<MyRouter>({
		url: `/project/${projectId}/upload`
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

			getProject(projectId).refresh();
		}
	});
</script>

<div class="flex h-full w-lg flex-col rounded-2xl border p-6">
	<h1 class="flex items-center gap-2 border-b pb-2 text-2xl font-semibold">
		<Workflow /> Knowledge Base
	</h1>

	<h2 class="py-2 font-medium">Your files:</h2>
	<div class="mb-2 flex-1 overflow-y-auto">
		<ul class="grid grid-cols-2 gap-2">
			{#each kbFiles as file (file.id)}
				<li class="flex flex-col justify-between gap-2 rounded-md border p-2">
					{#if file.type === 'image/jpeg' || file.type === 'image/png'}
						<img src={file.utURL} alt="" class="rounded-sm" />
					{:else if file.type === 'application/pdf'}
						<div class="flex h-full items-center justify-center rounded-sm bg-muted">
							<FileText class="size-20 text-muted-foreground" />
						</div>
					{/if}
					{file.name}
				</li>
			{/each}
		</ul>
	</div>

	<Dialog.Root bind:open>
		<Dialog.Trigger class={buttonVariants()}>Add files to Knowledge Base</Dialog.Trigger>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>Upload files</Dialog.Title>
			</Dialog.Header>
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
				<Button
					disabled={$isUploading || Array.from(filesToBeUploaded).length === 0}
					onclick={() => startUpload(arrayedFiles)}><Upload /> Upload</Button
				>
				{#if uploadProgress}
					<Progress value={uploadProgress} />
				{/if}
			{/if}
		</Dialog.Content>
	</Dialog.Root>
</div>
