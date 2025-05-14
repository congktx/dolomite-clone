import React from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi"


const Wallet = () => {
    const { address } = useAccount()
    const { connectors, connect } = useConnect()
    const { disconnect } = useDisconnect()

    return (
        <div
            className="wallet"
            style={{
                position: "absolute",
                top: "0%",
                left: "75%",
            }}
        >
            {address ? (
                <button
                    className="info_wallet"
                    onClick={() => disconnect()}
                    style={{
                        backgroundColor: "#292938",
                        color: "white",
                        border: "none",
                        borderRadius: "10px",
                        padding: "10px",
                        margin: "5px",
                        position: "absolute",
                        top: "0px",
                        left: "75%",
                        transform: "translate(-50 %, -50 %)",
                    }}
                >
                    {address} Disconnect
                </button>
            ) : (
                connectors.map((connector, index) =>
                    connector.name === "MetaMask" ? (
                        <button
                            key={`${index}_wallet`}
                            onClick={() => connect({ connector })}
                            style={{
                                backgroundColor: "#292938",
                                color: "white",
                                border: "none",
                                borderRadius: "10px",
                                padding: "10px",
                                margin: "5px",
                                position: "absolute",
                                top: "0px",
                                left: "75%",
                                transform: "translate(-50 %, -50 %)",
                            }}
                        >
                            {connector.name}
                        </button>
                    ) : (<></>)
                )
            )}
        </div>
    )
};

export default Wallet;