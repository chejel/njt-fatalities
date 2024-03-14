<script>
	import Map from '$lib/components/Map.svelte';
	import About from '$lib/components/About.svelte';
	import IncrementDate from '$lib/components/Date.svelte';
	import RefreshIcon from '$lib/components/RefreshIcon.svelte';
	import PlayIcon from '$lib/components/PlayIcon.svelte';
	import PauseIcon from '$lib/components/PauseIcon.svelte';
	import { fade } from 'svelte/transition';

	import { onDestroy } from 'svelte';

	let date = new Date(2023, 0, 0); // Initial date set to January 1, 2023
	let endDate = new Date(2023, 11, 30); // End date set to December 31, 2023

	const dateStringFormat = { year: 'numeric', month: 'long', day: 'numeric' };
	let dateString; // Date to display

	const updateDate = () => {
		if (date <= endDate) {
			date.setDate(date.getDate() + 1); // Increment date by one day

			dateString = date.toLocaleDateString('en-US', dateStringFormat);
		} else {
			clearInterval(interval); // Stop interval at end date
		}
		date = new Date(date); // Create new Date object to trigger reactivity
	};

	let intervalState = false;

	$: if (intervalState) {
		startInterval(); // Pauses interval
	} else {
		clearInterval(interval); // Stops interval
	}

	onDestroy(() => {
		clearInterval(interval); // Clear interval once component destroyed
	});

	// Import NJT data
	import njtFatalities from '$lib/data/fatalities.json';
	const dateNumFormat = { year: 'numeric', month: 'numeric', day: 'numeric' };

	// Check if incremented date is in NJT data
	$: dateNumString = date.toLocaleDateString('en-US', dateNumFormat).toString();
	let matchingDate = null;
	let filteredNJTData;

	$: if (
		njtFatalities
			.map((d) => d['Incident Date'])
			// Incremented date format: 1/1/2023
			.includes(dateNumString)
	) {
		matchingDate = true;
		filteredNJTData = njtFatalities.filter((d) => d['Incident Date'] === dateNumString);
	}

	// Reactive statement to handle interval
	let interval = null;
	const startInterval = () => {
		clearInterval(interval); // Clear previous interval
		interval = setInterval(updateDate, 150);
	};

	$: if (matchingDate) {
		clearInterval(interval); // Clear the interval

		setTimeout(() => {
			matchingDate = false; // Reset matchingDate after 5 seconds
			startInterval(); // Restart interval after 5 seconds
		}, 5000);
	}

	let closestStation = null;
	$: if (matchingDate) closestStation = filteredNJTData[0]['Closest Station to Incident'];
	else closestStation = null;
</script>

<main class="container">
	<div class="map">
		<Map {filteredNJTData} {closestStation} />
	</div>

	<div class="content">
		<!-- text -->
		<div class="introduction" transition:fade={{ delay: 300 }} class:dim={interval}>
			<About />
		</div>
		<!-- date + controls -->
		<div class="date-container" in:fade={{ delay: 300 }}>
			<div class="text">
				<IncrementDate {interval} {matchingDate} {dateString} />
			</div>
			<div class="buttons">
				<button on:click={() => (intervalState = !intervalState)}
					><PlayIcon
						fillColor={!interval ? 'var(--orange)' : 'var(--silver)'}
						strokeColor={!interval ? 'var(--bright-orange)' : 'var(--white)'}
					/></button
				>
				<button on:click={() => (intervalState = !intervalState)}><PauseIcon /></button>
				<button
					on:click={() => {
						clearInterval(interval); // Clear interval
						interval = null; // Reset interval
						intervalState = false; // Reset intervalStart
						date = new Date(2023, 0, 0); // Reset date to initial state
						matchingDate = false; // Reset matchingDate
						closestStation = null; // Reset closestStation
						filteredNJTData = null; // Reset filteredNJTData
					}}><RefreshIcon /></button
				>
			</div>
		</div>
	</div>
</main>

<style>
	.container {
		position: relative;
		height: 100svh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.map {
		position: absolute;
		width: 100%;
		z-index: 1;
	}

	.content {
		position: absolute;
		left: 50svw;
		top: 100px;
		height: 25svh;
		z-index: 2;
	}

	.introduction {
		width: 500px;
	}

	.dim {
		opacity: 0.25;
		transition: 1s;
	}

	.buttons button {
		border: 0;
		padding: 0 0.15rem 0 0;
	}

	@media screen and (max-width: 480px) {
		.content {
			left: 0;
			top: 0;
			height: 100svh;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: center;
			padding: 1rem;
			overflow: hidden;
		}

		.introduction {
			margin-top: auto;
			width: 100%;
			background-color: rgba(28, 39, 42, 0.75);
			padding: 1rem;
			border-radius: 5px;
			overflow: auto;
			box-shadow: 0px 0px 20px 5px rgba(0, 0, 0, 0.1);
		}

		.dim {
			opacity: 0;
		}

		.date-container {
			display: flex;
			flex-direction: column;
			align-items: center;
			bottom: 0;
		}
	}
</style>
