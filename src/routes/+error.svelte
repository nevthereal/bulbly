<script lang="ts">
	import { page } from '$app/state';
</script>

<h1>Something went wrong...</h1>
<p>Error: {page.status} {page.error?.message}</p>
