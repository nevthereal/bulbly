<script>
	import * as Select from '$lib/components/ui/select/index.js';

	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { createProject, getSubjects, createSubject } from '$lib/remote/projects.remote';
	import { buttonVariants } from '$lib/components/ui/button';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Field from '$lib/components/ui/field/index.js';
	import { createAIContext } from '@ai-sdk/svelte';

	createAIContext();

	let open = $state(false);

	let value = $state('');

	const triggerContent = $derived(
		(await getSubjects()).find((s) => s.id === value)?.title ?? 'Select a subject'
	);
</script>

<main class="mx-auto max-w-xl">
	<h1 class="mb-2 text-3xl font-bold">Create project</h1>
	<form {...createProject}>
		<Field.Group>
			<Field.Set>
				<Field.Field>
					<Field.Label for="title" class="mb-1">Name</Field.Label>
					<Input placeholder="eg. Redox Chemistry" name="title" />
				</Field.Field>
				<Field.Field class="mt-4">
					<Field.Label for="title" class="mb-1">Subject/Class</Field.Label>

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
					<Field.Description>Use an existing project or create one</Field.Description>
				</Field.Field>
			</Field.Set>
			<Field.Field orientation="horizontal">
				<Button type="submit" class="mt-2">Create Project</Button>
			</Field.Field>
		</Field.Group>
	</form>
</main>
