<script lang="ts">
	import Agent from '../components/agent.svelte';
	import { onMount } from 'svelte';

	let newAgentName = 'AgentMcSecret';

	let tokens = [];
	onMount(async () => {
		const res = await fetch(`/api/get-tokens`);
		tokens = await res.json();
		console.log('got', tokens);
	});

	let minting = false;

	const mintAgent = async () => {
		minting = true;
		const mint = await fetch(`/api/mint/${newAgentName}`);
		const res = await fetch(`/api/get-tokens`);
		tokens = await res.json();
		minting = false;
	};

	const setViewingKey = async () => {
		minting = true;
		const vk = await fetch(`/api/set-viewingkey`);
		const res = await fetch(`/api/get-tokens`);
		tokens = await res.json();
		minting = false;
	};
</script>

<h1>Welcome to SecretAgents</h1>
<div style="display:flex; flex-direction: column;">
	<h2>Recruit new Agents</h2>
	<div style="display: flex; flex-direction: row;">
		<h3 class="spaced-div">Name:</h3>
		<input class="spaced-div" bind:value={newAgentName} />
		<button disabled={minting} class="spaced-div" on:click={mintAgent}>Recruit</button>
	</div>
	<h2>
		My Agents
		<button disabled={minting} class="spaced-div" on:click={setViewingKey}>Set ViewingKey</button>
	</h2>

	<div class="postcard-grid">
		{#each tokens as token}
			<Agent id={token} />>
		{:else}
			<div class="loader" />
		{/each}
	</div>
	<div style="display:flex;" />
</div>

<style>
	.spaced-div {
		margin: 3px;
	}
	.postcard-grid {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}

	.loader {
		background-image: url('https://scrt.network/assets/img/logo-seal-outline-white.f9cad178.svg');
		background-size: contain;
		filter: brightness(0);
		width: 50px;
		height: 50px;
		animation: spin 2s linear infinite;
	}
	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
