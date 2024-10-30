import Web3 from "web3";
import { tenderlyRpcProvider } from "../utils/tenderly";

let web3 = new Web3(tenderlyRpcProvider);

// if (typeof window !== "undefined" && window.ethereum) {
//     // Check if MetaMask is available and initialize web3 with the provider
//     const providers = window.ethereum.providers || [window.ethereum];
//     for (const provider of providers) {
//         if (provider.isMetaMask) {
//             web3 = new Web3(provider);
//             break;
//         }
//     }
// } else {
//     console.warn("MetaMask is not available. Please install MetaMask.");
// }
// console.log("****provider", web3);
export { web3 };