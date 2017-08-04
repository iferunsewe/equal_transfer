// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import equal_transfer_artifacts from '../../build/contracts/EqualTransfer.json'

var EqualTransfer = contract(equal_transfer_artifacts)

var contractBalance;
var acctABalance;
var acctBBalance;

window.App = {
  start: function(){
      var self = this;
      // Bootstrap the MetaCoin abstraction for Use.
      EqualTransfer.setProvider(web3.currentProvider);

      var h = {};
      var et;
      EqualTransfer.deployed().then(function(instance){
        et = instance;
        h["acctBBalance"] = instance.getBalanceAcctB();
        return et.getContractBalance();
      }).then(function(contractBalance){
        console.log(contractBalance);
        h["contractBalance"] = contractBalance;
        var contractBalanceElement = document.getElementById("balance");
        contractBalanceElement.innerHTML = web3.fromWei(contractBalance, "ether")
        return et.getBalanceAcctA()
      }).then(function(acctABalance){
        console.log(acctABalance);
        h["acctABalance"] = acctABalance;
        var acctABalanceElement = document.getElementById("acct_a_balance");
        acctABalanceElement.innerHTML = web3.fromWei(acctABalance, "ether")
        return et.getBalanceAcctB();
      }).then(function(acctBBalance){
        console.log(acctBBalance);
        h["acctBBalance"] = acctBBalance;
        var acctBBalanceElement = document.getElementById("acct_b_balance");        
        acctBBalanceElement.innerHTML = web3.fromWei(acctBBalance, "ether")
      }).catch(function(e) {
        console.log(e);
        self.setStatus("Error getting balance; see log.");
      });

  },

  splitTransfer: function(value) {
    var self = this;
    var amountElement = document.getElementById("amount");
    var amount = parseInt(amountElement.value);
    this.setStatus("Initiating transaction... (please wait)");

    var et;
    EqualTransfer.deployed().then(function(instance) {
      et = instance;
      return et.splitEther(amount, {from: "0xb6416fa5eb2f7ada299bbed50fdfb8c2486b2dd6"});
    }).then(function(success) {
      console.log(success);
      self.setStatus("Transaction complete!");
      amountElement.value = "";
      self.start();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error sending coin; see log.");
    });

  },

  setStatus: function(message) {
      var status = document.getElementById("status");
      status.innerHTML = message;
  }
}

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  App.start();
});
