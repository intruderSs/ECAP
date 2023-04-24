import React, { useContext, useEffect, useRef, useState } from "react";
import dataContext from "../context/dataContext";
import { useNavigate } from "react-router";
import ViewAllCard from "./ViewAllCard";
import CertificateTableView from "./CertificateTableView";
import { CSVLink } from "react-csv";

function ViewAllCertificates(props) {

  const context = useContext(dataContext);
  const { allData, getAllData } = context;
  const navigate = useNavigate();

  const ref = useRef(null);
  const refClose = useRef(null);

  const [searchData, setSearchData] = useState("");

  const [tableView, setTableView] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      getAllData();
    } else {
      navigate("/login");
      props.showAlert("First Authorize yourself", "", "warning");
    }
  }, [])

  const onChange = (event) => {
    setSearchData(event.target.value);
    //console.log(searchData);
  }

  // console.log(allData);


  const filtered = allData.filter(data => {
    return data.userName === searchData.toLowerCase() || data.name === searchData.charAt(0).toUpperCase() + searchData.slice(1).toLowerCase() || data.CSP === searchData || data.certification_id === searchData || data.certification_level === searchData.charAt(0).toUpperCase() + searchData.slice(1).toLowerCase() || data.certification_name === searchData;
  })

  //console.log(filtered);
  // console.log(filtered.length);

  const handleClick = (event) => {
    event.preventDefault();
    if (filtered.length === 0) {
      props.showAlert("No data found", "", "warning");
      setSearchData("");
    } else {
      ref.current.click();
    }
  }

  const handleClose = () => {
    setSearchData("");
  }

  const handleRefresh = () => {
    getAllData();
  }

  const handleView = () => {
    setTableView(!tableView);
    //console.log("clicked");
  }

  ////////table view functionality
  const columns = [
    {
      Header: "Username",
      accessor: "name",
    },
    {
      Header: "Email",
      accessor: "userName",
    },
    {
      Header: "Certificate Name",
      accessor: "certification_name",
    },
    {
      Header: "Certificate Level",
      accessor: "certification_level",
    },
    {
      Header: "CSP",
      accessor: "CSP",
    },
    {
      Header: "Certificate ID",
      accessor: "certification_id",
    },

    {
      Header: "Achieved On",
      accessor: "date_of_certification",
    },
    {
      Header: "Ending On",
      accessor: "date_of_expiry",
    }
  ]

  const rows = allData;

  ///////////////download all functionality

  const download_headers = [
    {
      label: "Name", key: "name"
    },
    {
      label: "Email", key: "userName"
    },
    {
      label: "Certificate Name", key: "certification_name"
    },
    {
      label: "Level", key: "certification_level"
    },
    {
      label: "CSP", key: "CSP"
    },
    {
      label: "Certificate ID", key: "certification_id"
    },
    {
      label: "Achieved On", key: "date_of_certification"
    },
    {
      label: "Valid Till", key: "date_of_expiry"
    },
    {
      label: "Validity (in years)", key: "validity"
    }
  ]

  const csvAllLink = {
    filename: "certificate_data.csv",
    headers: download_headers,
    data: allData
  }

  return (
    <>
      <div>
        <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#filtered">
          Launch static backdrop modal
        </button>
        <div className="modal fade modal-xl" id="filtered" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="staticBackdropLabel">{searchData}</h1>
              </div>
              <div className="modal-body">
                <div className="col-md-12">
                  <div className=" my-3">
                    <div className="card-body row">
                      {filtered.map((data) => {
                        return <ViewAllCard key={data.certification_id} data={data} />
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" ref={refClose} onClick={handleClose} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!tableView && allData.length > 0 && <>
        <div className="search_bar">
          <div className="input-group">
            <input className="form-control" type="search" value={searchData} onChange={onChange} placeholder="Search" aria-label="Search" />
            <span className="input-group-text" id="inputGroupPrepend2"><i onClick={handleClick} className="fa-solid fa-magnifying-glass search_icon"></i></span>
          </div>
        </div>
      </>}
      {allData.length > 0 && <div className="download-btn col-md-1">
        <CSVLink className="download-button btn btn-danger" {...csvAllLink}>Download</CSVLink>
      </div>}
      <div className="my-3">
        {allData.length === 0 && <i className="fa-solid fa-rotate refresh" onClick={handleRefresh}></i>}
        {allData.length > 0 && <>
          <i className="fa-solid fa-rotate refreshAdmin" onClick={handleRefresh}></i>
          <div className="form-check form-switch view-toggler">
            <input onClick={handleView} className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" />
          </div>
        </>}
        <h2>All uploaded Certificates</h2>
        <h5 className="container mx-2">
          {allData.length === 0 && "No data to display"}
        </h5>
        {allData.length > 0 && <div className="my-3">
          {tableView && <CertificateTableView columns={columns} data={rows} />}
          <div className="row">
            {!tableView && allData.map((data) => {
              return <ViewAllCard showAlert={props.showAlert} key={data.certification_id} data={data} />;
            })}
          </div>
        </div>}
      </div>
    </>
  )
}

export default ViewAllCertificates;