<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { deleteSubject, getSubjectsWithProjects } from '$lib/remote/projects.remote';
	import { Trash2 } from '@lucide/svelte';

	const subjects = $derived(await getSubjectsWithProjects());
</script>

{#each subjects as sub (sub.id)}
	<div class="flex items-center gap-2">
		<h1 class="font-bold">{sub.title}:</h1>
		<Button
			variant="destructive"
			onclick={() => deleteSubject(sub.id).updates(getSubjectsWithProjects())}><Trash2 /></Button
		>
	</div>
	{#each sub.projects as proj (proj.id)}
		<p>{proj.name}</p>
	{/each}
{/each}
