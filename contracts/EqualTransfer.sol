pragma solidity ^0.4.8;

contract EqualTransfer {
	address public addressA;
	address public addressB;

	function EqualTransfer(address addrA, address addrB){
		addressA = addrA;
		addressB = addrB;
	}

	function splitEther() payable returns(bool){
		uint256 sv = msg.value / 2;
		if (!(addressA.send(sv) && addressB.send(sv))) throw;
		return true;
	}

	function getContractBalance() constant returns(uint256){
		return getBalance(this);
	}

	function getBalanceAcctA() constant returns(uint){
		return getBalance(addressA);
	}

	function getBalanceAcctB() constant returns(uint){
		return getBalance(addressB);
	}

	function getBalance(address addr) constant returns(uint) {
    	return addr.balance;
  	}
}
