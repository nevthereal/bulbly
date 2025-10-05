<script lang="ts">
	import { getSubjectsWithProjects } from '$lib/remote/projects.remote';

	const subWithProjects = await getSubjectsWithProjects();
</script>

{#each subWithProjects as sub (sub.id)}
	<h1 class="text-xl">{sub.title}:</h1>
	{#each sub.projects as prj (prj.id)}
		<a class="underline" href="/project/{prj.id}">{prj.name}</a>
	{/each}
{/each}
