import React from 'react';

interface BalanceDisplayProps {
    sushiBalance: String; // Replace `number` with `string` if balance is a string
    vaultBalance: String; // Replace `number` with `string` if balance is a string
}

const BalanceDisplay: React.FC<BalanceDisplayProps> = ({ sushiBalance, vaultBalance }) => (
    <div>
        <h2>Balance Information</h2>
        <p>Sushi Balance: {sushiBalance}</p>
        <p>Vault Balance: {vaultBalance}</p>
    </div>
);

export default BalanceDisplay;