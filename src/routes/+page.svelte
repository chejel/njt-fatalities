<script>
	import Map from '$lib/components/Map.svelte';
	import IncrementDate from '$lib/components/Date.svelte';

	import { onMount, onDestroy } from 'svelte';

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

	$: console.log(matchingCounty);

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
	let matchingCounty = null;
	$: if (matchingDate) matchingCounty = filteredNJTData[0]['County'];
	else matchingCounty = null;
</script>

<Map county={matchingCounty} />
<IncrementDate {matchingDate} {dateString} {filteredNJTData} />

<button on:click={() => (intervalState = !intervalState)}>Toggle</button>
