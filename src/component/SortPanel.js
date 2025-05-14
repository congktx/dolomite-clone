import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../styles/SortPanel.css';

const SortPanel = ({ position, onClose }) => {
    const dispatch = useDispatch();
    const currentSort = useSelector(state => state.counter.sort);

    const sortOptions = [
        { value: 'current_apr_desc', label: 'Current APR ↓', description: 'Highest current APR first' },
        { value: 'current_apr_asc', label: 'Current APR ↑', description: 'Lowest current APR first' },
        { value: 'avg_apr_30_desc', label: '30 Day Avg APR ↓', description: 'Highest 30-day average APR first' },
        { value: 'avg_apr_30_asc', label: '30 Day Avg APR ↑', description: 'Lowest 30-day average APR first' },
        { value: 'leverage_desc', label: 'Leverage ↓', description: 'Highest leverage first' },
        { value: 'leverage_asc', label: 'Leverage ↑', description: 'Lowest leverage first' },
        { value: 'risk_desc', label: 'Risk ↓', description: 'Highest risk first' },
        { value: 'risk_asc', label: 'Risk ↑', description: 'Lowest risk first' }
    ];

    const handleSortChange = (sortValue) => {
        dispatch({ type: 'counter/setSort', payload: sortValue });
        onClose();
    };

    // Handle click outside to close panel
    const handleClickOutside = (e) => {
        if (!e.target.closest('.sort-panel') && !e.target.closest('.filter_sort')) {
            onClose();
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="sort-panel-overlay">
            <div
                className="sort-panel"
                style={{
                    top: position.top,
                    left: position.left
                }}
            >
                <div className="sort-panel-title">Sort by</div>
                <div className="sort-options">
                    {sortOptions.map((option) => (
                        <div
                            key={option.value}
                            className={`sort-option ${currentSort === option.value ? 'selected' : ''}`}
                            onClick={() => handleSortChange(option.value)}
                        >
                            <div className="sort-option-label">{option.label}</div>
                            <div className="sort-option-description">{option.description}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SortPanel; 