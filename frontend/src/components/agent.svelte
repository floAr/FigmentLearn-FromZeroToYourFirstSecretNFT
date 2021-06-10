<script lang="ts">
	import { onMount } from 'svelte';

	export let id: number;

	let token: {
		public_metadata: {
			name: string;
			description: string;
			image: string;
		};
		private_metadata: {
			name: string;
			description: string;
			image: string;
		};
	};

	let background = undefined;
	let eye = undefined;
	let cloth = undefined;
	let name = undefined;

	onMount(async () => {
		const res = await fetch(`/api/get-token/${id}`);
		token = await res.json();
		console.log('got', token);
		background = token.private_metadata.name;
		cloth = token.private_metadata.description;
		eye = token.private_metadata.image;
		name = token.public_metadata.name;
	});
</script>

<div>
	{#if background !== undefined || eye !== undefined || cloth !== undefined}
		<div class="card">
			<div class="container">
				<!-- background -->
				<div class="image" style="background-image: url('https://{background}.ipfs.dweb.link/')" />
				<!-- face -->
				<div class="image" style="background-image: url('https://{eye}.ipfs.dweb.link/')" />
				<!-- clothes -->
				<div class="image" style="background-image: url('https://{cloth}.ipfs.dweb.link/')" />
			</div>
			<h3 style="text-align: center; padding: 5px;">{name}</h3>
		</div>
	{:else}
		<div class="loader" />
	{/if}
</div>

<style>
	.card {
		/* Add shadows to create the "card" effect */
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
		transition: 0.3s;
		margin: 5px;
	}

	/* On mouse-over, add a deeper shadow */
	.card:hover {
		box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
	}

	.container {
		position: relative;
		width: 300px;
		height: 300px;
	}

	.image {
		position: absolute;
		width: 300px;
		height: 300px;
		background-size: contain;
	}

	.loader {
		/* border: 16px solid #f3f3f3; 
		border-top: 16px solid #3498db; 
		border-radius: 50%; */
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
