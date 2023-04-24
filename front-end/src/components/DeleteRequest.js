import React, { useContext, useEffect, useRef, useState } from "react";
import dataContext from "../context/dataContext";
import { useNavigate } from "react-router";
import AdminCard from "./AdminCard";
import ToggleCard from "./ToggleCard";
import mailContext from "../context/mailContext";

function DeleteRequest(props) {

  const context = useContext(dataContext);
  const { delData, getDeleteData, deleteData } = context;
  const navigate = useNavigate();

  const [searchData, setSearchData] = useState("");

  const { sendMail } = useContext(mailContext);

  const ref = useRef(null);
  const refClose = useRef(null);

  const [multiCheck, setMultiCheck] = useState(false);

  const onChange = (event) => {
    setSearchData(event.target.value);
    //console.log(searchData);
  }

  const filtered = delData.filter(data => {
    return data.userName === searchData.toLowerCase() || data.name === searchData.charAt(0).toUpperCase() + searchData.slice(1).toLowerCase() || data.CSP === searchData || data.certification_id === searchData || data.certification_level === searchData.charAt(0).toUpperCase() + searchData.slice(1).toLowerCase() || data.certification_name === searchData;
  })

  const [delete_data, setDelete_Data] = useState(filtered);

  const handleClick = (event) => {
    event.preventDefault();
    if (filtered.length === 0) {
      props.showAlert("No data found", "", "warning");
      setSearchData("");
    } else {
      setDelete_Data(filtered);
      //console.log(delete_data);
      ref.current.click();
    }
  }

  const handleClose = (e) => {
    setSearchData("");
    const checkedVal = delete_data.map((user) => { return { ...user, isChecked: false } });
    setMultiCheck(false);
    setDelete_Data(checkedVal);
  }

  const handleRefresh = () => {
    if (localStorage.getItem("token")) {
      getDeleteData();
    }
  }

  useEffect(() => {
    if (localStorage.getItem('token')) {
      getDeleteData();
    } else {
      navigate("/login");
      props.showAlert("First Authorize yourself", "", "warning");
    }
  }, [])

  const deleteRef = useRef(null);
  const deleteCloseRef = useRef(null);

  const [data, setData] = useState({
    euserName: "",
    eCSP: "",
    ecertification_name: "",
    ecertification_level: "",
    ecertification_id: "",
    edate_of_certification: "",
    edate_of_expiry: "",
    evalidity: "",
    edeleteflag: ""
  })

  const handleDelete = (event) => {
    event.preventDefault();
    console.log("Deleting the certificate data", data);
    deleteData(data.ecertification_id)
      .then(res => {
        props.showAlert("Deleted Successfully", "", "success");
        deleteCloseRef.current.click();
        sendMail(process.env.REACT_APP_ADMIN_EMAIL, data.euserName, `Certificate having id ${data.ecertification_id} deleted successfully`, "Deleted successfully");
      }).catch(err => {
        props.showAlert(`${err}`, "failed to delete", "danger");
        deleteCloseRef.current.click();
      })
  }

  const deltData = (currentData) => {
    setDelete_Data(filtered);
    deleteRef.current.click();
    setData({
      euserName: currentData.userName,
      eCSP: currentData.CSP,
      ecertification_name: currentData.certification_name,
      ecertification_level: currentData.certification_level,
      ecertification_id: currentData.certification_id,
      edate_of_certification: currentData.date_of_certification,
      edate_of_expiry: currentData.date_of_expiry,
      evalidity: currentData.validity,
      edeleteflag: currentData.deleteflag
    })
  }

  let count = 0;

  const handleChange = (e) => {
    const { name, checked } = e.target;
    if (name === "allselect") {
      const checkedVal = delete_data.map((user) => { return { ...user, isChecked: checked } });
      setMultiCheck(false);
      count = delete_data.length;
      console.log(count);
      setDelete_Data(checkedVal);
      console.log(checkedVal);

    } else {
      const checkedVal = delete_data.map((user) => user.certification_id === name ? { ...user, isChecked: checked } : user);
      for (let i = 0; i < checkedVal.length; i++) {
        if (checkedVal[i]?.isChecked) {
          count++
        }
      }
      console.log(count);
      if (count !== 0 && count < delete_data.length) {
        setMultiCheck(true);
      } else if (count === delete_data.length) {
        console.log("reached");
        setMultiCheck(false);
      } else {
        setMultiCheck(false);
      }
      console.log(checkedVal)
      setDelete_Data(checkedVal);
    }
  }

  const handleSomeDelete = () => {
    for (let i = 0; i < delete_data.length; i++) {
      if (delete_data[i]?.isChecked) {
        deleteData(delete_data[i].certification_id)
          .then(res => {
            getDeleteData();
            props.showAlert("Deleted Successfully", "", "success");
            sendMail(process.env.REACT_APP_ADMIN_EMAIL, delete_data[i].userName, `Certificate having id ${delete_data[i].ecertification_id} deleted successfully`, "Deleted successfully");
          }).catch(err => {
            props.showAlert(`${err}`, "failed to delete", "danger");
            deleteCloseRef.current.click();
          })
      }
    }
    refClose.current.click();
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
                {!delete_data.some((user) => user?.isChecked !== true) && <i onClick={handleSomeDelete} className="fa-solid fa-trash-can modal-delete"></i>}
                {multiCheck && <i onClick={handleSomeDelete} className="fa-solid fa-trash-can modal-multi-delete"></i>}
                <input checked={!delete_data.some((user) => user?.isChecked !== true)} onChange={handleChange} name="allselect" className="form-check-input modal-check" type="checkbox" id="mainCheck" />
              </div>
              <div className="modal-body">
                <div className="col-md-12">
                  <div className=" my-3">
                    <div className="card-body row">
                      {delete_data.map((data) => {
                        return <ToggleCard multiCheck={multiCheck} handleChange={handleChange} showAlert={props.showAlert} deleteData={deltData} key={data.certification_id} data={data} />
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


      <div>
        <button ref={deleteRef} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#delete">
          Launch static backdrop modal
        </button>
        <div className="modal fade" id="delete" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="staticBackdropLabel">Are you Sure?, deleting a certificate cannot be undone!!</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-footer">
                <button type="button" ref={deleteCloseRef} className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button className="btn btn-primary" type="button" onClick={handleDelete}>Permanently Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="delete_search_bar">
        <div className="input-group">
          <input className="form-control" type="search" value={searchData} onChange={onChange} placeholder="Search" aria-label="Search" />
          <span className="input-group-text" id="inputGroupPrepend2"><i onClick={handleClick} className="fa-solid fa-magnifying-glass search_icon"></i></span>
        </div>
      </div>
      <div className="my-3">
        <i className="fa-solid fa-rotate refreshDelete" onClick={handleRefresh}></i>
        <h2>Delete Requests</h2>
        <h5 className="container mx-2">
          {delData.length === 0 && "No data to display"}
        </h5>
        <div className="row my-3">
          {delData.map((data) => {
            return <AdminCard showAlert={props.showAlert} key={data.certification_id} deleteData={deltData} data={data} />;
          })}
        </div>
      </div>
    </>
  )
}

export default DeleteRequest;