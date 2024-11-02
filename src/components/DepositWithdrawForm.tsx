import React, { useEffect, useState } from 'react';
import '../styles.css';
import { sushiToken, sushiVaultAddress } from "../store/contract/index";
import { useAccount } from 'wagmi';

interface DepositWithdrawFormProps {
    onDeposit: (amount: number) => void;
    onWithdraw: (amount: number) => void;
    onApprove: (amount: number) => void;
}

const DepositWithdrawForm: React.FC<DepositWithdrawFormProps> = ({ onDeposit, onWithdraw, onApprove }) => {
    const { address } = useAccount();

    const [amount, setAmount] = useState<number>(0);
    const [approve, setApprove] = useState<number>(0);

    useEffect(() => { if (address) getSushiTokens() }, [address])

    const getSushiTokens = async () => {
        const approvedTokens = (await sushiToken.methods.allowance(address, sushiVaultAddress).call()).toString();
        setApprove(Number(approvedTokens));
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(parseFloat(e.target.value) || 0);
    };

    return (
        <div className='button-container'>
            <input type="number" onChange={handleChange} placeholder="Enter Amount" />
            {approve < amount ? <button onClick={() => onApprove(amount)}>Approve</button> : <button onClick={() => onDeposit(amount)}>Deposit</button>}
            <button onClick={() => onWithdraw(amount)}>Withdraw</button>
        </div>
    );
};

export default DepositWithdrawForm;
