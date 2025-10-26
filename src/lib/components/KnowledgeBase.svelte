<script lang="ts">
	import { Trash2, Upload, Workflow } from '@lucide/svelte';

	import Input from './ui/input/input.svelte';
	import Button, { buttonVariants } from './ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';

	import { generateSvelteHelpers } from '@uploadthing/svelte';
	import type { MyRouter } from '$lib/server/uploadthing';
	import { getFiles } from '$lib/remote/files.remote';
	import { toast } from 'svelte-sonner';
	import Loading from './Loading.svelte';
	import Spinner from './ui/spinner/spinner.svelte';
	import Muted from './Muted.svelte';
	import File from './File.svelte';

	let filesToBeUploaded: FileList | undefined = $state(undefined);
	let uploadProgress: number | null = $state(null);
	let open = $state(false);

	let { projectId }: { projectId: string } = $props();

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
		}
	});
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
				{#each await getFiles() as file (file.id)}
					<File {file} />
				{:else}
					<Muted class="col-span-2 text-xs text-muted-foreground"
						>No files yet. Upload some below</Muted
					>
				{/each}
			</ul>
		</svelte:boundary>
	</div>
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
					onclick={() => startUpload(arrayedFiles).then(() => getFiles().refresh())}
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
</div>
