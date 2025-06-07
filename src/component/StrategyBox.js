import React, { useState } from 'react';
// import risk0 from './image/risk_0.png';
// import risk1 from './image/risk_1.png';
// import risk2 from './image/risk_2.png';
import { useDispatch } from 'react-redux';
import { setShowDetailStrategy } from '../redux/counterSlice';
import arbitrum_logo from './image/arbitrum-logo.png';
import ethereum_logo from './image/ethereum-logo.png';

const logoChains = {
    "Ethereum": ethereum_logo,
    "Arbitrum": arbitrum_logo,
};

const ctx = document.createElement("canvas").getContext("2d");
ctx.font = "22px sans-serif";


// const riskImages = [risk0, risk1, risk2];
const riskSvgs = [
    <div className="Strategies__RiskWrapper-sc-1mxapcq-47 hpZAbm StyledTooltip-sc-u72fp7-0 gSFEbY"><div className="Strategies__RiskBackground-sc-1mxapcq-48 fpXYGW"><svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="SignalCellularAltIcon"><path d="M17 4h3v16h-3zM5 14h3v6H5zm6-5h3v11h-3z"></path></svg></div><div className="Strategies__RiskIcon-sc-1mxapcq-49 hAhMcV"><svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv-green" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="SignalCellularAlt1BarIcon"><path d="M5 14h3v6H5v-6z"></path></svg></div><div className="Strategies__RiskTitle-sc-1mxapcq-50 rmrEZ"></div></div>,
    <div className="Strategies__RiskWrapper-sc-1mxapcq-47 hpZAbm StyledTooltip-sc-u72fp7-0 gSFEbY"><div className="Strategies__RiskBackground-sc-1mxapcq-48 fpXYGW"><svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="SignalCellularAltIcon"><path d="M17 4h3v16h-3zM5 14h3v6H5zm6-5h3v11h-3z"></path></svg></div><div className="Strategies__RiskIcon-sc-1mxapcq-49 gNESCe"><svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv-orange" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="SignalCellularAlt2BarIcon"><path d="M5 14h3v6H5v-6zm6-5h3v11h-3V9z"></path></svg></div><div className="Strategies__RiskTitle-sc-1mxapcq-50 rmrEZ"></div></div>,
    <div className="Strategies__RiskWrapper-sc-1mxapcq-47 hpZAbm StyledTooltip-sc-u72fp7-0 gSFEbY"><div className="Strategies__RiskBackground-sc-1mxapcq-48 fpXYGW"><svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="SignalCellularAltIcon"><path d="M17 4h3v16h-3zM5 14h3v6H5zm6-5h3v11h-3z"></path></svg></div><div className="Strategies__RiskIcon-sc-1mxapcq-49 jNFwcD"><svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv-red" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="SignalCellularAltIcon"><path d="M17 4h3v16h-3zM5 14h3v6H5zm6-5h3v11h-3z"></path></svg></div><div className="Strategies__RiskTitle-sc-1mxapcq-50 rmrEZ"></div></div>
];

const backgroundColorTag = {
    "Yield Maximizing": "#228b22",
    "Δ Neutral": "#5d869e",
    "GMX": "#5d8612",
};

const witdhTag = {
    "Yield Maximizing": 95.19,
    "Δ Neutral": 59.6,
    "GMX": 40,
};

const levelRows = [20, 45, 60, 120, 160];

function StrategyBox({ info }) {
    const [showRiskBox, setShowRiskBox] = useState(false);
    const dispatch = useDispatch();

    function getRiskSvg(riskIndex) {
        return riskSvgs[riskIndex] || riskSvgs[0];
    }

    return (
        <div
            className="strategy_box"
            style={{
                top: `${30 + (Math.floor(info.index / 2) * 48)}%`,
                left: `${20 + ((info.index % 2) * 26)}%`,
                width: "25%",
                height: "46%",
                position: 'absolute',
                backgroundColor: '#292938',
                color: 'white',
                borderRadius: '10px',
            }}
        >
            <div
                className='strategy_box_name'
                style={{
                    fontFamily: 'sans-serif',
                    fontSize: '22px',
                    position: 'absolute',
                    top: `${levelRows[0]}px`,
                    left: '20px',
                }}
            >
                {info.name}
            </div>

            {info.lever && <div
                className='strategy_box_lever'
                style={{
                    fontFamily: 'open-sans, sans-serif',
                    fontWeight: '600',
                    fontSize: '12px',
                    color: "white",
                    width: '27.48px',
                    height: '22px',
                    backgroundColor: '#05a47b',
                    borderRadius: '3px',
                    position: 'absolute',
                    top: `${levelRows[0]}px`,
                    left: `${ctx.measureText(info.name).width + 25}px`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {info.lever + "x"}
            </div>}

            <div
                className='strategy_box_risk'
                style={{
                    position: 'absolute',
                    top: `${levelRows[0] - 2}px`,
                    right: '30px',
                }}
                onMouseEnter={() => setShowRiskBox(true)}
                onMouseLeave={() => setShowRiskBox(false)}
            >
                {getRiskSvg(info.risk)}
                {showRiskBox && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '27px',
                            left: '-10px',
                            width: '150px',
                            padding: '10px',
                            backgroundColor: '#3d3e54',
                            border: 'none',
                            borderRadius: '5px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            zIndex: 2,
                            color: 'white',
                            fontSize: '10px',
                        }}
                    >
                        This is the risk information.
                    </div>
                )}
            </div>

            <div className='strategy_box_logo'>
                <img alt={info.chain} src={logoChains[info.chain]}
                    style={{
                        position: 'absolute',
                        top: `${levelRows[1]}px`,
                        left: '20px',
                        width: '15px',
                        height: '15px',
                    }}
                />
            </div>

            <div
                className='strategy_box_chain'
                style={{
                    position: 'absolute',
                    top: `${levelRows[1]}px`,
                    left: '40px',
                    fontSize: '12px',
                    fontFamily: 'open-sans, sans-serif',
                }}
            >
                {info.chain}
            </div>

            <div
                className='strategy_box_apr'
                style={{
                    position: 'absolute',
                    top: `${levelRows[2]}px`,
                    left: '20px',
                }}
            >
                <div
                    style={{
                        fontSize: '40px',
                        color: 'rgb(143, 201, 66)',
                        position: 'absolute',
                    }}
                >
                    {info.apr + "%"}
                </div>
                <div
                    style={{
                        fontSize: '14px',
                        color: 'white',
                        position: 'absolute',
                        top: '26px',
                        left: '135px',
                    }}
                >
                    {"APR"}
                </div>
            </div>

            <div
                className='strategy_box_avg_apy_30_day'
                style={{
                    position: 'absolute',
                    top: `${levelRows[2] + 11}px`,
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
                    {info.avg_apy_30_day + "%"}
                </div>
            </div>

            <div
                className='strategy_box_tags'
                style={{
                    position: 'absolute',
                    top: `${levelRows[3]}px`,
                    left: '20px',
                    display: 'flex',
                    gap: '5px',
                }}
            >
                {info.tags.map((tag, index) => (
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

            <div
                className='strategy_box_collateral'
                style={{
                    position: 'absolute',
                    top: `${levelRows[4]}px`,
                    left: '20px',
                }}
            >
                <div
                    style={{
                        fontSize: '12px',
                        color: '#606375'
                    }}
                >
                    Collateral
                </div>
                <div
                    style={{
                        fontSize: '16px',
                        color: 'white'
                    }}
                >
                    {info.collateral}
                </div>

            </div>

            <div
                className='strategy_box_debt'
                style={{
                    position: 'absolute',
                    top: `${levelRows[4]}px`,
                    right: '20px',
                }}
            >
                <div
                    style={{
                        fontSize: '12px',
                        color: '#606375'
                    }}
                >
                    Debt
                </div>
                <div
                    style={{
                        fontSize: '16px',
                        color: 'white'
                    }}
                >
                    {info.debt}
                </div>
            </div>

            <div
                style={{
                    position: 'absolute',
                    top: '80%',
                    left: '5%',
                    width: '90%',
                    height: '40px',
                }}
            >
                <button
                    style={{
                        backgroundColor: '#565a69',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        width: '100%',
                        height: '100%',
                    }}
                    onClick={() => {
                        dispatch(setShowDetailStrategy(info));
                    }}
                >
                    Create Position
                </button>
            </div>
        </div>
    );
}

export default StrategyBox;