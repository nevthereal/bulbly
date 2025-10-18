<script>
	import { authClient } from '$lib/auth-client';
	import { Button } from '$lib/components/ui/button';
</script>

<Button
	size="lg"
	onclick={async () =>
		await authClient.signIn.social({
			provider: 'google'
		})}>Sign in with Google</Button
>
