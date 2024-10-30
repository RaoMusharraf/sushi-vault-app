// App.tsx
import React, { useEffect } from 'react';
import BalanceDisplay from './components/BalanceDisplay';
import DepositWithdrawForm from './components/DepositWithdrawForm';
import TransactionStatus from './components/TransactionStatus';
import useSushiBar from './hooks/useSushiBar';
import './styles.css';
import '@rainbow-me/rainbowkit/styles.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const App: React.FC = () => {
  const { sushiBalance, vaultBalance, status, address, deposit, withdraw, getBalance } = useSushiBar();
  useEffect(() => { getBalance() }, [sushiBalance, vaultBalance, address])

  return (
    <div className="container">
      <ConnectButton />
      <h1>Sushi Vault</h1>
      <BalanceDisplay sushiBalance={sushiBalance} vaultBalance={vaultBalance} />
      <DepositWithdrawForm onDeposit={deposit} onWithdraw={withdraw} />
      <TransactionStatus status={status} />
    </div>
  );
};

export default App;