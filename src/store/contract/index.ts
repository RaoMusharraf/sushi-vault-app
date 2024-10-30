const { web3 } = require('../web3');
const { env } = require('../config');

const sushi = require(`./${env}/sushiToken.json`);
const sushiVault = require(`./${env}/sushiVault.json`);


const sushiTokenABI = sushi['abi'];
const sushiTokenAddress = sushi['address'];
const sushiToken = new web3.eth.Contract(sushiTokenABI, sushiTokenAddress);


const sushiVaultABI = sushiVault['abi'];
const sushiVaultAddress = sushiVault['address'];
const sushiVaultToken = new web3.eth.Contract(sushiVaultABI, sushiVaultAddress);

export { sushiTokenABI, sushiTokenAddress, sushiToken, sushiVaultABI, sushiVaultAddress, sushiVaultToken }