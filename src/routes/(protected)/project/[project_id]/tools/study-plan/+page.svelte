<script lang="ts">
	import * as Item from '$lib/components/ui/item/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';

	import { deleteSteps, getStudySteps } from '$lib/remote/tools.remote';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import { Maximize2 } from '@lucide/svelte';
	import Muted from '$lib/components/Muted.svelte';

	let steps = $derived(getStudySteps());
</script>

<h1 class="mb-4 text-xl font-bold">Study Plan</h1>
<svelte:boundary>
	{#if await steps}
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
	{:else}
		<Muted>No study plan generated yet. Prompt the chat to generate one!</Muted>
	{/if}
</svelte:boundary>
