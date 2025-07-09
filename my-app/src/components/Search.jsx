import React from "react";

const Search = ({searchTerm, setSearchTerm}) => {
  return(
    <div className="search">
        <h2>Busca una carta</h2>
        <input type="text" value={searchTerm} placeholder="Escribe la carta, papis" onChange={(e) => setSearchTerm(e.target.value)}/>
    </div>

) ;
};

export default Search;
