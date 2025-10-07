<script lang="ts">
	import { marked } from 'marked';
	import { MessageCircle } from '@lucide/svelte';
	import ChatInput from './ChatInput.svelte';
	import { Chat } from '@ai-sdk/svelte';

	let { projectId }: { projectId: string } = $props();
	const chat = new Chat({ id: `${projectId}-chat` });
</script>

<div class="flex h-full w-full flex-col rounded-2xl border p-6">
	<h1 class="flex min-h-0 items-center gap-2 border-b pb-2 text-2xl font-semibold">
		<MessageCircle /> Document Chat
	</h1>
	<div class="my-4 flex h-full min-h-0 flex-col gap-2">
		<div class="min-h-0 flex-1 overflow-y-auto">
			{#each chat.messages as message, messageIndex (messageIndex)}
				<li>
					<div>{message.role}</div>
					<div>
						{#each message.parts as part, partIndex (partIndex)}
							{#if part.type === 'text'}
								<!-- eslint-disable-next-line svelte/no-at-html-tags -->
								<div class="prose prose-neutral">{@html marked(part.text)}</div>
							{/if}
						{/each}
					</div>
				</li>
			{/each}
		</div>
		<ChatInput {chat} />
	</div>
</div>
