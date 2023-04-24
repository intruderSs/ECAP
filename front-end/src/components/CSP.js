import React from "react";

function CSP(props) {
    const { data } = props;

    let cls = "";

    if (data.CSP === "Salesforce") {
        cls = "card-title salesforce";
    } else if (data.CSP === "AWS") {
        cls = "card-title";
    } else if (data.CSP === "GCP") {
        cls = "card-title";
    } else if (data.CSP === "IBM") {
        cls = "card-title ibm";
    } else if (data.CSP === "Oracle") {
        cls = "card-title oracle";
    } else if (data.CSP === "Azure") {
        cls = "card-title azure";
    }

    let name = "";
    let first = "";
    let second = "";
    let third = "";

    if (data.CSP === "GCP" || data.CSP === "AWS") {
        name = data.CSP;
        first = name.charAt(0);
        second = name.charAt(1);
        third = name.charAt(2);
    }

    return (
        <>
            {data.CSP === "GCP" && <h5 className={cls}><span className="g">{first}</span><span className="c">{second}</span><span className="p">{third}</span></h5>}
            {data.CSP === "AWS" && data.deleteflag === "removeDeleteRequest" && <h5 className={cls}><span className="aw">{first}</span><span className="aw">{second}</span><span className="s">{third}</span></h5>}
            {data.CSP === "AWS" && data.deleteflag === "deleteRequested" && <h5 className={cls}><span className="aws">{first}</span><span className="aws">{second}</span><span className="aws">{third}</span></h5>}
            {data.CSP === "Azure" && <h5 className={cls}>{data.CSP}</h5>}
            {data.CSP === "Oracle" && <h5 className={cls}>{data.CSP}</h5>}
            {data.CSP === "Salesforce" && <h5 className={cls}>{data.CSP}</h5>}
            {data.CSP === "IBM" && <h5 className={cls}>{data.CSP}</h5>}
        </>

    )

}

export default CSP;