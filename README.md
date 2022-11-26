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


