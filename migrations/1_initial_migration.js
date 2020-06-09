const Migrations = artifacts.require("Migrations");

module.exports = (deployer, network) => {
  if (network === 'development') {
    deployer.deploy(Migrations);
  }
};