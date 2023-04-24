import React, { useState, useEffect } from "react";
import { useTable, useSortBy, useGlobalFilter, usePagination, useRowSelect } from "react-table";
import Filter from './Filter';
import Checkbox from "./Chechbox";

const HistoryTable = ({ columns, data, allTrainingData, deleteData, getAllTrainingRequest }) => {

    const [mainData, setMainData] = useState(allTrainingData);

    const [trainingData, setTrainingData] = useState(mainData.filter((datas) => { return datas.request === "true" }));
    const [selectAll, setSelectAll] = useState(false);
    const [multiCheck, setMultiCheck] = useState(false);
    let count = 0;

    useEffect(() => {
        getAllTrainingRequest();
    }, [trainingData])

    const handleChange = (e) => {
        //alert("Hello Select");
        const { name, checked } = e.target;
        if (name === "allselect") {
            const checkedValue = trainingData.map((user) => { return { ...user, isChecked: checked } });
            setSelectAll(true);
            count = trainingData.length;
            console.log(count);
            console.log(checkedValue);
            setTrainingData(checkedValue);
        } else {
            const checkedValue = trainingData.map((user) => user.usecert === name ? { ...user, isChecked: checked } : user);
            setSelectAll(false);
            console.log(checkedValue);
            for (let i = 0; i < checkedValue.length; i++) {
                if (checkedValue[i].isChecked === true) {
                    count++;
                }
            }
            if (count > 1) {
                setMultiCheck(true);
                setSelectAll(true);
            } else if (count === trainingData.length) {
                console.log("reached");
                setMultiCheck(false);
            } else {
                setMultiCheck(false);
            }
            console.log(count);
            setTrainingData(checkedValue);
        }
    }

    const handleAllDelete = (event) => {
        event.preventDefault();
        const checkedInput = [];
        for (let i = 0; i < trainingData.length; i++) {
            if (trainingData[i].isChecked === true) {
                checkedInput.push(trainingData[i].usecert);
            }
        }
        for (let j = 0; j < checkedInput.length; j++) {
            deleteData(checkedInput[j])
                .then(data => {
                    console.log("Deleted Successfully", data);
                    const newData = trainingData.filter((data) => { return data.usecert !== checkedInput[j] });
                    console.log(newData);
                    setTrainingData(newData);
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }

    const { getTableProps, getTableBodyProps, headerGroups, page, nextPage, previousPage, canNextPage, canPreviousPage, prepareRow, selectedFlatRows, pageOptions, gotoPage, pageCount, setPageSize, state, setGlobalFilter, allColumns, getToggleHideAllColumnsProps } =
        useTable(
            {
                columns,
                data,
            },
            useGlobalFilter,
            useSortBy,
            usePagination,
            useRowSelect,
            (hooks) => {
                hooks.visibleColumns.push((columns) => {
                    return [
                        ...columns,
                        {
                            id: 'selection',
                            Header: ({ getToggleAllRowsSelectedProps }) => (
                                <th scope="col">
                                    <input name="allselect" checked={!trainingData.some((user) => user?.isChecked !== true)} onChange={handleChange} className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                                    {!trainingData.some((user) => user?.isChecked !== true) && <i onClick={handleAllDelete} className="fa-solid fa-trash table-delete-icon"></i>}
                                    {multiCheck && <i onClick={handleAllDelete} className="fa-solid fa-trash table-delete-icon"></i>}
                                </th>
                                // <Checkbox handleDeleteFromIcon={handleDeleteFromIcon} {...getToggleAllRowsSelectedProps()} />
                            ),
                            Cell: ({ row }) => (
                                <Checkbox handleDeleteFromIcon={handleDeleteFromIcon} {...row.getToggleRowSelectedProps()} />
                                // <td>
                                //     <input name={row.cells[0].value} checked={data?.isChecked || false} onChange={handleChange} className="form-check-input" type="checkbox" id="flexCheckDefault" />
                                //     {!selectAll && data?.isChecked && <i onClick={handleAllDelete} className="fa-solid fa-trash table-delete-icon"></i>}
                                // </td>
                            )
                        }
                    ]
                })
            }
        );

    const { globalFilter, pageIndex, pageSize } = state;


    let Selected_Rows = selectedFlatRows;

    Selected_Rows = JSON.stringify({ selectedFlatRows: selectedFlatRows.map((row) => row.original.usecert) }, null, 2);

    console.log(Selected_Rows);

    const handleDeleteFromIcon = () => {

        console.log("clicked");
        // for (let j = 0; j < checkedInput.length; j++) {
        //     deleteData(checkedInput[j])
        //         .then(data => {
        //             console.log("Deleted Successfully", data);
        //             // const newData = trainingData.filter((data) => { return data.usecert !== checkedInput[j] });
        //             // console.log(newData);
        //             // setTrainingData(newData);
        //         })
        //         .catch(err => {
        //             console.log(err);
        //         })
        // }
    }




    return (
        <>
            <Filter style={{ width: "20%" }} filter={globalFilter} setFilter={setGlobalFilter}></Filter>
            <div className="table-responsive mb-3">
                <table style={{ width: "100%" }} className="table table-striped table-striped-columns table-dark table-hover table-bordered "  {...getTableProps()}>
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
                                {/* <th scope="col">
                                    <input name="allselect" checked={!trainingData.some((user) => user?.isChecked !== true)} onChange={handleChange} className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                                    {!trainingData.some((user) => user?.isChecked !== true) && <i onClick={handleAllDelete} className="fa-solid fa-trash table-delete-icon"></i>}
                                    {multiCheck && <i onClick={handleAllDelete} className="fa-solid fa-trash table-delete-icon"></i>}
                                </th> */}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {page.map((row, i) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    <td scope="row">
                                        {i + 1}
                                    </td>
                                    {row.cells.map((cell) => {
                                        return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                                    })}
                                    {/* <td>
                                        <input name={row.cells[0].value} checked={data?.isChecked || false} onChange={handleChange} className="form-check-input" type="checkbox" id="flexCheckDefault" />
                                        {!selectAll && data?.isChecked && <i onClick={handleAllDelete} className="fa-solid fa-trash table-delete-icon"></i>}
                                    </td> */}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
                <div className="pagination-custom">
                    <span>Page{" "}<strong>{pageIndex + 1} of {pageOptions.length}</strong>{" "}</span>
                    <span> | Go to page: {" "}<input type='number' defaultValue={pageIndex + 1} onChange={e => {
                        const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0
                        gotoPage(pageNumber)
                    }}
                        style={{ width: "50px" }}
                    ></input></span>
                    <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
                        {[3, 4, 5, 10].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>Show {pageSize}</option>
                        ))}
                    </select>
                    <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} className="btn btn-primary mx-3">{"<<"}</button>
                    <button onClick={() => previousPage()} disabled={!canPreviousPage} className="btn btn-primary mx-3">Previous</button>
                    <button onClick={() => nextPage()} disabled={!canNextPage} className="btn btn-primary mx-3">Next</button>
                    <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} className="btn btn-primary mx-3">{">>"}</button>
                </div>
                <div className="row my-3 text-center toggle_rows">
                    <div style={{ width: "60px" }}>
                        <input {...getToggleHideAllColumnsProps()} className="form-check-input" type="checkbox" />
                        <span style={{ fontSize: "12px" }}>View All</span>
                    </div>
                    {allColumns.map((column) => (
                        <div key={column.id} style={{ width: "60px" }}>
                            <label>
                                <input {...column.getToggleHiddenProps()} className="form-check-input" type="checkbox" />
                                <span style={{ fontSize: "12px" }}>{column.Header}</span>
                            </label>
                        </div>
                    ))}
                </div>

        </>
    )

}

export default HistoryTable;