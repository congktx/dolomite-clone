import React, { useEffect, useState } from 'react';
import './App.css';
import StrategyBox from './component/StrategyBox';
import DetailStrategy from './component/DetailStrategy';
import Wallet from './component/Wallet';
import ChainSwitch from './component/ChainSwitch';
import FilterStrategy from './component/FilterStrategy';
import HistoryPanel from './component/HistoryPanel';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, WagmiProvider, createConfig } from "wagmi";
import { mainnet, arbitrum, bsc } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";
import { useSelector } from 'react-redux';
import raumania_logo from "./component/image/raumania.png";
import { API_URL } from './config/secrect';
import { str } from 'ajv';

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

// let strategies = [
// {
//     name: "Strategy 1",
//     lever: 2,
//     risk: 0,
//     chain: "Arbitrum",
//     apr: 14.41,
//     avg_apy_30_day: 18.11,
//     tags: ["Yield Maximizing", "Δ Neutral", "GMX"],
//     collateral: "BNB",
//     debt: "USDC",
// }
// ];

const address_to_name = {
    42161: {
        "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1": "WETH",
        "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f": "WBTC",
        "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8": "USDC.e",
    },
};

const chain_id_to_name = {
    1: "Ethereum",
    42161: "Arbitrum",
    56: "BSC",
};

function App() {
    const filterAssets = useSelector((state) => state.counter.filterAssets);
    const selectedTags = useSelector((state) => state.counter.tags.selectedTags);
    const tagFilterType = useSelector((state) => state.counter.tags.filterType);
    const filters = useSelector((state) => state.counter.filters);
    const sort = useSelector((state) => state.counter.sort);
    const showDetailStrategy = useSelector((state) => state.counter.showDetailStrategy);

    const [strategies, setStrategies] = useState([]);

    const sortStrategies = (strategies, sortType) => {
        const sorted = strategies;
        // console.log("Sorting strategies with type:", sortType);

        if (sortType === 'current_apr_desc') {
            // console.log(sorted.sort((a, b) => b.apr - a.apr));
            return sorted.sort((a, b) => b.apr - a.apr);
        }
        if (sortType === 'current_apr_asc') {
            // console.log(sorted.sort((a, b) => a.apr - b.apr));
            return sorted.sort((a, b) => a.apr - b.apr);
        }
        if (sortType === 'avg_apr_30_desc') {
            // console.log(sorted.sort((a, b) => b.avg_apy_30_day - a.avg_apy_30_day));
            return sorted.sort((a, b) => b.avg_apy_30_day - a.avg_apy_30_day);
        }
        if (sortType === 'avg_apr_30_asc') {
            // console.log(sorted.sort((a, b) => a.avg_apy_30_day - b.avg_apy_30_day));
            return sorted.sort((a, b) => a.avg_apy_30_day - b.avg_apy_30_day);
        }
    };

    useEffect(() => {
        setStrategies(sortStrategies(strategies, sort));
    }
        , [sort, strategies]);

    useEffect(() => {
        async function fetchDataApp() {
            let strategies_data = [];
            await fetch(`${API_URL}/strategy/infos?strategy_index=ALL&token=ALL`)
                .then(response => response.json())
                .then(data => {
                    // console.log("Fetched strategies:", data);
                    data.forEach(element => {
                        let strategy_name = "";
                        if (element.strategy_index === 1) {
                            strategy_name = "Loop Lending WETH-WBTC";
                        }
                        else if (element.strategy_index === 2) {
                            strategy_name = "Arbitrage Lending USDC-WETH";
                        }
                        let tags = [];
                        if (element.strategy_index === 1) {
                            tags = ["Loop", "Lending"];
                        }
                        else if (element.strategy_index === 2) {
                            tags = ["Arbitrage", "Lending"];
                        }
                        strategies_data.push({
                            _i: element._i,
                            health_factor: element.data.health_factor,
                            name: strategy_name,
                            index: element.strategy_index - 1,
                            // lever: element.data.n_loop,
                            // risk: Math.floor(Math.random() * 3),
                            strategy_chain_id: element.strategy_chain_id,
                            vault_chain_id: element.vault_chain_id,
                            chain: chain_id_to_name[element.strategy_chain_id] || "Unknown",
                            apr: parseFloat((element.data.apr * 100).toFixed(2)),
                            avg_apy_30_day: 18.11,
                            tags: tags,
                            collateral_address: element.data.deposited_token || element.data.first_token,
                            debt_address: element.data.borrowed_token || element.data.second_token,
                            collateral: address_to_name[element.strategy_chain_id]?.[element.data.deposited_token || element.data.first_token] || "Unknown",
                            debt: address_to_name[element.strategy_chain_id]?.[element.data.borrowed_token || element.data.second_token] || "Unknown",
                            strategy_address: element.strategy_address,
                            vault_address: element.vault_address,
                        });
                    });
                })
                .catch(error => console.error('Error fetching strategies:', error));
            for (let i = 0; i < strategies_data.length; i++) {
                await fetch(`${API_URL}/strategy/apr-history?strategy_index=${strategies_data[i]._i}`)
                    .then(response => response.json())
                    .then(data => {
                        let avg = 0;
                        data.forEach(item => { avg += item.apr; });
                        avg /= data.length;
                        avg = parseFloat((avg * 100).toFixed(2));
                        strategies_data[i].avg_apy_30_day = avg;
                        // console.log(avg, strategies_data[i]._i);
                    })
                    .catch(error => console.error('Error fetching APR history:', error));
            }
            setStrategies(strategies_data);
            // console.log("Strategies after fetch:", strategies_data);
        }
        fetchDataApp();

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
                            {strategies
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
                                .map((strategy) => (
                                    <StrategyBox
                                        key={strategy.index}
                                        info={strategy}
                                    />
                                ))}
                        </div>
                        <FilterStrategy />
                        <ChainSwitch />
                        <Wallet />
                        <HistoryPanel />
                        {showDetailStrategy !== null && (
                            <DetailStrategy
                                strategy={showDetailStrategy}
                            />
                        )}
                    </div>
                </div>
            </QueryClientProvider>
        </WagmiProvider>
    );
}

export default App;