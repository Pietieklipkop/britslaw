<script lang="ts">
	// Client-side fallback redirect if JS loads before server redirect completes
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	onMount(() => {
		goto('/login', { replaceState: true });
	});
</script>

