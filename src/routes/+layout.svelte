<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	let mediaQuery: MediaQueryList;

	function setTheme(isDark: boolean) {
		if (isDark) {
			document.documentElement.dataset.theme = 'dark';
		} else {
			document.documentElement.removeAttribute('data-theme');
		}
	}

	function onChange(event: MediaQueryListEvent) {
		setTheme(event.matches);
	}

	onMount(() => {
		mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

		setTheme(mediaQuery.matches);

		mediaQuery.addEventListener('change', onChange);
	});

	onDestroy(() => {
		if (mediaQuery === undefined) return;
		mediaQuery.removeEventListener('change', onChange);
	});
</script>

<slot />

<style global lang="scss">
	:global(html) {
		--primary: hsl(266, 100%, 50%);
		--primary-active: hsl(266, 100%, 65%);
		--primary-low-contrast: hsla(266, 61%, 64%, 0.16);
		--primary-low-contrast-2: hsla(266, 61%, 64%, 0.08);

		--text: hsl(266, 27%, 15%);
		--text-low-contrast: hsla(266, 27%, 15%, 0.8);

		--space: hsl(0, 0%, 100%);
		--space-transparent: hsla(0, 0%, 100%, 0.8);
	}

	:global(html[data-theme='dark']) {
		--primary: hsl(266, 100%, 80%);
		--primary-active: hsl(266, 100%, 95%);
		--primary-low-contrast: hsla(266, 100%, 80%, 0.16);
		--primary-low-contrast-2: hsla(266, 30%, 62%, 0.08);

		--text: hsl(266, 42%, 94%);
		--text-low-contrast: hsla(266, 42%, 94%, 0.8);

		--space: hsl(0, 1%, 10%);
		--space-transparent: hsla(0, 1%, 10%, 0.8);
	}
</style>
