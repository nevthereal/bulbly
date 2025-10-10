<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { getUser } from '$lib/remote/auth.remote';
	import { getSubjectsWithProjects } from '$lib/remote/projects.remote';
</script>

{#if await getUser()}
	<Button variant="link" href="/create">Create project</Button>
	{#each await getSubjectsWithProjects() as sub (sub.id)}
		<h1 class="text-xl">{sub.title}:</h1>
		{#each sub.projects as prj (prj.id)}
			<a class="underline" href="/project/{prj.id}">{prj.name}</a>
		{/each}
	{/each}
{:else}
	<p>Sign in above</p>
{/if}
