import React from 'react';

interface TransactionStatusProps {
    status: string;
}

const TransactionStatus: React.FC<TransactionStatusProps> = ({ status }) => (
    <div>
        <h3>Transaction Status: {status}</h3>
    </div>
);

export default TransactionStatus;
