import React, { useEffect } from 'react';
import './App.css';
import StrategyBox from './component/StrategyBox';
import DetailStrategy from './component/DetailStrategy';
import Wallet from './component/Wallet';
import ChainSwitch from './component/ChainSwitch';
import FilterStrategy from './component/FilterStrategy';
import BalancePanel from './component/BalancePanel';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, WagmiProvider, createConfig } from "wagmi";
import { mainnet, arbitrum, bsc } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";
import { useSelector } from 'react-redux';
import raumania_logo from "./component/image/raumania.png";

const config = createConfig({
    ssr: true,
    chains: [mainnet, arbitrum, bsc],
    connectors: [metaMask()],
    transports: {
        [mainnet.id]: http(),
        [arbitrum.id]: http(),
        [bsc.id]: http(),
    },
});

const client = new QueryClient();

const strategies = [
    {
        name: "Strategy 1",
        lever: 2,
        risk: 0,
        chain: "Arbitrum",
        apr: 14.41,
        avg_apy_30_day: 18.11,
        tags: ["Yield Maximizing", "Δ Neutral", "GMX"],
        collateral: "BNB",
        debt: "USDC",
    },
    {
        name: "Strategy 2",
        lever: 3,
        risk: 1,
        chain: "Ethereum",
        apr: 14.42,
        avg_apy_30_day: 18.12,
        tags: ["Δ Neutral"],
        collateral: "DAI",
        debt: "USDC",
    },
    {
        name: "Strategy 3",
        lever: 4,
        risk: 1,
        chain: "Arbitrum",
        apr: 14.43,
        avg_apy_30_day: 18.13,
        tags: ["Yield Maximizing"],
        collateral: "ETH",
        debt: "USDC",
    },
    {
        name: "Strategy 4",
        lever: 7,
        risk: 2,
        chain: "Ethereum",
        apr: 14.45,
        avg_apy_30_day: 18.15,
        tags: ["Δ Neutral", "GMX"],
        collateral: "ETH",
        debt: "USDT",
    },
];

function App() {
    const filterAssets = useSelector((state) => state.counter.filterAssets);
    const selectedTags = useSelector((state) => state.counter.tags.selectedTags);
    const tagFilterType = useSelector((state) => state.counter.tags.filterType);
    const filters = useSelector((state) => state.counter.filters);
    const sort = useSelector((state) => state.counter.sort);
    const showDetailStrategy = useSelector((state) => state.counter.showDetailStrategy);

    const sortStrategies = (strategies, sortType) => {
        const sorted = [...strategies];

        switch (sortType) {
            case 'current_apr_desc':
                return sorted.sort((a, b) => b.apr - a.apr);
            case 'current_apr_asc':
                return sorted.sort((a, b) => a.apr - b.apr);
            case 'avg_apr_30_desc':
                return sorted.sort((a, b) => b.avg_apy_30_day - a.avg_apy_30_day);
            case 'avg_apr_30_asc':
                return sorted.sort((a, b) => a.avg_apy_30_day - b.avg_apy_30_day);
            case 'leverage_desc':
                return sorted.sort((a, b) => b.lever - a.lever);
            case 'leverage_asc':
                return sorted.sort((a, b) => a.lever - b.lever);
            case 'risk_desc':
                return sorted.sort((a, b) => b.risk - a.risk);
            case 'risk_asc':
                return sorted.sort((a, b) => a.risk - b.risk);
            default:
                return sorted;
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', (e) => {
            const scrollY = window.scrollY;

            const wrap_detail_strategy = document.querySelector('.wrap_detail_strategy');
            if (wrap_detail_strategy) {
                wrap_detail_strategy.style.top = `${scrollY}px`;
            }

            const tieu_vuong_quoc = document.querySelector('.tieu_vuong_quoc');
            if (tieu_vuong_quoc) {
                tieu_vuong_quoc.style.top = `calc(${scrollY}px + 95vh)`;
            }
        });
    }, []);

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={client}>
                <div
                    className='App'
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        height: '500vh',
                        textAlign: 'center',
                        backgroundColor: '#171621',
                        zIndex: 1,
                    }}
                >
                    <div className='tieu_vuong_quoc'
                        style={{
                            position: 'absolute',
                            top: '95vh',
                            left: '0%',
                            width: '50px',
                            height: '50px',
                            zIndex: 1000,
                            color: '#8fc942',
                        }}
                    >
                        <img alt="rau_ma" src={raumania_logo}
                            style={{
                                position: 'absolute',
                                top: '0%',
                                left: '0%',
                                width: '50px',
                                height: '50px',
                            }}
                        ></img>
                        <div
                            style={{
                                position: 'absolute',
                                top: '37%',
                                left: '100%',
                                fontSize: '12px',
                            }}
                        >
                            Raumania
                        </div>
                    </div>

                    <div
                        className='wrap_all_content'
                        style={{
                            position: 'absolute',
                            top: '0%',
                            left: '-100px',
                            width: '100%',
                            height: '100%',
                            backgroundColor: '#171621',
                        }}
                    >
                        <div
                            className="strategies_container"
                        >
                            {sortStrategies(strategies, sort)
                                .filter((strategy) => {
                                    // Filter by assets (collateral and debt)
                                    let trueCollateral = (filterAssets.collateral.length === 0) || filterAssets.collateral.includes(strategy.collateral);
                                    let trueDebt = (filterAssets.debt.length === 0) || filterAssets.debt.includes(strategy.debt);

                                    // Filter by chain, risk, leverage
                                    let trueChain = (filters.chains.length === 0) || filters.chains.includes(strategy.chain);
                                    let trueRisk = (filters.risks.length === 0) || filters.risks.includes(strategy.risk);
                                    let trueLeverage = (filters.leverages.length === 0) || filters.leverages.includes(strategy.lever);

                                    // Filter by tags
                                    let trueTags = true;
                                    if (selectedTags.length > 0) {
                                        if (tagFilterType === 'all') {
                                            trueTags = selectedTags.every(tag => strategy.tags.includes(tag));
                                        } else {
                                            trueTags = selectedTags.some(tag => strategy.tags.includes(tag));
                                        }
                                    }

                                    return trueCollateral && trueDebt && trueChain && trueRisk && trueLeverage && trueTags;
                                })
                                .map((strategy, index) => (
                                    <StrategyBox
                                        key={index}
                                        index={index}
                                        info={strategy}
                                    />
                                ))}
                        </div>
                        <FilterStrategy />
                        <ChainSwitch />
                        <Wallet />
                        <BalancePanel />
                        {showDetailStrategy !== -1 && (
                            <DetailStrategy
                                strategy={strategies[showDetailStrategy]}
                            />
                        )}
                    </div>
                </div>
            </QueryClientProvider>
        </WagmiProvider>
    );
}

export default App;