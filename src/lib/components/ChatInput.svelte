<script lang="ts">
	import { ArrowUpIcon, Ellipsis, GraduationCap, Info, Trash2 } from '@lucide/svelte';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';

	import { attachments, studyMode } from '$lib/chat.svelte';

	import { Chat } from '@ai-sdk/svelte';
	import Spinner from './ui/spinner/spinner.svelte';
	import Toggle from './ui/toggle/toggle.svelte';
	import { chatConfigSchema } from '$lib/zod';

	let { chat }: { chat: Chat } = $props();

	let input = $state('');

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		chat.sendMessage(
			{
				text: input,
				files: attachments.files.map((a) => ({
					mediaType: a.type,
					type: 'file',
					url: a.utURL,
					filename: a.name
				}))
			},
			{
				headers: {
					config: JSON.stringify(chatConfigSchema.parse({ studyMode: studyMode.current }))
				}
			}
		);
		input = '';
		attachments.clear();
	}
</script>

<form onsubmit={handleSubmit}>
	<InputGroup.Root>
		<InputGroup.Input bind:value={input} placeholder="Ask, Search or Chat..." />
		{#if attachments.files.length != 0}
			<InputGroup.Addon align="block-start">
				{#each attachments.files as att (att.id)}
					<ButtonGroup.Root>
						<ButtonGroup.Text>
							{att.name}
						</ButtonGroup.Text>
						<InputGroup.Button
							variant="destructive"
							size="icon-xs"
							onclick={() => attachments.remove(att.id)}><Trash2 /></InputGroup.Button
						>
					</ButtonGroup.Root>
				{:else}
					<InputGroup.Text
						>No files in Chat<Tooltip.Provider>
							<Tooltip.Root delayDuration={100}>
								<Tooltip.Trigger><Info /></Tooltip.Trigger>
								<Tooltip.Content class="flex">
									Tap on the <Ellipsis class="h-lh" /> of a file to add it to the chat
								</Tooltip.Content>
							</Tooltip.Root>
						</Tooltip.Provider></InputGroup.Text
					>
				{/each}
			</InputGroup.Addon>
		{/if}
		<InputGroup.Addon align="block-end">
			<Toggle
				bind:pressed={() => studyMode.current, (v) => (studyMode.current = v)}
				variant="outline"><GraduationCap />Enhanced mode</Toggle
			>
			<InputGroup.Button
				variant="default"
				class="ml-auto rounded-full"
				size="icon-xs"
				disabled={!input}
			>
				{#if chat.status === 'ready'}
					<ArrowUpIcon />
					<span class="sr-only">Send</span>
				{:else}
					<Spinner />
				{/if}
			</InputGroup.Button>
		</InputGroup.Addon>
	</InputGroup.Root>
</form>
