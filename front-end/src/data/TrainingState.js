import React, { useState } from "react";
import trainingContext from "../context/trainingContext";

const TrainingState = (props) => {

    const Initial = [];

    const [trainingData, setTrainingData] = useState(Initial);

    const [allTrainingData, setAllTrainingData] = useState(Initial);

    ////create training request
    const createTrainingRequest = async (first_name,
        last_name,
        email_id,
        username,
        usecert,
        csp,
        certificate_name,
        allocation_sbu,
        service_sl,
        applied_on,
        end_date,
        request,
        rejected
    ) => {
        //api call
        return await new Promise((resolve, reject) => {
            fetch("https://11h11u0e9l.execute-api.ap-south-1.amazonaws.com/dev/training/register", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({ first_name, last_name, email_id, username, usecert, csp, certificate_name, allocation_sbu, service_sl, applied_on, end_date, request, rejected })
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
    const deleteData = async (usecert) => {

        return await new Promise((resolve, reject) => {
            fetch('https://11h11u0e9l.execute-api.ap-south-1.amazonaws.com/dev/trainingdelete/' + usecert, {
                method: "DELETE",
                // headers: {
                //     'Content-Type': 'application/json',
                //     "Access-Control-Allow-Origin": "*",
                //     'Access-Control-Allow-Credentials': true,
                //     'Access-Control-Allow-Methods':'DELETE',
                // }
            }).then(res => {
                const json = res.json();
                resolve(json);
                //console.log(json);
                console.log("Deleting the note with id" + usecert);
                const newData = trainingData.filter((data) => { return data.usecert !== usecert });
                trainingData(newData);
                // window.location.reload(true);
                const newMainData = allTrainingData.filter((data) => { return data.usecert !== usecert });
                setAllTrainingData(newMainData);
            }).catch(err => {
                reject(err);
            })
        })
    }

    ///getAllTrainingRequest
    const getAllTrainingRequest = async () => {
        //todo api call
        const response = await fetch(`https://11h11u0e9l.execute-api.ap-south-1.amazonaws.com/dev/training/all`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
            }
        });

        const json = await response.json();
        console.log(json);
        ////till here array of items is visible in console
        setAllTrainingData(json.Items);
    }

    //getUserSpecificTrainingDetails
    const getUserSpecificTrainingRequest = async (email_id) => {
        //const email_id = localStorage.getItem("email");
        const response = await fetch('https://11h11u0e9l.execute-api.ap-south-1.amazonaws.com/dev/training/user' + '?email_id=' + email_id, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
            }
        });
        const json = await response.json();
        setTrainingData(json.Items);
        console.log(json);
        ////till here array of items is visible in console
        //setData(json.Items);

    }

    ////updateTrainingDetails
    const updateTrainingDetails = async (
        usecert,
        end_date,
        request,
        rejected) => {

        return await new Promise((resolve, reject) => {
            fetch(`https://11h11u0e9l.execute-api.ap-south-1.amazonaws.com/dev/training/updateinfo/${usecert}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*",

                },
                body: JSON.stringify({ usecert, end_date, request, rejected })
            }).then(res => {
                const json = res.json();
                //console.log(json);
                resolve(json);
                let newData = JSON.parse(JSON.stringify(trainingData))
                ///client side edit logic
                for (let index = 0; index < newData.length; index++) {
                    const element = newData[index];
                    if (element.usecert === usecert) {
                        newData[index].end_date = end_date;
                        newData[index].request = request;
                        newData[index].rejected = rejected;
                        break;
                    }
                }
                setTrainingData(newData);
            }).catch(err => {
                reject(err);
            })
        })
    }


    return (
        <trainingContext.Provider value={{ trainingData, allTrainingData, createTrainingRequest, deleteData, getAllTrainingRequest, getUserSpecificTrainingRequest, updateTrainingDetails }}>
            {props.children}
        </trainingContext.Provider>
    )
}

export default TrainingState;