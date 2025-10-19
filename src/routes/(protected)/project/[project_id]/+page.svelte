<script lang="ts">
	import * as Item from '$lib/components/ui/item/index.js';

	import { resolve } from '$app/paths';
	import { CreditCard, type Icon, NotebookPen } from '@lucide/svelte';
	import type { Component } from 'svelte';

	type Tool = {
		name: string;
		icon: Component<Icon>;
		description: string;
		link: string;
	};

	let { params } = $props();

	let tools: Tool[] = [
		{
			name: 'Study Plan',
			icon: NotebookPen,
			description: 'Generate a detailed study plan from your files',
			link: resolve('/(protected)/project/[project_id]/tools/study-plan', params)
		},
		{
			name: 'Flashcards',
			icon: CreditCard,
			description: 'Generate a flashcards from your files',
			link: resolve('/(protected)/project/[project_id]/tools/flashcards', params)
		}
	];
</script>

<Item.Group class="mt-4 space-y-2">
	{#each tools as tool, idx (idx)}
		{@const Icon = tool.icon}
		<Item.Root variant="outline">
			{#snippet child({ props })}
				<a href={tool.link} {...props}>
					<Item.Media class="max-lg:hidden" variant="icon">
						<Icon />
					</Item.Media>
					<Item.Content>
						{tool.name}
					</Item.Content>
				</a>
			{/snippet}
		</Item.Root>
	{/each}
</Item.Group>
