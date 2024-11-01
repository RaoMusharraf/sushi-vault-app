import { useState } from 'react';
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
            console.log("******address", address);

            let balanceInGwei = await sushiToken.methods.balanceOf(address).call()
            const balanceInEth = Web3.utils.fromWei(balanceInGwei, "gwei");
            console.log("*****balanceInEth", balanceInEth);
            setSushiBalance(balanceInEth);

            let shares = (await sushiVaultToken.methods.balanceOf(address).call()).toString()
            console.log("*****shares", shares);
            setVaultBalance(shares)
        }
    };
    const deposit = async (amount: number) => {
        try {
            // let data = sushiToken.methods.approve(address, amount).encodeABI();
            // let transaction = { to: sushiTokenAddress, chainId: 1, data };
            // //@ts-ignore
            // const txResponse = await signer.sendTransaction(transaction);
            // const txReceipt = await provider.waitForTransaction(txResponse);

            // if (txReceipt && txReceipt.status === 1) {
            console.log("*****amount", amount.toString());
            console.log("*****sushiVaultToken.methods", sushiVaultAddress);
            console.log("*****sushiTokenAddress", sushiTokenAddress);
            console.log("*****methods", sushiVaultToken.methods);



            let vaultTokenData = sushiVaultToken.methods.ZapIn(amount.toString(), sushiTokenAddress).encodeABI();
            console.log("*****sushiTokenAddress", vaultTokenData);

            let txVaultToken = { to: sushiVaultAddress, chainId: 1, data: vaultTokenData };
            //@ts-ignore
            const txR = await signer.sendTransaction(txVaultToken);
            const txRecp = await provider.waitForTransaction(txR);
            if (txRecp && txRecp.status === 1) {
                setStatus('deposit successful');
            }
            // } else setStatus('Failed');

        } catch (error) { setStatus("Error") }
    };
    const withdraw = async (amount: number) => {
        try {
            let data = sushiToken.methods.approve(address, amount).encodeABI();
            let transaction = { to: sushiTokenAddress, chainId: 1, data };
            //@ts-ignore
            const txResponse = await signer.sendTransaction(transaction);
            const txReceipt = await provider.waitForTransaction(txResponse);

            if (txReceipt && txReceipt.status === 1) setStatus('withdraw successful');
            else setStatus('failed');

        } catch (error) { setStatus("Error") }
    };

    return { sushiBalance, vaultBalance, status, address, deposit, withdraw, getBalance };
};

export default useSushiBar;
