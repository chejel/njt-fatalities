<script>
	export let matchingDate;
	export let dateString;

	$: if (!interval) {
		dateString = 'January 1, 2023';
	}
	export let interval;
</script>

<div class="incident">
	<h1 class="date" class:highlight={matchingDate} class:dim={!interval}>{dateString}</h1>
</div>

<style>
	.date {
		font-family: 'Oswald';
		color: var(--silver);
		font-size: 2.5rem;
		font-weight: 400;
		margin-bottom: 0.35rem;
	}

	.dim {
		opacity: 0.25;
		transition: 1s;
	}

	.highlight {
		color: var(--white);
	}
</style>
