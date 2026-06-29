<script lang="ts">
	import { onMount } from 'svelte';

	let activeSection = $state('colors');
	let toggleState = $state(false);
	let checkboxState = $state(false);
	let radioValue = $state('option1');
	let inputValue = $state('');
	let textareaValue = $state('');
	let selectValue = $state('');
	let rangeValue = $state(50);

	const sections = [
		{ id: 'colors', label: 'Colors', icon: '🎨' },
		{ id: 'typography', label: 'Typography', icon: '✍️' },
		{ id: 'buttons', label: 'Buttons', icon: '🔲' },
		{ id: 'inputs', label: 'Inputs', icon: '📝' },
		{ id: 'cards', label: 'Cards', icon: '🃏' },
		{ id: 'forms', label: 'Form Controls', icon: '☑️' },
		{ id: 'badges', label: 'Badges', icon: '🏷️' },
		{ id: 'alerts', label: 'Alerts', icon: '🔔' },
		{ id: 'spacing', label: 'Spacing', icon: '📐' },
		{ id: 'shadows', label: 'Shadows', icon: '🌑' }
	];

	const colors = [
		{ name: 'Primary Blue', hex: '#1e56e3', var: '--color-primary', dark: false },
		{ name: 'Primary Dark', hex: '#1240b8', var: '--color-primary-dark', dark: true },
		{ name: 'Primary Light', hex: '#5680e9', var: '--color-primary-light', dark: false },
		{ name: 'Accent Pink', hex: '#e91e63', var: '--color-accent', dark: true },
		{ name: 'Accent Yellow', hex: '#f5c400', var: '--color-yellow', dark: false },
		{ name: 'Surface', hex: '#e8ecf1', var: '--color-surface', dark: false },
		{ name: 'Surface Dark', hex: '#d0d5dd', var: '--color-surface-dark', dark: false },
		{ name: 'Text Primary', hex: '#1c1c2e', var: '--color-text', dark: true },
		{ name: 'Text Secondary', hex: '#4a4a6a', var: '--color-text-muted', dark: true },
		{ name: 'Success', hex: '#22c55e', var: '--color-success', dark: false },
		{ name: 'Warning', hex: '#f59e0b', var: '--color-warning', dark: false },
		{ name: 'Error', hex: '#ef4444', var: '--color-error', dark: true },
		{ name: 'White', hex: '#ffffff', var: '--color-white', dark: false }
	];

	function scrollToSection(id: string) {
		activeSection = id;
		document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						activeSection = entry.target.id;
					}
				}
			},
			{ threshold: 0.3 }
		);
		sections.forEach(({ id }) => {
			const el = document.getElementById(id);
			if (el) observer.observe(el);
		});
		return () => observer.disconnect();
	});
</script>

<svelte:head>
	<title>Stylesheet — Brits Law Design System</title>
	<meta name="description" content="Brits Law neumorphic design system and component style guide." />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&family=Source+Sans+3:ital,wght@0,300;0,400;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="sg-root">
	<!-- Sidebar Nav -->
	<aside class="sg-sidebar">
		<div class="sg-logo">
			<span class="sg-logo-icon">⚖️</span>
			<div>
				<div class="sg-logo-title">Brits Law</div>
				<div class="sg-logo-sub">Design System</div>
			</div>
		</div>
		<nav class="sg-nav">
			{#each sections as section}
				<button
					class="sg-nav-item"
					class:sg-nav-item--active={activeSection === section.id}
					onclick={() => scrollToSection(section.id)}
				>
					<span class="sg-nav-icon">{section.icon}</span>
					<span>{section.label}</span>
				</button>
			{/each}
		</nav>
		<div class="sg-sidebar-footer">
			<div class="sg-badge sg-badge--primary">v1.0.0</div>
		</div>
	</aside>

	<!-- Main Content -->
	<main class="sg-content">
		<header class="sg-header">
			<h1 class="sg-page-title">Style Guide</h1>
			<p class="sg-page-subtitle">
				The Brits Law neumorphic design system — a living reference for all UI components,
				typography, and brand tokens used across the application.
			</p>
		</header>

		<!-- ─── COLORS ─────────────────────────── -->
		<section id="colors" class="sg-section">
			<div class="sg-section-header">
				<h2 class="sg-section-title">Color Palette</h2>
				<p class="sg-section-desc">All brand tokens used across the Brits Law application.</p>
			</div>
			<div class="sg-color-grid">
				{#each colors as color}
					<div class="sg-color-swatch">
						<div
							class="sg-color-preview"
							style="background: {color.hex}; color: {color.dark ? '#ffffff' : '#1c1c2e'}"
						>
							{color.hex}
						</div>
						<div class="sg-color-info">
							<div class="sg-color-name">{color.name}</div>
							<div class="sg-color-var">{color.var}</div>
						</div>
					</div>
				{/each}
			</div>
		</section>

		<!-- ─── TYPOGRAPHY ────────────────────── -->
		<section id="typography" class="sg-section">
			<div class="sg-section-header">
				<h2 class="sg-section-title">Typography</h2>
				<p class="sg-section-desc">
					Montserrat for headings, Source Sans 3 for body, JetBrains Mono for code.
				</p>
			</div>
			<div class="sg-card sg-card--raised sg-type-showcase">
				<div class="sg-type-row">
					<span class="sg-type-label">Display / H1</span>
					<h1 class="sg-h1">Law for Assets</h1>
					<code class="sg-type-spec">Montserrat 700 · 48px · -0.02em</code>
				</div>
				<div class="sg-type-row">
					<span class="sg-type-label">H2</span>
					<h2 class="sg-h2">Immovable & Intellectual Property</h2>
					<code class="sg-type-spec">Montserrat 700 · 36px</code>
				</div>
				<div class="sg-type-row">
					<span class="sg-type-label">H3</span>
					<h3 class="sg-h3">Commercial Law Services</h3>
					<code class="sg-type-spec">Montserrat 600 · 28px</code>
				</div>
				<div class="sg-type-row">
					<span class="sg-type-label">H4</span>
					<h4 class="sg-h4">Litigation & Dispute Resolution</h4>
					<code class="sg-type-spec">Montserrat 600 · 22px</code>
				</div>
				<div class="sg-type-row">
					<span class="sg-type-label">H5</span>
					<h5 class="sg-h5">Conveyancing Process</h5>
					<code class="sg-type-spec">Montserrat 500 · 18px</code>
				</div>
				<div class="sg-type-row">
					<span class="sg-type-label">H6</span>
					<h6 class="sg-h6">Section Subtitle</h6>
					<code class="sg-type-spec">Montserrat 500 · 15px · uppercase</code>
				</div>
				<div class="sg-type-row">
					<span class="sg-type-label">Body Large</span>
					<p class="sg-body-lg">
						At Brits Law we combine strategic legal thinking with practical commercial insight to
						deliver solutions that protect our clients' interests and achieve real results.
					</p>
					<code class="sg-type-spec">Source Sans 3 400 · 18px · 1.7lh</code>
				</div>
				<div class="sg-type-row">
					<span class="sg-type-label">Body Regular</span>
					<p class="sg-body">
						Our firm provides focused legal services in commercial law, litigation, intellectual
						property and property-related matters.
					</p>
					<code class="sg-type-spec">Source Sans 3 400 · 16px · 1.6lh</code>
				</div>
				<div class="sg-type-row">
					<span class="sg-type-label">Label</span>
					<span class="sg-label">CASE REFERENCE · 2025-001</span>
					<code class="sg-type-spec">Montserrat 600 · 12px · 0.1em tracking</code>
				</div>
				<div class="sg-type-row">
					<span class="sg-type-label">Code / Mono</span>
					<code class="sg-code">const case = await britslaw.getCaseById(id);</code>
					<code class="sg-type-spec">JetBrains Mono 400 · 14px</code>
				</div>
			</div>
		</section>

		<!-- ─── BUTTONS ───────────────────────── -->
		<section id="buttons" class="sg-section">
			<div class="sg-section-header">
				<h2 class="sg-section-title">Buttons</h2>
				<p class="sg-section-desc">All button variants, sizes, and states.</p>
			</div>

			<div class="sg-card sg-card--raised">
				<h3 class="sg-subsection-title">Variants</h3>
				<div class="sg-btn-row">
					<button class="sg-btn sg-btn--primary">Primary</button>
					<button class="sg-btn sg-btn--secondary">Secondary</button>
					<button class="sg-btn sg-btn--ghost">Ghost</button>
					<button class="sg-btn sg-btn--danger">Danger</button>
					<button class="sg-btn sg-btn--success">Success</button>
					<button class="sg-btn sg-btn--primary" disabled>Disabled</button>
				</div>
			</div>

			<div class="sg-card sg-card--raised">
				<h3 class="sg-subsection-title">Sizes</h3>
				<div class="sg-btn-row sg-btn-row--align">
					<button class="sg-btn sg-btn--primary sg-btn--xs">Extra Small</button>
					<button class="sg-btn sg-btn--primary sg-btn--sm">Small</button>
					<button class="sg-btn sg-btn--primary">Medium</button>
					<button class="sg-btn sg-btn--primary sg-btn--lg">Large</button>
					<button class="sg-btn sg-btn--primary sg-btn--xl">Extra Large</button>
				</div>
			</div>

			<div class="sg-card sg-card--raised">
				<h3 class="sg-subsection-title">Icon Buttons</h3>
				<div class="sg-btn-row">
					<button class="sg-btn sg-btn--primary sg-btn--icon">
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
						Download
					</button>
					<button class="sg-btn sg-btn--secondary sg-btn--icon">
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
						Edit Case
					</button>
					<button class="sg-btn sg-btn--ghost sg-btn--icon">
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
						Search
					</button>
					<button class="sg-btn sg-btn--icon-only sg-btn--primary" aria-label="Add">
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14" /></svg>
					</button>
					<button class="sg-btn sg-btn--icon-only sg-btn--ghost" aria-label="Settings">
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
					</button>
				</div>
			</div>

			<div class="sg-card sg-card--raised">
				<h3 class="sg-subsection-title">Loading States</h3>
				<div class="sg-btn-row">
					<button class="sg-btn sg-btn--primary sg-btn--loading">
						<span class="sg-spinner"></span>
						Loading...
					</button>
					<button class="sg-btn sg-btn--secondary sg-btn--loading">
						<span class="sg-spinner sg-spinner--primary"></span>
						Processing
					</button>
				</div>
			</div>
		</section>

		<!-- ─── INPUTS ────────────────────────── -->
		<section id="inputs" class="sg-section">
			<div class="sg-section-header">
				<h2 class="sg-section-title">Input Fields</h2>
				<p class="sg-section-desc">Form inputs with neumorphic inset styling.</p>
			</div>

			<div class="sg-card sg-card--raised sg-form-grid">
				<div class="sg-field">
					<label class="sg-field-label" for="sg-text">Full Name</label>
					<input
						id="sg-text"
						class="sg-input"
						type="text"
						placeholder="e.g. John Smith"
						bind:value={inputValue}
					/>
				</div>
				<div class="sg-field">
					<label class="sg-field-label" for="sg-email">Email Address</label>
					<input
						id="sg-email"
						class="sg-input"
						type="email"
						placeholder="client@example.com"
					/>
				</div>
				<div class="sg-field">
					<label class="sg-field-label" for="sg-password">Password</label>
					<input
						id="sg-password"
						class="sg-input"
						type="password"
						placeholder="Enter your password"
					/>
				</div>
				<div class="sg-field">
					<label class="sg-field-label" for="sg-select">Case Type</label>
					<select id="sg-select" class="sg-input sg-select" bind:value={selectValue}>
						<option value="">Select case type…</option>
						<option value="commercial">Commercial Law</option>
						<option value="litigation">Litigation</option>
						<option value="ip">Intellectual Property</option>
						<option value="property">Conveyancing</option>
						<option value="notarial">Notarial Services</option>
					</select>
				</div>
				<div class="sg-field sg-field--full">
					<label class="sg-field-label" for="sg-textarea">Case Description</label>
					<textarea
						id="sg-textarea"
						class="sg-input sg-textarea"
						placeholder="Describe your legal matter in detail…"
						rows={4}
						bind:value={textareaValue}
					></textarea>
				</div>
				<div class="sg-field">
					<label class="sg-field-label" for="sg-disabled">Disabled Field</label>
					<input
						id="sg-disabled"
						class="sg-input"
						type="text"
						placeholder="Not editable"
						disabled
					/>
				</div>
				<div class="sg-field">
					<label class="sg-field-label" for="sg-error-input">Error State</label>
					<input
						id="sg-error-input"
						class="sg-input sg-input--error"
						type="text"
						value="invalid@"
					/>
					<span class="sg-field-error">Please enter a valid email address.</span>
				</div>
				<div class="sg-field sg-field--full">
					<label class="sg-field-label" for="sg-range">Priority Level — {rangeValue}%</label>
					<input
						id="sg-range"
						class="sg-range"
						type="range"
						min="0"
						max="100"
						bind:value={rangeValue}
					/>
				</div>
			</div>
		</section>

		<!-- ─── CARDS ─────────────────────────── -->
		<section id="cards" class="sg-section">
			<div class="sg-section-header">
				<h2 class="sg-section-title">Cards</h2>
				<p class="sg-section-desc">Neumorphic elevation levels: raised, flat, and inset.</p>
			</div>

			<div class="sg-cards-demo">
				<div class="sg-card sg-card--raised">
					<div class="sg-card-icon">⚖️</div>
					<h3 class="sg-card-title">Raised Card</h3>
					<p class="sg-card-body">
						Used for primary content blocks. Appears to float above the surface using dual box
						shadows.
					</p>
					<div class="sg-card-footer">
						<span class="sg-badge sg-badge--primary">ACTIVE</span>
						<button class="sg-btn sg-btn--primary sg-btn--sm">View</button>
					</div>
				</div>

				<div class="sg-card sg-card--flat">
					<div class="sg-card-icon">📋</div>
					<h3 class="sg-card-title">Flat Card</h3>
					<p class="sg-card-body">
						A subtle card that sits at the same level as the surface. Used for secondary items or
						lists.
					</p>
					<div class="sg-card-footer">
						<span class="sg-badge sg-badge--muted">DRAFT</span>
						<button class="sg-btn sg-btn--ghost sg-btn--sm">View</button>
					</div>
				</div>

				<div class="sg-card sg-card--inset">
					<div class="sg-card-icon">🔍</div>
					<h3 class="sg-card-title">Inset Panel</h3>
					<p class="sg-card-body">
						Pressed into the surface. Ideal for search fields, data tables, or content wells that
						should feel embedded.
					</p>
					<div class="sg-card-footer">
						<span class="sg-badge sg-badge--warning">PENDING</span>
						<button class="sg-btn sg-btn--ghost sg-btn--sm">View</button>
					</div>
				</div>
			</div>

			<!-- LexWorkstation-style template card -->
			<div class="sg-card sg-card--raised sg-template-card">
				<div class="sg-template-header">
					<span class="sg-badge sg-badge--primary">POPULAR</span>
				</div>
				<div class="sg-template-icon">📄</div>
				<h3 class="sg-card-title" style="color: #1e56e3">Master Service Agreement</h3>
				<p class="sg-card-body">
					A comprehensive MSA framework covering liability limits, IP ownership, and flexible
					payment scheduling for long-term B2B partnerships.
				</p>
				<div class="sg-template-meta">
					<span class="sg-meta-tag">COMMERCIAL LAW</span>
					<span class="sg-meta-tag">B2B</span>
				</div>
				<div class="sg-card-footer">
					<button class="sg-btn sg-btn--primary sg-btn--icon sg-btn--sm">
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" /></svg>
						Use Template
					</button>
					<button class="sg-btn sg-btn--ghost sg-btn--sm">Preview</button>
				</div>
			</div>
		</section>

		<!-- ─── FORM CONTROLS ─────────────────── -->
		<section id="forms" class="sg-section">
			<div class="sg-section-header">
				<h2 class="sg-section-title">Form Controls</h2>
				<p class="sg-section-desc">Checkboxes, radios, and toggle switches.</p>
			</div>

			<div class="sg-controls-grid">
				<div class="sg-card sg-card--raised">
					<h3 class="sg-subsection-title">Checkboxes</h3>
					<div class="sg-control-group">
						<label class="sg-control">
							<input class="sg-checkbox" type="checkbox" bind:checked={checkboxState} />
							<span class="sg-control-label">Accept Terms & Conditions</span>
						</label>
						<label class="sg-control">
							<input class="sg-checkbox" type="checkbox" checked />
							<span class="sg-control-label">Receive case updates via email</span>
						</label>
						<label class="sg-control">
							<input class="sg-checkbox" type="checkbox" disabled />
							<span class="sg-control-label sg-control-label--disabled">Disabled option</span>
						</label>
					</div>
				</div>

				<div class="sg-card sg-card--raised">
					<h3 class="sg-subsection-title">Radio Buttons</h3>
					<div class="sg-control-group">
						<label class="sg-control">
							<input class="sg-radio" type="radio" name="sg-radio" value="option1" bind:group={radioValue} />
							<span class="sg-control-label">Commercial Law</span>
						</label>
						<label class="sg-control">
							<input class="sg-radio" type="radio" name="sg-radio" value="option2" bind:group={radioValue} />
							<span class="sg-control-label">Litigation</span>
						</label>
						<label class="sg-control">
							<input class="sg-radio" type="radio" name="sg-radio" value="option3" bind:group={radioValue} />
							<span class="sg-control-label">Intellectual Property</span>
						</label>
					</div>
				</div>

				<div class="sg-card sg-card--raised">
					<h3 class="sg-subsection-title">Toggle Switches</h3>
					<div class="sg-control-group">
						<label class="sg-control">
							<button
								class="sg-toggle"
								class:sg-toggle--on={toggleState}
								onclick={() => (toggleState = !toggleState)}
								role="switch"
								aria-checked={toggleState}
							>
								<span class="sg-toggle-knob"></span>
							</button>
							<span class="sg-control-label">
								Email notifications — <strong>{toggleState ? 'On' : 'Off'}</strong>
							</span>
						</label>
						<label class="sg-control">
							<button class="sg-toggle sg-toggle--on" role="switch" aria-checked="true">
								<span class="sg-toggle-knob"></span>
							</button>
							<span class="sg-control-label">Case alerts — <strong>On</strong></span>
						</label>
						<label class="sg-control">
							<button class="sg-toggle" role="switch" aria-checked="false" disabled>
								<span class="sg-toggle-knob"></span>
							</button>
							<span class="sg-control-label sg-control-label--disabled">Disabled toggle</span>
						</label>
					</div>
				</div>
			</div>
		</section>

		<!-- ─── BADGES ────────────────────────── -->
		<section id="badges" class="sg-section">
			<div class="sg-section-header">
				<h2 class="sg-section-title">Badges & Tags</h2>
				<p class="sg-section-desc">Status indicators, category tags, and notification pills.</p>
			</div>

			<div class="sg-card sg-card--raised">
				<h3 class="sg-subsection-title">Status Badges</h3>
				<div class="sg-badge-row">
					<span class="sg-badge sg-badge--primary">Primary</span>
					<span class="sg-badge sg-badge--success">Active</span>
					<span class="sg-badge sg-badge--warning">Pending</span>
					<span class="sg-badge sg-badge--danger">Closed</span>
					<span class="sg-badge sg-badge--accent">Urgent</span>
					<span class="sg-badge sg-badge--muted">Draft</span>
				</div>
			</div>

			<div class="sg-card sg-card--raised">
				<h3 class="sg-subsection-title">Outline Tags</h3>
				<div class="sg-badge-row">
					<span class="sg-tag">Commercial Law</span>
					<span class="sg-tag">Litigation</span>
					<span class="sg-tag">IP Law</span>
					<span class="sg-tag">Conveyancing</span>
					<span class="sg-tag">Notarial</span>
					<span class="sg-tag">B2B</span>
					<span class="sg-tag">Residential</span>
				</div>
			</div>

			<div class="sg-card sg-card--raised">
				<h3 class="sg-subsection-title">Notification Pills</h3>
				<div class="sg-badge-row">
					<div class="sg-notif-item">
						<span>Messages</span>
						<span class="sg-pill">4</span>
					</div>
					<div class="sg-notif-item">
						<span>Cases</span>
						<span class="sg-pill sg-pill--warning">12</span>
					</div>
					<div class="sg-notif-item">
						<span>Alerts</span>
						<span class="sg-pill sg-pill--danger">2</span>
					</div>
				</div>
			</div>
		</section>

		<!-- ─── ALERTS ────────────────────────── -->
		<section id="alerts" class="sg-section">
			<div class="sg-section-header">
				<h2 class="sg-section-title">Alerts</h2>
				<p class="sg-section-desc">System feedback messages in four semantic variants.</p>
			</div>

			<div class="sg-alerts-stack">
				<div class="sg-alert sg-alert--info">
					<span class="sg-alert-icon">ℹ️</span>
					<div>
						<strong>Information</strong>
						<p>Your case documents are being reviewed by the assigned attorney. You will be notified within 2 business days.</p>
					</div>
				</div>
				<div class="sg-alert sg-alert--success">
					<span class="sg-alert-icon">✅</span>
					<div>
						<strong>Success</strong>
						<p>Your contract has been successfully signed and filed. A copy has been sent to your email.</p>
					</div>
				</div>
				<div class="sg-alert sg-alert--warning">
					<span class="sg-alert-icon">⚠️</span>
					<div>
						<strong>Warning</strong>
						<p>Your retainer balance is running low. Please top up to ensure uninterrupted legal services.</p>
					</div>
				</div>
				<div class="sg-alert sg-alert--danger">
					<span class="sg-alert-icon">❌</span>
					<div>
						<strong>Error</strong>
						<p>Document upload failed. The file size exceeds the 10MB limit. Please compress the file and try again.</p>
					</div>
				</div>
			</div>
		</section>

		<!-- ─── SPACING ───────────────────────── -->
		<section id="spacing" class="sg-section">
			<div class="sg-section-header">
				<h2 class="sg-section-title">Spacing Scale</h2>
				<p class="sg-section-desc">An 8px base unit system for consistent rhythm.</p>
			</div>

			<div class="sg-card sg-card--raised sg-spacing-list">
				{#each [
					{ token: '--space-1', px: '4px', rem: '0.25rem' },
					{ token: '--space-2', px: '8px', rem: '0.5rem' },
					{ token: '--space-3', px: '12px', rem: '0.75rem' },
					{ token: '--space-4', px: '16px', rem: '1rem' },
					{ token: '--space-5', px: '20px', rem: '1.25rem' },
					{ token: '--space-6', px: '24px', rem: '1.5rem' },
					{ token: '--space-8', px: '32px', rem: '2rem' },
					{ token: '--space-10', px: '40px', rem: '2.5rem' },
					{ token: '--space-12', px: '48px', rem: '3rem' },
					{ token: '--space-16', px: '64px', rem: '4rem' },
					{ token: '--space-20', px: '80px', rem: '5rem' },
					{ token: '--space-24', px: '96px', rem: '6rem' }
				] as sp}
					<div class="sg-spacing-row">
						<code class="sg-spacing-token">{sp.token}</code>
						<div class="sg-spacing-bar-wrap">
							<div class="sg-spacing-bar" style="width: {sp.px}; min-width: {sp.px}; height: 24px;"></div>
						</div>
						<span class="sg-spacing-val">{sp.px} / {sp.rem}</span>
					</div>
				{/each}
			</div>
		</section>

		<!-- ─── SHADOWS ───────────────────────── -->
		<section id="shadows" class="sg-section">
			<div class="sg-section-header">
				<h2 class="sg-section-title">Shadows</h2>
				<p class="sg-section-desc">Neumorphic shadow variants for different elevation levels.</p>
			</div>

			<div class="sg-shadows-grid">
				<div class="sg-shadow-demo sg-shadow--xs">
					<span class="sg-label">XS Raised</span>
					<code class="sg-shadow-code">3px 3px 6px #c8ccd1, -3px -3px 6px #ffffff</code>
				</div>
				<div class="sg-shadow-demo sg-shadow--sm">
					<span class="sg-label">SM Raised</span>
					<code class="sg-shadow-code">5px 5px 10px #c8ccd1, -5px -5px 10px #ffffff</code>
				</div>
				<div class="sg-shadow-demo sg-shadow--md">
					<span class="sg-label">MD Raised</span>
					<code class="sg-shadow-code">8px 8px 16px #c8ccd1, -8px -8px 16px #ffffff</code>
				</div>
				<div class="sg-shadow-demo sg-shadow--lg">
					<span class="sg-label">LG Raised</span>
					<code class="sg-shadow-code">12px 12px 24px #c8ccd1, -12px -12px 24px #ffffff</code>
				</div>
				<div class="sg-shadow-demo sg-shadow--inset-sm">
					<span class="sg-label">SM Inset</span>
					<code class="sg-shadow-code">inset 4px 4px 8px #c8ccd1, inset -4px -4px 8px #ffffff</code>
				</div>
				<div class="sg-shadow-demo sg-shadow--inset-md">
					<span class="sg-label">MD Inset</span>
					<code class="sg-shadow-code">inset 6px 6px 12px #c8ccd1, inset -6px -6px 12px #ffffff</code>
				</div>
				<div class="sg-shadow-demo sg-shadow--primary-glow">
					<span class="sg-label">Primary Glow</span>
					<code class="sg-shadow-code">0 4px 20px rgba(30, 86, 227, 0.3)</code>
				</div>
				<div class="sg-shadow-demo sg-shadow--accent-glow">
					<span class="sg-label">Accent Glow</span>
					<code class="sg-shadow-code">0 4px 20px rgba(233, 30, 99, 0.3)</code>
				</div>
			</div>
		</section>

		<footer class="sg-footer">
			<p>Brits Law Design System · Built with SvelteKit & Tailwind CSS</p>
			<p>Neumorphism pattern derived from the AI Contract Tailor reference design.</p>
		</footer>
	</main>
</div>

<style>
	/* ─── DESIGN TOKENS ──────────────────────────── */
	:global(:root) {
		--color-primary: #1e56e3;
		--color-primary-dark: #1240b8;
		--color-primary-light: #5680e9;
		--color-accent: #e91e63;
		--color-yellow: #f5c400;
		--color-surface: #e8ecf1;
		--color-surface-dark: #d0d5dd;
		--color-text: #1c1c2e;
		--color-text-muted: #4a4a6a;
		--color-success: #22c55e;
		--color-warning: #f59e0b;
		--color-error: #ef4444;
		--color-white: #ffffff;

		/* Neumorphic shadows */
		--neu-light: #ffffff;
		--neu-dark: #c8ccd1;
		--neu-raised-xs: 3px 3px 6px #c8ccd1, -3px -3px 6px #ffffff;
		--neu-raised-sm: 5px 5px 10px #c8ccd1, -5px -5px 10px #ffffff;
		--neu-raised-md: 8px 8px 16px #c8ccd1, -8px -8px 16px #ffffff;
		--neu-raised-lg: 12px 12px 24px #c8ccd1, -12px -12px 24px #ffffff;
		--neu-inset-sm: inset 4px 4px 8px #c8ccd1, inset -4px -4px 8px #ffffff;
		--neu-inset-md: inset 6px 6px 12px #c8ccd1, inset -6px -6px 12px #ffffff;
	}

	/* ─── ROOT LAYOUT ────────────────────────────── */
	.sg-root {
		display: flex;
		min-height: 100vh;
		background: var(--color-surface);
		font-family: 'Source Sans 3', 'Segoe UI', sans-serif;
		color: var(--color-text);
	}

	/* ─── SIDEBAR ────────────────────────────────── */
	.sg-sidebar {
		position: sticky;
		top: 0;
		height: 100vh;
		width: 260px;
		min-width: 260px;
		background: var(--color-surface);
		box-shadow: var(--neu-raised-md);
		display: flex;
		flex-direction: column;
		padding: 2rem 1rem;
		gap: 0.5rem;
		z-index: 50;
		overflow-y: auto;
	}

	.sg-logo {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 0.75rem;
		margin-bottom: 1.5rem;
		background: var(--color-surface);
		border-radius: 16px;
		box-shadow: var(--neu-raised-sm);
	}

	.sg-logo-icon {
		font-size: 1.75rem;
	}

	.sg-logo-title {
		font-family: 'Montserrat', sans-serif;
		font-weight: 800;
		font-size: 1rem;
		color: var(--color-primary);
		letter-spacing: -0.02em;
	}

	.sg-logo-sub {
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-text-muted);
	}

	.sg-nav {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
		flex: 1;
	}

	.sg-nav-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.65rem 1rem;
		border-radius: 10px;
		background: transparent;
		border: none;
		color: var(--color-text-muted);
		font-family: 'Source Sans 3', sans-serif;
		font-size: 0.9rem;
		font-weight: 500;
		cursor: pointer;
		text-align: left;
		transition:
			box-shadow 0.2s ease,
			color 0.2s ease,
			background 0.2s ease;
	}

	.sg-nav-item:hover {
		color: var(--color-text);
		background: var(--color-surface);
		box-shadow: var(--neu-raised-xs);
	}

	.sg-nav-item--active {
		background: var(--color-surface);
		color: var(--color-primary);
		font-weight: 700;
		box-shadow: var(--neu-raised-sm);
	}

	.sg-nav-icon {
		font-size: 1rem;
		width: 20px;
		text-align: center;
	}

	.sg-sidebar-footer {
		padding-top: 1rem;
		border-top: 1px solid #d5dae4;
		display: flex;
		justify-content: center;
	}

	/* ─── MAIN CONTENT ───────────────────────────── */
	.sg-content {
		flex: 1;
		padding: 3rem 2.5rem;
		max-width: 1100px;
		overflow-x: hidden;
	}

	/* ─── PAGE HEADER ────────────────────────────── */
	.sg-header {
		margin-bottom: 3.5rem;
		padding-bottom: 2rem;
		border-bottom: 1px solid #d5dae4;
	}

	.sg-page-title {
		font-family: 'Montserrat', sans-serif;
		font-size: 3rem;
		font-weight: 900;
		color: var(--color-text);
		letter-spacing: -0.03em;
		margin: 0 0 0.5rem;
	}

	.sg-page-subtitle {
		font-size: 1.1rem;
		color: var(--color-text-muted);
		line-height: 1.6;
		max-width: 640px;
		margin: 0;
	}

	/* ─── SECTIONS ───────────────────────────────── */
	.sg-section {
		margin-bottom: 4rem;
		scroll-margin-top: 2rem;
	}

	.sg-section-header {
		margin-bottom: 1.75rem;
	}

	.sg-section-title {
		font-family: 'Montserrat', sans-serif;
		font-size: 1.75rem;
		font-weight: 800;
		color: var(--color-text);
		margin: 0 0 0.375rem;
		letter-spacing: -0.02em;
	}

	.sg-section-desc {
		font-size: 0.95rem;
		color: var(--color-text-muted);
		margin: 0;
	}

	.sg-subsection-title {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-text-muted);
		margin: 0 0 1.25rem;
	}

	/* ─── COLORS ─────────────────────────────────── */
	.sg-color-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
		gap: 1.25rem;
	}

	.sg-color-swatch {
		border-radius: 14px;
		overflow: hidden;
		box-shadow: var(--neu-raised-sm);
		transition: box-shadow 0.2s;
	}

	.sg-color-swatch:hover {
		box-shadow: var(--neu-raised-md);
	}

	.sg-color-preview {
		height: 90px;
		display: flex;
		align-items: flex-end;
		padding: 0.5rem 0.75rem;
		font-size: 0.7rem;
		font-family: 'JetBrains Mono', monospace;
		font-weight: 500;
		letter-spacing: 0.02em;
	}

	.sg-color-info {
		padding: 0.6rem 0.75rem;
		background: var(--color-surface);
	}

	.sg-color-name {
		font-size: 0.82rem;
		font-weight: 700;
		color: var(--color-text);
	}

	.sg-color-var {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.68rem;
		color: var(--color-text-muted);
	}

	/* ─── TYPOGRAPHY ─────────────────────────────── */
	.sg-type-showcase {
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.sg-type-row {
		padding: 1.5rem 0;
		border-bottom: 1px solid #d5dae4;
		display: grid;
		grid-template-columns: 120px 1fr 220px;
		gap: 1rem;
		align-items: center;
	}

	.sg-type-row:last-child {
		border-bottom: none;
	}

	.sg-type-label {
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-text-muted);
	}

	.sg-type-spec {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.65rem;
		color: #888;
		background: #dde1e9;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		align-self: center;
		white-space: nowrap;
	}

	.sg-h1 {
		font-family: 'Montserrat', sans-serif;
		font-size: 3rem;
		font-weight: 700;
		line-height: 1.1;
		letter-spacing: -0.02em;
		color: var(--color-text);
		margin: 0;
	}

	.sg-h2 {
		font-family: 'Montserrat', sans-serif;
		font-size: 2.25rem;
		font-weight: 700;
		letter-spacing: -0.01em;
		color: var(--color-text);
		margin: 0;
	}

	.sg-h3 {
		font-family: 'Montserrat', sans-serif;
		font-size: 1.75rem;
		font-weight: 600;
		color: var(--color-text);
		margin: 0;
	}

	.sg-h4 {
		font-family: 'Montserrat', sans-serif;
		font-size: 1.375rem;
		font-weight: 600;
		color: var(--color-text);
		margin: 0;
	}

	.sg-h5 {
		font-family: 'Montserrat', sans-serif;
		font-size: 1.125rem;
		font-weight: 500;
		color: var(--color-text);
		margin: 0;
	}

	.sg-h6 {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.9375rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-text-muted);
		margin: 0;
	}

	.sg-body-lg {
		font-size: 1.125rem;
		line-height: 1.7;
		color: var(--color-text);
		margin: 0;
	}

	.sg-body {
		font-size: 1rem;
		line-height: 1.6;
		color: var(--color-text);
		margin: 0;
	}

	.sg-label {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-text-muted);
	}

	.sg-code {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.875rem;
		color: var(--color-primary-dark);
		background: #dde1e9;
		padding: 0.3rem 0.6rem;
		border-radius: 6px;
		display: block;
	}

	/* ─── CARDS ──────────────────────────────────── */
	.sg-card {
		padding: 1.75rem;
		border-radius: 20px;
		background: var(--color-surface);
		margin-bottom: 1.25rem;
	}

	.sg-card--raised {
		box-shadow: var(--neu-raised-md);
	}

	.sg-card--flat {
		box-shadow: var(--neu-raised-xs);
	}

	.sg-card--inset {
		box-shadow: var(--neu-inset-md);
	}

	.sg-cards-demo {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.sg-card-icon {
		font-size: 2rem;
		margin-bottom: 0.75rem;
	}

	.sg-card-title {
		font-family: 'Montserrat', sans-serif;
		font-size: 1.1rem;
		font-weight: 700;
		margin: 0 0 0.5rem;
		color: var(--color-text);
	}

	.sg-card-body {
		font-size: 0.9rem;
		line-height: 1.6;
		color: var(--color-text-muted);
		margin: 0 0 1.25rem;
	}

	.sg-card-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
	}

	.sg-template-card {
		max-width: 380px;
	}

	.sg-template-header {
		display: flex;
		justify-content: flex-end;
		margin-bottom: 0.5rem;
	}

	.sg-template-icon {
		font-size: 2.5rem;
		margin-bottom: 0.75rem;
	}

	.sg-template-meta {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		margin-bottom: 1.25rem;
	}

	.sg-meta-tag {
		font-family: 'Montserrat', monospace;
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		padding: 0.2rem 0.5rem;
		background: #dde1e9;
		color: var(--color-text-muted);
		border-radius: 4px;
	}

	/* ─── BUTTONS ────────────────────────────────── */
	.sg-btn-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		align-items: flex-start;
	}

	.sg-btn-row--align {
		align-items: center;
	}

	.sg-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.625rem 1.375rem;
		border-radius: 10px;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		border: none;
		transition:
			box-shadow 0.18s ease,
			transform 0.12s ease,
			filter 0.18s ease;
		text-decoration: none;
		white-space: nowrap;
	}

	.sg-btn:active:not(:disabled) {
		transform: translateY(1px);
	}

	.sg-btn--primary {
		background: var(--color-primary);
		color: #fff;
		box-shadow: var(--neu-raised-sm), 0 2px 12px rgba(30, 86, 227, 0.25);
	}

	.sg-btn--primary:hover:not(:disabled) {
		box-shadow: var(--neu-raised-md), 0 4px 20px rgba(30, 86, 227, 0.4);
		filter: brightness(1.08);
	}

	.sg-btn--secondary {
		background: var(--color-surface);
		color: var(--color-primary);
		box-shadow: var(--neu-raised-sm);
		border: 1.5px solid var(--color-primary);
	}

	.sg-btn--secondary:hover:not(:disabled) {
		box-shadow: var(--neu-raised-md);
		background: #dde5f8;
	}

	.sg-btn--ghost {
		background: transparent;
		color: var(--color-text-muted);
		box-shadow: none;
	}

	.sg-btn--ghost:hover:not(:disabled) {
		background: var(--color-surface);
		box-shadow: var(--neu-raised-xs);
		color: var(--color-text);
	}

	.sg-btn--danger {
		background: var(--color-error);
		color: #fff;
		box-shadow: var(--neu-raised-sm), 0 2px 12px rgba(239, 68, 68, 0.25);
	}

	.sg-btn--danger:hover:not(:disabled) {
		filter: brightness(1.08);
		box-shadow: var(--neu-raised-md), 0 4px 20px rgba(239, 68, 68, 0.35);
	}

	.sg-btn--success {
		background: var(--color-success);
		color: #fff;
		box-shadow: var(--neu-raised-sm), 0 2px 12px rgba(34, 197, 94, 0.25);
	}

	.sg-btn--success:hover:not(:disabled) {
		filter: brightness(1.06);
	}

	.sg-btn:disabled {
		opacity: 0.45;
		cursor: not-allowed;
		box-shadow: none;
	}

	/* Sizes */
	.sg-btn--xs {
		padding: 0.3rem 0.75rem;
		font-size: 0.72rem;
		border-radius: 7px;
	}

	.sg-btn--sm {
		padding: 0.45rem 1rem;
		font-size: 0.8rem;
		border-radius: 8px;
	}

	.sg-btn--lg {
		padding: 0.75rem 1.75rem;
		font-size: 1rem;
		border-radius: 12px;
	}

	.sg-btn--xl {
		padding: 0.9rem 2.25rem;
		font-size: 1.1rem;
		border-radius: 14px;
	}

	.sg-btn--icon {
		gap: 0.4rem;
	}

	.sg-btn--icon-only {
		padding: 0.625rem;
		border-radius: 10px;
	}

	.sg-btn--loading {
		pointer-events: none;
		opacity: 0.8;
	}

	.sg-spinner {
		width: 14px;
		height: 14px;
		border: 2px solid rgba(255, 255, 255, 0.4);
		border-top-color: #fff;
		border-radius: 50%;
		animation: sg-spin 0.7s linear infinite;
	}

	.sg-spinner--primary {
		border-color: rgba(30, 86, 227, 0.3);
		border-top-color: var(--color-primary);
	}

	@keyframes sg-spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* ─── INPUTS ─────────────────────────────────── */
	.sg-form-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1.5rem;
	}

	.sg-field {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	.sg-field--full {
		grid-column: 1 / -1;
	}

	.sg-field-label {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-text-muted);
	}

	.sg-input {
		padding: 0.7rem 1rem;
		border-radius: 10px;
		border: none;
		background: var(--color-surface);
		color: var(--color-text);
		font-family: 'Source Sans 3', sans-serif;
		font-size: 0.95rem;
		outline: none;
		box-shadow: var(--neu-inset-sm);
		transition:
			box-shadow 0.2s ease,
			border 0.2s ease;
		width: 100%;
		box-sizing: border-box;
	}

	.sg-input::placeholder {
		color: #adb5c2;
	}

	.sg-input:focus {
		box-shadow: var(--neu-inset-md), 0 0 0 2px rgba(30, 86, 227, 0.3);
	}

	.sg-input:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.sg-input--error {
		box-shadow: var(--neu-inset-sm), 0 0 0 2px rgba(239, 68, 68, 0.4);
	}

	.sg-field-error {
		font-size: 0.78rem;
		color: var(--color-error);
		font-weight: 500;
	}

	.sg-select {
		appearance: none;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%234a4a6a' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 0.9rem center;
		padding-right: 2.5rem;
		cursor: pointer;
	}

	.sg-textarea {
		resize: vertical;
		min-height: 100px;
	}

	.sg-range {
		-webkit-appearance: none;
		width: 100%;
		height: 6px;
		border-radius: 3px;
		background: var(--color-surface);
		box-shadow: var(--neu-inset-sm);
		outline: none;
		cursor: pointer;
	}

	.sg-range::-webkit-slider-thumb {
		-webkit-appearance: none;
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background: var(--color-primary);
		box-shadow: var(--neu-raised-sm), 0 2px 8px rgba(30, 86, 227, 0.3);
		cursor: pointer;
		transition: box-shadow 0.15s;
	}

	.sg-range::-webkit-slider-thumb:hover {
		box-shadow: var(--neu-raised-md), 0 4px 16px rgba(30, 86, 227, 0.4);
	}

	/* ─── FORM CONTROLS ──────────────────────────── */
	.sg-controls-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1.25rem;
	}

	.sg-control-group {
		display: flex;
		flex-direction: column;
		gap: 0.875rem;
	}

	.sg-control {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		cursor: pointer;
	}

	.sg-control-label {
		font-size: 0.9rem;
		color: var(--color-text);
	}

	.sg-control-label--disabled {
		color: var(--color-text-muted);
		opacity: 0.5;
	}

	.sg-checkbox,
	.sg-radio {
		appearance: none;
		width: 20px;
		height: 20px;
		border-radius: 6px;
		background: var(--color-surface);
		box-shadow: var(--neu-inset-sm);
		cursor: pointer;
		position: relative;
		flex-shrink: 0;
		transition: box-shadow 0.15s;
	}

	.sg-radio {
		border-radius: 50%;
	}

	.sg-checkbox:checked,
	.sg-radio:checked {
		background: var(--color-primary);
		box-shadow: var(--neu-raised-xs), 0 2px 8px rgba(30, 86, 227, 0.3);
	}

	.sg-checkbox:checked::after {
		content: '';
		position: absolute;
		left: 5px;
		top: 2px;
		width: 7px;
		height: 11px;
		border: 2.5px solid white;
		border-top: none;
		border-left: none;
		transform: rotate(45deg);
	}

	.sg-radio:checked::after {
		content: '';
		position: absolute;
		inset: 5px;
		background: white;
		border-radius: 50%;
	}

	.sg-checkbox:disabled,
	.sg-radio:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	/* Toggle switch */
	.sg-toggle {
		position: relative;
		width: 44px;
		height: 24px;
		border-radius: 12px;
		background: var(--color-surface);
		box-shadow: var(--neu-inset-sm);
		border: none;
		cursor: pointer;
		padding: 0;
		flex-shrink: 0;
		transition: background 0.25s, box-shadow 0.25s;
	}

	.sg-toggle--on {
		background: var(--color-primary);
		box-shadow: var(--neu-inset-sm), 0 2px 8px rgba(30, 86, 227, 0.3);
	}

	.sg-toggle:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.sg-toggle-knob {
		position: absolute;
		left: 3px;
		top: 3px;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: var(--color-surface);
		box-shadow: var(--neu-raised-xs);
		transition: transform 0.25s ease;
	}

	.sg-toggle--on .sg-toggle-knob {
		transform: translateX(20px);
		background: #fff;
	}

	/* ─── BADGES ─────────────────────────────────── */
	.sg-badge-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.625rem;
		align-items: center;
	}

	.sg-badge {
		display: inline-flex;
		align-items: center;
		padding: 0.25rem 0.625rem;
		border-radius: 6px;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.sg-badge--primary {
		background: rgba(30, 86, 227, 0.12);
		color: var(--color-primary);
	}

	.sg-badge--success {
		background: rgba(34, 197, 94, 0.15);
		color: #166534;
	}

	.sg-badge--warning {
		background: rgba(245, 158, 11, 0.15);
		color: #92400e;
	}

	.sg-badge--danger {
		background: rgba(239, 68, 68, 0.15);
		color: #991b1b;
	}

	.sg-badge--accent {
		background: rgba(233, 30, 99, 0.12);
		color: var(--color-accent);
	}

	.sg-badge--muted {
		background: #dde1e9;
		color: var(--color-text-muted);
	}

	.sg-tag {
		display: inline-flex;
		padding: 0.3rem 0.75rem;
		border-radius: 20px;
		border: 1.5px solid #c8ccd1;
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--color-text-muted);
		background: var(--color-surface);
		box-shadow: var(--neu-raised-xs);
		transition: box-shadow 0.15s, border-color 0.15s;
		cursor: default;
	}

	.sg-tag:hover {
		border-color: var(--color-primary);
		color: var(--color-primary);
		box-shadow: var(--neu-raised-sm);
	}

	.sg-notif-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.9rem;
		font-weight: 500;
	}

	.sg-pill {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 22px;
		height: 22px;
		padding: 0 0.4rem;
		border-radius: 11px;
		font-size: 0.72rem;
		font-weight: 700;
		background: var(--color-primary);
		color: #fff;
		box-shadow: 0 2px 6px rgba(30, 86, 227, 0.35);
	}

	.sg-pill--warning {
		background: var(--color-warning);
		color: #fff;
	}

	.sg-pill--danger {
		background: var(--color-error);
		color: #fff;
	}

	/* ─── ALERTS ─────────────────────────────────── */
	.sg-alerts-stack {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.sg-alert {
		display: flex;
		gap: 1rem;
		padding: 1.125rem 1.375rem;
		border-radius: 14px;
		box-shadow: var(--neu-raised-sm);
		align-items: flex-start;
	}

	.sg-alert p {
		margin: 0.25rem 0 0;
		font-size: 0.9rem;
		line-height: 1.5;
	}

	.sg-alert strong {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.85rem;
		font-weight: 700;
		letter-spacing: 0.02em;
	}

	.sg-alert-icon {
		font-size: 1.25rem;
		flex-shrink: 0;
		margin-top: 0.05rem;
	}

	.sg-alert--info {
		background: linear-gradient(135deg, #e8f0fe 0%, #e8ecf1 100%);
		color: #1a3a8a;
		border-left: 4px solid var(--color-primary);
	}

	.sg-alert--success {
		background: linear-gradient(135deg, #dcfce7 0%, #e8ecf1 100%);
		color: #14532d;
		border-left: 4px solid var(--color-success);
	}

	.sg-alert--warning {
		background: linear-gradient(135deg, #fef3c7 0%, #e8ecf1 100%);
		color: #713f12;
		border-left: 4px solid var(--color-warning);
	}

	.sg-alert--danger {
		background: linear-gradient(135deg, #fee2e2 0%, #e8ecf1 100%);
		color: #7f1d1d;
		border-left: 4px solid var(--color-error);
	}

	/* ─── SPACING ────────────────────────────────── */
	.sg-spacing-list {
		display: flex;
		flex-direction: column;
		gap: 0.875rem;
	}

	.sg-spacing-row {
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}

	.sg-spacing-token {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.72rem;
		color: var(--color-primary);
		background: rgba(30, 86, 227, 0.08);
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
		min-width: 100px;
	}

	.sg-spacing-bar-wrap {
		flex: 1;
	}

	.sg-spacing-bar {
		background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
		border-radius: 4px;
		box-shadow: 0 2px 6px rgba(30, 86, 227, 0.25);
	}

	.sg-spacing-val {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.72rem;
		color: var(--color-text-muted);
		min-width: 130px;
		text-align: right;
	}

	/* ─── SHADOWS ────────────────────────────────── */
	.sg-shadows-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
		gap: 1.5rem;
	}

	.sg-shadow-demo {
		height: 140px;
		border-radius: 16px;
		background: var(--color-surface);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		padding: 1rem;
		text-align: center;
		transition: transform 0.15s;
	}

	.sg-shadow-demo:hover {
		transform: translateY(-2px);
	}

	.sg-shadow-code {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.62rem;
		color: var(--color-text-muted);
		line-height: 1.5;
	}

	.sg-shadow--xs {
		box-shadow: 3px 3px 6px #c8ccd1, -3px -3px 6px #ffffff;
	}

	.sg-shadow--sm {
		box-shadow: 5px 5px 10px #c8ccd1, -5px -5px 10px #ffffff;
	}

	.sg-shadow--md {
		box-shadow: 8px 8px 16px #c8ccd1, -8px -8px 16px #ffffff;
	}

	.sg-shadow--lg {
		box-shadow: 12px 12px 24px #c8ccd1, -12px -12px 24px #ffffff;
	}

	.sg-shadow--inset-sm {
		box-shadow: inset 4px 4px 8px #c8ccd1, inset -4px -4px 8px #ffffff;
	}

	.sg-shadow--inset-md {
		box-shadow: inset 6px 6px 12px #c8ccd1, inset -6px -6px 12px #ffffff;
	}

	.sg-shadow--primary-glow {
		box-shadow: 0 4px 20px rgba(30, 86, 227, 0.35);
	}

	.sg-shadow--accent-glow {
		box-shadow: 0 4px 20px rgba(233, 30, 99, 0.35);
	}

	/* ─── FOOTER ─────────────────────────────────── */
	.sg-footer {
		padding: 2rem 0;
		border-top: 1px solid #d5dae4;
		text-align: center;
		color: var(--color-text-muted);
		font-size: 0.8rem;
		line-height: 1.7;
	}

	.sg-footer p {
		margin: 0;
	}

	/* ─── RESPONSIVE ─────────────────────────────── */
	@media (max-width: 860px) {
		.sg-root {
			flex-direction: column;
		}

		.sg-sidebar {
			position: relative;
			height: auto;
			width: 100%;
			min-width: unset;
			flex-direction: row;
			flex-wrap: wrap;
			padding: 1rem;
			gap: 0.375rem;
		}

		.sg-logo {
			width: 100%;
			margin-bottom: 0.5rem;
		}

		.sg-nav {
			flex-direction: row;
			flex-wrap: wrap;
		}

		.sg-sidebar-footer {
			display: none;
		}

		.sg-content {
			padding: 1.5rem 1rem;
		}

		.sg-type-row {
			grid-template-columns: 1fr;
		}

		.sg-h1 {
			font-size: 2rem;
		}

		.sg-h2 {
			font-size: 1.5rem;
		}
	}
</style>
