<script>
	import * as Select from '$lib/components/ui/select/index.js';

	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { createProject, getSubjects, createSubject } from '$lib/remote/projects.remote';
	import { buttonVariants } from '$lib/components/ui/button';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';

	let open = $state(false);

	let value = $state('');

	const triggerContent = $derived(
		(await getSubjects()).find((s) => s.id === value)?.title ?? 'Select a subject'
	);
</script>

<main class="mx-auto max-w-xl">
	<h1 class="mb-2 text-3xl font-bold">Create project</h1>
	<form {...createProject}>
		<div>
			<Label for="title" class="mb-1">Name</Label>
			<Input name="title" />
		</div>
		<div class="mt-4">
			<Label for="title" class="mb-1">Subject/Class</Label>
			<div class="flex gap-2">
				<Select.Root type="single" bind:value name="subjectId">
					<Select.Trigger class="w-full">{triggerContent}</Select.Trigger>
					<Select.Content>
						{#each await getSubjects() as sub (sub.id)}
							<Select.Item value={sub.id}>{sub.title}</Select.Item>
						{:else}
							<Select.Item value="nope" disabled>No active Subjects. Create one!</Select.Item>
						{/each}
						<Dialog.Root bind:open>
							<Dialog.Trigger
								class={buttonVariants({ size: 'sm', class: 'w-full', variant: 'outline' })}
								>Create subject</Dialog.Trigger
							>
							<Dialog.Content>
								<Dialog.Header>
									<Dialog.Title>New subject</Dialog.Title>
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
					</Select.Content>
				</Select.Root>
			</div>
		</div>
		<Button type="submit" class="mt-2">Create Project</Button>
	</form>
</main>
