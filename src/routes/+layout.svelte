<script lang="ts">
	import Logo from '$lib/assets/logo.png';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';
	import { authClient } from '$lib/auth-client';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import { getUser } from '$lib/remote/auth.remote';
	import ModeToggle from '$lib/components/ModeToggle.svelte';
	import { goto } from '$app/navigation';
	let { children } = $props();

	const user = $derived(await getUser());
</script>

<svelte:head>
	<link rel="icon" href="/favicon.png" type="image/png" />
	<title>Bulbly</title>
</svelte:head>

<Toaster />

<ModeWatcher defaultMode="dark" />

<nav class="flex h-[10dvh] items-center justify-between px-4">
	<a href="/" class="flex items-center text-3xl font-black tracking-tighter"
		><img src={Logo} alt="logo" class="mr-2 h-lh" /> bulbly</a
	>
	<div class="flex items-center gap-2">
		{#if user}
			<DropdownMenu.Root>
				<DropdownMenu.Trigger class={buttonVariants()}>{user.name}</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Group>
						<DropdownMenu.Label>Profile</DropdownMenu.Label>
						<DropdownMenu.Separator />
						<DropdownMenu.Item
							variant="destructive"
							onclick={async () =>
								await authClient.signOut().then(() =>
									getUser()
										.refresh()
										.then(() => goto('/'))
								)}>Sign out</DropdownMenu.Item
						>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		{:else}
			<Button
				onclick={async () =>
					await authClient.signIn.social({
						provider: 'google'
					})}>sign in</Button
			>
		{/if}

		<ModeToggle />
	</div>
</nav>
{@render children?.()}
