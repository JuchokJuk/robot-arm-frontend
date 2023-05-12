<script>
	import Record from './Record/Record.svelte';
</script>

<svelte:head>
	<title>Воспроизведение действий</title>
</svelte:head>

<div class="records-list">
	<div class="record">
		<span>Запись #1</span>
		<Record />
	</div>
	<div class="record">
		<span>Запись #2</span>
		<Record />
	</div>
	<div class="record">
		<span>Запись #3</span>
		<Record />
	</div>
	<div class="record">
		<span>Запись #4</span>
		<Record />
	</div>
</div>

<style lang="scss">
	.records-list {
		display: flex;
		flex-direction: column;
		gap: 32px;

		.record {
			display: flex;
			flex-direction: column;
			gap: 12px;

			span{
				font-weight: 500;
				padding: 0 16px;
			}
		}
	}
</style>
