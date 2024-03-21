<script>
	import njCountiesRaw from '$lib/data/njCounties.json';
	let njCounties = njCountiesRaw.features;
	let innerWidth;

	$: console.log(innerWidth);

	let width = 300,
		height = 270;

	import { geoMercator, geoPath } from 'd3-geo';
	const projection = geoMercator().center([-70.9, 38.9]).scale(4000);
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

<svelte:window bind:innerWidth />

<svg viewBox="0 0 {width} {height}">
	<g fill="none">
		{#each njCounties as feature}
			<path
				class="counties"
				d={path(feature)}
				stroke="var(--silver)"
				stroke-opacity="0.5"
				stroke-width="0.5"
			/>
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
				<text class="station-label" x={feature.coordinates[0]} y={feature.coordinates[1] - 10}>
					{feature.station} Station</text
				>
				<!-- rail line label -->
				<text class="line-label" x={feature.coordinates[0]} y={feature.coordinates[1]} dy={1}>
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
				<text class="time-label" x={feature.coordinates[0]} y={feature.coordinates[1]} dy={12}>
					{feature.day} at {feature.time}</text
				>
			{/if}
		{/each}
	{/if}
</svg>

<style>
	.counties {
		filter: drop-shadow(1px 3px 1px rgba(0 0 0 / 0.25));
	}

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

	.station-label,
	.line-label,
	.time-label {
		transform: translate(-75px, 30px);
	}

	@media screen and (max-width: 480px) {
		svg {
			width: 220px;
			height: 600px;
			transform: scale(2.5);
		}

		.station-label,
		.line-label,
		.time-label {
			transform: translate(-80px, 30px);
		}
	}
</style>
