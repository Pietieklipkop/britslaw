<script lang="ts">
	import { page } from '$app/state';
	import { onMount, onDestroy } from 'svelte';

	const email = page.url.searchParams.get('email') || 'user@example.com';
	const tenant = page.data.tenant;

	let timeLeft = $state(15 * 60); // 15 minutes in seconds
	const initialTime = 15 * 60;
	let timerInterval: ReturnType<typeof setInterval> | undefined;

	let minutes = $derived(Math.floor(timeLeft / 60));
	let seconds = $derived(timeLeft % 60);
	let timeString = $derived(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
	let progressWidth = $derived(`${(timeLeft / initialTime) * 100}%`);

	onMount(() => {
		timerInterval = setInterval(() => {
			if (timeLeft > 0) {
				timeLeft--;
			} else {
				clearInterval(timerInterval);
			}
		}, 1000);
	});

	onDestroy(() => {
		if (timerInterval) clearInterval(timerInterval);
	});

	function handleResend() {
		// Placeholder for resending magic link action
		alert('Magic link resent successfully.');
		timeLeft = initialTime;
	}
</script>

<svelte:head>
	<title>{tenant ? tenant.name : 'LegalForge'} | Magic Link Sent</title>
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
</svelte:head>

<div class="flex-grow flex items-center justify-center p-6 w-full">
	<div class="w-full max-w-md bg-primary-container neo-raised rounded-[24px] p-10 flex flex-col items-center text-center">
		<!-- Icon Area -->
		<div class="w-20 h-20 rounded-full neo-raised flex items-center justify-center mb-8">
			<span class="material-symbols-outlined text-[40px] text-[#5B6CF9]">mail</span>
		</div>
		<!-- Content -->
		<h1 class="text-[26px] font-bold text-on-surface mb-4 leading-tight">Check your inbox</h1>
		<p class="text-body-sm text-[#6B7A94] mb-8 max-w-[280px]">
			We sent a sign-in link to <span class="font-semibold text-on-surface">{email}</span>. It expires in 15 minutes.
		</p>
		<!-- CTA/Links Area -->
		<div class="flex flex-col gap-6 w-full items-center">
			<a href="mailto:" class="w-full py-4 px-6 rounded-xl bg-[#5B6CF9] text-white text-center font-semibold neo-raised transition-neo hover:brightness-110 active:shadow-none">
				Open email app
			</a>
			<div class="flex flex-col gap-4">
				<p class="text-[13px] text-on-surface-variant">
					Didn't receive it? 
					<button class="text-[#5B6CF9] font-semibold hover:underline ml-1 transition-all" onclick={handleResend}>Resend</button>
				</p>
				<a class="inline-flex items-center justify-center gap-2 text-[13px] text-[#9AAABB] hover:text-on-surface transition-colors font-medium" href="/login">
					<span class="material-symbols-outlined text-sm">arrow_back</span>
					Back to sign in
				</a>
			</div>
		</div>
		<!-- Decoration Element -->
		<div class="mt-12 w-full h-1 neo-inset rounded-full overflow-hidden bg-surface-variant/30">
			<div class="h-full bg-[#5B6CF9] transition-all duration-300" style="width: {progressWidth}"></div>
		</div>
		<p class="text-[10px] uppercase tracking-widest text-[#9AAABB] mt-3 font-bold">
			{timeLeft > 0 ? `Link valid for ${timeString}` : 'LINK EXPIRED'}
		</p>
	</div>
</div>
