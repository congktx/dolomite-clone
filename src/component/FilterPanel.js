import React, { useState } from 'react';
import '../styles/FilterPanel.css';
import { useDispatch, useSelector } from 'react-redux';
import {
    addFilterChain,
    removeFilterChain,
    addFilterRisk,
    removeFilterRisk,
    addFilterLeverage,
    removeFilterLeverage
} from '../redux/counterSlice';

// Chain icons
const ChainIcon = ({ chain }) => {
    switch (chain) {
        case 'Arbitrum':
            return <span className="chain-icon arbitrum">⚪</span>;
        case 'Ethereum':
            return <span className="chain-icon Ethereum">⚫</span>;
        default:
            return null;
    }
};

function FilterPanel({ onClose, position = { top: "50px", left: "50px" } }) {
    const dispatch = useDispatch();
    const filters = useSelector((state) => state.counter.filters);

    const [activeTab, setActiveTab] = useState('chain');

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const chains = [
        { id: 'Arbitrum', name: 'Arbitrum' },
        { id: 'Ethereum', name: 'Ethereum' },
    ];

    const risks = [
        { id: 0, name: 'Low' },
        { id: 1, name: 'Med' },
        { id: 2, name: 'High' }
    ];

    const leverages = [
        { id: 2, name: '2x' },
        { id: 3, name: '3x' },
        { id: 4, name: '4x' },
        { id: 5, name: '5x' },
        { id: 6, name: '6x' },
        { id: 7, name: '7x' },
        { id: 8, name: '8x' }
    ];

    const toggleChain = (chain) => {
        if (filters.chains.includes(chain.id)) {
            dispatch(removeFilterChain(chain.id));
        } else {
            dispatch(addFilterChain(chain.id));
        }
    };

    const toggleRisk = (risk) => {
        if (filters.risks.includes(risk.id)) {
            dispatch(removeFilterRisk(risk.id));
            console.log(filters.risks);
        } else {
            dispatch(addFilterRisk(risk.id));
            console.log(filters.risks);
        }
    };

    const toggleLeverage = (leverage) => {
        if (filters.leverages.includes(leverage.id)) {
            dispatch(removeFilterLeverage(leverage.id));
        } else {
            dispatch(addFilterLeverage(leverage.id));
        }
    };

    const handleClearSelection = () => {
        if (activeTab === 'chain') {
            filters.chains.forEach(chain =>
                dispatch(removeFilterChain(chain))
            );
        } else if (activeTab === 'risk') {
            filters.risks.forEach(risk =>
                dispatch(removeFilterRisk(risk))
            );
        } else {
            filters.leverages.forEach(leverage =>
                dispatch(removeFilterLeverage(leverage))
            );
        }
    };

    const currentItems = activeTab === 'chain'
        ? chains
        : activeTab === 'risk'
            ? risks
            : leverages;

    const selectedCount = activeTab === 'chain'
        ? filters.chains.length
        : activeTab === 'risk'
            ? filters.risks.length
            : filters.leverages.length;

    const isItemSelected = (id) => {
        if (activeTab === 'chain') {
            return filters.chains.includes(id);
        } else if (activeTab === 'risk') {
            return filters.risks.includes(id);
        } else {
            return filters.leverages.includes(id);
        }
    };

    const toggleItem = (item) => {
        if (activeTab === 'chain') {
            toggleChain(item);
        } else if (activeTab === 'risk') {
            toggleRisk(item);
        } else {
            toggleLeverage(item);
        }
    };

    const handleClickOutside = (e) => {
        if (e.target.className === 'filter-panel-overlay') {
            onClose();
        }
    };

    return (
        <div className="filter-panel-overlay" onClick={handleClickOutside}>
            <div
                className="filter-panel"
                style={{
                    top: position.top,
                    left: position.left
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="filter-tabs">
                    <button
                        className={`filter-tab ${activeTab === 'chain' ? 'active' : ''}`}
                        onClick={() => handleTabChange('chain')}
                    >
                        Chain
                    </button>
                    <button
                        className={`filter-tab ${activeTab === 'risk' ? 'active' : ''}`}
                        onClick={() => handleTabChange('risk')}
                    >
                        Risk
                    </button>
                    <button
                        className={`filter-tab ${activeTab === 'leverage' ? 'active' : ''}`}
                        onClick={() => handleTabChange('leverage')}
                    >
                        Leverage
                    </button>
                </div>

                <div className="filter-selection-info">
                    {selectedCount > 0 && (
                        <button className="filter-clear-button" onClick={handleClearSelection}>
                            ✕ Clear selected {activeTab === 'chain' ? 'chains' : activeTab === 'risk' ? 'risk' : 'leverage'}
                        </button>
                    )}
                </div>

                <div className="filter-list">
                    {currentItems.map((item) => (
                        <div key={item.id} className="filter-item">
                            <label className="filter-checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={isItemSelected(item.id)}
                                    onChange={() => toggleItem(item)}
                                    className="filter-checkbox"
                                />
                                {activeTab === 'chain' && <ChainIcon chain={item.id} />}
                                <span className="filter-item-name">{item.name}</span>
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default FilterPanel; 