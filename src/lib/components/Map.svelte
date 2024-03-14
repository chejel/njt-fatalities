<script>
	import njCountiesRaw from '$lib/data/njCounties.json';
	let njCounties = njCountiesRaw.features;
	import { onMount } from 'svelte';

	let minX = 225,
		minY = 10;

	onMount(() => {
		if (window.matchMedia('(max-width: 480px)').matches) {
			minX = 100;
			minY = 15;
		}
	});

	let width = 800,
		height = 300;

	import { geoMercator, geoPath } from 'd3-geo';
	const projection = geoMercator().center([-75, 39.35]).scale(5000);
	const path = geoPath(projection);

	import njtStationsRaw from '$lib/data/njt-rail-stations.json';
	const njtStations = njtStationsRaw.features;

	export let filteredNJTData;
	$: projectedStations = njtStations?.map((d) => {
		const time = filteredNJTData?.map((e) => e['Incident Time']).toString();
		const day = filteredNJTData?.map((e) => e['Day of Week']).toString();
		return {
			line: d.properties.LINE_CODE,
			station: d.properties.STATION_ID,
			time: time,
			day: day,
			coordinates: projection([d.properties.LONGITUDE, d.properties.LATITUDE])
		};
	});

	export let closestStation;

	let matchingLine;
	$: if (closestStation)
		matchingLine = projectedStations
			?.filter((d) => d.station === closestStation)
			.map((d) => d.line)
			.toString();
</script>

<svg viewBox="{minX} {minY} {width} {height}">
	<g fill="none">
		{#each njCounties as feature}
			<path d={path(feature)} stroke="silver" stroke-opacity="0.5" stroke-width="0.5" />
		{/each}
	</g>

	{#if filteredNJTData}
		<!-- show corresponding rail line -->
		{#each projectedStations as feature}
			{#if closestStation && feature.line === matchingLine}
				<circle
					cx={feature.coordinates[0]}
					cy={feature.coordinates[1]}
					r="1.5"
					opacity="0.4"
					fill="var(--bright-orange)"
				/>
			{/if}
		{/each}

		<!-- show closest station to incident -->
		{#each projectedStations as feature}
			{#if feature.station === closestStation}
				<circle
					cx={feature.coordinates[0]}
					cy={feature.coordinates[1]}
					r="3"
					stroke="var(--dark)"
					stroke-width="1"
					opacity="1"
					fill="#E2B400"
				/>
				<!-- station label -->
				<text class="station-label" x={feature.coordinates[0] + 10} y={feature.coordinates[1] - 10}>
					{feature.station} Station</text
				>
				<!-- rail line label -->
				<text
					class="line-label"
					x={feature.coordinates[0] + 10}
					y={feature.coordinates[1] - 10}
					dy={12}
				>
					{feature.line
						.replace('AC', 'Atlantic City Line')
						.replace('GL', 'Gladstone Line')
						.replace('NC', 'North Jersey Coast Line')
						.replace('BC', 'Bergen County Line')
						.replace('ME', 'Morris & Essex Line')
						.replace('ML', 'Main Line')
						.replace('NE', 'Northeast Corridor Line')
						.replace('RV', 'Raritan Valley Line')}</text
				>
				<!-- time label -->
				<text
					class="time-label"
					x={feature.coordinates[0] + 10}
					y={feature.coordinates[1] - 10}
					dy={23}
				>
					{feature.day} at {feature.time}</text
				>
			{/if}
		{/each}
	{/if}
</svg>

<style>
	text {
		font-family: 'Barlow Condensed', sans-serif;
	}

	.station-label {
		font-size: 0.85rem;
		fill: var(--orange);
		font-weight: 600;
	}

	.line-label,
	.time-label {
		font-size: 0.7rem;
		fill: var(--white);
		font-weight: 500;
	}

	.time-label {
		font-size: 0.55rem;
		font-weight: 400;
		text-transform: uppercase;
	}

	@media screen and (max-width: 480px) {
		svg {
			transform: scale(4);
		}
	}
</style>
