import React, { useRef, useState, useEffect, use } from 'react';
import { useDispatch } from 'react-redux';
import { setShowDetailStrategy } from '../redux/counterSlice';
import { LineChart, Line, Tooltip } from 'recharts';
import '../styles/RainbowBorder.css';
import arbitrum_logo from './image/arbitrum-logo.png';
import ethereum_logo from './image/ethereum-logo.png';
import { useAccount, useChainId, usePublicClient, useReadContract, useWriteContract } from 'wagmi';
import StrategyABI from '../abi/strategy.json';
import VaultABI from '../abi/vault.json';
import ERC20ABI from '../abi/erc20.json';

const ctx = document.createElement("canvas").getContext("2d");
ctx.font = "32px sans-serif";

const data = [10.5, 20.3, 15.7, 25.1, 18.9, 10.5, 20.3, 15.7, 25.1, 18.9, 10.5, 20.3, 15.7, 25.1, 18.9].map((value) => ({
    value: value,
}));

const logoChains = {
    "Ethereum": ethereum_logo,
    "Arbitrum": arbitrum_logo,
};

const backgroundColorTag = {
    "Yield Maximizing": "#228b22",
    "Δ Neutral": "#5d869e",
};

const witdhTag = {
    "Yield Maximizing": 95.19,
    "Δ Neutral": 59.6,
};

const riskSvgs = [
    <div className="Strategies__RiskWrapper-sc-1mxapcq-47 hpZAbm StyledTooltip-sc-u72fp7-0 gSFEbY"><div className="Strategies__RiskBackground-sc-1mxapcq-48 fpXYGW"><svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="SignalCellularAltIcon"><path d="M17 4h3v16h-3zM5 14h3v6H5zm6-5h3v11h-3z"></path></svg></div><div className="Strategies__RiskIcon-sc-1mxapcq-49 hAhMcV"><svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv-green" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="SignalCellularAlt1BarIcon"><path d="M5 14h3v6H5v-6z"></path></svg></div><div className="Strategies__RiskTitle-sc-1mxapcq-50 rmrEZ"></div></div>,
    <div className="Strategies__RiskWrapper-sc-1mxapcq-47 hpZAbm StyledTooltip-sc-u72fp7-0 gSFEbY"><div className="Strategies__RiskBackground-sc-1mxapcq-48 fpXYGW"><svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="SignalCellularAltIcon"><path d="M17 4h3v16h-3zM5 14h3v6H5zm6-5h3v11h-3z"></path></svg></div><div className="Strategies__RiskIcon-sc-1mxapcq-49 gNESCe"><svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv-orange" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="SignalCellularAlt2BarIcon"><path d="M5 14h3v6H5v-6zm6-5h3v11h-3V9z"></path></svg></div><div className="Strategies__RiskTitle-sc-1mxapcq-50 rmrEZ"></div></div>,
    <div className="Strategies__RiskWrapper-sc-1mxapcq-47 hpZAbm StyledTooltip-sc-u72fp7-0 gSFEbY"><div className="Strategies__RiskBackground-sc-1mxapcq-48 fpXYGW"><svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="SignalCellularAltIcon"><path d="M17 4h3v16h-3zM5 14h3v6H5zm6-5h3v11h-3z"></path></svg></div><div className="Strategies__RiskIcon-sc-1mxapcq-49 jNFwcD"><svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv-red" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="SignalCellularAltIcon"><path d="M17 4h3v16h-3zM5 14h3v6H5zm6-5h3v11h-3z"></path></svg></div><div className="Strategies__RiskTitle-sc-1mxapcq-50 rmrEZ"></div></div>
];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div
                style={{
                    position: 'absolute',
                    top: '-10px',
                    left: '100%',
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#292938',
                    fontSize: '12px',
                    color: 'white',
                    // border: 'none',
                    // borderRadius: '5px',
                    // boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}
            >
                {/* <p style={{ margin: 0, fontWeight: 'bold' }}>{`Điểm: ${label}`}</p> */}
                {/* <p style={{ margin: 0, color: '#8884d8' }}>{`${payload[0].value.toFixed(2)}%`}</p> */}
                {`${payload[0].value.toFixed(2)}%`}
            </div>
        );
    }
    return null;
};

const DetailStrategy = ({ strategy }) => {
    const dispatch = useDispatch();

    const chartContainerRef = useRef(null);
    const [chartSize, setChartSize] = useState({ width: 0, height: 0 });
    const [chartData, setChartData] = useState(data);

    const { address: userAddress, isConnected } = useAccount();
    const chainId = useChainId();
    const { writeContract, isPending, isSuccess, error } = useWriteContract();
    const publicClient = usePublicClient();

    const handleDeposit = async () => {
        try {
            if (chainId !== strategy.strategy_chain_id) {
                alert(`Please switch to ${strategy.chain} network.`);
                return;
            }
            writeContract({
                address: strategy.vault_address,
                abi: VaultABI,
                functionName: 'deposit',
                args: [parseFloat(document.querySelector('.input_deposit_amount').value), 0, 0],
            });
        } catch (error) {
            console.error("Error depositing:", error);
            alert("Error depositing.");
        }
    }

    const handleWithdraw = async () => {
        try {
            if (chainId !== strategy.strategy_chain_id) {
                alert(`Please switch to ${strategy.chain} network.`);
                return;
            }
            writeContract({
                address: strategy.vault_address,
                abi: VaultABI,
                functionName: 'withdraw',
                args: [parseFloat(document.querySelector('.input_withdraw_amount').value), 0],
            });
        } catch (error) {
            console.error("Error withdrawing:", error);
            alert("Error withdrawing.");
        }
    }

    useEffect(() => {
        if (isSuccess) {
            alert("Transaction successful!");
        } else if (error) {
            console.error("Transaction failed:", error);
            alert("Transaction failed: " + error.message);
        }
    },
        [isSuccess, error]);

    const getMaxWithdrawAmount = async () => {
        try {
            const balance = await publicClient.readContract({
                address: strategy.strategy_address,
                abi: StrategyABI,
                functionName: 'getBalanceOf',
                args: [userAddress],
            });
            console.log("Balance:", balance);

            const totalSupply = await publicClient.readContract({
                address: strategy.strategy_address,
                abi: StrategyABI,
                functionName: 'getTotalSupply',
                args: [],
            });
            console.log("Total supply:", totalSupply);

            const totalAssets = await publicClient.readContract({
                address: strategy.strategy_address,
                abi: StrategyABI,
                functionName: 'getTotalAssets',
                args: [],
            });
            console.log("Total assets:", totalAssets);

            let maxWithdrawAmount = parseFloat(totalSupply > 0 ? (balance / totalSupply) * totalAssets : 0);
            document.querySelector('.input_withdraw_amount').value = maxWithdrawAmount;
        } catch (error) {
            console.error("Error fetching balance:", error);
        }
    };

    useEffect(() => {
        fetch(`http://localhost:8000/strategy/apr-history?strategy_index=${strategy._i}`)
            .then(response => response.json())
            .then(data => {
                setChartData(data.map(item => ({ value: parseFloat((item.apr * 100).toFixed(2)) })));
            })
            .catch(error => console.error('Error fetching strategies:', error));

        const updateChartSize = () => {
            if (chartContainerRef.current) {
                const { offsetWidth, offsetHeight } = chartContainerRef.current;
                setChartSize({
                    width: offsetWidth,
                    height: offsetHeight,
                });
            }
        };
        updateChartSize();
        const lineChart = document.querySelector('.wrap_line_chart');
        lineChart.addEventListener('resize', updateChartSize);
    }, []);

    const handleInputChange = (e) => {
        let newValue = e.target.value;

        newValue = newValue.replace(/[^0-9.]/g, '');

        const parts = newValue.split('.');
        if (parts.length > 2) {
            newValue = parts[0] + '.' + parts.slice(1).join('');
        }

        document.querySelector(`.${e.target.className}`).value = newValue;
    };

    return (
        <div
            className="wrap_detail_strategy"
            style={{
                position: 'absolute',
                top: '0%',
                left: '0%',
                width: '100%',
                height: '100%',
            }}
        >
            <div className="rainbow-border"></div>

            <div
                className="detail_strategy"
                style={{
                    position: 'absolute',
                    top: '5%',
                    left: '30%',
                    width: '50vw',
                    height: '90vh',
                    backgroundColor: '#292938',
                    zIndex: 5,
                    border: 'none',
                    borderRadius: '6px',
                }}
            >
                <button
                    className='close_button'
                    style={{
                        position: 'absolute',
                        top: '0%',
                        right: '0%',
                        cursor: 'pointer',
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: 'white',
                    }}
                    onClick={() => {
                        dispatch(setShowDetailStrategy(null));
                    }}
                >
                    X
                </button>

                <div
                    className='detail_strategy_header'
                    style={{
                        position: 'absolute',
                        top: '2%',
                        left: '2%',
                        width: 'fit-content',
                        height: 'fit-content',
                    }}
                >
                    <div
                        className='detail_strategy_name'
                        style={{
                            fontFamily: 'sans-serif',
                            fontSize: '32px',
                            width: 'fit-content',
                            color: 'white',
                        }}
                    >
                        {strategy.name}
                    </div>

                    {strategy.lever && <div
                        className='strategy_box_lever'
                        style={{
                            fontFamily: 'open-sans, sans-serif',
                            fontWeight: '600',
                            fontSize: '14px',
                            color: "white",
                            width: '27.48px',
                            height: '30px',
                            backgroundColor: '#05a47b',
                            borderRadius: '3px',
                            position: 'absolute',
                            top: `1px`,
                            left: `${ctx.measureText(strategy.name).width + 5}px`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {strategy.lever + "x"}
                    </div>}

                    <div className='detail_strategy_subtitle'
                        style={{
                            position: 'absolute',
                            top: '120%',
                            left: '2%',
                            color: 'white',
                            fontSize: '1em',
                            display: 'flex',
                        }}
                    >
                        <div className='detail_strategy_logo'>
                            <img alt={strategy.chain} src={logoChains[strategy.chain]} style={{ width: '20px', height: '20px', marginRight: '5px' }} />
                        </div>
                        <div className="detail_strategy_chain">
                            {strategy.chain}
                        </div>
                        <div className="detail_strategy_risk"
                            style={{
                                position: 'absolute',
                                left: '120%',
                                display: 'flex',
                            }}
                        >
                            Risk:
                            {riskSvgs[strategy.risk]}
                        </div>
                        <div className="detail_strategy_oracle"
                            style={{
                                position: 'absolute',
                                left: '200%',
                                display: 'flex',
                            }}
                        >
                            Oracles
                            <div>
                                <svg className="MuiSvgIcon-root StyledTooltip__StyledInfoIcon-sc-u72fp7-1 iTqbcE" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div
                        className='strategy_box_tags'
                        style={{
                            position: 'absolute',
                            top: `200%`,
                            left: '2%',
                            display: 'flex',
                            gap: '5px',
                        }}
                    >
                        {/* {strategy.tags.map((tag, index) => (
                            <div
                                key={index}
                                style={{
                                    fontSize: '10px',
                                    color: 'white',
                                    backgroundColor: backgroundColorTag[tag] || '#5d869e',
                                    borderRadius: '5px',
                                    width: `${witdhTag[tag] || 59.6}px`,
                                    height: '18.6px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                {tag}
                            </div>
                        ))} */}
                    </div>
                </div>
                <div
                    className='wrap_chart_info'
                    style={{
                        position: 'absolute',
                        top: '20%',
                        left: '2%',
                        width: '40%',
                        height: '36%',
                        border: 'none',
                        borderRadius: '6px',
                        backgroundColor: '#2f2f40',
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            top: '3%',
                            left: '3%',
                            color: '#606375',
                            fontSize: '12px',
                            fontWeight: 'bold',
                        }}
                    >
                        Historical APR (31 Days)
                    </div>

                    <div
                        className='wrap_line_chart'
                        ref={chartContainerRef}
                        style={{
                            position: 'absolute',
                            top: '20%',
                            left: '2%',
                            width: '70%',
                            height: '80%',
                        }}
                    >
                        <LineChart
                            width={chartSize.width}
                            height={chartSize.height - 15}
                            data={chartData}
                        >
                            <Tooltip cursor={false} content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="white"
                                dot={false}
                                activeDot={{ r: 2 }}
                            />
                        </LineChart>
                    </div>

                    <div
                        className='strategy_box_avg_apy_30_day'
                        style={{
                            position: 'absolute',
                            top: `20%`,
                            right: '20px',
                        }}
                    >
                        <div
                            style={{
                                fontSize: '11px',
                                color: '#606375'
                            }}
                        >
                            {"30 Day Avg."}
                        </div>
                        <div
                            style={{
                                fontSize: '18px',
                                color: '#8fc942'
                            }}
                        >
                            {strategy.avg_apy_30_day + "%"}
                        </div>
                    </div>

                    <div
                        style={{
                            position: 'absolute',
                            top: '70%',
                            left: '3%',
                            color: '#606375',
                            fontSize: '12px',
                            fontWeight: 'bold',
                        }}
                    >
                        You earn:
                        <div
                            style={{
                                position: 'absolute',
                                top: '100%',
                                left: '0%',
                                color: 'white',
                                fontSize: '12px',
                                fontWeight: 'normal',
                                display: 'flex',
                                gap: '3px',
                            }}
                        >
                            <span>Staking</span>
                            <span>Yield:</span>
                            <span
                                style={{
                                    position: 'absolute',
                                    color: '#8fc942',
                                    left: '120%',
                                }}
                            >
                                44.08%
                            </span>
                        </div>
                        <div
                            style={{
                                position: 'absolute',
                                top: '200%',
                                left: '0%',
                                color: 'white',
                                fontSize: '12px',
                                fontWeight: 'normal',
                                display: 'flex',
                                gap: '3px',
                            }}
                        >
                            <span>+3.5</span>
                            <span>Reservoir</span>
                            <span>Points</span>
                        </div>
                    </div>

                    <div
                        style={{
                            position: 'absolute',
                            top: '70%',
                            right: '35%',
                            color: '#606375',
                            fontSize: '12px',
                            fontWeight: 'bold',
                        }}
                    >
                        You owe:
                        <div
                            style={{
                                position: 'absolute',
                                top: '100%',
                                left: '0%',
                                color: 'white',
                                fontSize: '12px',
                                fontWeight: 'normal',
                                display: 'flex',
                                gap: '3px',
                            }}
                        >
                            <span>{strategy.debt}</span>
                            <span>Borrow</span>
                            <span>APR:</span>
                            <span
                                style={{
                                    position: 'absolute',
                                    color: 'white',
                                    left: '110%',
                                }}
                            >
                                44.08%
                            </span>
                        </div>
                    </div>

                    <div
                        style={{
                            position: 'absolute',
                            color: '#606375',
                            fontSize: '12px',
                            bottom: '1%',
                            right: '3%',
                            display: 'flex',
                            gap: '3px',
                        }}
                    >
                        {String("Doflamingo 36%").split(" ").map((char, index) => {
                            return (
                                <span key={index}>{char}</span>
                            )
                        })}
                    </div>
                </div>

                <div
                    className='wrap_deposit'
                    style={{
                        position: 'absolute',
                        top: '3%',
                        right: '4%',
                        width: '50%',
                        height: '17%',
                        border: 'none',
                        borderRadius: '6px',
                        backgroundColor: 'transparent',
                        color: 'white',
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            top: '0%',
                            left: '0%',
                            fontSize: '20px',
                        }}
                    >
                        Deposit Amount
                    </div>
                    <input
                        className='input_deposit_amount'
                        type="text"
                        placeholder="0.0"
                        style={{
                            position: 'absolute',
                            top: '40px',
                            left: '0%',
                            width: '100%',
                            height: '40px',
                            borderRadius: '4px',
                            border: 'none',
                            fontSize: '16px',
                            color: 'white',
                            backgroundColor: '#1e1c29',
                        }}
                        onChange={handleInputChange}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            top: '48px',
                            right: '10px',
                        }}
                    >
                        {strategy.collateral}
                    </div>
                    <button
                        className='deposit_button'
                        style={{
                            position: 'absolute',
                            bottom: '0%',
                            right: '0%',
                            width: '20%',
                            height: '25%',
                            backgroundColor: '#565a69',
                            border: 'none',
                            borderRadius: '4px',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '11px',
                            cursor: 'pointer',
                        }}
                        onClick={handleDeposit}
                    >
                        Deposit
                    </button>
                    <button
                        style={{
                            position: 'absolute',
                            top: '23px',
                            right: '0%',
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: '#606375',
                            fontSize: '13px',
                            cursor: 'pointer',
                        }}
                    >
                        Max
                    </button>
                </div>

                <div
                    className='wrap_withdraw'
                    style={{
                        position: 'absolute',
                        top: '22%',
                        right: '4%',
                        width: '50%',
                        height: '17%',
                        border: 'none',
                        borderRadius: '6px',
                        backgroundColor: 'transparent',
                        color: 'white',
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            top: '0%',
                            left: '0%',
                            fontSize: '20px',
                        }}
                    >
                        Withdraw
                    </div>
                    <input
                        className='input_withdraw_amount'
                        type="text"
                        placeholder="0.0"
                        style={{
                            position: 'absolute',
                            top: '40px',
                            left: '0%',
                            width: '100%',
                            height: '40px',
                            borderRadius: '4px',
                            border: 'none',
                            fontSize: '16px',
                            color: 'white',
                            backgroundColor: '#1e1c29',
                        }}
                        onChange={handleInputChange}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            top: '48px',
                            right: '10px',
                        }}
                    >
                        {strategy.collateral}
                    </div>
                    <button
                        className='withdraw_button'
                        style={{
                            position: 'absolute',
                            bottom: '0%',
                            right: '0%',
                            width: '20%',
                            height: '25%',
                            backgroundColor: '#565a69',
                            border: 'none',
                            borderRadius: '4px',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '11px',
                            cursor: 'pointer',
                        }}
                        onClick={handleWithdraw}
                    >
                        Withdraw
                    </button>
                    <button
                        style={{
                            position: 'absolute',
                            top: '23px',
                            right: '0%',
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: '#606375',
                            fontSize: '13px',
                            cursor: 'pointer',
                        }}
                        onClick={getMaxWithdrawAmount}
                    >
                        Max
                    </button>
                </div>

            </div>
        </div >
    );
};

export default DetailStrategy;