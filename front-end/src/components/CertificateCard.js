import React from "react";
import Mode from "./Mode";
import CSP from "./CSP";
import { motion } from "framer-motion"

function CertificateCard(props) {

  const { data, updateData, deleteData, revokeData } = props;

  const startDate = new Date(data.date_of_certification).toLocaleDateString();
  const endDate = new Date(data.date_of_expiry).toLocaleDateString();

  return (
    <>
      <div className="col-md-6">
        {data.deleteflag === "deleteRequested" &&
          <>
            <motion.div initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                default: {
                  duration: 0.3,
                  ease: [0, 0.71, 0.2, 1.01]
                },
                scale: {
                  type: "spring",
                  damping: 11,
                  stiffness: 100,
                  restDelta: 0.001
                }
              }}
              className="card my-3 border-dark text-bg-dark">
              <div className="card-body certificate-card">
                <Mode data={data} />
                <CSP data={data} />
                <h6 className="card-subtitle mb-2 text-muted">{data.certification_name}</h6>
                <p className="card-text text-muted">Level - {data.certification_level}</p>
                <p className="card-text text-muted"> Validation Id - {data.certification_id}</p>
                <p className="card-text text-muted">Date of Certification - {startDate}</p>
                <p className="card-text text-muted">Valid till - {endDate}</p>
                <h6 className="card-subtitle mb-2 text-muted">Validity - {data.validity} years</h6>
                {data.deleteflag !== "deleteRequested" && <i id="deleteIcon" className="fa-solid fa-trash-arrow-up mx-2 icon-pointer" onClick={() => deleteData(data)}></i>}
                {data.deleteflag === "deleteRequested" && <i id="revokeIcon" className="fa-solid fa-rectangle-xmark mx-2 icon-pointer" onClick={() => revokeData(data)}></i>}
                <i id="editIcon" className="fa-solid fa-pen-to-square mx-2 icon-pointer" onClick={() => { updateData(data) }}></i>
              </div>
            </motion.div>
          </>
        }
        {data.deleteflag !== "deleteRequested" &&
          <motion.div initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                default: {
                  duration: 0.3,
                  ease: [0, 0.71, 0.2, 1.01]
                },
                scale: {
                  type: "spring",
                  damping: 11,
                  stiffness: 100,
                  restDelta: 0.001
                }
              }} className="card my-3 border-light text-bg-light">
            <div className="card-body certificate-card">
              <Mode data={data} />
              <CSP data={data} />
              <h6 className="card-subtitle mb-2 text-muted">{data.certification_name}</h6>
              <p className="card-text">Level - {data.certification_level}</p>
              <p className="card-text"> Validation Id - {data.certification_id}</p>
              <p className="card-text">Date of Certification - {startDate}</p>
              <p className="card-text">Valid till - {endDate}</p>
              <h6 className="card-subtitle mb-2 text-muted">Validity - {data.validity} years</h6>
              {data.deleteflag !== "deleteRequested" && <i id="deleteIcon" className="fa-solid fa-trash-arrow-up mx-2 icon-pointer" onClick={() => deleteData(data)}></i>}
              {data.deleteflag === "deleteRequested" && <i id="revokeIcon" className="fa-solid fa-rectangle-xmark mx-2 icon-pointer" onClick={() => revokeData(data)}></i>}
              <i id="editIcon" className="fa-solid fa-pen-to-square mx-2 icon-pointer" onClick={() => { updateData(data) }}></i>
            </div>
          </motion.div>}
      </div>
    </>

  )
}

export default CertificateCard;