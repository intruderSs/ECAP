import React from "react";
import aws from "../images/aws-icon.png";
import google from "../images/google-cloud-icon.png";
import oracle from "../images/oracle-icon.png";
import salesforce from "../images/salesforce-icon.png";
import azure from "../images/azure-icon.png";
import ibm from "../images/ibm-icon.png";


function Mode(props) {
    const { data } = props;



    return (
        <>
            {data.CSP === "AWS" && data.deleteflag === "deleteRequested" && <i className="fa-brands fa-aws custom-icon-position aws-orange"></i>}
            {data.CSP === "AWS" && data.deleteflag === "removeDeleteRequest" && <img src={aws} alt="Logo" className="d-inline-block  align-text-top custom-icon-position aws"></img>}
            {data.CSP === "GCP" && <img src={google} alt="Logo" className="d-inline-block  align-text-top custom-icon-position google"></img>}
            {data.CSP === "Azure" && <img src={azure} alt="Logo" className="d-inline-block  align-text-top custom-icon-position azure"></img>}
            {data.CSP === "Salesforce" && <img src={salesforce} alt="Logo" className="d-inline-block  align-text-top custom-icon-position salesforce"></img>}
            {data.CSP === "Oracle" && <img src={oracle} alt="Logo" className="d-inline-block  align-text-top custom-icon-position oracle"></img>}
            {data.CSP === "IBM" && <img src={ibm} alt="Logo" className="d-inline-block  align-text-top custom-icon-position ibm"></img>}
        </>
    )
}

export default Mode;