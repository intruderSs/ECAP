import React from "react";

function UserTable(props) {

    const { trainingData } = props;

    console.log(trainingData);

    const mapFunction = trainingData.map((data, index) => {
        return (
            <tr key={index+1}>
                <th scope="row">{index+1}</th>
                <td>
                    {data.certificate_name}
                </td>
                <td>
                    {data.csp}
                </td>
                <td>
                    {data.applied_on}
                </td>
                {data.request === "true" ?  <td>{data.rejected === "true" ? "-" : data.end_date}</td> : <td>-</td>}
                {data.request === "true" ?  <td>{data.rejected === "true" ? "Rejected" : "Approved"}</td> : <td>Pending</td>}
               
                {/* {!data.rejected === "true" ? <td>
                    {data.end_date}
                </td> : <td>-</td>}
                {!data.rejected === true ? <td>
                    {data.request === true ? "Approved" : "Pending"}
                </td> : <td>
                    Rejected
                </td>} */}
                
            </tr>
        )
    })

    return (
        <>
            <div className="table-custom certificate-card">
                <table className="table table-striped table-striped-columns table-dark table-hover table-bordered">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Certificate Name</th>
                            <th scope="col">Provider</th>
                            <th scope="col">Applied On</th>
                            <th scope="col">Ending On</th>
                            <th scope="col">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mapFunction}
                    </tbody>
                </table>
            </div>
            {/* <h3 className="training-program">Register for a training program!</h3> */}
        </>
    )
}

export default UserTable;