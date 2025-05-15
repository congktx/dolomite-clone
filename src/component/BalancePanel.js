import React, { useState } from 'react';
import '../styles/BalancePanel.css';

// Lightning bolt icon for Swap button
const LightningIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 2L4.5 12.5H11L9 22L19 9.5H12L13 2Z" fill="#2E86DE" stroke="#2E86DE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// Token icon components
const AaveIcon = () => (
    <div className="token-icon aave">
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="16" fill="#B6509E" />
            <path d="M22.46 17.32l-2.6 4.13h-4.58l3.44-5.5-3.43-5.41h4.59l2.58 4.12 2.52-4.12h4.68l-3.47 5.42 3.46 5.49h-4.7l-2.5-4.13z" fill="white" />
            <path d="M9.24 11.54L12.5 17.1l-3.26 5.35H4.5l3.27-5.42L4.5 11.54h4.74z" fill="white" />
        </svg>
    </div>
);

const ArbIcon = () => (
    <div className="token-icon arb">
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="16" fill="#28A0F0" />
            <path d="M16 6.5L10 19h12L16 6.5z" fill="white" />
            <path d="M16 25.5L10 13h12L16 25.5z" fill="white" />
        </svg>
    </div>
);

const DaiIcon = () => (
    <div className="token-icon dai">
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="16" fill="#F5AC37" />
            <path d="M16.39 21.87h-5.22v-2.63h5.22c1.68 0 2.7-.76 2.7-2.24s-1.02-2.24-2.7-2.24h-5.22V12h5.22c3.31 0 5.3 1.67 5.3 5s-1.99 4.87-5.3 4.87z" fill="white" />
            <path d="M10.35 8h5.43v16h-5.43V8z" fill="white" />
        </svg>
    </div>
);

const EthIcon = () => (
    <div className="token-icon eth">
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="16" fill="#627EEA" />
            <path d="M16.498 8v5.87l4.974 2.22L16.498 8z" fill="white" fillOpacity="0.6" />
            <path d="M16.498 8L11.525 16.09l4.973-2.22V8z" fill="white" />
            <path d="M16.498 21.572v2.426L21.476 17.2 16.498 21.572z" fill="white" fillOpacity="0.6" />
            <path d="M16.498 23.998v-2.426L11.525 17.2l4.973 6.798z" fill="white" />
            <path d="M16.498 20.291l4.974-2.901-4.974-2.216v5.117z" fill="white" fillOpacity="0.2" />
            <path d="M11.525 17.39l4.973 2.901v-5.117l-4.973 2.216z" fill="white" fillOpacity="0.6" />
        </svg>
    </div>
);


const tokenData = [
    { symbol: 'AAVE', name: 'Aave Token', balance: '0.0000', value: '$0.00', icon: <AaveIcon /> },
    { symbol: 'ARB', name: 'Arbitrum', balance: '0.0000', value: '$0.00', icon: <ArbIcon /> },
    { symbol: 'DAI', name: 'Dai Stablecoin', balance: '0.0000', value: '$0.00', icon: <DaiIcon /> },
    { symbol: 'ETH', name: 'Ethereum', balance: '0.0000', value: '$0.00', icon: <EthIcon /> },
];

function BalancePanel() {
    const [hideZeroBalances, setHideZeroBalances] = useState(false);

    const filteredTokens = hideZeroBalances
        ? tokenData.filter(token => parseFloat(token.balance) > 0)
        : tokenData;

    return (
        <div
            className="balance-panel"
            style={{
                position: "absolute",
                top: "24%",
                right: "4%",
            }}
        >
            <div className="balance-header">
                <h2>Congktx Balances <span className="info-icon">ⓘ</span></h2>
            </div>

            <div className="action-button primary">
                <span>Swap <LightningIcon /></span>
            </div>

            <div className="action-buttons">
                <div className="action-button secondary">Deposit</div>
                <div className="action-button secondary">Withdraw</div>
            </div>

            <div className="balance-filter">
                <input
                    type="checkbox"
                    id="hide-zero"
                    checked={hideZeroBalances}
                    onChange={() => setHideZeroBalances(!hideZeroBalances)}
                />
                <label htmlFor="hide-zero">Hide Zero Balances</label>
            </div>

            <div className="token-list-header">
                <div className="token-label">Token</div>
                <div className="balance-label">Balance</div>
            </div>

            <div className="token-list">
                {filteredTokens.map((token, index) => (
                    <div className="token-item" key={index}>
                        <div className="token-info">
                            {token.icon}
                            <div className="token-details">
                                <div className="token-symbol">{token.symbol}</div>
                                <div className="token-name">{token.name}</div>
                            </div>
                        </div>
                        <div className="token-balance">
                            <div className="balance-amount">{token.balance}</div>
                            <div className="balance-value">{token.value}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BalancePanel; 