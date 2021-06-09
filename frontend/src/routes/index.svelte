<script lang="ts">
	import Agent from '../components/agent.svelte';

	import { onMount } from 'svelte';

	let tokens = [];

	let newAgentName = 'AgentMcSecret';

	onMount(async () => {
		const res = await fetch(`/api/get-tokens`);
		tokens = await res.json();
		console.log('got', tokens);
	});

    let minting = false;

    const mintAgent= async()=>{
        minting=true;
        const mint = await fetch(`/api/mint/${newAgentName}`);
		const res = await fetch(`/api/get-tokens`);
		tokens = await res.json();
        minting=false
    }
</script>

<h1>Welcome to SecretAgents</h1>
<div style="display:flex; flex-direction: column;">
	<h2>Recruit new Agents</h2>
	<div style="display: flex; flex-direction: row;">
		<h3 class="blob">Name:</h3>
		<input class="blob" bind:value={newAgentName} />
		<button disabled={minting} class="blob" on:click={mintAgent}>Recruit</button>
	</div>
	<h2>My Agents</h2>
	<div class="postcard-grid">
		{#each tokens as token}
			<Agent id={token} />
		{:else}
			<!-- this block renders when photos.length === 0 -->
			<p>loading...</p>
		{/each}
	</div>
	<div style="display:flex;" />
</div>

<style>
	.blob {
		margin: 3px;
	}
	.postcard-grid {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}
</style>
