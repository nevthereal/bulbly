<script lang="ts">
	import DocumentChat from '$lib/components/DocumentChat.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';

	import KnowledgeBase from '$lib/components/KnowledgeBase.svelte';
	import { deleteProject, getProject } from '$lib/remote/projects.remote';
	import { FlaskConical, Trash2 } from '@lucide/svelte';
	import { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import { goto } from '$app/navigation';

	let { params, children } = $props();

	const project = $derived(await getProject());
</script>

<main class="flex h-[90dvh] flex-col p-2">
	<div class="flex items-center justify-between">
		<h1 class="mb-4 ml-4 text-3xl font-bold">{project.name}</h1>
		<div class="flex items-center gap-2">
			<AlertDialog.Root>
				<AlertDialog.Trigger class={buttonVariants({ size: 'sm', variant: 'destructive' })}
					><Trash2 /> Delete</AlertDialog.Trigger
				>
				<AlertDialog.Content>
					<AlertDialog.Header>
						<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
						<AlertDialog.Description>
							This action cannot be undone. This will permanently delete this project, all of it's
							files, threads and tool results.
						</AlertDialog.Description>
					</AlertDialog.Header>
					<AlertDialog.Footer>
						<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
						<AlertDialog.Action
							onclick={async () => await deleteProject(project.id).then(() => goto('/'))}
							class={buttonVariants({ variant: 'destructive' })}>Continue</AlertDialog.Action
						>
					</AlertDialog.Footer>
				</AlertDialog.Content>
			</AlertDialog.Root>
		</div>
	</div>
	<div class="flex h-full gap-4 overflow-scroll">
		<KnowledgeBase projectId={params.project_id} />
		<DocumentChat projectId={params.project_id} />

		<div class="flex h-full w-lg flex-col rounded-2xl border p-6">
			<h1 class="flex items-center gap-2 border-b pb-2 text-2xl font-semibold">
				<FlaskConical /> Tools (WIP)
			</h1>
			{@render children()}
		</div>
	</div>
</main>
