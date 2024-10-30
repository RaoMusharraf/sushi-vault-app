import { useState } from 'react';
import Web3 from 'web3';
import { sushiToken, sushiVaultToken } from "../store/contract/index";
import { useAccount, useWalletClient } from 'wagmi';
import { provider } from "../store/provider";

const useSushiBar = () => {
    const { address } = useAccount();
    const { data: signer } = useWalletClient();
    const [sushiBalance, setSushiBalance] = useState<number>(0);
    const [vaultBalance, setVaultBalance] = useState<number>(0);
    const [status, setStatus] = useState<string>('');

    const getBalance = async () => {
        if (address) {
            let balanceInGwei = await sushiToken.methods.balanceOf(address).call()
            const balanceInEth = Web3.utils.fromWei(balanceInGwei, "gwei");
            let shares = (await sushiVaultToken.methods.balanceOf(address).call()).toString()
            setSushiBalance(Number(balanceInEth));
            setVaultBalance(Number(shares))
        }
    };

    const deposit = async (amount: number) => {
        try {
            let transaction = {
                to: "0xfcbbcA426B71F766417318F99cEffb9EE6a5E270",
                chainId: 1,
                data: sushiToken.methods.approve("0x84CE599879F1d7319De73A1A0C58727B1e41f9dA", 10).encodeABI(),
            };
            //@ts-ignore
            const txResponse = await signer.sendTransaction(transaction);
            const txReceipt = await provider.waitForTransaction(txResponse);
            if (txReceipt && txReceipt.status === 1) {
                setStatus('Deposit successful');
                setSushiBalance(sushiBalance + amount);
            } else setStatus('Failed');
        } catch (error) { setStatus("Error") }
    };

    const withdraw = (amount: number) => {
        if (amount <= sushiBalance) {
            setSushiBalance(sushiBalance - amount);
            setVaultBalance(sushiBalance - amount)
            setStatus('Withdraw successful');
        } else {
            setStatus('Insufficient funds');
        }
    };

    return { sushiBalance, vaultBalance, status, address, deposit, withdraw, getBalance };
};

export default useSushiBar;
