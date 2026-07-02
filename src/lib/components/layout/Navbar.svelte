<script lang="ts">
	import { page } from '$app/stores';
	import { base } from '$app/paths'; // use base path for correct linking in production

	let menuOpen = $state(false);

	const closeMenu = () => (menuOpen = false);
	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Escape') closeMenu();
	};
</script>

<svelte:window onkeydown={handleKeydown} />

<nav class="sticky top-0 z-50 border-b border-slate-800 bg-slate-950">
	<div class="mx-auto max-w-6xl px-4 py-3 sm:px-6 sm:py-4">
		<div class="flex items-center justify-between gap-4">
			<a href="{base}/" class="flex items-center gap-2 transition-colors hover:text-blue-400">
				<span class="text-xl font-bold text-white">🎵 MusicToolkit</span>
			</a>

			<button
				type="button"
				onclick={() => (menuOpen = !menuOpen)}
				aria-expanded={menuOpen}
				aria-controls="mobile-navigation"
				aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
				class="grid h-10 w-10 place-items-center rounded-lg text-2xl text-slate-300 transition hover:bg-slate-800 hover:text-white sm:hidden"
			>
				<span aria-hidden="true">{menuOpen ? '×' : '☰'}</span>
			</button>

			<div class="hidden items-center gap-8 sm:flex" aria-label="Primary navigation">
				<a
					href="{base}/"
					class="snap-start py-1 whitespace-nowrap text-slate-400 transition-colors hover:text-white {$page
						.url.pathname === `${base}/`
						? 'border-b-2 border-blue-500 text-white'
						: ''}"
				>
					Home
				</a>
				<a
					href="{base}/tools"
					class="snap-start py-1 whitespace-nowrap text-slate-400 transition-colors hover:text-white {$page.url.pathname.startsWith(
						`${base}/tools`
					)
						? 'border-b-2 border-blue-500 text-white'
						: ''}"
				>
					Tools
				</a>
				<a
					href="{base}/learn"
					class="snap-start py-1 whitespace-nowrap text-slate-400 transition-colors hover:text-white {$page.url.pathname.startsWith(
						`${base}/learn`
					)
						? 'border-b-2 border-blue-500 text-white'
						: ''}"
				>
					Learn
				</a>
				<a
					href="{base}/games"
					class="snap-start py-1 whitespace-nowrap text-slate-400 transition-colors hover:text-white {$page.url.pathname.startsWith(
						`${base}/games`
					)
						? 'border-b-2 border-blue-500 text-white'
						: ''}"
				>
					Games
				</a>
			</div>
		</div>
	</div>

	{#if menuOpen}
		<div id="mobile-navigation" class="border-t border-slate-800 px-4 py-3 sm:hidden">
			<div class="mx-auto max-w-6xl space-y-1" aria-label="Mobile navigation">
				{#each [{ label: 'Home', href: `${base}/`, active: $page.url.pathname === `${base}/` }, { label: 'Tools', href: `${base}/tools`, active: $page.url.pathname.startsWith(`${base}/tools`) }, { label: 'Learn', href: `${base}/learn`, active: $page.url.pathname.startsWith(`${base}/learn`) }, { label: 'Games', href: `${base}/games`, active: $page.url.pathname.startsWith(`${base}/games`) }] as item, index (item.href)}
					<a
						href={item.href}
						onclick={closeMenu}
						aria-current={item.active ? 'page' : undefined}
						class="flex items-center gap-4 rounded-lg px-3 py-3 transition {item.active
							? 'bg-slate-800 text-white'
							: 'text-slate-400 hover:bg-slate-900 hover:text-white'}"
					>
						<span class="font-mono text-xs text-cyan-400">{String(index + 1).padStart(2, '0')}</span
						>
						<span class="text-lg">{item.label}</span>
					</a>
				{/each}
			</div>
		</div>
	{/if}
</nav>
