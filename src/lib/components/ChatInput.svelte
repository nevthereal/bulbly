<script lang="ts">
	import { ArrowUpIcon, PlusIcon, Trash2 } from '@lucide/svelte';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

	import { attachments } from '$lib/attachments.svelte';

	import { Chat } from '@ai-sdk/svelte';

	let { chat }: { chat: Chat } = $props();

	let input = $state('');

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		chat.sendMessage({
			text: input,
			files: attachments.files.map((a) => ({
				mediaType: a.type,
				type: 'file',
				url: a.utURL,
				filename: a.name
			}))
		});
		input = '';
		attachments.clear();
	}
</script>

<form onsubmit={handleSubmit}>
	<InputGroup.Root>
		<InputGroup.Input bind:value={input} placeholder="Ask, Search or Chat..." />
		<InputGroup.Addon align="block-end">
			<InputGroup.Button variant="outline" class="rounded-full" size="icon-xs">
				<PlusIcon />
			</InputGroup.Button>
			<InputGroup.Addon class="flex gap-2">
				{#each attachments.files as att (att.id)}
					<InputGroup.Text>
						{att.name}
						<InputGroup.Button size="icon-sm" onclick={() => attachments.remove(att.id)}
							><Trash2 /></InputGroup.Button
						>
					</InputGroup.Text>
				{:else}
					<InputGroup.Text>No files in Context</InputGroup.Text>
				{/each}
			</InputGroup.Addon>
			<InputGroup.Button
				variant="default"
				class="ml-auto rounded-full"
				size="icon-xs"
				disabled={!input}
			>
				<ArrowUpIcon />
				<span class="sr-only">Send</span>
			</InputGroup.Button>
		</InputGroup.Addon>
	</InputGroup.Root>
</form>
