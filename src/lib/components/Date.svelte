<script>
	export let matchingDate;
	export let dateString;
	//export let filteredNJTData;
</script>

{#if dateString}
	<div class="incident">
		<h1 class="date" class:highlight={matchingDate}>{dateString}</h1>
		<!-- {#if matchingDate}
			<p class="highlight">
				{#each filteredNJTData as d}
					<p class="time">{d['Day of Week']} at {d['Incident Time']}</p>
					<p>
						<span style="font-weight: 600; color: #ecb159;"
							>{d['Closest Station to Incident']} Station</span
						>
						on the
						{d['Line Name']}
					</p>

					<p class="county">{d['County']} County</p>
				{/each}
			</p>
		{/if} -->
	</div>
{/if}

<style>
	/* .incident {
		text-align: center;
	} */
	.date {
		font-family: 'Oswald';
		color: #b4bcbe;
		font-size: 2.25rem;
		font-weight: 400;
	}
	.highlight {
		color: #fff;
	}
	.county {
		/* font-size: 1.25rem; */
	}
</style>
