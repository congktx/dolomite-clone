import React, { useState, useEffect } from 'react';
import '../styles/TagsPanel.css';
import { useDispatch, useSelector } from 'react-redux';
import {
    addTag,
    removeTag,
    clearTags,
    setTagFilterType
} from '../redux/counterSlice';

// Define tag color based on category
const getTagColor = (tag) => {
    // These colors correspond to the CSS classes defined in TagsPanel.css
    if (['Stable', 'Sustainable', 'Green', 'Eco-friendly'].includes(tag)) {
        return 'green-tag';
    } else if (['Savings', 'DeFi', 'Stable Rates', 'Fixed Rate'].includes(tag)) {
        return 'blue-tag';
    } else if (['Lending', 'Borrowing', 'Yield', 'Staking'].includes(tag)) {
        return 'orange-tag';
    } else if (['High Risk', 'New', 'Experimental', 'Beta'].includes(tag)) {
        return 'red-tag';
    }
    // Default color if not in any category
    return 'blue-tag';
};

const TagsPanel = ({ position, onClose }) => {
    const dispatch = useDispatch();
    const selectedTags = useSelector(state => state.counter.tags.selectedTags);
    const filterType = useSelector(state => state.counter.tags.filterType);

    // List of available tags
    const allTags = [
        // Green tags
        'Stable', 'Sustainable', 'Green', 'Eco-friendly',
        // Blue tags
        'Savings', 'DeFi', 'Stable Rates', 'Fixed Rate',
        // Orange tags
        'Lending', 'Borrowing', 'Yield', 'Staking',
        // Red tags
        'High Risk', 'New', 'Experimental', 'Beta'
    ];

    // Handle click on tag
    const handleTagClick = (tag) => {
        if (selectedTags.includes(tag)) {
            dispatch(removeTag(tag));
        } else {
            dispatch(addTag(tag));
        }
    };

    // Handle change in filter type (all vs any)
    const handleFilterTypeChange = (type) => {
        dispatch(setTagFilterType(type));
    };

    // Handle click outside to close panel
    const handleClickOutside = (e) => {
        if (!e.target.closest('.tags-panel') && !e.target.closest('.filter_tags')) {
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
        <div className="tags-panel-overlay">
            <div
                className="tags-panel"
                style={{
                    top: position.top,
                    left: position.left
                }}
            >
                <div className="tags-filter-type">
                    <label className="filter-by-label">Filter by:</label>
                    <div className="filter-type-buttons">
                        <button
                            className={`filter-type-button ${filterType === 'all' ? 'active' : ''}`}
                            onClick={() => handleFilterTypeChange('all')}
                        >
                            All selected tags
                        </button>
                        <button
                            className={`filter-type-button ${filterType === 'any' ? 'active' : ''}`}
                            onClick={() => handleFilterTypeChange('any')}
                        >
                            Any selected tag
                        </button>
                    </div>
                </div>

                <div>
                    {selectedTags.length > 0 && (
                        <span className="selected-tags-label">
                            {selectedTags.length} tag{selectedTags.length === 1 ? '' : 's'} selected
                            <button
                                onClick={() => dispatch(clearTags())}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#8c8c98',
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                    fontSize: '14px',
                                    marginLeft: '8px'
                                }}
                            >
                                Clear
                            </button>
                        </span>
                    )}
                </div>

                <div className="tags-grid">
                    {allTags.map((tag) => (
                        <button
                            key={tag}
                            className={`tag-button ${getTagColor(tag)} ${selectedTags.includes(tag) ? 'selected' : ''}`}
                            onClick={() => handleTagClick(tag)}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TagsPanel; 