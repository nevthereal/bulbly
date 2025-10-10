<script lang="ts">
	import { MessageCircle } from '@lucide/svelte';
	import ChatInput from './ChatInput.svelte';
	import { Chat } from '@ai-sdk/svelte';
	import Message from './Message.svelte';
	import Spinner from './ui/spinner/spinner.svelte';

	let { projectId }: { projectId: string } = $props();
	const chat = new Chat({ id: `${projectId}-chat` });
</script>

<div class="flex h-full w-full flex-col rounded-2xl border p-6">
	<h1 class="flex min-h-0 items-center gap-2 border-b pb-2 text-2xl font-semibold">
		<MessageCircle /> Document Chat
	</h1>
	<div class="mt-4 flex h-full min-h-0 flex-col gap-2">
		<ul class="flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto">
			{#each chat.messages as message, messageIndex (messageIndex)}
				<Message {message} />
			{/each}
			{#if chat.status === 'submitted'}
				<p class="flex items-center gap-2 font-medium text-muted-foreground">
					<Spinner /> Loading message
				</p>
			{/if}
		</ul>
		<ChatInput {chat} />
	</div>
</div>
