import { BigInt, Address } from "@graphprotocol/graph-ts"
import {
    NftMarketPlace,
    ItemBought as ItemBoughtEvent,
    ItemCanceled as ItemCanceledEvent,
    ItemListed as ItemListedEvent,
} from "../generated/NftMarketPlace/NftMarketPlace"
import { ItemListed, ActiveItem, ItemBought, ItemCanceled } from "../generated/schema"
//we ve to save the event in the graph
//then we ve to update the active item list

//get or create a Item Listed obj
//we need a unique Id (tokenId + nft addr)
export function handleItemListed(event: ItemListedEvent): void {
    let itemListed = ItemListed.load(
        //the ItemListed obj(what we save to graph) is obtained from the ItemListed event
        getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    )
    let activeItem = ActiveItem.load(
        getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    )
    if (!itemListed) {
        //if there is no item listed then create a new one
        itemListed = new ItemListed(
            getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
        )
    }
    if (!activeItem) {
        activeItem = new ActiveItem(
            getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
        )
    }
    itemListed.seller = event.params.seller
    activeItem.seller = event.params.seller

    itemListed.nftAddress = event.params.nftAddress
    activeItem.nftAddress = event.params.nftAddress

    itemListed.tokenId = event.params.tokenId
    activeItem.tokenId = event.params.tokenId

    itemListed.price = event.params.price
    activeItem.price = event.params.price

    activeItem.buyer = Address.fromString("0x0000000000000000000000000000000000000000") // if we ve the empty addr which means the item is still on the market, and actuall real addr means its actually bought by someone

    itemListed.save() //this is how we save itemlisted as an obj to save our graph
    activeItem.save()
}

export function handleItemCanceled(event: ItemCanceledEvent): void {
    let itemCanceled = ItemCanceled.load(
        getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    )
    let activeItem = ActiveItem.load(
        getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    )
    if (!itemCanceled) {
        itemCanceled = new ItemCanceled(
            getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
        )
    }
    itemCanceled.seller = event.params.seller
    itemCanceled.nftAddress = event.params.nftAddress
    itemCanceled.tokenId = event.params.tokenId
    activeItem!.buyer = Address.fromString("0x000000000000000000000000000000000000dEaD") //the Dead addr, and if we ve the dead addr(as buyer) means that the item has cancelled

    itemCanceled.save()
    activeItem!.save()
}

export function handleItemBought(event: ItemBoughtEvent): void {
    let itemBought = ItemBought.load(
        //the ItemBought obj(what we save) is obtained from the Itembought event
        getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    )
    let activeItem = ActiveItem.load(
        getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    )
    if (!itemBought) {
        itemBought = new ItemBought(
            getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
        )
    }
    itemBought.buyer = event.params.buyer
    itemBought.nftAddress = event.params.nftAddress
    itemBought.tokenId = event.params.tokenId
    activeItem!.buyer = event.params.buyer

    itemBought.save()
    activeItem!.save()
}

function getIdFromEventParams(tokenId: BigInt, nftAddress: Address): string {
    return tokenId.toHexString() + nftAddress.toHexString()
}
