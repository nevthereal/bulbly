<script lang="ts">
	import * as Drawer from '$lib/components/ui/drawer/index.js';

	import { getFiles } from '$lib/remote/files.remote';
	import Loading from '$lib/components/Loading.svelte';
	import Muted from '$lib/components/Muted.svelte';
	import File from '$lib/components/File.svelte';
	import { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import { resolve } from '$app/paths';
	import { generateSvelteHelpers, UploadDropzone } from '@uploadthing/svelte';
	import { toast } from 'svelte-sonner';
	import type { MyRouter } from '$lib/server/uploadthing';
	import { Upload } from '@lucide/svelte';
	import { twMerge } from 'tailwind-merge';

	let { params } = $props();
	let open = $state(false);

	const { createUploader } = generateSvelteHelpers<MyRouter>();

	const uploader = createUploader('uploader', {
		uploadProgressGranularity: 'all',
		onClientUploadComplete: () => {
			toast.success('Upload Completed');
			open = false;
			getFiles(params.project_id).refresh();
		},
		onUploadError: (e) => {
			toast.error(e.message);
		},
		url: resolve('/(protected)/projects/[project_id]/tools/files/upload', params),
		config: { cn: twMerge }
	});
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

<Drawer.Root bind:open>
	<Drawer.Trigger class={buttonVariants()}><Upload /> Upload</Drawer.Trigger>
	<Drawer.Content>
		<div class="mx-auto max-w-sm">
			<Drawer.Header>
				<Drawer.Title>Upload files</Drawer.Title>
			</Drawer.Header>
			<UploadDropzone
				{uploader}
				class="ut-button:bg-primary ut-button:text-primary-foreground ut-button:after:bg-primary ut-allowed-content:text-muted-foreground ut-label:text-foreground"
			>
				<i slot="upload-icon">
					<Upload />
				</i>

				<span slot="button-content" let:state>
					{state.isUploading ? `Uploading... ${state.uploadProgress}%` : 'Pick files'}
				</span>
				<span slot="label" let:state>
					{state.ready ? 'Drag and drop files here' : 'Loading...'}
				</span>
				<span slot="allowed-content" let:state>
					You can choose between {state.fileTypes.join(', ')} files
				</span>
			</UploadDropzone>
		</div>
	</Drawer.Content>
</Drawer.Root>
