import React from 'react'
import "./Search.css";
import { BiSearch } from 'react-icons/bi';
const Search = () => {
  const handleSearch = () => {
    alert("Searching..."); // Replace this with your actual search logic
  };
  return (
    <div className="search-bar">
      <form className="search-form d-flex align-items-center" method="POST" action="#">
        <input
          type="text"
          name="query"
          placeholder="Search"
          title="Enter Search Keyword"
        />
        <BiSearch className="search-icon" onClick={handleSearch} />

      </form>
    </div>
  );
};

export default Search;