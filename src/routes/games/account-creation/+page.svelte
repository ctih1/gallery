<script lang="ts">
	import Input from '$lib/components/Input.svelte';

	let email: string = $state('');
	let password: string = $state('');
	let passwordConfirm: string = $state('');
	let passwordConfirmConfirm: string = $state('');
	let bestRegion: string = $state('');
	let zipCode: number = $state(0);
	let lyric: string = $state('');
	let loves: string = $state('');
	let gdLevelId: number = $state(0);

	let dateWeek = $state('');

	let issues: string[] = $state([]);

	$effect(() => {
		const detectedIssues = [];

		if (!email.includes('@')) {
			detectedIssues.push('Email is not valid!');
		} else if (!email.includes('@iki.fi')) {
			detectedIssues.push('We only accept email addresses from @iki.fi');
		}

		if (password.length > 38) {
			detectedIssues.push('Password is too long');
		} else if (password.length < 38) {
			detectedIssues.push('Password is too short');
		}

		if (password !== passwordConfirm) {
			detectedIssues.push("Password and confirmation password don't match");
		}
		if (passwordConfirm !== passwordConfirmConfirm) {
			detectedIssues.push("Password confirmation confirmation doesn't match password confirmation");
		}

		if (!dateWeek) {
			detectedIssues.push("You haven't set your birth week");
		} else if (new Date().getFullYear() - Number(dateWeek.split('-')[0]) < 18) {
			detectedIssues.push("You're underage!");
		} else if (new Date().getFullYear() - Number(dateWeek.split('-')[0]) > 21) {
			detectedIssues.push("You're too old!");
		}

		if (bestRegion.replace('-', '').replace(' ', '').toLocaleLowerCase() === 'centralfinland') {
			detectedIssues.push('The region name is not in Finnish!');
		} else if (bestRegion.toLocaleLowerCase() === 'keskisuomi') {
			detectedIssues.push('The region has a dash in the name...');
		} else if (bestRegion.toLocaleLowerCase() !== 'keski-suomi') {
			detectedIssues.push('Wrong region!');
		} else if (bestRegion !== 'Keski-Suomi') {
			detectedIssues.push('Region name is missing grammar rules...');
		}

		if (zipCode.toString().length !== 5) {
			detectedIssues.push('Your zip code is too short!');
		} else if (zipCode % 17 !== 0) {
			detectedIssues.push("Your zip code isn't divisible by 17");
		}

		if (lyric.toLowerCase().trim() !== "i'm an englishman in new york") {
			detectedIssues.push('Incorrect lyric!');
		}

		if (loves != 'ja') {
			detectedIssues.push('You broke my heart :(');
		}

		if (gdLevelId !== 56199846) {
			detectedIssues.push('Invalid Geometry Dash level id');
		}

		issues = detectedIssues;
	});
</script>

<h1>account creation simulator</h1>

<div class="flex flex-col">
	<Input bind:value={email} type="email" label="Email" />

	<Input bind:value={dateWeek} type="week" label="Your birth week" />

	<Input disablePasting={true} bind:value={password} type="password" label="Password" />
	<Input
		disablePasting={true}
		bind:value={passwordConfirm}
		type="password"
		label="Confirm password"
	/>
	<Input
		disablePasting={true}
		bind:value={passwordConfirmConfirm}
		type="password"
		label="Confirm confirmation password"
	/>

	<Input
		disablePasting={true}
		bind:value={bestRegion}
		label="Which region are you from? hint: Finland"
	/>
	<Input bind:value={zipCode} type="number" label="Your postal code" />
	<Input bind:value={lyric} label="Continue the lyric: I'm an alien, I'm a legal alien" />
	<Input bind:value={loves} label="Liebst du mich? <3 (ja oder nein)" />
	<Input bind:value={gdLevelId} type="number" label="Geometry Dash level id for 'Sunshine'" />
</div>

<h2>Issues:</h2>
<ol>
	{#each issues as issue, index}
		<li>#{index + 1}: {issue}</li>
	{/each}
</ol>
