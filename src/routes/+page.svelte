<script>
	import Map from '$lib/components/Map.svelte';
	import IncrementDate from '$lib/components/Date.svelte';

	import { onDestroy } from 'svelte';

	let date = new Date(2023, 0, 0); // Initial date set to January 1, 2023
	let endDate = new Date(2023, 11, 30); // End date set to December 31, 2023

	const dateStringFormat = { year: 'numeric', month: 'long', day: 'numeric' };
	let dateString; // Date to display

	const updateDate = () => {
		if (date <= endDate) {
			date.setDate(date.getDate() + 1); // Increment the date by one day

			dateString = date.toLocaleDateString('en-US', dateStringFormat);
		} else {
			clearInterval(interval); // Stop the interval when the end date is reached
		}
		date = new Date(date); // Create a new Date object to trigger reactivity
	};

	let intervalState = false;

	$: if (intervalState) {
		startInterval(); // Pauses interval
	}

	onDestroy(() => {
		clearInterval(interval); // Clear interval once component destroyed
	});

	// Import NJT data
	import njtFatalities from '$lib/data/fatalities.json';
	const dateNumFormat = { year: 'numeric', month: 'numeric', day: 'numeric' };

	// Check if incremented date is in NJT data
	$: dateNumString = date.toLocaleDateString('en-US', dateNumFormat).toString();
	let matchingDate = false;
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
	let interval;
	const startInterval = () => {
		interval = setInterval(updateDate, 150);
	};

	$: if (matchingDate) {
		clearInterval(interval); // Clear the interval

		setTimeout(() => {
			matchingDate = false; // Reset the matchingDate after 5 seconds
			startInterval(); // Restart the interval after 5 seconds
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
		<div class="buttons">
			<button on:click={() => (intervalState = !intervalState)}>Restart</button>
			<button>Pause</button>
		</div>
		<div class="text">
			<IncrementDate {matchingDate} {dateString} />
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
		left: 55svw;
		bottom: 10px;
		height: 25svh;
		z-index: 2;
	}
</style>
