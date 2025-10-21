<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';

	import { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import { deleteSubject, getSubjectsWithProjects } from '$lib/remote/projects.remote';
	import { Trash2 } from '@lucide/svelte';

	const subjects = $derived(await getSubjectsWithProjects());
</script>

<main class="px-6">
	<h1 class="mb-4 text-3xl font-bold">Subjects</h1>
	<section class="grid grid-cols-4 gap-4">
		{#each subjects as sub (sub.id)}
			<div class="rounded-lg border p-4">
				<div class="flex items-center justify-between gap-2">
					<h2 class="text-xl font-semibold">{sub.title}:</h2>

					<AlertDialog.Root>
						<AlertDialog.Trigger class={buttonVariants({ variant: 'destructive', size: 'icon-sm' })}
							><Trash2 /></AlertDialog.Trigger
						>
						<AlertDialog.Content>
							<AlertDialog.Header>
								<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
								<AlertDialog.Description
									>This action cannot be undone. Your subject and all of it's projects and the
									project's files will be deleted permanently.</AlertDialog.Description
								>
							</AlertDialog.Header>
							<AlertDialog.Footer>
								<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
								<AlertDialog.Action
									class={buttonVariants({ variant: 'destructive' })}
									onclick={() => deleteSubject(sub.id).updates(getSubjectsWithProjects())}
									>Continue</AlertDialog.Action
								>
							</AlertDialog.Footer>
						</AlertDialog.Content>
					</AlertDialog.Root>
				</div>
				<ul class="list-inside list-disc">
					{#each sub.projects as proj (proj.id)}
						<li>{proj.name}</li>
					{:else}
						<p class="text-xs text-muted-foreground">No projects in subject</p>
					{/each}
				</ul>
			</div>
		{/each}
	</section>
</main>
