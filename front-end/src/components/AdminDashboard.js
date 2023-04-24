import React, { useRef, useContext, useEffect, useState } from "react";
import shahil from "../images/shahil.png";
import trainingContext from "../context/trainingContext";
import { useNavigate } from "react-router-dom";
import ApproveTable from "./ApproveTable";
import dataContext from "../context/dataContext";
import { AccountContext } from "../context/Account";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import userContext from "../context/userContext";

function AdminDashboard(props) {

    const context = useContext(trainingContext);
    const { allTrainingData, getAllTrainingRequest } = context;

    const certContext = useContext(dataContext);
    const { delData, allData, getAllData, getDeleteData } = certContext;
    
    const { getSession, authenticate } = useContext(AccountContext);

    const { allUserData, getAllUserData } = useContext(userContext);

    const trainingData = allTrainingData.filter((datas) => { return datas.request === "false" });

    const navigate = useNavigate();

    const allTData = allTrainingData.filter((data) => { return data.request === true });

    const allApprovedData = allTData.filter((data) => { return data.rejected === false });

    const refchngNameDashboard = useRef(null);
    const refClosechngNameDashboard = useRef(null);

    const [newFirstName, setNewFirstName] = useState("");
    const [newLastName, setNewLastName] = useState("");
    const [changeEmailPassword, setchangeEmailPassword] = useState("");
    const [Picon, setPIcon] = useState(false);
    const [NPicon, setNPicon] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('token')) {
            getAllTrainingRequest();
            getAllData();
            getDeleteData();
            getAllUserData();
        }
    }, [])

    const viewPendingRequest = (event) => {
        getAllTrainingRequest();
        navigate('/pendingrequests');
    }

    const handeleDeleteAlert = (event) => {
        getDeleteData();
        navigate("/deleterequest");
    }

    const showCurrentPassword = () => {
        var x = document.getElementById("newPass");
        if (x.type === "password") {
            x.type = "text";
            setPIcon(true);
        } else {
            x.type = "password";
            setPIcon(false);
        }
    }

    const handleEdit = () => {
        refchngNameDashboard.current.click();
    }

    const changeUsername = (event) => {
        event.preventDefault();
        getSession().then(({ user, email }) => {
            authenticate(email, changeEmailPassword).then(() => {
                const attributes = [
                    new CognitoUserAttribute({ Name: 'name', Value: newFirstName }, { Name: 'nickname', Value: newLastName }),
                ];
                user.updateAttributes(attributes, (err, result) => {
                    if (err) {
                       // setSuccess(false);
                        props.showAlert("Failure", `${err.message}`, "warning");
                        setNewFirstName("");
                        setNewLastName("");
                        setchangeEmailPassword("");
                    } else {
                        //setSuccess(true);
                        props.showAlert(`${result}`, "Username changed successfully", "success");
                        console.log(result);
                        localStorage.setItem('first_name', newFirstName);
                        localStorage.setItem('last_name', newLastName);
                        refClosechngNameDashboard.current.click();
                        setNewFirstName("");
                        setNewLastName("");
                        setchangeEmailPassword("");
                    }
                })
            })
        })
    }

    return (
        <>
            <button ref={refchngNameDashboard} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#changeUsernameDash">
                Launch static backdrop modal
            </button>
            <div className="modal fade" id="changeUsernameDash" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Change your username here!</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="input-group mb-3">
                            <span className="input-group-text" id="basic-addon2"><i className="fa-solid fa-user icon-color"></i></span>
                                <input value={newFirstName} onChange={(event) => setNewFirstName(event.target.value)} id="newFirstName" name="newFirstName" type="name" className="form-control" placeholder="First Name" aria-label="user Name" aria-describedby="basic-addon2" required />
                            </div>
                            <div className="input-group mb-3">
                                <input value={newLastName} onChange={(event) => setNewLastName(event.target.value)} id="newLastNAme" name="newLastNAme" type="name" className="form-control" placeholder="Last Name" aria-label="Certification Name" aria-describedby="basic-addon2" required />
                                <span className="input-group-text" id="basic-addon2"><i className="fa-solid fa-user icon-color"></i></span>
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text" id="basic-addon3">{NPicon ? <i className="fa-regular fa-eye-slash" onClick={showCurrentPassword}></i> : <i className="fa-regular fa-eye" onClick={showCurrentPassword}></i>}</span>
                                <input value={changeEmailPassword} onChange={(event) => setchangeEmailPassword(event.target.value)} id="newPass" name="newPass" type="password" className="form-control" placeholder="Enter Password" aria-describedby="basic-addon3" required />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" ref={refClosechngNameDashboard} className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button disabled={newFirstName.length < 5 || newLastName.length < 5 || changeEmailPassword.length < 8} className="btn btn-primary" type="button" onClick={changeUsername}>Update Username</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-4 my-3 mx-5 text-center">
                    <div className="card my-3 border-dark bg-dark certificate-card" style={{height: "479px"}}>
                        <div className="admin-image-div">
                            <img src={shahil} className="admin-image" alt="..." />
                        </div>
                        <div className="card-body user-body">
                            <h2 className="card-subtitle mb-2 text-muted">{localStorage.getItem("first_name")} {localStorage.getItem("last_name")} <i onClick={handleEdit} className="fa-solid fa-pen edit_icon"></i></h2>
                            <hr className="hr-color" />
                            <h4 className="card-text mb-1 text-muted">{localStorage.getItem("email")}</h4>
                        </div>
                    </div>
                </div>
                <div className="row col-md-7 my-3 text-center">
                    <div className="card col-md-5 my-3 mx-4 text-bg-dark mb-3 admin-details-card certificate-card">
                        <div className="card-body">
                            <h3 className="card-title">{allData.length}</h3>
                            <hr className="admin-hr-color" />
                            <h4 className="card-text" style={{color: "green"}}>Total Certificates</h4>
                        </div>
                    </div>
                    <div className="card col-md-5 my-3 mx-4 text-bg-dark mb-3 admin-details-card certificate-card">
                        <div className="card-body">
                            <h3 className="card-title">{delData.length}</h3>
                            <hr className="admin-hr-color" />
                            <h4 className="card-text" style={{color: "green"}}>Delete Request</h4>
                        </div>
                        {delData.length !== 0 && <span onClick={handeleDeleteAlert} className="custom-alert p-2 position-absolute top-48 start-100 translate-middle badge rounded-pill bg-success">
                            {delData.length}
                            <span className="visually-hidden">New alerts</span>
                        </span>}
                    </div>
                    <div className="card col-md-5 my-3 mx-4 text-bg-dark mb-3 admin-details-card certificate-card">
                        <div className="card-body">
                            <h3 className="card-title">{trainingData.length}</h3>
                            <hr className="admin-hr-color" />
                            <h4 className="card-text" style={{color: "green"}}>Pending Training Request</h4>
                        </div>
                        {trainingData.length !== 0 && <span onClick={viewPendingRequest} className="custom-alert p-2 position-absolute top-48 start-100 translate-middle badge rounded-pill bg-success">
                            {trainingData.length}
                            <span className="visually-hidden" style={{color: "green"}}>New alerts</span>
                        </span>}

                    </div>
                    <div className="card col-md-5 my-3 mx-4 text-bg-dark mb-3 admin-details-card certificate-card">
                        <div className="card-body">
                            <h3 className="card-title">{allApprovedData.length}</h3>
                            <hr className="admin-hr-color" />
                            <h4 className="card-text" style={{color: "green"}}>Active Trainings</h4>
                        </div>
                    </div>
                    <div className="card col-md-5 my-3 mx-4 text-bg-dark mb-3 admin-details-card certificate-card">
                        <div className="card-body">
                            <h3 className="card-title">{allUserData.length}</h3>
                            <hr className="admin-hr-color" />
                            <h4 className="card-text" style={{color: "green"}}>Total Users</h4>
                        </div>
                    </div>
                    <div className="card col-md-5 my-3 mx-4 text-bg-dark mb-3 admin-details-card certificate-card">
                        <div className="card-body">
                            <h3 className="card-title">1</h3>
                            <hr className="admin-hr-color" />
                            <h4 className="card-text" style={{color: "green"}}>Active Admins</h4>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminDashboard;