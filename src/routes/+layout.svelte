<script lang="ts">
	import Logo from '$lib/components/Logo.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';
	import { authClient } from '$lib/auth-client';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import { getUser } from '$lib/remote/auth.remote';
	import * as Popover from '$lib/components/ui/popover';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import ModeToggle from '$lib/components/ModeToggle.svelte';
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/favicon.png" type="image/png" />
</svelte:head>

<ModeWatcher defaultMode="dark" />

<nav class="flex items-center justify-between p-6">
	<a href="/" class="flex items-center text-3xl font-black tracking-tighter"><Logo /> AURI</a>
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
		<ModeToggle />
	</div>
</nav>
{@render children?.()}
