<script lang="ts">
	import * as Item from '$lib/components/ui/item/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';

	import { type DateValue, today, getLocalTimeZone } from '@internationalized/date';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Select from '$lib/components/ui/select';
	import { getFiles } from '$lib/remote/files.remote';
	import { createStudyPlan, deleteSteps, getStudySteps } from '$lib/remote/tools.remote';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import { Maximize2 } from '@lucide/svelte';

	let files = $derived(await getFiles());
	let steps = $derived(getStudySteps());

	let selectedFiles: string[] = $state([]);
	const selAmount = $derived(selectedFiles.length);

	let date: DateValue = $state(today(getLocalTimeZone()));
	let dateToString = $derived(date.toString());

	let submitting = $state(false);
</script>

<h1 class="mb-4 text-xl font-bold">Study Plan</h1>
{#if (await steps).length > 0}
	<Button onclick={async () => await deleteSteps()}>Delete</Button>
	<ul class="space-y-2 overflow-scroll">
		{#each await steps as step (step.id)}
			<Item.Root variant="outline" class="flex-col items-start gap-2">
				<Item.Content>
					<Item.Title
						>{Intl.DateTimeFormat('en-gb', { dateStyle: 'medium' }).format(step.date)}</Item.Title
					>
					<Item.Description>{step.title}</Item.Description>
				</Item.Content>
				<Item.Actions>
					<Dialog.Root>
						<Dialog.Trigger class={buttonVariants({ variant: 'outline', size: 'sm' })}
							><Maximize2 />Details</Dialog.Trigger
						>
						<Dialog.Content>
							<Dialog.Header>
								<Dialog.Title>{step.title}</Dialog.Title>
								<Dialog.Description>
									{step.description}
								</Dialog.Description>
							</Dialog.Header>
						</Dialog.Content>
					</Dialog.Root>
				</Item.Actions>
			</Item.Root>
		{/each}
	</ul>
{:else if !submitting}
	<form
		{...createStudyPlan.enhance(async ({ submit }) => {
			submitting = true;

			await submit();
		})}
	>
		<svelte:boundary>
			<Label for="files" class="mt-4 mb-2">Files for context</Label>
			<Select.Root bind:value={selectedFiles} type="multiple" name="files[]">
				<Select.Trigger class="mb-2 w-full"
					>{selAmount === 0 ? 'Select...' : `${selAmount} selected`}</Select.Trigger
				>
				<Select.Content>
					{#each files as file (file.id)}
						<Select.Item value={file.id}>{file.name}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</svelte:boundary>
		<Label for="files" class="mt-4 mb-2">Select interrogation date</Label>
		<Calendar
			minValue={today(getLocalTimeZone())}
			bind:value={date}
			type="single"
			class="rounded-md border shadow-sm"
			captionLayout="dropdown"
		/>
		<input name="date" bind:value={dateToString} type="hidden" />
		<Button disabled={selectedFiles.length === 0} class="mt-4 w-full" type="submit">Submit</Button>
		{createStudyPlan.fields.allIssues()}
	</form>
{:else}
	<p class="animate-pulse text-center font-mono text-muted-foreground">
		Creating your tailored study plan...
	</p>
{/if}
