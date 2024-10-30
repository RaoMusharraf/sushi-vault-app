import Web3 from "web3";
import { tenderlyRpcProvider } from "../utils/tenderly";

let web3 = new Web3(tenderlyRpcProvider);

export { web3 };