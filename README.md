## Full stack NFT Market Place 

This is a full stack nft market place dApp like open sea, when we enter into the app we can see our listings(nft), if its owned by the us(by wallet addr) then we can see "its owned by you" and also we ve an option to update our listings. \

If other people go into (not owner), they will ve an option to buy the nft ("buy me" on the listings), and if a user wana buy they can make an offer to buy, after they bought the listing will removed from the market place.(if the buyer wish to resell/ relist his nft, he can do so) \

The market place will keep track of proceeds(sale) whenever someone buys the nft. So now the Creater/owner(addr that listed) can be able to withdraw the proceeds/nft amt. \

## dev Dependencies

```yarn add --dev @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers @nomiclabs/hardhat-etherscan @nomiclabs/hardhat-waffle chai ethereum-waffle hardhat hardhat-contract-sizer hardhat-deploy hardhat-gas-reporter prettier prettier-plugin-solidity solhint solidity-coverage dotenv hardhat-shorthand solc @openzeppelin/contracts``` \


## NftMarketPlace.sol 

The NftMarketPlace.sol is ReentrancyGuard contract.\

our contract will perform the following tasks 
1. listItem - listing the nft item on the market place
2. BuyItem - the users can buy the nft's
3. cancelListing 
4. UpdateListing
5. Withdraw Proceeds - withdraw payments for the sold nfts.\

So our contract is the one which is gon hold all the funds. \

## Frontend - Moralis(kind of firebase but for crypto)

next.js is the framework used the frontend 
```yarn create next-app . ```

# ToDo 

1. Home page : In the home page shows the recently listed NFTs .
    - If the user own the Nft, then he can update the listing .\
    - If not, he can buy the Nft.\
As we can't loop thru the mapping(listings (of every single addr)) to show the recently listed nft, we can use an array but its gas expensive and ve some other cons .\ (Having an array for every single mapping isn't feasible)
Also we don't want to change our protocol just for the website.\

So we can make use of the "EVENT" that emits (still onchain), we can IDEX these events from off-chain and read from the DB

2. Sell Page : The Users can sell their Nfts on the Marketplace

dependencies .\
```yarn add web3uikit moralis react-moralis```

In this Moralis part of the frontend we used morlis server as well --> <MoralisProvider initializeOnMount={true}>

## Tailwind 

Tailwind for the styling --> ```yarn add --dev tailwindcss postcss autoprefixer``` and init ```yarn tailwindcss init -p```

## Moralis Server

We'l setup a svr to listen for those events to be fired and add them to our DB to Query (since Moralis Db is a Mongo Db and its very quereable).\ 
Every single time an item is listed, we gon index it in a DB for ouself, although this approach is a centralized (of using Morlis server). we'll also impl the same in the Graph for a decentralized approach.

Refer docs.moralis.io "Moralis Workflow(such as moralis Identity, Real-time, SDK, APIs)" for additional usage of Moralis.

## connect hardhat to moralis dev server (db)

for the development purpose we'l connect moralis db to our local Harhat,
Since the moralis 2.0 doesn't support for the server we can make a self hosted server by using moralis api key in the mongo DB. \
This is where we set our server to watch for the event and keep track of the active items. Anytime the item is bought, its updated and removed from the activeItem table(thru moralis cloud fns by querying them).\

## Querying the DB 

Now we only wanna show activeItemListed in our moralis DB.\
UseMoralisQuery() Hook.\ from ract-moralis
    - By Using the useMoralisQuery() hook This allow us to fetch and query our Db in a react context (so we can see the active item price addr tokenId sellerId in our frontend from our DB)


## FrontEnd with the Graph

The graph is a decentralized event indexer, the most of the front end code is same as the previous section, but only instead of moralis centralized Db, we'll use graph to listen our events.\

The graph is a n/w of diff that reads from BC and idex the data, it exposes an API to call so we can read that data. Using the Graph the devs can buid and publish an open api called subgraphs, so they can then use in their app to enable bettter qurying capability with data stored on the n/w  including diff feautures.\

ToDo
1. Create a new SubGraph(defining DM, SC addr, n/w and other configs) in graphUI,
2. we can use the graph cli to update our contract info.
3. Then Deploy the subgraph(subgraph Studio)
4. Once the subgraph is deployed and the data begins to index, we can then start test it out, in the graphUI .\

```yarn global add @graphprotocol/graph-cli```
```graph init --studio nft-marketplace-eth```
```graph auth --studio 3xxxxxxxxxx```
```cd nft-marketplace-eth```
```graph codegen``` --> grabs all the code in shema.graphql and put em in the generated directory(schema.ts). so anytime we wana update our shema.graphql, we wana run codegen to update our schema (schem.ts)\
```graph codegen && graph build``` --> this build is what we gon deploy in graph
```graph deploy --studio nft-marketplace-eth``` --> this will deploy in graph and also upload our subgraph to Ipfs -"QmRNvreJZeuVoR9Vc6n2sALwPpNk1rfmMri2FN1295NfcZ" 

## subgraph Endpoint 

This is our subgraph Endpoint - https://thegraph.com/studio/subgraph/nft-marketplace-eth/v0.0.2

And in the playground we can run some quries to see diff events and responses from qraphql.\
Once we run the script mint-and-list.js we can see our events(in playground) has been added active item event and the listed item event'\

To Do the graph query -> graphExample.js this script shows how to query from the graph.\
We gon ve to use the tool called @appolo/client --> ```yarn add --dev @apollo/client graphql``` with this apollo/client we gon make queries to the qraphql, the ex query is in graphExample.js \
And in our _app.js similar to moralis provider we also ve to wrap our app with the apollo provider. in our dapp now we can get our events from decentralized data structure.\

## Hostin dApp

## Deployed Addresses

The contracts are deployed and verified in the Goerli testnet and the addresses are 

    - NftMarketPlace.sol: "0x50dd8aED0c3B11c99710C9fCBE27B4b6385a7680"
    - BasicNft.sol: "0x7D2de13F52030f24e5EB7F4DD80a164Da5e0CC43"
