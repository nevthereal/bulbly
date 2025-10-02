<script>
	import * as Select from '$lib/components/ui/select/index.js';

	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { createProject, getSubjects, createSubject } from '$lib/remote/projects.remote';
	import { buttonVariants } from '$lib/components/ui/button';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';

	let open = $state(false);
</script>

<main class="mx-auto max-w-3xl">
	<h1 class="mb-2 text-3xl font-bold">Create project</h1>
	<form {...createProject}>
		<div>
			<Label for="title" class="mb-1">Name</Label>
			<Input name={createProject.field('title')} />
		</div>
		<div class="mt-2">
			<Label for="title" class="mb-1">Subject/Class</Label>
			<div class="flex gap-2">
				<Select.Root type="single">
					<Select.Trigger class="w-full"></Select.Trigger>
					<Select.Content>
						{#each await getSubjects() as sub (sub.id)}
							<Select.Item value={sub.id}>{sub.title}</Select.Item>
						{:else}
							<Select.Item value="nope" disabled>No active Subjects. Create one!</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
				{@render subjectDialog()}
			</div>
		</div>
	</form>
</main>

{#snippet subjectDialog()}
	<Dialog.Root bind:open>
		<Dialog.Trigger class={buttonVariants()}>Create subject</Dialog.Trigger>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>Create new subject</Dialog.Title>
				<Dialog.Description>
					<form
						{...createSubject.enhance(async ({ submit }) => {
							await submit().updates(getSubjects());

							open = false;
						})}
					>
						<Label for="title" class="mb-1">Name</Label>
						<div class="flex gap-2">
							<Input name="title" type="text" />
							<Button type="submit">Add</Button>
						</div>
					</form>
				</Dialog.Description>
			</Dialog.Header>
		</Dialog.Content>
	</Dialog.Root>
{/snippet}
