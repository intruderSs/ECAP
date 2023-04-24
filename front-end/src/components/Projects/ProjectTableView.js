import React, { useState } from "react";
import { useTable, useSortBy, useGlobalFilter } from "react-table";
import ProjectTableFilter from "./ProjectTableFilter";

const ProjectTableView = ({ columns, data }) => {


    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, state, setGlobalFilter } =
        useTable(
            {
                columns,
                data,
            },
            useGlobalFilter,
            useSortBy
        );

    const { globalFilter } = state;

    return (
        <>
            {data.length > 0 && <ProjectTableFilter filter={globalFilter} setFilter={setGlobalFilter}></ProjectTableFilter>}
            <div className="mb-3 certificate-card">
                <table style={{ width: "100%" }} className="table table-striped table-striped-columns table-dark table-hover table-bordered"  {...getTableProps()}>
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                <th scope="col">#</th>
                                {headerGroup.headers.map((column) => (
                                    <th scope="col" {...column.getHeaderProps(column.getSortByToggleProps())}>
                                        {column.render("Header")}{" "}
                                        {column.isSorted ? (column.isSortedDesc ? " ⬇️" : " ⬆️") : ""}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {rows.map((row, i) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    <td scope="row">
                                        {i + 1}
                                    </td>
                                    {row.cells.map((cell) => {
                                        return <td {...cell.getCellProps()}>{typeof (cell.value) === "object" && cell.value.length > 0 ? cell.value.map((data) => {
                                            return <span className="span-skill">
                                                <td>{data}</td>
                                            </span>
                                        }) : <td>{cell.render("Cell")}</td>}</td>
                                        {/* <td {...cell.getCellProps()}>{cell.render("Cell")} {typeof(cell.value) === "object" && cell.value.length > 1 && console.log(cell.value)}</td>; */ }
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </>
    )

}

export default ProjectTableView;