<script lang="ts">
	import { type DateValue, today, getLocalTimeZone } from '@internationalized/date';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Select from '$lib/components/ui/select';
	import { getFiles } from '$lib/projects.remote';
	import { createStudyPlan } from '$lib/tools.remote';
	import Button from '$lib/components/ui/button/button.svelte';

	let selectedFiles: string[] = $state([]);
	const selAmount = $derived(selectedFiles.length);

	let date: DateValue = $state(today(getLocalTimeZone()));
	let dateToString = $derived(date.toString());

	let files = $derived(await getFiles());
</script>

<h1 class="text-xl font-bold">Study Plan</h1>
<form {...createStudyPlan}>
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
	<Label for="files" class="mt-4 mb-2">Select interrogation date</Label>
	<Calendar
		bind:value={date}
		type="single"
		class="rounded-md border shadow-sm"
		captionLayout="dropdown"
	/>
	<input name="date" bind:value={dateToString} type="hidden" />
	<Button class="mt-4 w-full" type="submit">Submit</Button>
</form>
