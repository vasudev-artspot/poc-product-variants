import React, { useState } from 'react';
import { TextField, Box, InputAdornment } from '@mui/material';
// import SearchIcon from '../../assets/Icons/SearchIcon.png';
import SearchIcon from '@mui/icons-material/Search';


interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <Box sx={{ marginBottom: '1rem', maxWidth: '500px' }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search shops..."
        value={searchQuery}
        onChange={handleInputChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <img alt="Search" style={{ width: '24px', height: '24px' }} />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default SearchBar;
