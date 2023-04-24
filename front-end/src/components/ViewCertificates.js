import React, { useContext, useEffect, useRef, useState } from "react";
import dataContext from "../context/dataContext";
import CertificateCard from "./CertificateCard";
import { useNavigate } from "react-router";
import SuggestionsAWS from "./Suggestions/SuggestionsAWS";
import SuggestionsGCP from "./Suggestions/SuggestionsGCP";
import SuggestionsIBM from "./Suggestions/SuggestionsIBM";
import SuggestionsSalesforce from "./Suggestions/SuggestionsSalesforce";
import SuggestionsOracle from "./Suggestions/SuggestionsOracle";
import SuggestionsAzure from "./Suggestions/SuggestionsAzure";

function Dashboard(props) {

  const context = useContext(dataContext);
  const { datas, getData, editData, deleteFlag } = context;
  const navigate = useNavigate();


  useEffect(() => {
    if (localStorage.getItem('token')) {
      getData();
    } else {
      navigate("/login");
      props.showAlert("First Authorize yourself", "", "warning");
    }
  }, [])

  const ref = useRef(null);
  const refClose = useRef(null);

  const deleteRef = useRef(null);
  const deleteCloseRef = useRef(null);

  const removeRef = useRef(null);
  const removeCloseRef = useRef(null);

  const [data, setData] = useState({
    euserName: "",
    eCSP: "",
    ecertification_name: "",
    ecertification_level: "",
    ecertification_id: "",
    edate_of_certification: "",
    edate_of_expiry: "",
    evalidity: "",
    edeleteflag: "",
  })



  const handleSubmit = (event) => {
    console.log("Updating the certificate data", data);
    event.preventDefault();
    editData(data.euserName,
      data.eCSP,
      data.ecertification_name,
      data.ecertification_level,
      data.ecertification_id,
      data.edate_of_certification,
      data.edate_of_expiry,
      data.evalidity,
      data.edeleteflag,
    )
      .then(data => {
        props.showAlert("Certificate data updated successfully", "", "success");
        refClose.current.click();
      })
      .catch(err => {
        props.showAlert(`${err}`, "failed to update", "danger");
        refClose.current.click();
      })
    // window.location.reload(true);

  }

  /////relete request function [add an attribute to the data like deleteRequested]
  const handleDelete = (event) => {
    let deleteflag = "deleteRequested";
    event.preventDefault();
    deleteFlag(data.ecertification_id, deleteflag)
      .then(data => {
        props.showAlert("Delete request raised successfully", "wait some time to get response from the admin", "success");
        deleteCloseRef.current.click();
      })
      .catch(err => {
        props.showAlert(`${err}`, "failed to raise request", "danger");
        deleteCloseRef.current.click();
      })
  }

  /////removing the delete request
  const handleRevoke = (event) => {
    let deleteflag = "removeDeleteRequest";
    event.preventDefault();
    deleteFlag(data.ecertification_id, deleteflag)
      .then(data => {
        props.showAlert("Delete request removed successfully", "", "success");
        removeCloseRef.current.click();
      }).catch(err => {
        props.showAlert(`${err}`, "failed to remove request", "success");
        removeCloseRef.current.click();
      })
  }

  const onChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value })
  }

  const delData = (currentData) => {
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

  const revData = (currentData) => {
    removeRef.current.click();

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

  const refreshClick = () => {
    if (localStorage.getItem("token")) {
      getData();
    }
  }



  const updateData = (currentData) => {
    ////update function
    ref.current.click();

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

  const onInput = (event) => {
    if (event.target.value.length > 1) {
      event.target.value = "";
      props.showAlert("Invalid Validity : ", "it should be 1,2 or 3 years", "warning");
    }
    event.target.value = event.target.value.replace(/[4-9 && 0]/g, "");
    //value = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
  }

  ////start of certification

  let date = new Date();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let day = date.getDate();

  let maxDate = year + '-' + month + '-' + day;
  //console.log(maxDate);


  let minYear = date.getFullYear() - 5;
  let minDate = minYear + '-' + month + '-' + day;


  /////end of certification
  let enteredDate = new Date(data.edate_of_certification);
  // console.log("entered date" + enteredDate);

  let expMonth = enteredDate.getMonth() + 1;
  let expYear = enteredDate.getFullYear();
  let expDay = enteredDate.getDate();

  let minExpYear = expYear + 1;
  let maxExpYear = expYear + 3;

  let minExpDate = minExpYear + '-' + expMonth + '-' + expDay;
  let maxExpDate = maxExpYear + '-' + expMonth + '-' + expDay;

  // console.log("minimum" + minExpDate);
  //console.log("max" + maxExpDate);

  let endDate = new Date(data.edate_of_expiry);
  let endDate_s = endDate.getFullYear();

  let validity_data = endDate_s - expYear;
  data.evalidity = validity_data;


  return (
    <>
      <div>
        <button ref={deleteRef} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#delete">
          Launch static backdrop modal
        </button>
        <div className="modal fade" id="delete" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="staticBackdropLabel">Want to raise a delete request?</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-footer">
                <button type="button" ref={deleteCloseRef} className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button className="btn btn-primary" type="button" onClick={handleDelete}>Raise request</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <button ref={removeRef} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#remove">
          Launch static backdrop modal
        </button>
        <div className="modal fade" id="remove" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="staticBackdropLabel">Want to keep the certificate?</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-footer">
                <button type="button" ref={removeCloseRef} className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button className="btn btn-primary" type="button" onClick={handleRevoke}>Remove request</button>
              </div>
            </div>
          </div>
        </div>
      </div>


      <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
        Launch static backdrop modal
      </button>
      <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">Edit details about your certificate</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form className='my-3 '>
                <div className="input-group mb-3">
                  <label className="input-group-text" htmlFor="inputGroupSelect01"><i className="fa-solid fa-square-poll-horizontal icon-color"></i></label>
                  <select disabled value={data.eCSP} className="form-select" id="eCSP" name="eCSP" onChange={onChange}>
                    <option value="AWS">AWS</option>
                    <option value="Azure">Azure</option>
                    <option value="GCP">GCP</option>
                    <option value="Oracle">Oracle</option>
                    <option value="Salesforce">Salesforce</option>
                  </select>
                </div>
                <div className="input-group mb-3">
                  <input disabled id="ecertification_name" value={data.ecertification_name} name="ecertification_name" onChange={onChange} type="text" className="form-control" placeholder="Enter Certification Name" aria-label="Certification Name" aria-describedby="basic-addon2" required />
                  <span className="input-group-text" id="basic-addon2"><i className="fa-solid fa-file-signature icon-color"></i></span>
                </div>
                <div className="input-group mb-3">
                  <span className="input-group-text" id="basic-addon3"><i className="fa-solid fa-code icon-color"></i></span>
                  <input disabled id="ecertification_level" value={data.ecertification_level} name="ecertification_level" onChange={onChange} type="text" className="form-control" placeholder="Enter Certification Level" aria-describedby="basic-addon3" required />
                </div>

                <div className="input-group mb-3">
                  <span className="input-group-text"><i className="fa-solid fa-id-card icon-color"></i></span>
                  <input disabled id="ecertification_id" value={data.ecertification_id} name="ecertification_id" onChange={onChange} type="text" className="form-control" placeholder="Enter Validation Id" aria-label="Amount (to the nearest dollar)" required />
                </div>

                <div className="input-group mb-3">
                  <input min={minDate} max={maxDate} id="edate_of_certification" defaultValue={data.edate_of_certification} name="edate_of_certification" onChange={onChange} type="date" className="form-control" placeholder="Valid till" aria-label="Server" required />
                  <span className="input-group-text"><i className="fa-solid fa-calendar-days icon-color"></i></span>
                  <input min={minExpDate} max={maxExpDate} id="edate_of_expiry" defaultValue={data.edate_of_expiry} name="edate_of_expiry" onChange={onChange} type="date" className="form-control" placeholder="Valid till" aria-label="Server" required />
                </div>
                <div className="input-group mb-3">
                  <input id="evalidity" onInput={onInput} value={data.evalidity} name="evalidity" onChange={onChange} type="number" className="form-control" placeholder="Validity" aria-label="Server" required />
                  <span className="input-group-text"><i className="fa-solid fa-hashtag icon-color"></i></span>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" ref={refClose} className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button disabled={data.ecertification_name.length < 5 || data.ecertification_level.length < 5 || data.ecertification_id < 10 || data.edate_of_certification === "" || data.edate_of_expiry === "" || data.evalidity === ""} type="button" onClick={handleSubmit} className="btn btn-primary">Save Changes</button>
            </div>
          </div>
        </div>
      </div>
      <div className="my-3">
        <i className="fa-solid fa-rotate refresh" onClick={refreshClick}></i>
        <h2>Your Achieved Certificates</h2>
        <h5 className="container mx-2">
          {datas.length === 0 && "No data to display"}
        </h5>
        <div className="row my-3">
          {datas.map((data) => {
            return <CertificateCard showAlert={props.showAlert} key={data.certification_id} revokeData={revData} deleteData={delData} updateData={updateData} data={data} />;
          })}
        </div>
      </div>
      {datas.filter((data) => { return data.CSP === "AWS" }).length > 0 && <div>
        <SuggestionsAWS datas={datas} />
      </div>}
      {datas.filter((data) => { return data.CSP === "Salesforce" }).length > 0 && <div>
        <SuggestionsSalesforce datas={datas} />
      </div>}
      {datas.filter((data) => { return data.CSP === "Azure" }).length > 0 && <div>
        <SuggestionsAzure datas={datas} />
      </div>}
      {datas.filter((data) => { return data.CSP === "IBM" }).length > 0 && <div>
        <SuggestionsIBM datas={datas} />
      </div>}
      {datas.filter((data) => { return data.CSP === "Oracle" }).length > 0 && <div>
        <SuggestionsOracle datas={datas} />
      </div>}
      {datas.filter((data) => { return data.CSP === "GCP" }).length > 0 && <div>
        <SuggestionsGCP datas={datas} />
      </div>}

    </>
  )
}

export default Dashboard;