import React, { useContext, useEffect, useState, useRef, useMemo } from "react";
import HistoryTable from "./HistoryTable";
import trainingContext from "../context/trainingContext";
import { CSVLink } from "react-csv";
import { useNavigate } from "react-router-dom";

function AdminTrainingData(props) {

    const navigate = useNavigate();

    const context = useContext(trainingContext);
    const { allTrainingData, getAllTrainingRequest, deleteData } = context;

    const trainingData = allTrainingData.filter((datas) => { return datas.request === "true" });

    //const allData = allTrainingData.filter((data) => { return data.request === true });

    const allApprovedData = trainingData.filter((data) => { return data.rejected === "false" });

    const allRejectedData = trainingData.filter((data) => { return data.rejected === "true" });

    //console.log(allRejectedData);
    //console.log(allTrainingData);

    useEffect(() => {
        if (localStorage.getItem('token')) {
            getAllTrainingRequest();
        }
    }, [])

    const handleRefresh = () => {
        //console.log("shahil");
        getAllTrainingRequest();
    }

    //////mapping data to table

    const [tableHeader, setTableHeader] = useState([]);
    const [tableRows, setTableRows] = useState([]);

    const header = useMemo(() => tableHeader, [tableHeader]);
    const data = useMemo(() => tableRows, [tableRows]);
    const buttonRef = useRef(null);

    // const columns = [
    //     {
    //         Header: 'Allocation SBU',
    //         accessor: 'allocation_sbu',
    //     },
    //     {
    //         Header: 'Applied On',
    //         accessor: 'applied_on',
    //     },
    //     {
    //         Header: 'Certificate Name',
    //         accessor: 'certificate_name',
    //     },
    //     {
    //         Header: 'CSP',
    //         accessor: 'csp',
    //     },
    //     {
    //         Header: 'Email ID',
    //         accessor: 'email_id',
    //     },
    //     {
    //         Header: 'Ending On',
    //         accessor: 'end_date',
    //     },
    //     {
    //         Header: 'First Name',
    //         accessor: 'first_name',
    //     },
    //     {
    //         Header: 'Last Name',
    //         accessor: 'last_name',
    //     },
    //     {
    //         Header: 'Service SL',
    //         accessor: 'service_sl',
    //     },
    //     {
    //         Header: 'Status',
    //         accessor: 'rejected',
    //     }
    // ]

    // console.log(columns);

    ////download All as CSV

    const headersAll = [
        {
            label: "First Name", key: "first_name"
        },
        {
            label: "Last Name", key: "last_name"
        },
        {
            label: "Email", key: "email_id"
        },
        {
            label: "Allocation SBU", key: "allocation_sbu"
        },
        {
            label: "Service SL", key: "service_sl"
        },
        {
            label: "Certificate Name", key: "certificate_name"
        },
        {
            label: "CSP", key: "csp"
        }
    ]

    const csvAllLink = {
        filename: "training_data_all.csv",
        headers: headersAll,
        data: trainingData
    }

    /////download approved
    const headersApproved = [
        {
            label: "First Name", key: "first_name"
        },
        {
            label: "Last Name", key: "last_name"
        },
        {
            label: "Email", key: "email_id"
        },
        {
            label: "Allocation SBU", key: "allocation_sbu"
        },
        {
            label: "Service SL", key: "service_sl"
        },
        {
            label: "Certificate Name", key: "certificate_name"
        },
        {
            label: "CSP", key: "csp"
        }
    ]

    const csvApprovedLink = {
        filename: "training_data_approved.csv",
        headers: headersApproved,
        data: allApprovedData
    }

    ////download rejected data

    const headersRejected = [
        {
            label: "First Name", key: "first_name"
        },
        {
            label: "Last Name", key: "last_name"
        },
        {
            label: "Email", key: "email_id"
        },
        {
            label: "Allocation SBU", key: "allocation_sbu"
        },
        {
            label: "Service SL", key: "service_sl"
        },
        {
            label: "Certificate Name", key: "certificate_name"
        },
        {
            label: "CSP", key: "csp"
        }
    ]

    const csvRejectedLink = {
        filename: "training_data_rejected.csv",
        headers: headersRejected,
        data: allRejectedData
    }

    const handleUpload = (event) => {
        event.preventDefault();
        navigate("/uploadcsv")
    }

    /////////////////react table setup

    const columns = [
        {
            Header: "Application ID",
            accessor: "usecert",
            Cell: ({value}) => {return value}
        },
        {
            Header: "First Name",
            accessor: "first_name",
        },
        {
            Header: "Last Name",
            accessor: "last_name",
        },
        {
            Header: "Email",
            accessor: "email_id",
        },
        {
            Header: "Allocation SBU",
            accessor: "allocation_sbu",
        },
        {
            Header: "Service SL",
            accessor: "service_sl",
        },
        {
            Header: "Certificate Name",
            accessor: "certificate_name",
        },
        {
            Header: "CSP",
            accessor: "csp",
        },
        {
            Header: "Applied On",
            accessor: "applied_on",
        },
        {
            Header: "Ending On",
            accessor: "end_date",
            Cell: ({value}) => {return value === "" ? "--" : value}
        },
        {
            Header: "Status",
            accessor: "rejected",
            Cell: ({value}) => {return value === "true" ? "Rejected" : "Approved"}
        },
    ]

    const rows = trainingData;

    return (
        <>
            <div className="my-3">
                {trainingData.length > 0 ?
                    <div className="download-btn col-md-1">
                        <button className="download-button btn btn-danger dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Actions
                        </button>
                        <ul className="dropdown-menu dropdown-menu-dark">
                            <li><CSVLink className="dropdown-item" {...csvAllLink}>Download all as .csv</CSVLink></li>
                            <li><hr className="dropdown-divider" /></li>
                            <li><CSVLink className="dropdown-item" {...csvApprovedLink}>Download approved</CSVLink></li>
                            <li><CSVLink className="dropdown-item" {...csvRejectedLink}>Download rejected</CSVLink></li>
                            <li><hr className="dropdown-divider" /></li>
                            <li><button className="dropdown-item" type="button" onClick={handleUpload}>Upload</button></li>
                        </ul>
                    </div> :
                    <div className="download-btn col-md-1">
                        <button onClick={handleUpload} className="download-button btn btn-danger" type="button">
                            Upload
                        </button>
                    </div>
                }
                <i onClick={handleRefresh} className="fa-solid fa-rotate refreshTable"></i>
                {/* <div className="form-check form-switch tableToggler">
                    <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" />
                </div> */}
                <h2>All Training Data</h2>
                <h5 className="container mx-2">
                    {trainingData.length === 0 && "No data to display"}
                </h5>

                <div className="row">
                {/* <HistoryTable columns={columns} data={trainingData} /> */}
                    {trainingData.length > 0 && <HistoryTable columns={columns} data={rows} allTrainingData={trainingData} deleteData={deleteData} getAllTrainingRequest={getAllTrainingRequest} />}
                </div>
            </div>
        </>
    )
}

export default AdminTrainingData;