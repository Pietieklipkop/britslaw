<script lang="ts">
	import { authClient } from '$lib/utils/auth-client';
	import { page } from '$app/state';

	let email = $state('');
	let loading = $state(false);
	let errorMsg = $state('');
	let successMsg = $state('');

	const tenant = page.data.tenant;

	async function handleReset() {
		loading = true;
		errorMsg = '';
		successMsg = '';
		try {
			await authClient.sendVerificationEmail({
				email,
				callbackURL: '/reset-password'
			});
			successMsg = 'Password reset link sent! Please check your inbox.';
		} catch (err: unknown) {
			errorMsg = err instanceof Error ? err.message : 'Failed to send reset link.';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>{tenant ? tenant.name : 'LegalForge'} | Reset Password</title>
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
</svelte:head>

<div class="flex-grow flex items-center justify-center px-4 py-12">
	<!-- Main Card -->
	<div class="w-full max-w-md bg-primary-container neo-raised rounded-[24px] p-8 md:p-12 flex flex-col gap-6">
		<div class="space-y-2 text-center">
			<h1 class="text-headline-md font-bold text-on-surface">Reset your password</h1>
			<p class="text-body-sm text-on-surface-variant">Enter your email and we'll send a reset link.</p>
		</div>

		<!-- Error or Success message -->
		{#if errorMsg}
			<div class="p-4 bg-red-100 text-red-700 text-sm rounded-xl text-center neo-inset">
				{errorMsg}
			</div>
		{/if}
		{#if successMsg}
			<div class="p-4 bg-green-100 text-green-700 text-sm rounded-xl text-center neo-inset">
				{successMsg}
			</div>
		{/if}

		<form class="flex flex-col gap-6" onsubmit={(e) => { e.preventDefault(); handleReset(); }}>
			<div class="flex flex-col gap-2">
				<label class="text-label-caps text-on-surface-variant px-1 uppercase text-[11px] font-bold" for="email">Email Address</label>
				<div class="relative">
					<input 
						id="email"
						class="w-full h-14 px-6 rounded-xl neo-inset bg-primary-container text-on-surface font-body-md focus:ring-0 outline-none" 
						placeholder="name@firm.com" 
						type="email"
						bind:value={email}
						required
					/>
				</div>
			</div>
			<button 
				class="w-full h-14 rounded-xl bg-secondary text-white font-headline-sm flex items-center justify-center gap-2 neo-raised transition-neo active:shadow-none hover:brightness-110 disabled:opacity-50" 
				type="submit"
				disabled={loading}
			>
				<span>{loading ? 'Sending...' : 'Send Reset Link'}</span>
				<span class="material-symbols-outlined">arrow_forward</span>
			</button>
		</form>
		<div class="mt-2 text-center">
			<a class="inline-flex items-center gap-1 text-body-sm text-secondary font-semibold hover:underline" href="/login">
				<span class="material-symbols-outlined text-[18px]">arrow_back</span>
				Back to sign in
			</a>
		</div>
	</div>
</div>
