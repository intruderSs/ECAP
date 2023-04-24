import React from "react";
import Mode from "./Mode";
import CSP from "./CSP";


function ToggleCard(props) {

  // const {deleteData} = context;
  const { data, handleChange } = props;

  const startDate = new Date(data.date_of_certification).toLocaleDateString();
  const endDate = new Date(data.date_of_expiry).toLocaleDateString();

  //console.log(data);

  return (
    <div className="col-md-6">
      <div className="card my-3 text-bg-dark">
        <div className="card-body certificate-card">
          {data?.isChecked && <i className="fa-solid fa-trash-can toggle-delete-icon"></i>}
          <input name={data.certification_id} checked={data?.isChecked || false} onChange={handleChange} className="form-check-input toggle-card-check" type="checkbox" id="childCheck" />
          <Mode data={data} />
          <CSP data={data} />
          <h6 className="card-subtitle mb-2 text-muted">{data.certification_name}</h6>
          <p className="card-text text-muted">Level - {data.certification_level}</p>
          <p className="card-text text-muted"> Validation Id - {data.certification_id}</p>
          <p className="card-text text-muted">Date of Certification - {startDate}</p>
          <p className="card-text text-muted">Valid till - {endDate}</p>
          <h6 className="card-subtitle mb-2 text-muted">Validity - {data.validity} years</h6>
          <h6 className="card-title text-muted custom_name">{data.name}</h6>
          <h6 className="card-title text-muted custom_name">{data.userName}</h6>
        </div>
      </div>
    </div>
  )
}

export default ToggleCard;