<script lang="ts">
	import * as Item from '$lib/components/ui/item/index.js';
	import { Brain, FileText, ToolCase } from '@lucide/svelte';
	import type { UIMessage } from 'ai';
	import { marked } from 'marked';
	import { fade } from 'svelte/transition';

	let { message }: { message: UIMessage } = $props();
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
				{:else if part.type === 'tool-'}
					<p class="mb-2 flex items-center gap-2 text-muted-foreground select-none">
						<ToolCase size={16} /> Used tool {JSON.stringify(part)}
					</p>
				{/if}
			{/each}
		</div>
	{/if}
</li>
