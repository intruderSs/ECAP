import React from "react";

const ProjectTableFilter = ({ filter, setFilter }) => {
    return (
        // <span>
        // Search: {' '}
        // <input value={filter || ""} onChange={(e) => setFilter(e.target.value)}></input>
        // </span>
        <>
            <div className="filter-bar" style={{width: "22%", position: "absolute", left: "65%", top: "16.3%"}}>
                <div className="input-group">
                    <span className="input-group-text" id="inputGroupPrepend2"><i className="fa-solid fa-download"></i></span>
                    <input value={filter || ""} onChange={(e) => setFilter(e.target.value)} className="form-control table-search" type="search" placeholder="Search" aria-label="Search" />
                </div>
            </div>
        </>
    )
}

export default ProjectTableFilter;