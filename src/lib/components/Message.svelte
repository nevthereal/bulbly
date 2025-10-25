<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion/index.js';

	import type { MyUIMessage } from '$lib/ai';
	import * as Item from '$lib/components/ui/item/index.js';
	import { Brain, FileText, ToolCase } from '@lucide/svelte';
	import { marked } from 'marked';
	import { fade } from 'svelte/transition';

	let { message }: { message: MyUIMessage } = $props();
</script>

<li in:fade|global>
	{#if message.role === 'user'}
		<Item.Root class="ml-auto w-fit" variant="muted">
			<Item.Content>
				<!-- Files container - flex row -->
				{#if message.parts.some((part) => part.type === 'file')}
					<div class="mb-2 flex flex-wrap gap-1">
						{#each message.parts as part, partIndex (partIndex)}
							{#if part.type === 'file'}
								<Item.Root variant="outline" size="sm">
									<Item.Media>
										<FileText class="h-lh" />
									</Item.Media>
									<Item.Content>
										<Item.Title>{part.filename}</Item.Title>
									</Item.Content>
								</Item.Root>
							{/if}
						{/each}
					</div>
				{/if}

				<!-- Text content below files -->
				{#each message.parts as part, partIndex (partIndex)}
					{#if part.type === 'text'}
						<Item.Title class="prose dark:prose-invert">
							<!-- eslint-disable svelte/no-at-html-tags -->
							{@html marked(part.text)}
						</Item.Title>
					{/if}
				{/each}
			</Item.Content>
		</Item.Root>
	{:else if message.role === 'assistant'}
		<div in:fade|global>
			{#if message.parts.filter((p) => p.type === 'tool-study_plan')}
				<Accordion.Root type="single">
					<Accordion.Item value="item-1">
						<Accordion.Trigger>Tool calls</Accordion.Trigger>
						<Accordion.Content>
							<ul class="space-y-2">
								{#each message.parts as part, partIndex (partIndex)}
									{#if part.type === 'tool-study_plan'}
										{#if part.input}
											<li class="flex items-center gap-2 text-muted-foreground select-none">
												<ToolCase size={16} />
												Added study step "{part.input.title}"
											</li>
										{/if}
									{/if}
								{/each}
							</ul>
						</Accordion.Content>
					</Accordion.Item>
				</Accordion.Root>
			{/if}

			{#each message.parts as part, partIndex (partIndex)}
				{#if part.type === 'text'}
					<div class="prose max-w-full dark:prose-invert">
						<!-- eslint-disable svelte/no-at-html-tags -->
						{@html marked(part.text)}
					</div>
				{:else if part.type === 'reasoning'}
					{#if part.state === 'streaming'}
						<p class="mb-2 flex animate-pulse items-center gap-2 text-muted-foreground select-none">
							<Brain size={16} /> Thinking...
						</p>
					{/if}
				{/if}
			{/each}
		</div>
	{/if}
</li>
