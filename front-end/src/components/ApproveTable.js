import React, { useState, useEffect } from "react";

function ApproveTable(props) {

    const { allTrainingData, updateTrainingDetails, getAllTrainingRequest } = props;

    //console.log(allTrainingData);

    const [mainData, setMainData] = useState(allTrainingData);

    const [trainingData, setTrainingData] = useState(mainData.filter((datas) => { return datas.request === "false" }));

    const [selectAll, setSelectAll] = useState(false);

    useEffect(() => {
        getAllTrainingRequest();
    }, [trainingData])
    // const [data, setData] = useState({
    //     email_id: "shahil.sinha9378@gmail.com",
    //     eend_date: "2023-1-31",
    //     erequest: true,
    //     erejected: false,
    //     usecert: "Tk5nf6bSNu5TeBKF3mAISEoQYZlmApr"
    // })

    // const handleAllApprove = () => {
    //     updateTrainingDetails(data.usecert, data.email_id, data.eend_date, data.erequest, data.erejected)
    //     .then(data => {
    //         console.log("Updated Successfuly");
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     })
    // }

    const [multiCheck, setMultiCheck] = useState(false);

    let count = 0;

    const handleChange = (e) => {
        //alert("Hello Select");
        const { name, checked } = e.target;
        if (name === "allselect") {
            const checkedValue = trainingData.map((user) => { return { ...user, isChecked: checked } });
            setSelectAll(true);
            count = trainingData.length;
            //console.log(checkedValue);
            setTrainingData(checkedValue);
        } else {
            const checkedValue = trainingData.map((user) => user.usecert === name ? { ...user, isChecked: checked } : user);
            setSelectAll(false);
            console.log(checkedValue);
            for (let i = 0; i < checkedValue.length; i++) {
                if (checkedValue[i].isChecked === true) {
                    count++;
                }
            }
            if (count > 1 && count) {
                setMultiCheck(true);
                setSelectAll(true);
            } else if (count === trainingData.length) {
                setMultiCheck(false);
            } else {
                setMultiCheck(false);
            }
            console.log(count);
            setTrainingData(checkedValue);
        }
    }

    const handleAllApprove = (event) => {
        event.preventDefault();
        const checkedInput = [];
        for (let i = 0; i < trainingData.length; i++) {
            if (trainingData[i].isChecked === true) {
                checkedInput.push(trainingData[i]);
            }
        }
        console.log(checkedInput);
        let rejected = "false";
        let request = "true";
        let date = new Date();
        let month = date.getMonth() + 4;
        let year = date.getFullYear();
        let day = date.getDate();
        let end_date = year + "-" + month + "-" + day;
        for (let j = 0; j < checkedInput.length; j++) {
            updateTrainingDetails(checkedInput[j].usecert, end_date, request, rejected)
                .then(data => {
                    console.log("Approved Successfully", data);
                    const newData = trainingData.filter((data) => { return data.usecert !== checkedInput[j].usecert });
                    console.log(newData);
                    setTrainingData(newData);
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }

    const handleAllReject = (event) => {
        event.preventDefault();
        const checkedInput = [];
        for (let i = 0; i < trainingData.length; i++) {
            if (trainingData[i].isChecked === true) {
                checkedInput.push(trainingData[i]);
            }
        }
        //console.log(checkedInput);
        let rejected = "true";
        let request = "true";
        let end_date = "";
        for (let j = 0; j < checkedInput.length; j++) {
            updateTrainingDetails(checkedInput[j].usecert, end_date, request, rejected)
                .then(data => {
                    console.log("Rejected Successfully", data);
                    console.log(checkedInput);
                    const newData = trainingData.filter((data) => { return data.usecert !== checkedInput[j].usecert });
                    console.log(newData);
                    setTrainingData(newData);
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }

    const mapAdminFunction = trainingData.map((data, index) => {
        return (
            <tr key={index + 1}>
                <th scope="row">{index + 1}</th>
                <td>
                    {data.first_name}
                </td>
                <td>
                    {data.last_name}
                </td>
                <td>
                    {data.email_id}
                </td>
                <td>
                    {data.allocation_sbu}
                </td>
                <td>
                    {data.service_sl}
                </td>
                <td>
                    {data.certificate_name}
                </td>
                <td>
                    {data.csp}
                </td>
                <td>
                    {data.applied_on}
                </td>
                {data.request === "true" ? <td>{data.rejected === "true" ? "Rejected" : "Approved"}</td> : <td>Pending</td>}
                <td>
                    <input name={data.usecert} checked={data?.isChecked || false} onChange={handleChange} className="form-check-input" type="checkbox" id="flexCheckDefault" />
                    {!selectAll && data?.isChecked && <div><i onClick={handleAllApprove} className="fa-solid fa-circle-check table-approve-icon"></i><i onClick={handleAllReject} className="fa-solid fa-rectangle-xmark table-reject-icon"></i></div>}
                </td>
            </tr>
        )
    })


    return (
        <>
            <div className="history-table certificate-card">
                <table className="table table-striped table-striped-columns table-dark table-hover table-bordered">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">First Name</th>
                            <th scope="col">Last Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Allocation SBU</th>
                            <th scope="col">Service SL</th>
                            <th scope="col">Certificate Name</th>
                            <th scope="col">Provider</th>
                            <th scope="col">Applied On</th>
                            <th scope="col">Status</th>
                            <th scope="col">
                                <input name="allselect" checked={!trainingData.some((user) => user?.isChecked !== true)} onChange={handleChange} className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                                {!trainingData.some((user) => user?.isChecked !== true) && <div><i onClick={handleAllApprove} className="fa-solid fa-circle-check table-approve-icon"></i> <i onClick={handleAllReject} className="fa-solid fa-rectangle-xmark table-reject-icon"></i></div>}
                                {multiCheck && <div><i onClick={handleAllApprove} className="fa-solid fa-circle-check table-approve-icon"></i> <i onClick={handleAllReject} className="fa-solid fa-rectangle-xmark table-reject-icon"></i></div>}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {mapAdminFunction}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default ApproveTable;