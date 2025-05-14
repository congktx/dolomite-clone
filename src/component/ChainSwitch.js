import React, { useState } from "react";
import { useSwitchChain } from "wagmi"

const chainSupported = {
    1: "Ethereum",
    42_161: "Arbitrum",
};
const indexChain = {
    1: 0,
    42_161: 1,
};

function ChainSwitch() {
    const { chains, switchChain } = useSwitchChain()
    const [selectedChain, setSelectedChain] = useState(null);
    const [clicked, setClicked] = useState(false);

    return (
        <div
            className="chain_switch"
            style={{
                position: 'absolute',
                top: '0%',
                left: '65%',
                transform: 'translate(-50 %, -50 %)',
                backgroundColor: '#292938',
                color: 'white',
                borderRadius: '10px',
                padding: '5px',
                margin: '5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <button
                style={{
                    backgroundColor: "#292938",
                    color: "white",
                    border: "none",
                }}
                onClick={() => setClicked(!clicked)}
            >
                {chainSupported[selectedChain] ? chainSupported[selectedChain] : "Select Chain"}
            </button>
            {clicked === true ? chains.map((chain) =>
                (chainSupported[chain.id]) ? (
                    <button
                        key={chain.id}
                        style={{
                            position: "absolute",
                            top: `${indexChain[chain.id] * 25 + 30}px`,
                            left: "0%",
                            backgroundColor: "#292938",
                            color: "white",
                            border: "none",
                        }}
                        onClick={() => { switchChain({ chainId: chain.id }); setSelectedChain(chain.id); setClicked(false); }}
                    >
                        {chainSupported[chain.id]}
                    </button>
                ) : (<></>)
            ) : (<></>)}
        </div>
    )
}

export default ChainSwitch;