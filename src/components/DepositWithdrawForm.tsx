import React, { useEffect, useState } from 'react';
import '../styles.css';
import { sushiVaultAddress, sushiTokenABI, sushiVaultToken } from "../store/contract/index";
import BalanceDisplay from '../components/BalanceDisplay';
import TransactionStatus from '../components/TransactionStatus';
import { useAccount } from 'wagmi';
import { web3 } from '../store/web3';

interface DepositWithdrawFormProps {
    onDeposit: (amount: number, tokenAddress: string) => void;
    onWithdraw: (amount: number, tokenAddress: string) => void;
    onApprove: (amount: number, tokenAddress: string) => void;
    status: string;
}

const DepositWithdrawForm: React.FC<DepositWithdrawFormProps> = ({ onDeposit, onWithdraw, onApprove, status }) => {
    const { address } = useAccount();

    const [amount, setAmount] = useState<number>(0);
    const [tokenAddress, setTokenAddress] = useState<string>("");
    const [sushiBalance, setSushiBalance] = useState<String>("0");
    const [vaultBalance, setVaultBalance] = useState<String>("0");
    const [approve, setApprove] = useState<number>(0);

    useEffect(() => { if (address || tokenAddress) getSushiTokens() }, [address, tokenAddress, status])

    const getSushiTokens = async () => {
        if (tokenAddress) {
            const sushiToken = new web3.eth.Contract(sushiTokenABI, tokenAddress);
            const approvedTokens = await sushiToken.methods.allowance(address, sushiVaultAddress).call();
            setApprove(Number(approvedTokens));
            let balanceInGwei = await sushiToken.methods.balanceOf(address).call()
            //@ts-ignore
            setSushiBalance(balanceInGwei.toString());
        }
        if (address) {
            let shares = (await sushiVaultToken.methods.balanceOf(address).call()).toString()
            setVaultBalance(shares)
        }
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(parseFloat(e.target.value) || 0);
        if (!Number(e.target.value)) setAmount(0)
    };
    const handleChangeToken = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTokenAddress(String(e.target.value));
        if (!String(e.target.value)) setSushiBalance("0")
    };

    return (
        <> <div><BalanceDisplay sushiBalance={sushiBalance} vaultBalance={vaultBalance} /></div>
            <div className='button-container'>
                <input type="number" onChange={handleChange} placeholder="Enter Amount" />
                <input type="String" onChange={handleChangeToken} placeholder="Enter Token Address" />
                {approve < amount ? <button onClick={() => onApprove(amount, tokenAddress)}>Approve</button> : <button onClick={() => onDeposit(amount, tokenAddress)}>Deposit</button>}
                <button onClick={() => onWithdraw(amount, tokenAddress)}>Withdraw</button>
            </div>
            <div><TransactionStatus status={status} /></div>
        </>
    );
};

export default DepositWithdrawForm;
