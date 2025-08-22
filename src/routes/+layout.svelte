<script lang="ts">
	import '../app.css';
	import { authClient } from '$lib/auth-client';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import { getUser } from '$lib/remote/auth.remote';
	import * as Popover from '$lib/components/ui/popover';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	let { children } = $props();
</script>

<nav class="flex items-center justify-between p-6">
	<a href="/" class="text-3xl font-black tracking-tighter">AURI</a>
	<div class="flex items-center gap-2">
		{#await getUser()}
			<p>loading user...</p>
		{:then user}
			{#if user}
				<Popover.Root>
					<Popover.Trigger class={buttonVariants()}>{user.name}</Popover.Trigger>
					<Popover.Content class="w-auto text-center">
						<h1 class="text-xl font-semibold">Profile</h1>
						<Separator class="mb-2" />
						<Button
							variant="destructive"
							onclick={async () => await authClient.signOut().then(() => getUser().refresh())}
							>Sign out</Button
						></Popover.Content
					>
				</Popover.Root>
			{:else}
				<Button
					onclick={async () =>
						await authClient.signIn.social({
							provider: 'google'
						})}>sign in</Button
				>
			{/if}
		{/await}
	</div>
</nav>
{@render children?.()}
