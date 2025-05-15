import React from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi"
import metamask_logo from "./image/metamask-logo.png"

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
                right: "10%",
                width: "10%",
                height: "6%",
            }}
        >
            {address ? (
                <div>
                    <button
                        className="info_wallet"
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
                        }}
                    >
                        <div style={{
                            position: "absolute",
                            top: "30%",
                            left: "10%",
                            fontSize: "16px",
                        }}>
                            {address.slice(0, 6) + "..." + address.slice(-4)}
                        </div>
                        <img alt="icon_wallet" src={metamask_logo}
                            style={{
                                position: "absolute",
                                top: "27%",
                                right: "6%",
                                width: "20px",
                                height: "20px",
                            }}
                        ></img>
                    </button>

                    <button
                        className="disconnect_wallet"
                        style={{
                            backgroundColor: "#292938",
                            color: "white",
                            border: "none",
                            borderRadius: "10px",
                            padding: "10px",
                            margin: "5px",
                            position: "absolute",
                            top: "0%",
                            right: "-75%",
                            width: "70%",
                            height: "100%",
                            fontSize: "16px",
                            cursor: "pointer",
                        }}
                        onClick={() => disconnect()}
                        onMouseMove={() => { document.querySelector('.disconnect_wallet').style.backgroundColor = "red" }}
                        onMouseLeave={() => { document.querySelector('.disconnect_wallet').style.backgroundColor = "#292938" }}
                    >
                        Disconnect
                    </button>
                </div>
            ) : (
                connectors.map((connector, index) =>
                    connector.name === "MetaMask" ? (
                        <button
                            key={`${index}_wallet`}
                            onClick={() => connect({ connector })}
                            style={{
                                backgroundColor: "#68b04d",
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
                        >
                            Connect Wallet
                        </button>
                    ) : (<></>)
                )
            )
            }
        </div >
    )
};

export default Wallet;