import { JsonRpcProvider } from "ethers";
import { tenderlyRpcProvider } from "../utils/tenderly";

export const provider = new JsonRpcProvider(tenderlyRpcProvider);