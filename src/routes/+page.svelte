<script lang="ts">
	import usbIcon from '../assets/icons/usb.svg?raw';
	import Button from './Button.svelte';
	import { goto } from '$app/navigation';
	import { port as portStore } from '../stores/portStore';

	import { onMount } from 'svelte';
	import { fly, fade } from 'svelte/transition';

	function connect() {
		// @ts-ignore
		navigator.serial
			.requestPort({})
			.then((port: any) => {
				port
					.open({ baudRate: 9600 })
					.then(() => {
						portStore.set(port);
						port.ondisconnect = () => {
							console.warn('disconnected');
							portStore.set(undefined);
						};
						goto(`control/manual`, { replaceState: true });
					})
					.catch((e: any) => {
						console.warn(e);
					});
			})
			.catch((e: any) => {
				console.warn(e);
			});
	}

	let animate = false;

	onMount(() => {
		setTimeout(() => {
			animate = true;
		}, 200);
	});
</script>

<svelte:head>
	<title>Подключение</title>
</svelte:head>

<div class="page">
	{#if animate}
		<div in:fly={{ duration: 400, y: 32 }} out:fade={{ duration: 400 }}>
			<Button icon={usbIcon} on:click={connect}>Подключиться к манипулятору</Button>
		</div>
	{/if}
</div>

<style lang="scss">
	.page {
		width: 100%;
		min-width: min-content;
		height: 100%;
		min-height: 100%;

		padding: 32px 64px;

		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
