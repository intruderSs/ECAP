import React, { useState } from "react";
import userContext from "../context/userContext";

const UserState = (props) => {

    const Initial = [];

    const [userData, setUserData] = useState(Initial);

    const [allUserData, setAllUserData] = useState(Initial);

    ////create training request
    const createUser = async (first_name,
        last_name,
        email_id,
        allocation_sbu,
        service_sl,
    ) => {
        //api call
        return await new Promise((resolve, reject) => {
            fetch("https://2pnugsu1o4.execute-api.ap-south-1.amazonaws.com/dev/user", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({ first_name, last_name, email_id, allocation_sbu, service_sl })
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
    const deleteUser = async () => {
        const email_id = localStorage.getItem('email');
        return await new Promise((resolve, reject) => {
            fetch(`https://2pnugsu1o4.execute-api.ap-south-1.amazonaws.com/dev/deleteuser/${email_id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*",
                }
            }).then(res => {
                const json = res.json();
                resolve(json);
                //console.log(json);
                console.log("Deleting the training request with id" + email_id);
                // window.location.reload(true);
                const newMainData = userData.filter((data) => { return data.email_id !== email_id });
                userData(newMainData);
            }).catch(err => {
                reject(err);
            })
        })
    }

    ///getAllTrainingRequest
    const getAllUserData = async () => {
        //todo api call
        const response = await fetch(`https://2pnugsu1o4.execute-api.ap-south-1.amazonaws.com/dev/user/all`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
            }
        });

        const json = await response.json();
       // console.log(json);
        ////till here array of items is visible in console
        setAllUserData(json.Items);
    }

    //getUserSpecificTrainingDetails
    const getSpecificUserData = async (email_id) => {
        //const email_id = localStorage.getItem('email');
        const response = await fetch('https://2pnugsu1o4.execute-api.ap-south-1.amazonaws.com/dev/user/specific' + '?email_id=' + email_id, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
            }
        });
        const json = await response.json();
        setUserData(json.Items);
        //console.log(json);
        ////till here array of items is visible in console
        //setData(json.Items);
        //console.log(json.Items[0].allocation_sbu);
        //console.log(json.Items[0].service_sl);
        localStorage.setItem('sbu', json.Items[0].allocation_sbu);
        localStorage.setItem('sl', json.Items[0].service_sl);

    }

    const getSpecificData = async (email_id) => {
        return await new Promise((resolve, reject) => {
            fetch('https://2pnugsu1o4.execute-api.ap-south-1.amazonaws.com/dev/user/specific' + '?email_id=' + email_id, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*",
                }
            })
            .then(res => {
                const json = res.json();
                resolve(json);
            })
            .catch(err => {
                reject(err);
            })
        })
    }

    ////updateTrainingDetails
    const updateUserData = async (
        first_name,
        last_name,
        allocation_sbu,
        service_sl) => {
        const email_id = localStorage.getItem("email");
        return await new Promise((resolve, reject) => {
            fetch(`https://2pnugsu1o4.execute-api.ap-south-1.amazonaws.com/dev/user/update/${email_id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*",

                },
                body: JSON.stringify({ first_name, last_name, email_id, allocation_sbu, service_sl })
            }).then(res => {
                const json = res.json();
                //console.log(json);
                resolve(json);
                let newData = JSON.parse(JSON.stringify(userData))
                ///client side edit logic
                for (let index = 0; index < newData.length; index++) {
                    const element = newData[index];
                    if (element.email_id === email_id) {
                        newData[index].first_name = first_name;
                        newData[index].last_name = last_name;
                        newData[index].allocation_sbu = allocation_sbu;
                        newData[index].service_sl = service_sl;
                        break;
                    }
                }
                setUserData(newData);
            }).catch(err => {
                reject(err);
            })
        })
    }

     ////addSkill
     const addSkill = async (
        email_id,
        skill_set) => {
        return await new Promise((resolve, reject) => {
            fetch(`https://2pnugsu1o4.execute-api.ap-south-1.amazonaws.com/dev/user/addskill/${email_id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*",

                },
                body: JSON.stringify({ skill_set, email_id })
            }).then(res => {
                const json = res.json();
                //console.log(json);
                resolve(json);
                let newData = JSON.parse(JSON.stringify(userData))
                ///client side edit logic
                for (let index = 0; index < newData.length; index++) {
                    const element = newData[index];
                    if (element.email_id === email_id) {
                        newData[index].skill_set = skill_set;
                        break;
                    }
                }
                setUserData(newData);
            }).catch(err => {
                reject(err);
            })
        })
    }

    ////addCluster
    const addCluster = async (
        email_id,
        skill_cluster) => {
        return await new Promise((resolve, reject) => {
            fetch(`https://2pnugsu1o4.execute-api.ap-south-1.amazonaws.com/dev/user/addcluster/${email_id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*",

                },
                body: JSON.stringify({ email_id, skill_cluster })
            }).then(res => {
                const json = res.json();
                //console.log(json);
                resolve(json);
                let newData = JSON.parse(JSON.stringify(userData))
                ///client side edit logic
                for (let index = 0; index < newData.length; index++) {
                    const element = newData[index];
                    if (element.email_id === email_id) {
                        newData[index].skill_cluster = skill_cluster;
                        break;
                    }
                }
                setUserData(newData);
            }).catch(err => {
                reject(err);
            })
        })
    }

     ////addProject
     const allotProject = async (
        email_id,
        project) => {
        return await new Promise((resolve, reject) => {
            fetch(`https://2pnugsu1o4.execute-api.ap-south-1.amazonaws.com/dev/user/addproject/${email_id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*",

                },
                body: JSON.stringify({ email_id, project })
            }).then(res => {
                const json = res.json();
                //console.log(json);
                resolve(json);
                let newData = JSON.parse(JSON.stringify(userData))
                ///client side edit logic
                for (let index = 0; index < newData.length; index++) {
                    const element = newData[index];
                    if (element.email_id === email_id) {
                        newData[index].project = project;
                        break;
                    }
                }
                setUserData(newData);
            }).catch(err => {
                reject(err);
            })
        })
    }

     ////addProject
     const addKnowledgeCheck = async (
        email_id,
        knowledgeTest) => {
        return await new Promise((resolve, reject) => {
            fetch(`https://2pnugsu1o4.execute-api.ap-south-1.amazonaws.com/dev/user/knowledgetest/${email_id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*",

                },
                body: JSON.stringify({ email_id, knowledgeTest })
            }).then(res => {
                const json = res.json();
                //console.log(json);
                resolve(json);
                let newData = JSON.parse(JSON.stringify(userData))
                ///client side edit logic
                for (let index = 0; index < newData.length; index++) {
                    const element = newData[index];
                    if (element.email_id === email_id) {
                        newData[index].knowledgeTest = knowledgeTest;
                        break;
                    }
                }
                setUserData(newData);
            }).catch(err => {
                reject(err);
            })
        })
    }


    return (
        <userContext.Provider value={{ userData, allUserData, createUser, deleteUser, getAllUserData, getSpecificUserData, updateUserData, addSkill, addCluster, getSpecificData, allotProject, addKnowledgeCheck }}>
            {props.children}
        </userContext.Provider>
    )
}

export default UserState;