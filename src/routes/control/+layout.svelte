<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import Navigation from './Navigation.svelte';
	import { navigationHeight } from '../../stores/navigationHeightStore';

	export let data: { pathname: string };

	$: pathname = data.pathname;
</script>

<Navigation />

<div class="page">
	{#key pathname}
		<div
			style="--navigation-height: {$navigationHeight}px"
			in:fly={{ delay: 400, duration: 400, y: 32 }}
			out:fade={{ duration: 400 }}
		>
			<slot />
		</div>
	{/key}
</div>

<style lang="scss">
	.page {
		width: 100%;
		height: 100%;
		min-width: min-content;

		div {
			padding: 64px;
			padding-bottom: calc(var(--navigation-height) + 64px);
			min-height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
		}
	}
</style>
