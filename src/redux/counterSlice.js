import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
    name: 'counter',
    initialState: {
        filterAssets: {
            collateral: [],
            debt: [],
        },
        filters: {
            chains: [],
            risks: [],
            leverages: []
        },
        tags: {
            selectedTags: [],
            filterType: 'all'
        },
        sort: 'current_apr_desc',
        showDetailStrategy: null,
    },
    reducers: {
        // filterAssets
        addFilterAssetsCollateral: (state, action) => {
            state.filterAssets.collateral.push(action.payload);
        },
        removeFilterAssetsCollateral: (state, action) => {
            state.filterAssets.collateral = state.filterAssets.collateral.filter(
                (asset) => asset !== action.payload
            );
        },
        addFilterAssetsDebt: (state, action) => {
            state.filterAssets.debt.push(action.payload);
        },
        removeFilterAssetsDebt: (state, action) => {
            state.filterAssets.debt = state.filterAssets.debt.filter(
                (asset) => asset !== action.payload
            );
        },

        // filters
        addFilterChain: (state, action) => {
            state.filters.chains.push(action.payload);
        },
        removeFilterChain: (state, action) => {
            state.filters.chains = state.filters.chains.filter(
                (chain) => chain !== action.payload
            );
        },

        // risks 
        addFilterRisk: (state, action) => {
            state.filters.risks.push(action.payload);
        },
        removeFilterRisk: (state, action) => {
            state.filters.risks = state.filters.risks.filter(
                (risk) => risk !== action.payload
            );
        },

        // leverages
        addFilterLeverage: (state, action) => {
            state.filters.leverages.push(action.payload);
        },
        removeFilterLeverage: (state, action) => {
            state.filters.leverages = state.filters.leverages.filter(
                (leverage) => leverage !== action.payload
            );
        },

        // tags
        addTag: (state, action) => {
            if (!state.tags.selectedTags.includes(action.payload)) {
                state.tags.selectedTags.push(action.payload);
            }
        },
        removeTag: (state, action) => {
            state.tags.selectedTags = state.tags.selectedTags.filter(
                (tag) => tag !== action.payload
            );
        },
        clearTags: (state) => {
            state.tags.selectedTags = [];
        },
        setTagFilterType: (state, action) => {
            state.tags.filterType = action.payload;
        },

        // sort
        setSort: (state, action) => {
            state.sort = action.payload;
        },

        // showDetailStrategy
        setShowDetailStrategy: (state, action) => {
            state.showDetailStrategy = action.payload;
        },
    },
});

export const {
    addFilterAssetsCollateral,
    removeFilterAssetsCollateral,
    addFilterAssetsDebt,
    removeFilterAssetsDebt,

    addFilterChain,
    removeFilterChain,

    addFilterRisk,
    removeFilterRisk,

    addFilterLeverage,
    removeFilterLeverage,

    addTag,
    removeTag,
    clearTags,
    setTagFilterType,

    setSort,

    setShowDetailStrategy,
} = counterSlice.actions;

export default counterSlice.reducer;
