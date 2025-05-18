import React, { useState } from 'react';
import { BiSearch } from 'react-icons/bi';
import './Search.css';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <form className="search-form" onSubmit={handleSearch}>
      <div className="search-input-container">
        <input
          type="text"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={handleChange}
          className="search-input"
        />
        <div className="search-icon" onClick={handleSearch}>
          <BiSearch />
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
