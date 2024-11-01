import React, { useState } from 'react';
import '../styles.css';

interface DepositWithdrawFormProps {
    onDeposit: (amount: number) => void;
    onWithdraw: (amount: number) => void;
}

const DepositWithdrawForm: React.FC<DepositWithdrawFormProps> = ({ onDeposit, onWithdraw }) => {
    const [amount, setAmount] = useState<number>(0);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(parseFloat(e.target.value) || 0);
    };

    return (
        <div className='button-container'>
            <input type="number" onChange={handleChange} placeholder="Enter Amount" />
            <button onClick={() => onDeposit(amount)}>Deposit</button>
            <button onClick={() => onWithdraw(amount)}>Withdraw</button>
        </div>
    );
};

export default DepositWithdrawForm;
