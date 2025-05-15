import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import '../styles/AssetFilter.css';
import {
    addFilterAssetsCollateral,
    removeFilterAssetsCollateral,
    addFilterAssetsDebt,
    removeFilterAssetsDebt
} from '../redux/counterSlice';

const TokenIcon = ({ type }) => {
    const getIcon = () => {
        switch (type) {
            case 'ETH':
                return (
                    <div className="token-icon eth-icon">
                        <span>m</span>
                    </div>
                );
            case 'DAI':
                return (
                    <div className="token-icon wst-icon">
                        <span>w</span>
                    </div>
                );
            case 'BNB':
                return (
                    <div className="token-icon gm-eth-icon">
                        <span>g</span>
                    </div>
                );
            case 'gmBTC':
                return (
                    <div className="token-icon gm-btc-icon">
                        <span>g</span>
                    </div>
                );
            case 'gmUNI-USD':
                return (
                    <div className="token-icon gm-uni-icon">
                        <span>g</span>
                    </div>
                );
            case 'gmLINK-USD':
                return (
                    <div className="token-icon gm-link-icon">
                        <span>g</span>
                    </div>
                );
            case 'PT-USDe':
                return (
                    <div className="token-icon pt-icon">
                        <span>P</span>
                    </div>
                );
            default:
                return null;
        }
    };

    return getIcon();
};

const tokens = {
    collateral: [
        { id: 'ETH', name: 'ETH', type: 'ETH' },
        { id: 'DAI', name: 'DAI', type: 'DAI' },
        { id: 'BNB', name: 'BNB', type: 'BNB' },
    ],
    debt: [
        { id: 'USDC', name: 'USDC', type: 'USDC' },
        { id: 'USDT', name: 'USDT', type: 'USDT' },
    ]
};

function AssetFilter({ onClose, position = { top: "50px", left: "50px" } }) {
    const [activeTab, setActiveTab] = useState('collateral');
    const [searchTerm, setSearchTerm] = useState('');
    const filterAssets = useSelector((state) => state.counter.filterAssets);
    const dispatch = useDispatch();

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSearchTerm('');
    };

    const toggleToken = (token) => {
        if (activeTab === 'collateral') {
            if (filterAssets.collateral.includes(token.id)) {
                dispatch(removeFilterAssetsCollateral(token.id));
            } else {
                dispatch(addFilterAssetsCollateral(token.id));
            }
        } else {
            if (filterAssets.debt.includes(token.id)) {
                dispatch(removeFilterAssetsDebt(token.id));
            } else {
                dispatch(addFilterAssetsDebt(token.id));
            }
        }
    };

    const handleClearSelection = () => {
        if (activeTab === 'collateral') {
            filterAssets.collateral.forEach(token =>
                dispatch(removeFilterAssetsCollateral(token))
            );
        } else {
            filterAssets.debt.forEach(token =>
                dispatch(removeFilterAssetsDebt(token))
            );
        }
    };

    const filteredTokens = tokens[activeTab].filter(token =>
        token.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedCount = activeTab === 'collateral'
        ? filterAssets.collateral.length
        : filterAssets.debt.length;

    const totalCount = filteredTokens.length;

    const isTokenSelected = (tokenId) => {
        return activeTab === 'collateral'
            ? filterAssets.collateral.includes(tokenId)
            : filterAssets.debt.includes(tokenId);
    };

    const handleClickOutside = (e) => {
        if (e.target.className === 'asset-filter-overlay') {
            onClose();
        }
    };

    return (
        <div className="asset-filter-overlay" onClick={handleClickOutside}>
            <div
                className="asset-filter-panel"
                style={{
                    top: position.top,
                    left: position.left
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="asset-filter-tabs">
                    <button
                        className={`tab ${activeTab === 'collateral' ? 'active' : ''}`}
                        onClick={() => handleTabChange('collateral')}
                    >
                        Collateral
                    </button>
                    <button
                        className={`tab ${activeTab === 'debt' ? 'active' : ''}`}
                        onClick={() => handleTabChange('debt')}
                    >
                        Debt
                    </button>
                </div>

                <div className="asset-filter-search">
                    <input
                        type="text"
                        placeholder="Search for Token"
                        className="asset-search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '90%' }}
                    />
                </div>

                <div className="asset-filter-selection-info">
                    <span>{selectedCount} of {totalCount} selected</span>
                    {selectedCount > 0 && (
                        <button className="clear-button" onClick={handleClearSelection}>
                            ✕ Clear
                        </button>
                    )}
                </div>

                <div className="asset-filter-list">
                    {filteredTokens.map((token) => (
                        <div key={token.id} className="asset-filter-item">
                            <label className="asset-checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={isTokenSelected(token.id)}
                                    onChange={() => toggleToken(token)}
                                    className="asset-checkbox"
                                />
                                <TokenIcon type={token.type} />
                                <span className="token-name">{token.name}</span>
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AssetFilter; 