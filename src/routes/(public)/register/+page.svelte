<script lang="ts">
	import { signUp } from '$lib/utils/auth-client';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	let name = $state('');
	let email = $state('user@example.com'); // Placeholder, typically loaded from invitation token
	let password = $state('');
	let confirmPassword = $state('');
	let acceptTerms = $state(false);
	let loading = $state(false);
	let errorMsg = $state('');

	const tenant = page.data.tenant;

	// Simple password strength check
	let strength = $derived.by(() => {
		if (!password) return 0;
		let score = 0;
		if (password.length >= 8) score++;
		if (/[A-Z]/.test(password)) score++;
		if (/[0-9]/.test(password)) score++;
		if (/[^A-Za-z0-9]/.test(password)) score++;
		return score;
	});

	let strengthText = $derived.by(() => {
		if (strength === 0) return '';
		if (strength === 1) return 'Weak';
		if (strength === 2) return 'Fair';
		if (strength === 3) return 'Good';
		return 'Strong Security';
	});

	async function handleRegister() {
		if (password !== confirmPassword) {
			errorMsg = 'Passwords do not match.';
			return;
		}
		if (!acceptTerms) {
			errorMsg = 'You must accept the Terms of Service and Privacy Policy.';
			return;
		}

		loading = true;
		errorMsg = '';
		try {
			await signUp.email({
				email,
				password,
				name,
				callbackURL: '/dashboard'
			});
		} catch (err: unknown) {
			errorMsg = err instanceof Error ? err.message : 'Registration failed.';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>{tenant ? tenant.name : 'LegalForge'} | Register</title>
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
</svelte:head>

<div class="flex-grow flex items-center justify-center px-4 py-12">
	<!-- Main Invitation Card -->
	<div class="neo-raised w-full max-w-[480px] bg-primary-container rounded-[24px] p-8 md:p-12 flex flex-col gap-8">
		<!-- Firm Logo Block -->
		{#if tenant}
			<div class="flex flex-col items-center gap-3">
				<div class="w-12 h-12 rounded-full overflow-hidden neo-raised p-1">
					<img class="w-full h-full object-cover rounded-full" src={tenant.logoUrl} alt={tenant.name}/>
				</div>
				<div class="flex flex-col items-center">
					<span class="text-[13px] text-on-surface-variant/70 tracking-wide font-medium">{tenant.name}</span>
					<div class="h-[1px] w-12 bg-outline-variant/30 mt-2"></div>
				</div>
			</div>
		{:else}
			<header class="w-full flex items-center justify-center">
				<span class="text-headline-md font-bold text-primary">LegalForge</span>
			</header>
		{/if}

		<!-- Header Section -->
		<div class="text-center flex flex-col gap-2">
			<h1 class="text-[26px] font-bold text-on-surface">You've been invited!</h1>
			<p class="text-body-sm text-on-surface-variant">{tenant ? tenant.name : 'LegalForge'} has invited you to set up your account.</p>
		</div>

		<!-- Error Message -->
		{#if errorMsg}
			<div class="p-4 bg-red-100 text-red-700 text-sm rounded-xl text-center neo-inset">
				{errorMsg}
			</div>
		{/if}

		<!-- Form Section -->
		<form class="flex flex-col gap-6" onsubmit={(e) => { e.preventDefault(); handleRegister(); }}>
			<!-- Email Field (Pre-filled/Disabled) -->
			<div class="flex flex-col gap-2">
				<label class="text-label-caps text-on-surface-variant ml-2 uppercase text-[11px] font-bold">Email Address</label>
				<input class="neo-inset bg-primary-container w-full h-12 px-5 rounded-xl text-[#9AAABB] font-body-md cursor-not-allowed outline-none" disabled type="email" bind:value={email}/>
			</div>
			<!-- Full Name Field -->
			<div class="flex flex-col gap-2">
				<label class="text-label-caps text-on-surface-variant ml-2 uppercase text-[11px] font-bold">Full Name</label>
				<input 
					class="neo-inset bg-primary-container w-full h-12 px-5 rounded-xl text-on-surface font-body-md focus:ring-0 outline-none" 
					placeholder="John Doe" 
					type="text"
					bind:value={name}
					required
				/>
			</div>
			<!-- Password Field -->
			<div class="flex flex-col gap-2">
				<label class="text-label-caps text-on-surface-variant ml-2 uppercase text-[11px] font-bold">Password</label>
				<input 
					class="neo-inset bg-primary-container w-full h-12 px-5 rounded-xl text-on-surface font-body-md focus:ring-0 outline-none" 
					placeholder="••••••••" 
					type="password"
					bind:value={password}
					required
				/>
				<!-- Strength Bar -->
				{#if password}
					<div class="flex gap-1.5 mt-1 px-1">
						<div class="h-1.5 flex-1 rounded-full transition-all duration-300 {strength >= 1 ? 'bg-secondary' : 'bg-surface-variant/30'}" style="opacity: {strength >= 1 ? 1 : 0.3}"></div>
						<div class="h-1.5 flex-1 rounded-full transition-all duration-300 {strength >= 2 ? 'bg-secondary' : 'bg-surface-variant/30'}" style="opacity: {strength >= 2 ? 1 : 0.3}"></div>
						<div class="h-1.5 flex-1 rounded-full transition-all duration-300 {strength >= 3 ? 'bg-secondary' : 'bg-surface-variant/30'}" style="opacity: {strength >= 3 ? 1 : 0.3}"></div>
						<div class="h-1.5 flex-1 rounded-full transition-all duration-300 {strength >= 4 ? 'bg-secondary' : 'bg-surface-variant/30'}" style="opacity: {strength >= 4 ? 1 : 0.3}"></div>
					</div>
					<span class="text-[10px] font-bold text-secondary uppercase tracking-widest ml-2">{strengthText}</span>
				{/if}
			</div>
			<!-- Confirm Password Field -->
			<div class="flex flex-col gap-2">
				<label class="text-label-caps text-on-surface-variant ml-2 uppercase text-[11px] font-bold">Confirm Password</label>
				<input 
					class="neo-inset bg-primary-container w-full h-12 px-5 rounded-xl text-on-surface font-body-md focus:ring-0 outline-none" 
					placeholder="••••••••" 
					type="password"
					bind:value={confirmPassword}
					required
				/>
			</div>
			<!-- Terms Checkbox -->
			<label class="flex items-center gap-3 cursor-pointer group mt-2">
				<input 
					type="checkbox" 
					bind:checked={acceptTerms}
					class="w-6 h-6 rounded-md bg-primary-container neo-raised transition-neo checked:neo-inset cursor-pointer appearance-none checked:after:content-['✓'] checked:after:text-secondary checked:after:font-bold checked:after:flex checked:after:justify-center checked:after:items-center"
				/>
				<span class="text-body-sm text-on-surface-variant">
					I agree to the <a class="text-secondary hover:underline" href="#">Terms of Service</a> and <a class="text-secondary hover:underline" href="#">Privacy Policy</a>.
				</span>
			</label>
			<!-- Action Button -->
			<button 
				class="neo-raised transition-neo w-full h-14 mt-4 bg-secondary rounded-xl text-white font-headline-sm flex items-center justify-center gap-2 disabled:opacity-50" 
				type="submit"
				disabled={loading}
			>
				{loading ? 'Creating Account...' : 'Create Account'}
				<span class="material-symbols-outlined text-[20px]">arrow_forward</span>
			</button>
		</form>
	</div>
</div>
