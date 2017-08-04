var EqualTransfer = artifacts.require("./EqualTransfer.sol");

module.exports = function(deployer) {
  deployer.deploy(EqualTransfer, "0xb6416fa5eb2f7ada299bbed50fdfb8c2486b2dd6", "0xd2dec7142e0d37e72c7eb54c9806f4b9e7f45d68");
};
