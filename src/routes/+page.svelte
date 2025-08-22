<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import Button from '$lib/components/ui/button/button.svelte';
	import { getUser } from '$lib/remote/auth.remote';
</script>

{#await getUser()}
	<p>loading user...</p>
{:then user}
	{#if user}
		<p>{user.name}</p>
	{:else}
		<p>not signed in</p>
		<Button
			onclick={async () =>
				await authClient.signIn.social({
					provider: 'google'
				})}>Sign in</Button
		>
	{/if}
{/await}
