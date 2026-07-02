<script lang="ts">
	let { children } = $props();
</script>

<div class="min-h-screen flex flex-col justify-between">
	<main class="flex-grow flex flex-col">
		{@render children()}
	</main>
	<footer class="w-full py-8 flex flex-col items-center gap-4 text-center text-on-surface-variant font-body-sm text-body-sm bg-transparent">
		<div class="flex flex-wrap justify-center gap-6 mb-2">
			<a class="hover:text-secondary transition-colors" href="#">Terms of Service</a>
			<a class="hover:text-secondary transition-colors" href="#">Privacy Policy</a>
			<a class="hover:text-secondary transition-colors" href="#">Contact Support</a>
		</div>
		<p>© 2026 LegalForge. All rights reserved.</p>
	</footer>
</div>
