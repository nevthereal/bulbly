<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="my-16 text-center">
	<p>{page.error?.message}</p>
</div>
