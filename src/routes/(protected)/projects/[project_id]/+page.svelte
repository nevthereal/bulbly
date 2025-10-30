<script lang="ts">
	import * as Item from '$lib/components/ui/item/index.js';
	import { resolve } from '$app/paths';
	import { CreditCard, NotebookPen, Workflow } from '@lucide/svelte';
	let { params } = $props();
</script>

<Item.Group class="mt-4 space-y-2">
	<Item.Root variant="outline">
		{#snippet child({ props })}
			<a href={resolve('/(protected)/projects/[project_id]/tools/files', params)} {...props}>
				<Item.Media class="max-lg:hidden" variant="icon">
					<Workflow />
				</Item.Media>
				<Item.Content>Knowledge Base</Item.Content>
			</a>
		{/snippet}
	</Item.Root>
	<Item.Root variant="outline">
		{#snippet child({ props })}
			<a href={resolve('/(protected)/projects/[project_id]/tools/study-plan', params)} {...props}>
				<Item.Media class="max-lg:hidden" variant="icon">
					<NotebookPen />
				</Item.Media>
				<Item.Content>Study Plan</Item.Content>
			</a>
		{/snippet}
	</Item.Root>
	<Item.Root variant="outline">
		{#snippet child({ props })}
			<a href={resolve('/(protected)/projects/[project_id]/tools/flashcards', params)} {...props}>
				<Item.Media class="max-lg:hidden" variant="icon">
					<CreditCard />
				</Item.Media>
				<Item.Content>Flashcards (work in progress)</Item.Content>
			</a>
		{/snippet}
	</Item.Root>
</Item.Group>
