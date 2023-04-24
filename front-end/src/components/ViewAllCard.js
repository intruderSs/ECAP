import React from "react";
import Mode from "./Mode";
import CSP from "./CSP";


function ViewAllCard(props) {

  // const {deleteData} = context;
  const { data } = props;


  const startDate = new Date(data.date_of_certification).toLocaleDateString();
  const endDate = new Date(data.date_of_expiry).toLocaleDateString();


  return (
    <div className="col-md-6">
      {data.deleteflag === "deleteRequested" &&
        <div className="card my-3 border-dark text-bg-dark">
          <div className="card-body certificate-card">
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
        </div>}
      {data.deleteflag !== "deleteRequested" &&
        <div className="card my-3 border-light text-bg-light">
          <div className="card-body certificate-card">
            <Mode data={data} />
            <CSP data={data} />
            <h6 className="card-subtitle mb-2 text-muted">{data.certification_name}</h6>
            <p className="card-text">Level - {data.certification_level}</p>
            <p className="card-text"> Validation Id - {data.certification_id}</p>
            <p className="card-text">Date of Certification - {startDate}</p>
            <p className="card-text">Valid till - {endDate}</p>
            <h6 className="card-subtitle mb-2 text-muted">Validity - {data.validity} years</h6>
            <h6 className="card-title text-muted custom_name">{data.name}</h6>
            <h6 className="card-title text-muted custom_name">{data.userName}</h6>
          </div>
        </div>}
    </div>
  )
}

export default ViewAllCard;