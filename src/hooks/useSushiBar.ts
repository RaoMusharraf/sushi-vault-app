import { useState } from 'react';
import { sushiToken, sushiVaultToken, sushiVaultAddress } from "../store/contract/index";
import { useAccount, useWalletClient } from 'wagmi';
import { provider } from "../store/provider";

const useSushiBar = () => {
    const { address } = useAccount();
    const { data: signer } = useWalletClient();
    const [status, setStatus] = useState<string>('');

    const approveTokens = async (amount: number, tokenAddress: string) => {
        try {
            let data = sushiToken.methods.approve(address, amount).encodeABI();
            let transaction = { to: tokenAddress, chainId: 1, data: data };
            //@ts-ignore
            const txResponse = await signer.sendTransaction(transaction);
            setStatus('pending')
            const txReceipt = await provider.waitForTransaction(txResponse);
            if (txReceipt && txReceipt.status === 1) setStatus('successfull')
            else setStatus('Failed');
        } catch (error) { setStatus("Error") }
    };
    const deposit = async (amount: number, tokenAddress: string) => {
        try {
            let data = sushiVaultToken.methods.ZapIn(amount, tokenAddress).encodeABI();
            let transaction = { to: sushiVaultAddress, chainId: 1, data };
            //@ts-ignore
            const txResponse = await signer.sendTransaction(transaction);
            setStatus('pending')
            const txReceipt = await provider.waitForTransaction(txResponse);
            if (txReceipt && txReceipt.status === 1) setStatus('successfull')
            else setStatus('Failed');

        } catch (error) { setStatus("error") }
    };
    const withdraw = async (amount: number, tokenAddress: string) => {
        try {
            let data = sushiVaultToken.methods.ZapOut(amount, tokenAddress).encodeABI();
            let transaction = { to: sushiVaultAddress, chainId: 1, data };
            //@ts-ignore
            const txResponse = await signer.sendTransaction(transaction);
            setStatus('pending')
            const txReceipt = await provider.waitForTransaction(txResponse);
            if (txReceipt && txReceipt.status === 1) setStatus('successfull')
            else setStatus('failed');
        } catch (error) { setStatus("Error") }
    };
    return { status, address, deposit, withdraw, approveTokens };
};

export default useSushiBar;
