<script lang="ts">
	import { authClient } from '$lib/utils/auth-client';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	let email = $state('');
	let password = $state('');
	let showPassword = $state(false);
	let loading = $state(false);
	let errorMsg = $state('');

	// Support dynamic tenant logo if loaded via subdomain
	const tenant = page.data.tenant;

	async function handleLogin() {
		loading = true;
		errorMsg = '';
		try {
			const res = await authClient.signIn.email({
				email,
				password,
				callbackURL: '/dashboard'
			});
		} catch (err: unknown) {
			errorMsg = err instanceof Error ? err.message : 'Incorrect email or password.';
		} finally {
			loading = false;
		}
	}

	async function handleMagicLink() {
		if (!email) {
			errorMsg = 'Please enter your email first to send a magic link.';
			return;
		}
		loading = true;
		errorMsg = '';
		try {
			await authClient.signIn.magicLink({
				email,
				callbackURL: '/dashboard'
			});
			goto('/magic-link-sent', { replaceState: true });
		} catch (err: unknown) {
			errorMsg = err instanceof Error ? err.message : 'Failed to send magic link.';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>{tenant ? tenant.name : 'LegalForge'} | Login</title>
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
</svelte:head>

<div class="flex-grow flex items-center justify-center px-4 py-12">
	<!-- Auth Card -->
	<div class="neo-raised w-full max-w-[440px] bg-primary-container rounded-[24px] p-10 flex flex-col">
		
		{#if tenant}
			<!-- Tenant Specific Firm Logo -->
			<div class="flex flex-col items-center gap-3 mb-6">
				<div class="w-12 h-12 rounded-full overflow-hidden neo-raised p-1">
					<img class="w-full h-full object-cover rounded-full" src={tenant.logoUrl} alt={tenant.name} />
				</div>
				<div class="flex flex-col items-center">
					<span class="text-[13px] text-on-surface-variant/70 tracking-wide font-medium">{tenant.name}</span>
					<div class="h-[1px] w-12 bg-outline-variant/30 mt-2"></div>
				</div>
			</div>
		{:else}
			<!-- Default LegalForge Logo -->
			<header class="w-full flex items-center justify-center mb-6">
				<span class="text-headline-md font-bold text-primary">LegalForge</span>
			</header>
		{/if}

		<!-- Welcome Header -->
		<div class="mb-8 text-center">
			<h1 class="text-[26px] font-bold text-on-surface mb-2">Welcome back</h1>
			<p class="text-body-sm text-on-surface-variant">Sign in to your account</p>
		</div>

		<!-- Error Message -->
		{#if errorMsg}
			<div class="mb-6 p-4 bg-red-100 text-red-700 text-sm rounded-xl text-center neo-inset">
				{errorMsg}
			</div>
		{/if}

		<!-- Form -->
		<form class="space-y-6" onsubmit={(e) => { e.preventDefault(); handleLogin(); }}>
			<!-- Email Field -->
			<div class="flex flex-col gap-2">
				<label class="text-label-caps text-on-surface-variant tracking-widest px-2 uppercase text-[11px] font-bold">EMAIL ADDRESS</label>
				<div class="neo-inset bg-primary-container rounded-xl overflow-hidden focus-within:ring-2 ring-secondary transition-neo">
					<input 
						bind:value={email}
						class="w-full bg-transparent border-none py-4 px-6 text-on-surface placeholder:text-outline-variant focus:ring-0 outline-none" 
						placeholder="name@firm.com" 
						type="email"
						required
					/>
				</div>
			</div>
			<!-- Password Field -->
			<div class="flex flex-col gap-2">
				<div class="flex justify-between items-center px-2">
					<label class="text-label-caps text-on-surface-variant tracking-widest uppercase text-[11px] font-bold">PASSWORD</label>
					<a class="text-[12px] font-semibold text-secondary hover:opacity-80 transition-opacity" href="/forgot-password">Forgot password?</a>
				</div>
				<div class="neo-inset bg-primary-container rounded-xl overflow-hidden flex items-center pr-4 focus-within:ring-2 ring-secondary transition-neo">
					<input 
						bind:value={password}
						class="w-full bg-transparent border-none py-4 px-6 text-on-surface placeholder:text-outline-variant focus:ring-0 outline-none" 
						placeholder="••••••••" 
						type={showPassword ? "text" : "password"}
						required
					/>
					<button class="text-on-surface-variant hover:text-secondary p-1" onclick={() => showPassword = !showPassword} type="button">
						<span class="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
					</button>
				</div>
			</div>
			<!-- Sign In Button -->
			<button 
				class="neo-raised transition-neo w-full bg-secondary text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 active:shadow-none hover:brightness-110 disabled:opacity-50" 
				type="submit"
				disabled={loading}
			>
				{loading ? 'Signing In...' : 'Sign In'}
				<span class="material-symbols-outlined text-[20px]">arrow_forward</span>
			</button>
			<!-- Divider -->
			<div class="relative flex items-center py-2">
				<div class="flex-grow border-t border-outline-variant/30"></div>
				<span class="flex-shrink mx-4 text-on-surface-variant text-[12px] font-medium">or</span>
				<div class="flex-grow border-t border-outline-variant/30"></div>
			</div>
			<!-- Magic Link Button -->
			<button 
				class="neo-raised transition-neo w-full bg-primary-container text-secondary font-semibold py-4 rounded-xl flex items-center justify-center gap-3 hover:brightness-105 active:shadow-none disabled:opacity-50" 
				type="button"
				onclick={handleMagicLink}
				disabled={loading}
			>
				<span class="material-symbols-outlined text-[20px]">mail</span>
				Sign in with Magic Link
			</button>
		</form>
		<!-- Footer Link -->
		<div class="mt-8 text-center">
			<p class="text-[13px] text-on-surface-variant font-medium">
				Don't have an account? 
				<a class="text-secondary font-bold hover:underline ml-1" href="/register">Request access</a>
			</p>
		</div>
	</div>
</div>
