<script lang="ts">
	import { generateSvelteHelpers, UploadDropzone } from '@uploadthing/svelte';
	import { toast } from 'svelte-sonner';
	import { resolve } from '$app/paths';
	import type { MyRouter } from '$lib/server/uploadthing';
	import { goto } from '$app/navigation';
	import { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import { Upload } from '@lucide/svelte';
	import { twMerge } from 'tailwind-merge';

	let { params } = $props();

	const { createUploader } = generateSvelteHelpers<MyRouter>();

	const uploader = createUploader('uploader', {
		uploadProgressGranularity: 'all',
		onClientUploadComplete: () => {
			toast.success('Upload Completed', {
				action: {
					label: 'View files',
					onClick: () => {
						goto(resolve('/(protected)/projects/[project_id]/tools/files', params));
					}
				}
			});
		},
		onUploadError: (e) => {
			toast.error(e.message);
		},
		url: resolve('/(protected)/projects/[project_id]/tools/files/upload', params)
	});
</script>

<UploadDropzone {uploader}>
	<i slot="upload-icon">
		<Upload />
	</i>

	<span slot="button-content" let:state>
		{state.isUploading ? 'Uploading...' : 'Pick a file'}
	</span>
	<span slot="label" let:state>
		{state.ready ? 'Drag and drop files here' : 'Loading...'}
	</span>
	<span slot="allowed-content" let:state>
		You can choose between {state.fileTypes.join(', ')} files
	</span>
</UploadDropzone>
