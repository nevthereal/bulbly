<script>
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { createProject } from '$lib/remote/projects.remote';
</script>

<main class="mx-auto max-w-3xl">
	<h1 class="mb-2 text-3xl font-bold">Create project</h1>
	<form {...createProject}>
		<Label for="title" />
		<Input name={createProject.field('title')} />
	</form>
</main>
