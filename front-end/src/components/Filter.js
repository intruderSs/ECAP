import React from "react";

const GlobalFilter = ({ filter, setFilter }) => {
    return (
        // <span>
        // Search: {' '}
        // <input value={filter || ""} onChange={(e) => setFilter(e.target.value)}></input>
        // </span>
        <>
            <div className="filter-bar" style={{width: "24.5%"}}>
                <div className="input-group">
                    <span className="input-group-text" id="inputGroupPrepend2"><i className="fa-solid fa-download"></i></span>
                    <input value={filter || ""} onChange={(e) => setFilter(e.target.value)} className="form-control table-search" type="search" placeholder="Search" aria-label="Search" />
                </div>
            </div>
        </>
    )
}

export default GlobalFilter;