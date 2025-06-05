import React, { useEffect, useState } from "react";
import { useSwitchChain } from "wagmi"
import arbitrum_logo from "./image/arbitrum-logo.png"
import eth_logo from "./image/ethereum-logo.png"

const chainSupported = {
    1: "Ethereum",
    42161: "Arbitrum",
    56: "BSC"
};
const indexChain = {
    1: 0,
    42161: 1,
    56: 2,
};

const logoChain = {
    1: eth_logo,
    42161: arbitrum_logo,
    56: "https://cryptologos.cc/logos/bnb-bnb-logo.svg",
}

function ChainSwitch() {
    const { chains, switchChain } = useSwitchChain()
    const [selectedChain, setSelectedChain] = useState(1);
    const [clicked, setClicked] = useState(false);

    useEffect(() => {
        const storedChain = localStorage.getItem("selectedChain");
        if (storedChain) {
            setSelectedChain(parseInt(storedChain));
        }
        switchChain({ chainId: selectedChain });
    },
        [selectedChain]);

    return (
        <div
            className="chain_switch"
            style={{
                position: "absolute",
                top: "0%",
                right: "20.5%",
                width: "8%",
                height: "6%",
            }}
        >
            <button
                style={{
                    backgroundColor: "#292938",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    padding: "10px",
                    margin: "5px",
                    position: "absolute",
                    top: "0%",
                    right: "0%",
                    width: "100%",
                    height: "100%",
                    fontSize: "16px",
                    cursor: "pointer",
                }}
                onClick={() => { setClicked(!clicked); console.log("clicked", clicked); }}
            >
                <div style={{
                    position: "absolute",
                    top: "30%",
                    left: "14%",
                    fontSize: "16px",
                }}>
                    {chainSupported[selectedChain]}
                </div>
                <img alt="icon_wallet" src={logoChain[selectedChain]}
                    style={{
                        position: "absolute",
                        top: "27%",
                        right: "8%",
                        width: "20px",
                        height: "20px",
                    }}
                ></img>
            </button>

            {clicked === true ? chains.map((chain) =>
                (chainSupported[chain.id]) ? (
                    <button
                        className={`switch_chain_${chain.id}`}
                        key={chain.id}
                        style={{
                            backgroundColor: "#292938",
                            color: "white",
                            border: "none",
                            padding: "10px",
                            margin: "5px",
                            position: "absolute",
                            top: `${indexChain[chain.id] * 100 + 120}%`,
                            right: "0%",
                            width: "100%",
                            height: "100%",
                            fontSize: "16px",
                            cursor: "pointer",
                        }}
                        onClick={() => { setSelectedChain(chain.id); setClicked(false); localStorage.setItem("selectedChain", chain.id); }}
                        onMouseMove={() => { document.querySelector(`.switch_chain_${chain.id}`).style.opacity = "0.5" }}
                        onMouseLeave={() => { document.querySelector(`.switch_chain_${chain.id}`).style.opacity = "1" }}
                    >
                        <div style={{
                            position: "absolute",
                            top: "30%",
                            left: "14%",
                            fontSize: "16px",
                        }}>
                            {chainSupported[chain.id]}
                        </div>
                        <img alt="icon_wallet" src={logoChain[chain.id]}
                            style={{
                                position: "absolute",
                                top: "27%",
                                right: "8%",
                                width: "20px",
                                height: "20px",
                            }}
                        ></img>
                    </button>
                ) : (<></>)
            ) : (<></>)}
        </div>
    )
}

export default ChainSwitch;