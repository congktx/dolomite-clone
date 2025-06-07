import React, { useEffect, useState } from 'react';
import '../styles/BalancePanel.css';
import { useAccount, useChainId, usePublicClient } from 'wagmi';
import erc20Abi from '../abi/erc20.json';

const listOfTokens = {
    42161: [
        {
            symbol: 'ETH',
            name: 'weth',
            tokenAddress: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
        },
        {
            symbol: 'USDT',
            name: 'tether',
            tokenAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
        },
        {
            symbol: 'WBTC',
            name: 'wrapped-bitcoin',
            tokenAddress: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
        },
        {
            symbol: 'USDC.e',
            name: 'usd-coin',
            tokenAddress: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8'
        }
    ]
};

function BalancePanel() {
    const { address: userAddress, isConnected } = useAccount()
    const [hideZeroBalances, setHideZeroBalances] = useState(false);
    const [tokenData, setTokenData] = useState([]);
    const chainId = useChainId();
    const publicClient = usePublicClient();

    useEffect(() => {
        const fetchTokenBalances = async () => {
            console.log("Fetching token balances...", isConnected, userAddress, chainId);
            if (!isConnected || !userAddress || !listOfTokens[chainId]) {
                setTokenData([]);
                return;
            }

            const tokens = listOfTokens[chainId];
            console.log(tokens)
            const balancePromises = tokens.map(async (token) => {
                const contract = {
                    address: token.tokenAddress,
                    abi: erc20Abi,
                };

                try {
                    const balance = await publicClient.readContract({
                        ...contract,
                        functionName: 'balanceOf',
                        args: [userAddress]
                    });

                    return {
                        symbol: token.symbol,
                        name: token.name,
                        balance: balance.toString(),
                        value: '$0.00'
                    };
                } catch (error) {
                    console.error(`Error fetching balance for ${token.symbol}:`, error);
                    return { symbol: token.symbol, name: token.name, balance: '0', value: '0' };
                }
            });

            const balances = await Promise.all(balancePromises);
            balances.map(((token) => {
                if (token.balance) {
                    token.balance = parseFloat(token.balance).toFixed(4);
                }
                fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${token.name}&vs_currencies=usd`)
                    .then(response => response.json())
                    .then(data => {
                        token.value = `$${(data[token.name]?.usd * parseFloat(token.balance)).toFixed(2)}`;
                    })
                    .catch(error => {
                        console.error(`Error fetching price for ${token.name}:`, error);
                        token.value = '$0.00';
                    });
            }));
            setTokenData(balances);
        };

        fetchTokenBalances();
    },
        [chainId, isConnected, userAddress]);

    const filteredTokens = hideZeroBalances
        ? tokenData.filter((token, index) => token.balance ? (parseFloat(token.balance) > 0) : true)
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
                {tokenData.map((token, index) => (
                    <div className="token-item" key={index}>
                        <div className="token-info">
                            <div className="token-details">
                                <div className="token-symbol">{token.symbol}</div>
                                <div className="token-name">{token.name}</div>
                            </div>
                        </div>
                        <div className="token-balance">
                            <div className="balance-amount">{token.balance ? token.balance : '0'}</div>
                            <div className="balance-value">{token.value}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BalancePanel; 