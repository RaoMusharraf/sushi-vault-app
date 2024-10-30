import { useState } from 'react';
import Web3 from 'web3';
import { sushiToken, sushiVaultToken } from "../store/contract/index";

const useSushiBar = () => {
    const [sushiBalance, setSushiBalance] = useState<number>(0);
    const [vaultBalance, setVaultBalance] = useState<number>(0);
    const [status, setStatus] = useState<string>('');

    const getBalance = async () => {
        let address = "0x8d7cFeDD2AbfbCDAfA9d17811923285Bc147AC0A";
        let balanceInGwei = await sushiToken.methods.balanceOf(address).call()
        const balanceInEth = Web3.utils.fromWei(balanceInGwei, "gwei");
        let shares = (await sushiVaultToken.methods.balanceOf(address).call()).toString()
        setSushiBalance(Number(balanceInEth));
        setVaultBalance(Number(shares))
    };

    const deposit = (amount: number) => {
        setSushiBalance(sushiBalance + amount);
        setStatus('Deposit successful');
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

    return { sushiBalance, vaultBalance, status, deposit, withdraw, getBalance };
};

export default useSushiBar;
