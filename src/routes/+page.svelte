<script lang="ts">
	import { getSubjectsWithProjects } from '$lib/remote/projects.remote';

	const projects = await getSubjectsWithProjects();
</script>

{#each projects as project (project.id)}{/each}
