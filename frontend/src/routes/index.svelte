<script lang="ts">
	import Agent from '../components/agent.svelte';
	import { onMount } from 'svelte';
	import { login } from '../utils/keplr';
	import { getTokens } from '../actions/get-tokens';
	import { mint } from '../actions/mint';
	import { setViewingKey } from '../actions/set-viewingkey';
	import { instantiate } from '../actions/instantiate';


	let contractAddress = ''
	const codeHash = import.meta.env.VITE_SECRET_CONTRACT_HASH as string;
	const codeId = import.meta.env.VITE_SECRET_CODE_ID;
	let viewingKey = 'your_viewing_key';
 
	let newAgentName = 'AgentMcSecret';
	
	let tokens = [];
	let secretjs;
	onMount(async () => {
		contractAddress = window.localStorage.getItem('contractAddress');
		const vk = window.localStorage.getItem('viewingKey');
		if (vk) viewingKey = vk;
		secretjs = await login();
		if (contractAddress) {
			const resp = await getTokens({
				contractAddress,
				codeHash
			});

			tokens = resp.token_list.tokens;
		}
	});

	let minting = false;


	const mintAgent = async () => {
		minting = true;

		try {
			await mint({ agentName: newAgentName, contractAddress, codeHash });
		} catch(ex) {
			console.log(ex);
		}
		
		const resp = await getTokens({
			contractAddress,
			codeHash
		});
		tokens = resp.token_list.tokens;
		minting = false;
	};

	const handleClickSetViewingKey = async () => {
		minting = true;
		try {
			await setViewingKey({
				contractAddress,
				codeHash,
				viewingKey,
			});
			const resp = await getTokens({
				contractAddress,
				codeHash
			});
			tokens = resp.token_list.tokens;
		} catch(ex) {
			console.log(ex);
		}
		

		minting = false;
	};

	const handleDeleteContract = () => {
		window.localStorage.setItem('contractAddress', '');
		window.localStorage.setItem('viewingKey', 'your_viewing_key');
		contractAddress = ''
		tokens = [];
		viewingKey = 'your_viewing_key';
	}
	const handleCreateNewContract = async () => {
		try {
			const address = await instantiate({
				codeId,
				codeHash,
				label: `MyNewContract-${Math.random() * 10000000}`
			});
			console.log('new address', address);
			window.localStorage.setItem('contractAddress', address);
			contractAddress = address;
		} catch(ex) {
			console.log(ex);
		}

	}
	const onBurn = async () => {
		const resp = await getTokens({
			contractAddress,
			codeHash,
		});
		tokens = resp.token_list.tokens;
	}
</script>

<div class="container">
	<div>
		<div><h1 class="text-center">Welcome to SecretAgents</h1></div>


		<div>
			<h1>Uploading the Contract</h1>

			<p>Deploying and executing a cosmwasm contract is a 3 step process rather than 2 like Ethereum.
				You can read more about the process in detail (uploading, instantiating and executing) on <a href="https://docs.scrt.network/dev/quickstart.html#create-initial-smart-contract">docs.srct.network</a>.
			</p>
			<p>For the purpose of this example the contract has already been uploaded to testnet and
				can be found at code id <code>9314</code>. This utilizes the uploaded contract and allows
				the user to instantiate and execute 
			</p>
		</div>
		<hr class="break" />
		<div>
			<h1>Instantiating the Contract</h1>
			<p>Instantiation can be done via the command line secret cli tool as follows:</p>
			<code>
				<pre class="overflow-scroll">
INIT='&#123;"count": 100000000&#125';
CODE_ID=1
secretd tx compute instantiate $CODE_ID "$INIT" --from a --label "my counter" -y --keyring-backend test
			</pre>
		</code>
		<p>Instantiation can also be done using the <a href="https://github.com/scrtlabs/secret.js#secretjstxcomputeinstantiatecontract">secretjs</a> library as done in this example.</p>
		<p>Click the Instantiate button bellow to do so. (this app stores the contract address in localStorage to persist across reloads. Your contract will
			be different than other users unless you share the contract address with them).</p>
		<button class="full-width p-15 border-solid text-center text-bold" on:click={handleCreateNewContract}>1. Instantiate New Contract</button>
		{#if contractAddress}
		<div class="p-20 border-solid">
			<div><p class="mr-5">Contract: </p></div>
			<div class="flex h-50">
				
				<input type="text" value={contractAddress} disabled class="px-5 flex-grow mr-5" />
				
				<button on:click={handleDeleteContract}>Delete</button>

			</div>
		</div>
		{/if}
			
		</div>

		
	</div>
	<hr class="break mt-20" />

	<div>
			<h1>Set Viewing Key</h1>
			<p>AS the contact owner you dont need to </p>
			<p>You can choose to provide someone else access to the private data on the contract through the viewing key.</p>
			<p>This app hard codes the viewing key as "foobar"</p>
			
			<div class="p-15 border-solid">
				<input name="viewingKey" class="full-width border-box  border-solid p-15 box-box" bind:value={viewingKey}>
			</div>
			<button class="full-width p-15 border-solid text-center text-bold" disabled={minting}  on:click={handleClickSetViewingKey}>2. Set ViewingKey</button>	
		
	</div>
	<hr class="break mt-20" />
	<div>
		
		<h1>Mint the Agent</h1>
		<p>
			Minting the agent will generate the NFT. This is done by <a href="https://github.com/scrtlabs/secret.js#broadcasting-transactions">broadcasting a transaction</a>.
		</p>

		
		<div class="p-15 border-solid">
			<input name="newAgentName" class="full-width border-box  border-solid p-15 box-box" bind:value={newAgentName} />
		</div>
		<button disabled={minting}  class="full-width p-15 border-solid text-center text-bold"  on:click={mintAgent}>3. Recruit the Agent</button>	

		
	</div>
	<hr class="break mt-20" />

	{#if contractAddress}
		<div>
			<h2>
				My Agents
				
			</h2>

			<div class="flex md:flex-col">
				{#each tokens as token}
					<Agent
						id={token}
						viewingKey={viewingKey}
						contractAddress={contractAddress}
						codeHash={codeHash}
						onBurn={onBurn}
					/>
				{:else}
					<div class="loader" />
				{/each}
			</div>
		</div>
	{/if}

</div>

<style>
	button {
		cursor: pointer;
	}
	.container {
		max-width: 1200px;
		margin: 0 auto;
		font-family:Arial, Helvetica, sans-serif
	}
	.overflow-scroll {
		overflow: scroll;
	}
	.border-box {
		box-sizing: border-box;
	}
	.text-center {
		text-align: center;
	}
	.px-5 {
		padding: 0 5px;
	}
	.mr-5 {
		margin-right: 5px;
	}
	.mt-20 {
		margin-top:20px;
	}
	.h-50 {
		height: 50px;
	}

	.p-20 {
		padding:20px;
	}
	.p-15 {
		padding: 15px;
	}

	.border-solid {
		border: 1px solid #ccc;
	}

	.full-width {
		width: 100%;
	}
	.text-bold {
		font-weight: bold;
	}



	.flex {
		display: flex;
	}
	.flex-grow {
		flex: 1;
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

	@media only screen and (max-width: 600px) {
		.md\:flex-col {
			flex-direction: column;
		}
	}
</style>
