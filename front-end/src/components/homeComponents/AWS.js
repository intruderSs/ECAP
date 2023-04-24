import React from "react";
import CardCertificate from "./CardCertificate";
import aws from "../../images/aws-icon.png";


function AWS() {
    return (
        <>
            <div className="cert-logo">
                <img src={aws} className="card-img-top" alt="..." />
            </div>
            <div className="row">
                <CardCertificate />
                <CardCertificate />
                <CardCertificate />
                <CardCertificate />
                <CardCertificate />
                <CardCertificate />
                <CardCertificate />
                <CardCertificate />
            </div>
        </>
    )
}

export default AWS;