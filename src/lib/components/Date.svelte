<script>
	export let matchingDate;
	export let dateString;
	export let filteredNJTData;
</script>

{#if dateString}
	<div class="incident">
		<p class="date" class:highlight={matchingDate}>{dateString}</p>
		{#if matchingDate}
			<p class="highlight">
				{#each filteredNJTData as d}
					<p>{d['Day of Week']}</p>
					<p>{d['Incident Time']}</p>
					<p>{d['Closest Station to Incident']}</p>
					<p>{d['County']} County</p>
				{/each}
			</p>
		{/if}
	</div>
{/if}

<style>
	.incident {
		text-align: center;
	}
	.date {
		font-size: 2rem;
	}
	.highlight {
		color: goldenrod;
	}
</style>
