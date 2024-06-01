import React from "react";

export const SearchComponent = ({ filterText, onFilter, onClear }: any) => (
  <>
    <input
      id="search"
      type="text"
      placeholder="Filter By Name"
      aria-label="Search Input"
      value={filterText}
      onChange={onFilter}
      autoComplete="off"
    />
    <button onClick={onClear}>X</button>
  </>
);
