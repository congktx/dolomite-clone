import React, { useState, useRef, useEffect } from 'react';
import AssetFilter from './AssetFilter';
import FilterPanel from './FilterPanel';
import TagsPanel from './TagsPanel';
import SortPanel from './SortPanel';

function FilterStrategy() {
    // Asset filter state
    const [showAssetFilter, setShowAssetFilter] = useState(false);
    const assetsButtonRef = useRef(null);
    const [assetFilterPosition, setAssetFilterPosition] = useState({ top: "0px", left: "0px" });

    // Filters state
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const filtersButtonRef = useRef(null);
    const [filterPanelPosition, setFilterPanelPosition] = useState({ top: "0px", left: "0px" });

    // Tags state
    const [showTagsPanel, setShowTagsPanel] = useState(false);
    const tagsButtonRef = useRef(null);
    const [tagsPanelPosition, setTagsPanelPosition] = useState({ top: "0px", left: "0px" });

    // Sort state
    const [showSortPanel, setShowSortPanel] = useState(false);
    const sortButtonRef = useRef(null);
    const [sortPanelPosition, setSortPanelPosition] = useState({ top: "0px", left: "0px" });

    const toggleAssetFilter = () => {
        // Close the other panels if open
        if (showFilterPanel) {
            setShowFilterPanel(false);
        }
        if (showTagsPanel) {
            setShowTagsPanel(false);
        }
        if (showSortPanel) {
            setShowSortPanel(false);
        }

        if (!showAssetFilter && assetsButtonRef.current) {
            const rect = assetsButtonRef.current.getBoundingClientRect();
            setAssetFilterPosition({
                top: `${rect.bottom + 10}px`,
                left: `${rect.left}px`
            });
        }
        setShowAssetFilter(!showAssetFilter);
    };

    const toggleFilterPanel = () => {
        // Close the other panels if open
        if (showAssetFilter) {
            setShowAssetFilter(false);
        }
        if (showTagsPanel) {
            setShowTagsPanel(false);
        }
        if (showSortPanel) {
            setShowSortPanel(false);
        }

        if (!showFilterPanel && filtersButtonRef.current) {
            const rect = filtersButtonRef.current.getBoundingClientRect();
            setFilterPanelPosition({
                top: `${rect.bottom + 10}px`,
                left: `${rect.left}px`
            });
        }
        setShowFilterPanel(!showFilterPanel);
    };

    const toggleTagsPanel = () => {
        // Close the other panels if open
        if (showAssetFilter) {
            setShowAssetFilter(false);
        }
        if (showFilterPanel) {
            setShowFilterPanel(false);
        }
        if (showSortPanel) {
            setShowSortPanel(false);
        }

        if (!showTagsPanel && tagsButtonRef.current) {
            const rect = tagsButtonRef.current.getBoundingClientRect();
            setTagsPanelPosition({
                top: `${rect.bottom + 10}px`,
                left: `${rect.left}px`
            });
        }
        setShowTagsPanel(!showTagsPanel);
    };

    const toggleSortPanel = () => {
        // Close the other panels if open
        if (showAssetFilter) {
            setShowAssetFilter(false);
        }
        if (showFilterPanel) {
            setShowFilterPanel(false);
        }
        if (showTagsPanel) {
            setShowTagsPanel(false);
        }

        if (!showSortPanel && sortButtonRef.current) {
            const rect = sortButtonRef.current.getBoundingClientRect();
            setSortPanelPosition({
                top: `${rect.bottom + 10}px`,
                left: `${rect.left}px`
            });
        }
        setShowSortPanel(!showSortPanel);
    };

    const closeAssetFilter = () => {
        setShowAssetFilter(false);
    };

    const closeFilterPanel = () => {
        setShowFilterPanel(false);
    };

    const closeTagsPanel = () => {
        setShowTagsPanel(false);
    };

    const closeSortPanel = () => {
        setShowSortPanel(false);
    };

    // Close filters when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // For Asset Filter
            if (assetsButtonRef.current &&
                !assetsButtonRef.current.contains(event.target) &&
                !event.target.closest('.asset-filter-panel')) {
                setShowAssetFilter(false);
            }

            // For Filter Panel
            if (filtersButtonRef.current &&
                !filtersButtonRef.current.contains(event.target) &&
                !event.target.closest('.filter-panel')) {
                setShowFilterPanel(false);
            }

            // For Tags Panel
            if (tagsButtonRef.current &&
                !tagsButtonRef.current.contains(event.target) &&
                !event.target.closest('.tags-panel')) {
                setShowTagsPanel(false);
            }

            // For Sort Panel
            if (sortButtonRef.current &&
                !sortButtonRef.current.contains(event.target) &&
                !event.target.closest('.sort-panel')) {
                setShowSortPanel(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div
            className="filter_strategy"
            style={{
                position: 'absolute',
                top: '24%',
                left: '44%',
                width: '27%',
                height: '5%',
                backgroundColor: "transparent",
                display: 'flex',
            }}
        >
            <div
                className='filter_icon'
                style={{
                    width: '7%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    position: 'absolute',
                    cursor: 'pointer',
                    color: 'white',
                }}
                onClick={() => { console.log('Filter icon clicked'); }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="Strategies__StyledMenuIcon-sc-1mxapcq-89 cRzSUZ"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            </div>

            {/* Assets Button */}
            <button
                ref={assetsButtonRef}
                className='filter_assets'
                style={{
                    position: 'absolute',
                    left: '10%',
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#292938',
                    border: 'none',
                    borderRadius: '5px',
                    width: '22%',
                    height: '100%',
                    cursor: 'pointer',
                    color: 'white',
                }}
                onClick={toggleAssetFilter}
            >
                <svg className="MuiSvgIcon-root" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="SearchIcon" style={{ marginLeft: '8px' }}><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></svg>
                <div
                    style={{
                        position: 'absolute',
                        left: '40%',
                    }}
                >
                    Assets
                </div>
            </button>

            {/* Filters Button */}
            <button
                ref={filtersButtonRef}
                className='filter_panel'
                style={{
                    position: 'absolute',
                    left: '35%',
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#292938',
                    border: 'none',
                    borderRadius: '5px',
                    width: '20%',
                    height: '100%',
                    cursor: 'pointer',
                    color: 'white',
                }}
                onClick={toggleFilterPanel}
            >
                <svg className="MuiSvgIcon-root" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="FilterAltSharpIcon"><path d="M3 4c2.01 2.59 7 9 7 9v7h4v-7s4.98-6.41 7-9H3z"></path></svg>
                <div
                    style={{
                        position: 'absolute',
                        left: '40%',
                    }}
                >
                    Filters
                </div>
            </button>

            {/* Tags Button */}
            <button
                ref={tagsButtonRef}
                className='filter_tags'
                style={{
                    position: 'absolute',
                    left: '58%',
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#292938',
                    border: 'none',
                    borderRadius: '5px',
                    width: '20%',
                    height: '100%',
                    cursor: 'pointer',
                    color: 'white',
                }}
                onClick={toggleTagsPanel}
            >
                <svg className="MuiSvgIcon-root" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="LocalOfferIcon"><path d="m21.41 11.58-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"></path></svg>
                <div
                    style={{
                        position: 'absolute',
                        left: '40%',
                    }}
                >
                    Tags
                </div>
            </button>

            {/* Sort Button */}
            <button
                ref={sortButtonRef}
                className='filter_sort'
                style={{
                    position: 'absolute',
                    left: '81%',
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#292938',
                    border: 'none',
                    borderRadius: '5px',
                    width: '20%',
                    height: '100%',
                    cursor: 'pointer',
                    color: 'white',
                }}
                onClick={toggleSortPanel}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '5px' }}><path d="M11 5h10"></path><path d="M11 9h7"></path><path d="M11 13h4"></path><path d="m3 17 3 3 3-3"></path><path d="M6 18V4"></path></svg>
                <div
                    style={{
                        position: 'absolute',
                        left: '40%',
                    }}
                >
                    Sort
                </div>
            </button>

            {showAssetFilter && (
                <AssetFilter
                    onClose={closeAssetFilter}
                    position={assetFilterPosition}
                />
            )}

            {showFilterPanel && (
                <FilterPanel
                    onClose={closeFilterPanel}
                    position={filterPanelPosition}
                />
            )}

            {showTagsPanel && (
                <TagsPanel
                    onClose={closeTagsPanel}
                    position={tagsPanelPosition}
                />
            )}

            {showSortPanel && (
                <SortPanel
                    onClose={closeSortPanel}
                    position={sortPanelPosition}
                />
            )}
        </div>
    );
}

export default FilterStrategy;