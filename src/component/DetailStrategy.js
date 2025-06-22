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
import { API_URL } from '../config/secrect';

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
    "Arbitrage": "#228b22",
    "Lending": "#5d869e",
    "Loop": "#228b22",
};

const witdhTag = {
    "Arbitrage": 70.19,
    "Lending": 59.6,
    "Loop": 40,
};

// const riskSvgs = [
//     <div className="Strategies__RiskWrapper-sc-1mxapcq-47 hpZAbm StyledTooltip-sc-u72fp7-0 gSFEbY"><div className="Strategies__RiskBackground-sc-1mxapcq-48 fpXYGW"><svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="SignalCellularAltIcon"><path d="M17 4h3v16h-3zM5 14h3v6H5zm6-5h3v11h-3z"></path></svg></div><div className="Strategies__RiskIcon-sc-1mxapcq-49 hAhMcV"><svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv-green" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="SignalCellularAlt1BarIcon"><path d="M5 14h3v6H5v-6z"></path></svg></div><div className="Strategies__RiskTitle-sc-1mxapcq-50 rmrEZ"></div></div>,
//     <div className="Strategies__RiskWrapper-sc-1mxapcq-47 hpZAbm StyledTooltip-sc-u72fp7-0 gSFEbY"><div className="Strategies__RiskBackground-sc-1mxapcq-48 fpXYGW"><svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="SignalCellularAltIcon"><path d="M17 4h3v16h-3zM5 14h3v6H5zm6-5h3v11h-3z"></path></svg></div><div className="Strategies__RiskIcon-sc-1mxapcq-49 gNESCe"><svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv-orange" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="SignalCellularAlt2BarIcon"><path d="M5 14h3v6H5v-6zm6-5h3v11h-3V9z"></path></svg></div><div className="Strategies__RiskTitle-sc-1mxapcq-50 rmrEZ"></div></div>,
//     <div className="Strategies__RiskWrapper-sc-1mxapcq-47 hpZAbm StyledTooltip-sc-u72fp7-0 gSFEbY"><div className="Strategies__RiskBackground-sc-1mxapcq-48 fpXYGW"><svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="SignalCellularAltIcon"><path d="M17 4h3v16h-3zM5 14h3v6H5zm6-5h3v11h-3z"></path></svg></div><div className="Strategies__RiskIcon-sc-1mxapcq-49 jNFwcD"><svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv-red" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="SignalCellularAltIcon"><path d="M17 4h3v16h-3zM5 14h3v6H5zm6-5h3v11h-3z"></path></svg></div><div className="Strategies__RiskTitle-sc-1mxapcq-50 rmrEZ"></div></div>
// ];

const descriptions = {
    "Loop Lending WETH-WBTC": "This strategy automatically optimizes yield by using WETH as collateral and borrowing WBTC through the Aave protocol. By utilizing flash loans and a looping technique, the strategy repeatedly deposits and borrows to maximize the leverage ratio. The entire process is automated, transparent, and decentralized, allowing users to earn profits by taking advantage of interest rate differences between the collateral and the borrowed asset.",
    "Arbitrage Lending USDC-WETH": "This strategy automates a cross-market leverage loop between USDC and WETH using two separate Silo V1 lending pools. By repeatedly supplying USDC in one pool and borrowing WETH, then supplying the borrowed WETH in another pool to borrow USDC again, it builds a cyclical leveraged position across both assets. The loop is executed multiple times to maximize capital efficiency and potential yield, enabling users to benefit from interest rate differentials. All operations are fully automated, with built-in cooldowns and safety controls for reliable and decentralized execution.",
};

const risks = {
    "Loop Lending WETH-WBTC": "By using leverage through repeated deposit-and-borrow loops, it becomes susceptible to liquidation if the price of WETH drops or the borrowing rate for WBTC rises sharply. Moreover, it relies heavily on smart contracts from Aave and flash loan providers, meaning that any bug, vulnerability, or technical failure could result in a total loss of user funds. Interest rate fluctuations, inaccurate price oracles, Ethereum network congestion (leading to high gas fees), and the complexity of interacting with multiple protocols (composability risk) further contribute to the potential downsides.",
    "Arbitrage Lending USDC-WETH": "The repeated borrowing and supplying between two Silo V1 lending pools creates a highly leveraged position that is sensitive to price fluctuations and interest rate changes on both USDC and WETH. A significant drop in WETH price or a sharp increase in borrowing rates could trigger liquidation or result in negative yield. The reliance on two separate lending pools increases composability risk—any failure or mispricing in one pool can cascade across the entire position. Additionally, oracle manipulation, or flash loan vulnerabilities may lead to loss of funds.",
};

const calculateDaysAgo = (days) => {
    let date = parseInt(Date.now());
    date -= days * 24 * 60 * 60 * 1000;
    return new Date(date).toISOString().split('T')[0];
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div
                style={{
                    position: 'absolute',
                    top: '-10px',
                    left: '100%',
                    width: '150px',
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
                {calculateDaysAgo(31 - label) + `:    ${payload[0].value.toFixed(2)}%`}
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
    const [currentAction, setCurrentAction] = useState(null);
    const [currentAmount, setCurrentAmount] = useState(0);
    const [collateralChangeRate, setCollateralChangeRate] = useState('0%');
    const [debtChangeRate, setDebtChangeRate] = useState('0%');

    const { address: userAddress } = useAccount();
    const chainId = useChainId();
    const { writeContract, isSuccess, error } = useWriteContract();
    const publicClient = usePublicClient();

    const handleDeposit = async () => {
        try {
            if (chainId !== strategy.strategy_chain_id) {
                alert(`Please switch to ${strategy.chain} network.`);
                return;
            }
            setCurrentAction('deposit');
            setCurrentAmount(parseFloat(document.querySelector('.input_deposit_amount').value));
            writeContract({
                address: strategy.vault_address,
                abi: VaultABI,
                functionName: 'deposit',
                args: [currentAmount, 0, 0],
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
            setCurrentAction('withdraw');
            setCurrentAmount(parseFloat(document.querySelector('.input_withdraw_amount').value));
            writeContract({
                address: strategy.vault_address,
                abi: VaultABI,
                functionName: 'withdraw',
                args: [currentAmount, 0],
            });
        } catch (error) {
            console.error("Error withdrawing:", error);
            alert("Error withdrawing.");
        }
    }

    useEffect(() => {
        if (isSuccess) {
            alert("Transaction successful!");
            fetch(`${API_URL}/user/activity`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        address: userAddress,
                        action: {
                            strategy_name: strategy.name,
                            type: currentAction,
                            amount: currentAmount,
                        }
                    }),
                }
            ).then(response => response.json())
                .then(data => console.log("Activity logged:", data))
                .catch(error => console.error("Error logging activity:", error))
        } else if (error) {
            console.error("Transaction failed:", error);
            alert("Transaction failed: " + error.message);
        }
    },
        [isSuccess, error]);

    const getMaxDepositAmount = async () => {
        try {
            const balance = await publicClient.readContract({
                address: strategy.collateral_address,
                abi: ERC20ABI,
                functionName: 'balanceOf',
                args: [userAddress],
            });
            console.log("Balance:", balance);

            const decimals = await publicClient.readContract({
                address: strategy.collateral_address,
                abi: ERC20ABI,
                functionName: 'decimals',
                args: [],
            });
            console.log("Decimals:", decimals);

            let maxDepositAmount = parseFloat(parseFloat(balance) / (10 ** parseFloat(decimals))).toFixed(10);
            document.querySelector('.input_deposit_amount').value = maxDepositAmount;
        } catch (error) {
            console.error("Error fetching max deposit:", error);
        }
    };

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

            let maxWithdrawAmount = parseFloat(totalSupply > 0 ? (balance / totalSupply) * totalAssets : 0).toFixed(10);
            document.querySelector('.input_withdraw_amount').value = maxWithdrawAmount;
        } catch (error) {
            console.error("Error fetching balance:", error);
        }
    };

    useEffect(() => {
        let collateralAddress = strategy.collateral_address;
        if (collateralAddress === "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8") {
            collateralAddress = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1";
        }
        fetch(`${API_URL}/token/change-rate?token_address=${collateralAddress}&chain_id=${strategy.strategy_chain_id}`)
            .then(response => response.json())
            .then(data => {
                if (data.changeRate[0] !== '-') {
                    document.querySelector('.collateral-change-rate').style.color = 'green';
                } else {
                    data.changeRate = data.changeRate.slice(1);
                    document.querySelector('.collateral-change-rate').style.color = 'red';
                }
                setCollateralChangeRate(data.changeRate);
            })
            .catch(error => console.error('Error fetching collateral change rate:', error));

        fetch(`${API_URL}/token/change-rate?token_address=${strategy.debt_address}&chain_id=${strategy.strategy_chain_id}`)
            .then(response => response.json())
            .then(data => {
                if (data.changeRate[0] !== '-') {
                    document.querySelector('.debt-change-rate').style.color = 'green';
                } else {
                    data.changeRate = data.changeRate.slice(1);
                    document.querySelector('.debt-change-rate').style.color = 'red';
                }
                setDebtChangeRate(data.changeRate);
            })
            .catch(error => console.error('Error fetching debt change rate:', error));

        fetch(`${API_URL}/strategy/apr-history?strategy_index=${strategy._i}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 31) {
                    data = data.slice(-31);
                }
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

        const dotIndex = newValue.indexOf('.');
        if (newValue.length - 1 - dotIndex > 10 && dotIndex !== -1) {
            newValue = newValue.slice(0, dotIndex + 11);
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
                            <img alt={strategy.chain} src={logoChains[strategy.chain]} style={{ width: '17px', height: '17px', marginRight: '5px' }} />
                        </div>
                        <div className="detail_strategy_chain">
                            {strategy.chain}
                        </div>
                        {/* <div className="detail_strategy_risk"
                            style={{
                                position: 'absolute',
                                left: '120%',
                                display: 'flex',
                            }}
                        >
                            Risk:
                            {riskSvgs[strategy.risk]}
                        </div> */}
                        {/* <div className="detail_strategy_oracle"
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
                        </div> */}
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
                        {strategy.tags.map((tag, index) => (
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
                        ))}
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
                            top: '75%',
                            left: '3%',
                            color: 'white',
                            fontSize: '17px',
                            display: 'flex',
                            gap: '5px',
                        }}
                    >
                        Health factor :
                        <div
                            style={{ color: 'green' }}
                        >
                            {strategy.health_factor !== null ? strategy.health_factor.toString().slice(0, 4) : "N/A"}
                        </div>
                    </div>
                    {/* <div
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
                                {strategy.health_factor !== null ? strategy.health_factor.toString().slice(0, 4) : "N/A"}
                            </span>
                        </div>
                    </div> */}

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
                        top: '10%',
                        left: '46%',
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
                        placeholder="0.0000000000"
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
                        onClick={getMaxDepositAmount}
                    >
                        Max
                    </button>
                </div>

                <div
                    className='wrap_withdraw'
                    style={{
                        position: 'absolute',
                        top: '29%',
                        left: '46%',
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
                        placeholder="0.0000000000"
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

                <div
                    className="token-change-rate"
                    style={{
                        position: 'absolute',
                        top: '47%',
                        left: '46%',
                        width: '50%',
                        height: 'fit-content',
                        fontSize: '16px',
                        color: 'white',
                    }}
                >
                    <div style={{ position: 'absolute', width: 'fit-content' }}>1 HRS TOKEN CHANGE RATE</div>
                    <div style={{ position: 'absolute', width: 'fit-content', top: '20px' }}>{strategy.collateral}</div>
                    <div className='collateral-change-rate' style={{ position: 'absolute', width: 'fit-content', top: '20px', left: '60px' }}>{collateralChangeRate}</div>
                    <div style={{ position: 'absolute', width: 'fit-content', top: '40px' }}>{strategy.debt}</div>
                    <div className='debt-change-rate' style={{ position: 'absolute', width: 'fit-content', top: '40px', left: '60px' }}>{debtChangeRate}</div>
                </div>

                <div
                    className='wrap-text'
                    style={{
                        position: 'absolute',
                        top: '410px',
                        left: '2%',
                        width: '96%',
                        height: 'fit-content',
                    }}
                >
                    <div
                        className='description-strategy-title'
                        style={{
                            width: 'fit-content',
                            height: 'fit-content',
                            color: 'white',
                            fontSize: '18px',
                            fontWeight: 'bold',
                        }}
                    >
                        Why the Strategy Works
                    </div>
                    <div
                        className='description-strategy'
                    >
                        <div
                            style={{
                                width: '100%',
                                height: 'fit-content',
                                color: 'white',
                                fontSize: '14px',
                                overflowY: 'auto',
                                textAlign: 'left'
                            }}
                        >
                            {descriptions[strategy.name] || ""}
                        </div>
                    </div>

                    <div
                        className='risk-title'
                        style={{
                            width: 'fit-content',
                            height: 'fit-content',
                            color: 'white',
                            fontSize: '18px',
                            fontWeight: 'bold',
                        }}
                    >
                        Risks
                    </div>
                    <div
                        className='risk-strategy'
                    >
                        <div
                            style={{
                                width: '100%',
                                height: 'fit-content',
                                color: 'white',
                                fontSize: '14px',
                                overflowY: 'auto',
                                textAlign: 'left'
                            }}
                        >
                            {risks[strategy.name] || ""}
                        </div>
                    </div>
                </div>

            </div>
        </div >
    );
};

export default DetailStrategy;