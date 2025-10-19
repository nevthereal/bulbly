<script lang="ts">
	import { type DateValue, today, getLocalTimeZone } from '@internationalized/date';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Select from '$lib/components/ui/select';
	import { getFiles } from '$lib/remote/files.remote';
	import { createStudyPlan, getStudySteps } from '$lib/remote/tools.remote';
	import Button from '$lib/components/ui/button/button.svelte';

	let files = $derived(await getFiles());
	let steps = $derived(getStudySteps());

	let selectedFiles: string[] = $state([]);
	const selAmount = $derived(selectedFiles.length);

	let date: DateValue = $state(today(getLocalTimeZone()));
	let dateToString = $derived(date.toString());
</script>

<h1 class="mb-4 text-xl font-bold">Study Plan</h1>
{#if await steps}
	<ul class="space-y-2 overflow-scroll">
		{#each await steps as step (step.id)}
			<li>
				{Intl.DateTimeFormat('en-us').format(step.date)}: {step.content}
			</li>
		{/each}
	</ul>
{:else}
	<form {...createStudyPlan}>
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
{/if}
