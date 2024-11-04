import React from 'react';
import DepositWithdrawForm from './components/DepositWithdrawForm';
import useSushiBar from './hooks/useSushiBar';
import './styles.css';
import '@rainbow-me/rainbowkit/styles.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const App: React.FC = () => {
  const { status, approveTokens, deposit, withdraw } = useSushiBar();

  return (
    <div className="container">
      <ConnectButton />
      <h1>Sushi Vault</h1>
      <DepositWithdrawForm onDeposit={deposit} onWithdraw={withdraw} onApprove={approveTokens} status={status} />
    </div>
  );
};

export default App;