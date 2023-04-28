import React, { useState } from "react";
import dataContext from "../context/dataContext";

const DataState = (props) => {

    const Initial = [];

    const [datas, setData] = useState(Initial);

    const [delData, setDelData] = useState(Initial);

    const [allData, setAllData] = useState(Initial);


    ////get user specific certificates data
    const getData = async () => {
        //todo api call
        const username = localStorage.getItem('email');
        const response = await fetch(`https://2pnugsu1o4.execute-api.ap-south-1.amazonaws.com/dev/certificateList` + '?username=' + username, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
            }
        });

        const json = await response.json();
        //console.log(json);
        ////till here array of items is visible in console
        setData(json.Items);

    }


    /////get data with delete flag
    const getDeleteData = async () => {
        //todo api call
        const deleteflag = "deleteRequested";
        const response = await fetch(`https://b9tdhv1wva.execute-api.ap-south-1.amazonaws.com/dev/certificateList` + '?deleteflag=' + deleteflag, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
            }
        });

        const json = await response.json();
        //console.log(json);
        ////till here array of items is visible in console
        //setData(json.Items);
        setDelData(json.Items);
    }


    ////get {ADMIN} all certificates data
    const getAllData = async () => {
        //todo api call
        const response = await fetch(`https://fz2xtk2dud.execute-api.ap-south-1.amazonaws.com/dev/certificateList`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
            }
        });

        const json = await response.json();
        //console.log(json);
        ////till here array of items is visible in console
        setAllData(json.Items);

    }


    ////add certificate data functionality

    const addData = async (userName,
        name,
        CSP,
        certification_name,
        certification_level,
        certification_id,
        date_of_certification,
        date_of_expiry,
        validity,
        deleteflag
    ) => {
        //api call
        return await new Promise((resolve, reject) => {
            fetch("https://2pnugsu1o4.execute-api.ap-south-1.amazonaws.com/dev/certificateList", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({ userName, name, CSP, certification_name, certification_level, certification_id, date_of_certification, date_of_expiry, validity, deleteflag })
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

    // const addData = async (userName,
    //     name,
    //     CSP,
    //     certification_name,
    //     certification_level,
    //     certification_id,
    //     date_of_certification,
    //     date_of_expiry,
    //     validity,
    //     deleteflag
    // ) => {
    //     //api call
    //     return await new Promise((resolve, reject) => {
    //         fetch("https://11h11u0e9l.execute-api.ap-south-1.amazonaws.com/dev/certificateList", {
    //             method: "POST",
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 "Access-Control-Allow-Origin": "*",
    //             },
    //             body: JSON.stringify({ userName, name, CSP, certification_name, certification_level, certification_id, date_of_certification, date_of_expiry, validity, deleteflag })
    //         }).then(res => {
    //             if (!res.ok) {
    //                 throw new Error(res.statusText);
    //             }
    //             const data = res.json();
    //             //console.log(data);
    //             // console.log("Adding a new certificate data");
    //             resolve(data);
    //         }).catch(err => {
    //             console.log(err);
    //             reject(err.message);
    //         })
    //     })
    // }

    /////delete certificate data functionality
    const deleteData = async (certification_id) => {

        return await new Promise((resolve, reject) => {
            fetch(`https://2pnugsu1o4.execute-api.ap-south-1.amazonaws.com/dev/certificateList/${certification_id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*",
                }
            }).then(res => {
                const json = res.json();
                resolve(json);
                //console.log(json);
                console.log("Deleting the note with id" + certification_id);
                const newData = delData.filter((data) => { return data.certification_id !== certification_id });
                setDelData(newData);
                // window.location.reload(true);
                const newMainData = datas.filter((data) => { return data.certification_id !== certification_id });
                setData(newMainData);
            }).catch(err => {
                reject(err);
            })
        })
    }


    ///////add delete flag 
    const deleteFlag = async (
        certification_id,
        deleteflag) => {

        return await new Promise((resolve, reject) => {
            fetch(`https://fz2xtk2dud.execute-api.ap-south-1.amazonaws.com/dev/certificateList/${certification_id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*",

                },
                body: JSON.stringify({ certification_id, deleteflag })
            }).then(res => {
                const json = res.json();
                //console.log(json);
                resolve(json);
                let newData = JSON.parse(JSON.stringify(datas))
                ///client side edit logic
                for (let index = 0; index < newData.length; index++) {
                    const element = newData[index];
                    if (element.certification_id === certification_id) {
                        newData[index].deleteflag = deleteflag;
                        break;
                    }
                }
                setData(newData);
            }).catch(err => {
                reject(err);
            })
        })
    }

    ///////add delete flag 
    const updateUsername = async (
        certification_id,
        name) => {
        return await new Promise((resolve, reject) => {
            fetch(`https://b9tdhv1wva.execute-api.ap-south-1.amazonaws.com/dev/certificateList/${certification_id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*",

                },
                body: JSON.stringify({ certification_id, name })
            }).then(res => {
                resolve(res);
                const json = res.json();
                //console.log(json);
                let newData = JSON.parse(JSON.stringify(datas))
                ///client side edit logic
                for (let index = 0; index < newData.length; index++) {
                    const element = newData[index];
                    if (element.certification_id === certification_id) {
                        newData[index].name = name;
                        break;
                    }
                }
                setData(newData);
            }).catch(err => {
                reject(err);
            })
        })
    }


    ///////edit certificate data functionality
    const editData = async (userName,
        CSP,
        certification_name,
        certification_level,
        certification_id,
        date_of_certification,
        date_of_expiry,
        validity) => {

        return await new Promise((resolve, reject) => {
            fetch(`https://2pnugsu1o4.execute-api.ap-south-1.amazonaws.com/dev/certificateList/${certification_id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*",

                },
                body: JSON.stringify({ userName, CSP, certification_name, certification_level, certification_id, date_of_certification, date_of_expiry, validity })
            }).then(res => {
                const json = res.json();
                //console.log(json);
                resolve(json);
                let newData = JSON.parse(JSON.stringify(datas))
                ///client side edit logic
                for (let index = 0; index < newData.length; index++) {
                    const element = newData[index];
                    if (element.certification_id === certification_id) {
                        newData[index].userName = userName;
                        newData[index].CSP = CSP;
                        newData[index].certification_name = certification_name;
                        newData[index].certification_level = certification_level;
                        newData[index].certification_id = certification_id;
                        newData[index].date_of_certification = date_of_certification;
                        newData[index].date_of_expiry = date_of_expiry;
                        newData[index].validity = validity;
                        break;
                    }
                }
                setData(newData);
            }).catch(err => {
                reject(err);
            })
        })



    }


    return (
        <dataContext.Provider value={{ datas, delData, allData, setData, addData, deleteData, getData, editData, getAllData, deleteFlag, getDeleteData, updateUsername }}>
            {props.children}
        </dataContext.Provider>
    )
}

export default DataState;