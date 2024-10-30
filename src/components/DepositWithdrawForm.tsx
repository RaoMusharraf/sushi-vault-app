import React, { useState } from 'react';

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
        <div>
            <input type="number" value={amount} onChange={handleChange} />
            <button onClick={() => onDeposit(amount)}>Deposit</button>
            <button onClick={() => onWithdraw(amount)}>Withdraw</button>
        </div>
    );
};

export default DepositWithdrawForm;
