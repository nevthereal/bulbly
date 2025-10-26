<script lang="ts">
	import { requireAuth } from '$lib/remote/auth.remote';

	let { children } = $props();
</script>

{#if (await requireAuth()).isApproved}
	{@render children()}
{:else}
	<p class="mt-8 text-center font-mono">Your account is not approved. Please request.</p>
{/if}
