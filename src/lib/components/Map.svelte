<script>
	import njCountiesRaw from '$lib/data/njCounties.json';
	let njCounties = njCountiesRaw.features;

	let width = 1000,
		height = 325;

	import { geoMercator, geoPath } from 'd3-geo';
	const projection = geoMercator().center([-75, 39.35]).scale(5000);
	const path = geoPath(projection);

	export let county;
	$: county = county?.toLowerCase();
</script>

<!-- Code prevents white border of adjacent counties from appearing within yellow stroke of county of an incident -->
<svg viewBox="0 0 {width} {height}">
	<g fill="none">
		{#each njCounties as feature}
			{#if feature.properties.COUNTY.toLowerCase() !== county}
				<path d={path(feature)} stroke="#fff" stroke-width="0.5" />
			{/if}
		{/each}
		{#each njCounties as feature}
			{#if feature.properties.COUNTY.toLowerCase() === county}
				<path d={path(feature)} stroke="#f7c548" stroke-width="2" />
			{/if}
		{/each}
	</g>
</svg>
