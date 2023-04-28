import React, { useState } from "react";
import approveContext from "../context/approveContext";

const ApproveState = (props) => {

    const Initial = [];

    const [approveData, setApproveData] = useState(Initial);

    ////create training request
    const createApproveData = async (approve_id,
        email_id,
        name,
        skills,
        approval_status,
        approved_,
        approved_by,
        date,
        cluster
    ) => {
        //api call
        return await new Promise((resolve, reject) => {
            fetch("https://2pnugsu1o4.execute-api.ap-south-1.amazonaws.com/dev/approvedata/add", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({ approve_id, email_id, name, skills, approval_status, approved_, approved_by, date, cluster })
            }).then(res => {
                if (!res.ok) {
                    throw new Error(res.statusText);
                }
                const data = res.json();
                //console.log(data);
                // console.log("Adding a new certificate data");
                resolve(data);
            }).catch(err => {
                console.log(err.message);
                reject(err.message);
            })
        })
    }

    ///delete training request
    const deleteApproveData = async (approve_id) => {
        return await new Promise((resolve, reject) => {
            fetch(`https://2pnugsu1o4.execute-api.ap-south-1.amazonaws.com/dev/approvedata/delete/${approve_id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*",
                }
            }).then(res => {
                const json = res.json();
                resolve(json);
                //console.log(json);
                console.log("Deleting the approve request with id" + approve_id);
                // window.location.reload(true);
                const newMainData = approveData.filter((data) => { return data.approve_id !== approve_id });
                setApproveData(newMainData);
            }).catch(err => {
                reject(err);
            })
        })
    }

    ///getAllTrainingRequest
    const getAllApproveData = async () => {
        //todo api call
        const response = await fetch(`https://2pnugsu1o4.execute-api.ap-south-1.amazonaws.com/dev/approvedata/getall`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
            }
        });

        const json = await response.json();
        //console.log(json);
        ////till here array of items is visible in console
        setApproveData(json.Items);
    }

    ////updateTrainingDetails
    const updateApproveData = async (approve_id,
        approval_status,
        approved_,
        approved_by,
        date,
        cluster) => {
        return await new Promise((resolve, reject) => {
            fetch(`https://2pnugsu1o4.execute-api.ap-south-1.amazonaws.com/dev/approvedata/update`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*",

                },
                body: JSON.stringify({ approve_id, approval_status , approved_, approved_by, date, cluster})
            }).then(res => {
                const json = res.json();
                //console.log(json);
                resolve(json);
                let newData = JSON.parse(JSON.stringify(approveData))
                ///client side edit logic
                for (let index = 0; index < newData.length; index++) {
                    const element = newData[index];
                    if (element.approve_id === approve_id) {
                        newData[index].approval_status = approval_status;
                        newData[index].approved_ = approved_;
                        newData[index].approved_by = approved_by;
                        newData[index].date = date;
                        newData[index].cluster = cluster;
                        break;
                    }
                }
                setApproveData(newData);
            }).catch(err => {
                reject(err);
            })
        })
    }

    return (
        <approveContext.Provider value={{ approveData, createApproveData, deleteApproveData, getAllApproveData, updateApproveData }}>
            {props.children}
        </approveContext.Provider>
    )
}

export default ApproveState;