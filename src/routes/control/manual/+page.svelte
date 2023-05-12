<script lang="ts">
	// import { onMount } from 'svelte';
	import TitledRange from './TitledRange.svelte';
	import { port } from '../../../stores/portStore';

	let controls = [
		[
			{
				title: 'Поворот мизинца',
				value: 0,
				min: 0,
				max: 180
			},
			{
				title: 'Сгиб основания мизинца',
				value: 0,
				min: 0,
				max: 180
			},
			{
				title: 'Сгиб мизинца',
				value: 0,
				min: 0,
				max: 180
			},
			{
				title: 'Поворот основания мизинца',
				value: 0,
				min: 0,
				max: 180
			}
		],
		[
			{
				title: 'Поворот безымянного пальца',
				value: 0,
				min: 0,
				max: 180
			},
			{
				title: 'Сгиб основания безымянного пальца',
				value: 0,
				min: 0,
				max: 180
			},
			{
				title: 'Сгиб безымянного пальца',
				value: 0,
				min: 0,
				max: 180
			}
		],
		[
			{
				title: 'Поворот среднего пальца',
				value: 0,
				min: 0,
				max: 180
			},
			{
				title: 'Сгиб основания среднего пальца',
				value: 0,
				min: 0,
				max: 180
			},
			{
				title: 'Сгиб среднего пальца',
				value: 0,
				min: 0,
				max: 180
			}
		],
		[
			{
				title: 'Поворот указательного пальца',
				value: 0,
				min: 0,
				max: 180
			},
			{
				title: 'Сгиб основания указательного пальца',
				value: 0,
				min: 0,
				max: 180
			},
			{
				title: 'Сгиб указательного пальца',
				value: 0,
				min: 0,
				max: 180
			}
		],
		[
			{
				title: 'Поворот большого пальца',
				value: 0,
				min: 0,
				max: 180
			},
			{
				title: 'Сгиб основания большого пальца',
				value: 0,
				min: 0,
				max: 180
			},
			{
				title: 'Сгиб большого пальца',
				value: 0,
				min: 0,
				max: 180
			},
			{
				title: 'Поворот основания большого пальца',
				value: 0,
				min: 0,
				max: 180
			}
		]
	];

	const textEncoder = new TextEncoder();
	// const textDecoder = new TextDecoder();

	$: {
		if ($port !== undefined) {
			let data: number[][] | number[] = controls.map((finger) => {
				return finger.map((slider) => {
					return Math.round(slider.value);
				});
			});
			data = data.flat();

			const message = textEncoder.encode(data.join(' ') + '\n');

			const writer = $port.writable.getWriter();
			writer.write(message);
			writer.releaseLock();
		}
	}

	// onMount(async () => {
	// 	const reader = $port.readable.getReader();
	// 	let buffer = '';

	// 	while (true) {
	// 		const { value } = await reader.read();
	// 		buffer += textDecoder.decode(value);
	// 		const newlineIndex = buffer.indexOf('\n');
	// 		if (newlineIndex !== -1) {
	// 			const message = buffer.substring(0, newlineIndex);
	// 			buffer = buffer.substring(newlineIndex + 1);
	// 			console.log(`Received message: ${message}`);
	// 		}
	// 	}
	// });
</script>

<svelte:head>
	<title>Ручное управление</title>
</svelte:head>

<div class="grid">
	{#each controls as finger}
		<div class="column">
			{#each finger as range}
				<TitledRange bind:value={range.value} min={range.min} max={range.max}>
					{range.title}
				</TitledRange>
			{/each}
		</div>
	{/each}
</div>

<style lang="scss">
	.grid {
		display: flex;
		flex-wrap: wrap;
		gap: 64px;

		.column {
			width: 256px;
			display: flex;
			flex-direction: column;
			gap: 32px;
		}
	}
</style>
