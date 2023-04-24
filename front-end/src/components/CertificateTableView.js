import React, { useState } from "react";
import { useTable, useSortBy, useGlobalFilter } from "react-table";
import Filter from './Filter';

const CertificateTableView = ({ columns, data }) => {


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
            {data.length > 0 && <Filter filter={globalFilter} setFilter={setGlobalFilter}></Filter>}
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
                                        return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
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

export default CertificateTableView;