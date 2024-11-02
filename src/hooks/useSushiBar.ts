import { useEffect, useState } from 'react';
import Web3 from 'web3';
import { sushiToken, sushiVaultToken, sushiTokenAddress, sushiVaultAddress } from "../store/contract/index";
import { useAccount, useWalletClient } from 'wagmi';
import { provider } from "../store/provider";

const useSushiBar = () => {
    const { address } = useAccount();
    const { data: signer } = useWalletClient();
    const [sushiBalance, setSushiBalance] = useState<String>("0");
    const [vaultBalance, setVaultBalance] = useState<String>("0");
    const [status, setStatus] = useState<string>('');

    const getBalance = async () => {
        if (address) {
            let balanceInGwei = await sushiToken.methods.balanceOf(address).call()
            const balanceInEth = Web3.utils.fromWei(balanceInGwei, "gwei");
            setSushiBalance(balanceInEth);

            let shares = (await sushiVaultToken.methods.balanceOf(address).call()).toString()
            setVaultBalance(shares)
        }
    };
    const approveTokens = async (amount: number) => {
        try {
            let data = sushiToken.methods.approve(address, amount).encodeABI();
            let transaction = { to: sushiTokenAddress, chainId: 1, data: data };
            //@ts-ignore
            const txResponse = await signer.sendTransaction(transaction);
            setStatus('pending')
            const txReceipt = await provider.waitForTransaction(txResponse);
            if (txReceipt && txReceipt.status === 1) {
                setStatus('successfull')
                getBalance()
            }
            else setStatus('Failed');
        } catch (error) { setStatus("Error") }
    };
    const deposit = async (amount: number) => {
        try {
            let data = sushiVaultToken.methods.ZapIn(amount, sushiTokenAddress).encodeABI();
            let transaction = { to: sushiVaultAddress, chainId: 1, data };
            //@ts-ignore
            const txResponse = await signer.sendTransaction(transaction);
            setStatus('pending')
            const txReceipt = await provider.waitForTransaction(txResponse);

            if (txReceipt && txReceipt.status === 1) {
                setStatus('successfull')
                getBalance()
            }

            else setStatus('Failed');

        } catch (error) { setStatus("error") }
    };
    const withdraw = async (amount: number) => {
        try {
            let data = sushiVaultToken.methods.ZapOut(amount, sushiTokenAddress).encodeABI();
            let transaction = { to: sushiVaultAddress, chainId: 1, data };
            //@ts-ignore
            const txResponse = await signer.sendTransaction(transaction);
            setStatus('pending')
            const txReceipt = await provider.waitForTransaction(txResponse);
            if (txReceipt && txReceipt.status === 1) {
                setStatus('successfull')
                getBalance()
            }
            else setStatus('failed');
        } catch (error) { setStatus("Error") }
    };
    return { sushiBalance, vaultBalance, status, address, deposit, withdraw, getBalance, approveTokens };
};

export default useSushiBar;
