<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="my-16 text-center">
	<h1 class="mb-4 text-4xl font-black">Something went wrong...</h1>
	<p>Error: {page.status} {page.error?.message}</p>
</div>
