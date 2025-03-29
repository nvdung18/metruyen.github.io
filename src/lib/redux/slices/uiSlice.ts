import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  theme: 'light' | 'dark';
  selectedGenres: string[];
  sortBy: string;
  searchQuery: string;
  currentPage: number;
  status: string[];
}

const initialState: UiState = {
  theme: 'dark',
  selectedGenres: [],
  sortBy: 'latest',
  searchQuery: '',
  currentPage: 1,
  status: []
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    toggleGenre: (state, action: PayloadAction<string>) => {
      const genre = action.payload;
      if (state.selectedGenres.includes(genre)) {
        state.selectedGenres = state.selectedGenres.filter(g => g !== genre);
      } else {
        state.selectedGenres.push(genre);
      }
      // Reset page when filters change
      state.currentPage = 1;
    },
    toggleStatus: (state, action: PayloadAction<string>) => {
      const status = action.payload;
      if (state.status.includes(status)) {
        state.status = state.status.filter(s => s !== status);
      } else {
        state.status.push(status);
      }
      // Reset page when filters change
      state.currentPage = 1;
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      // Reset page when search changes
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    clearFilters: (state) => {
      state.selectedGenres = [];
      state.status = [];
      state.sortBy = 'latest';
      state.searchQuery = '';
      state.currentPage = 1;
    }
  }
});

export const { 
  setTheme, 
  toggleGenre, 
  toggleStatus, 
  setSortBy, 
  setSearchQuery, 
  setCurrentPage,
  clearFilters
} = uiSlice.actions;
export default uiSlice.reducer;
