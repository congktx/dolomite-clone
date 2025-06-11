import React, { use, useEffect, useState } from 'react';
import '../styles/HistoryPanel.css';
import { useAccount } from 'wagmi';
import { API_URL } from '../config/secrect';

function HistoryPanel() {
    const { address: userAddress } = useAccount();
    const [historyData, setHistoryData] = useState([]);

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    useEffect(() => {
        const fetchHistory = async () => {
            if (!userAddress) return;

            try {
                const response = await fetch(`${API_URL}/user/activity?address=${userAddress}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setHistoryData(data);
            } catch (error) {
                console.error('Error fetching history:', error);
            }
        };

        fetchHistory();
    }
        , [userAddress]);

    return (
        <div
            className="history-panel"
            style={{
                position: "absolute",
                top: "24%",
                right: "4%",
            }}
        >
            <div className="history-header">
                <h2>User History <span className="info-icon">ⓘ</span></h2>
            </div>

            <div className="action-list-header">
                <div className="action-label">Action</div>
                <div className="amount-label">Amount</div>
            </div>

            <div className="action-list">
                {historyData.map((action, index) => (
                    <div className="action-item" key={index}>
                        <div className="action-info">
                            <div className="action-details">
                                <div className="amount-strategy-name">{action.action.strategy_name}</div>
                                <div className="amount-type">{action.action.type}</div>
                            </div>
                        </div>
                        <div className="action-amount-time">
                            <div className="action-amount">{action.action.amount}</div>
                            <div className="action-value">{formatTimestamp(action.timestamp)}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HistoryPanel; 