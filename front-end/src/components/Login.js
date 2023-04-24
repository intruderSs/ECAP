import React, { useState, useContext, useEffect, useRef } from "react";
import { AccountContext } from "../context/Account";
import UserPool from "../UserPool";
import { useNavigate } from 'react-router-dom';
import mailContext from "../context/mailContext";
import userContext from "../context/userContext";
import dataContext from "../context/dataContext";
import trainingContext from "../context/trainingContext";


function Login(props) {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cpassword, setCPassword] = useState("");
    const [registered, setRegistered] = useState(true);
    const [allocation_sbu, setAllocation_SBU] = useState("");
    const [service_sl, setService_SL] = useState("");

    const [Picon, setPIcon] = useState(false);
    const [Cicon, setCIcon] = useState(false);

    let navigate = useNavigate();

    ///status login or logout
    const [status, setStatus] = useState(false);
    const { getSession, authenticate, sendCode, resetPass } = useContext(AccountContext);

    const { verifyMail } = useContext(mailContext);

    const { createUser, getSpecificUserData, addCluster} = useContext(userContext);

    const { getUserSpecificTrainingRequest } = useContext(trainingContext);

    const { getData } = useContext(dataContext);

    const refPass = useRef(null);
    const refClosePass = useRef(null);

    // const showNPassword = () => {
    //     var x = document.getElementById("newPass");
    //     if (x.type === "password") {
    //         x.type = "text";
    //         setNPicon(true);
    //     } else {
    //         x.type = "password";
    //         setNPicon(false);
    //     }
    // }

    ////forgot password functionality

    const [stage, setStage] = useState(1);

    const [forgotEmail, setForgotEmail] = useState("");

    const [NPicon, setNPicon] = useState(false);
    const [NCicon, setNCicon] = useState(false);

    const [vCode, setVCode] = useState("");
    const [forgetNewPass, setforgetNewPass] = useState("");
    const [forgetCPass, setforgetCPass] = useState("");

    const showForgotNPassword = () => {
        var x = document.getElementById("forgotNewPass");
        if (x.type === "password") {
            x.type = "text";
            setNPicon(true);
        } else {
            x.type = "password";
            setNPicon(false);
        }
    }

    const showForgotCPassword = () => {
        var x = document.getElementById("forgotNewCPass");
        if (x.type === "password") {
            x.type = "text";
            setNCicon(true);
        } else {
            x.type = "password";
            setNCicon(false);
        }
    }

    const handleClickPass = (props) => {
        refPass.current.click();
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (forgotEmail === process.env.REACT_APP_ADMIN_EMAIL) {
            props.showAlert("Unauthorized access", "this mail id is reserved for admin", "warning");
            setForgotEmail("");
        } else {
            sendCode(forgotEmail)
                .then(data => {
                    //console.log("Success", data);
                    props.showAlert("Verification code sent successfully", "please check your mail", "success");
                    setStage(2);
                })
                .catch(err => {
                    console.log("error" + err.message);
                    props.showAlert("Failure", `${err.message}`, "warning");
                });
        }
    }

    const resetPassword = (event) => {
        event.preventDefault();
        if (forgetNewPass === forgetCPass) {
            resetPass(forgotEmail, vCode, forgetNewPass)
                .then(data => {
                    //console.log("Success", data);
                    props.showAlert("Success: ", "Password reset successfully", "success");
                    refClosePass.current.click();
                    setStage(1);
                    setVCode("");
                    setForgotEmail("");
                    setforgetNewPass("");
                    setforgetCPass("");
                })
                .catch(err => {
                    //console.log(err.message);
                    props.showAlert("Failure", `${err.message}`, "warning");
                    setVCode("");
                });
        } else {
            props.showAlert("Password and Confirm password not matched", "", "warning");
            setforgetNewPass("");
            setforgetCPass("");
        }

    }

    const cancelResetPass = () => {
        setStage(1);
        setVCode("");
        setForgotEmail("");
        setforgetNewPass("");
        setforgetCPass("");
        props.showAlert("Password reset cancelled", "", "primary");
    }


    ////////forgot password functionality close


    //////cognito sending username as attributes
    var attributeList = [];

    var firstname = {
        Name: 'name',
        Value: firstName,
    };

    var lastname = {
        Name: 'nickname',
        Value: lastName
    }

    attributeList.push(firstname, lastname);

    useEffect(() => {
        getSession()
            .then((session) => {
                if (localStorage.getItem('email') === process.env.REACT_APP_ADMIN_EMAIL) {
                    navigate("/admin");
                } else {
                    navigate("/");
                }
                setStatus(true);
            }).catch(err => {
                //console.log(err);
                props.showAlert("Not Logged in : ", `${err}`, "secondary");
            })
    }, []);


    useEffect(() => {
        if (localStorage.getItem('token')) {
            props.showAlert("You are already logged in", "", "warning");
            navigate("/");
        }
    }, [])
    // console.log("Password is " + password);
    // console.log("Confirm Password is " + password);

    const loginFunction = async (event) => {
        event.preventDefault();

        if (email === process.env.REACT_APP_ADMIN_EMAIL) {
            authenticate(email.toLowerCase(), password)
                .then(data => {
                    props.showAlert("Logged in as Admin", "", "success");
                    localStorage.setItem('token', data.getAccessToken().getJwtToken());
                    // console.log(localStorage.token);
                    navigate("/admin");
                })
                .catch(err => {
                    //console.log("Failed to login :", err);
                    props.showAlert("Falied to Login : ", `${err.message}, please verify yourself`, "danger");
                    setEmail("");
                    setPassword("");
                })
        } else {
            authenticate(email.toLowerCase(), password)
                .then(data => {
                    props.showAlert("Logged In Successfully", "", "success");
                    localStorage.setItem('token', data.getAccessToken().getJwtToken());
                    getSpecificUserData(email);
                    getUserSpecificTrainingRequest(email);
                    // console.log(localStorage.token);
                    navigate("/");
                })
                .catch(err => {
                    //console.log("Failed to login :", err);
                    props.showAlert("Falied to Login : ", `${err.message}, please verify yourself`, "danger");
                    setEmail("");
                    setPassword("");
                })
        }

    }

    const signUpFunction = async (event) => {
        event.preventDefault();
        let date_ = new Date();
        let month = date_.getMonth();
        let year = date_.getFullYear();
        let day = date_.getDate();
        let date = year + "-" + month + "-" + day;
        const approved_by = process.env.REACT_APP_ADMIN_NAME;
        const cluster = "Default";
        let cluster_data = {
            approved_by,
            date,
            cluster
        }
        if (process.env.REACT_APP_ADMIN_EMAIL === email) {
            props.showAlert("Email reserved for Admin:", "use another email to create account", "danger");
            setEmail("");
            setPassword("");
            setCPassword("");
        } else {
            if (password === cpassword) {
                UserPool.signUp(email.toLowerCase(), password, attributeList, null, (err, data) => {
                    if (err) {
                        //console.log(err);
                        props.showAlert("Failed to Register:", `${err.message}`, "danger");
                        setEmail("");
                        setPassword("");
                        setFirstName("");
                        setLastName("");
                        setCPassword("");
                    } else {
                        //console.log(data);
                        ///this function is for verifying ses identity
                        createUser(
                            firstName,
                            lastName,
                            email,
                            allocation_sbu,
                            service_sl
                        )
                            .then(data => {
                                addCluster(email, [cluster_data])
                                .then(data => {
                                    console.log("Data Inserted Successfully", data);
                                })
                                .catch(err => {
                                    console.log("Unable to insert cluster", err.message); 
                                })
                            })
                            .catch(err => {
                                console.log("Unable to insert data", err.message);
                            })
                        verifyMail(email.toLowerCase());
                        props.showAlert("Account Created Successfully", ": kindly check your mail to verify yourself before login", "success");
                        setRegistered(true);
                        setEmail("");
                        setPassword("");
                        setFirstName("");
                        setLastName("");
                        setCPassword("");
                    }
                })
            } else {
                props.showAlert("Password Error: ", "Password and confirm password not matched", "warning");
                setPassword("");
                setCPassword("");
            }
        }
    }


    const handleClick = () => {
        setRegistered(true);
    }

    const secondClick = () => {
        setRegistered(false);
    }

    const cancel = () => {
        setEmail("");
        setPassword("");
        setCPassword("");
        setFirstName("");
        setLastName("");
        props.showAlert("Cancelled", "", "primary");
    }

    const showPassword = () => {
        var x = document.getElementById("passwordField");
        if (x.type === "password") {
            x.type = "text";
            setPIcon(true);
        } else {
            x.type = "password";
            setPIcon(false);
        }
    }

    const showCPassword = () => {
        var x = document.getElementById("cpassword");
        if (x.type === "password") {
            x.type = "text";
            setCIcon(true);
        } else {
            x.type = "password";
            setCIcon(false);
        }
    }

    //console.log(process.env);


    return (
        <>
            <div>
                <button ref={refPass} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#forgotPass">
                    Launch static backdrop modal
                </button>
                <div className="modal fade" id="forgotPass" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="staticBackdropLabel">Password Reset</h1>
                            </div>
                            {stage === 1 && <>
                                <div className="modal-body">
                                    <div className="input-group mb-3">
                                        <input value={forgotEmail} onChange={(event) => setForgotEmail(event.target.value)} id="forgotEmail" name="forgotEmail" type="email" className="form-control" placeholder="Email" aria-describedby="basic-addon2" required />
                                        <span className="input-group-text" id="basic-addon2"><i className="fa-solid fa-envelope icon-color"></i></span>
                                    </div>

                                    {/* <div className="input-group mb-3">
                                    <input id="otp" name="otp" type="number" className="form-control" placeholder="Enter the verification code" aria-describedby="basic-addon2" required />
                                    <span className="input-group-text" id="basic-addon2">****</span>
                                </div>
                                <div className="input-group mb-3">
                                    <span className="input-group-text" id="basic-addon3">{NPicon ? <i className="fa-regular fa-eye-slash" onClick={showForgotNPassword}></i> : <i className="fa-regular fa-eye" onClick={showForgotNPassword}></i>}</span>
                                    <input value={forgetNewPass} onChange={(event) => setforgetNewPass(event.target.value)} id="forgotNewPass" name="forgotNewPass" type="password" className="form-control" placeholder="Enter New Password" aria-describedby="basic-addon3" required />
                                </div>
                                <div className="input-group mb-3">
                                    <input value={forgetCPass} onChange={(event) => setforgetCPass(event.target.value)} id="forgotNewCPass" name="forgotNewCPass" type="password" className="form-control" placeholder="Confirm Password" aria-describedby="basic-addon3" required />
                                    <span className="input-group-text" id="basic-addon3">{NCicon ? <i className="fa-regular fa-eye-slash" onClick={showForgotCPassword}></i> : <i className="fa-regular fa-eye" onClick={showForgotCPassword}></i>}</span>
                                </div> */}

                                </div>
                                <div className="modal-footer">
                                    <button type="button" ref={refClosePass} className="btn btn-secondary" data-bs-dismiss="modal" onClick={cancelResetPass}>Cancel</button>
                                    <button className="btn btn-primary" type="button" onClick={handleSubmit}>Send verification code</button>
                                </div>
                            </>}
                            {stage === 2 && <>
                                <div className="modal-body">
                                    {/* <div className="input-group mb-3">
                                        <input value={forgotEmail} onChange={(event) => setForgotEmail(event.target.value)} id="forgotEmail" name="forgotEmail" type="email" className="form-control" placeholder="Email" aria-describedby="basic-addon2" required />
                                        <span className="input-group-text" id="basic-addon2">****</span>
                                    </div> */}

                                    <div className="input-group mb-3">
                                        <input value={vCode} onChange={(event) => setVCode(event.target.value)} id="otp" name="otp" type="number" className="form-control" placeholder="Enter 6 digit verification code" aria-describedby="basic-addon2" required />
                                        <span className="input-group-text" id="basic-addon2"><i className="fa-solid fa-comment-dots icon-color"></i></span>
                                    </div>
                                    <div className="input-group mb-3">
                                        <span className="input-group-text" id="basic-addon3">{NPicon ? <i className="fa-regular fa-eye-slash" onClick={showForgotNPassword}></i> : <i className="fa-regular fa-eye" onClick={showForgotNPassword}></i>}</span>
                                        <input value={forgetNewPass} onChange={(event) => setforgetNewPass(event.target.value)} id="forgotNewPass" name="forgotNewPass" type="password" className="form-control" placeholder="Enter New Password" aria-describedby="basic-addon3" required />
                                    </div>
                                    <div className="input-group mb-3">
                                        <input value={forgetCPass} onChange={(event) => setforgetCPass(event.target.value)} id="forgotNewCPass" name="forgotNewCPass" type="password" className="form-control" placeholder="Confirm Password" aria-describedby="basic-addon3" required />
                                        <span className="input-group-text" id="basic-addon3">{NCicon ? <i className="fa-regular fa-eye-slash" onClick={showForgotCPassword}></i> : <i className="fa-regular fa-eye" onClick={showForgotCPassword}></i>}</span>
                                    </div>

                                </div>
                                <div className="modal-footer">
                                    <button type="button" ref={refClosePass} className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                    <button disabled={vCode.length !== 6 || forgetNewPass.length < 8 || forgetCPass.length < 8} className="btn btn-primary" type="button" onClick={resetPassword}>Reset password</button>
                                </div>
                            </>}
                        </div>
                    </div>
                </div>
            </div>



            <div className="col-md-5 text-bg-dark text-center margin login-form">
                <h2>{registered ? "Login here" : "Signup here"}</h2>
                <form id="login-form" className='my-3' onSubmit={registered ? loginFunction : signUpFunction}>
                    {!registered && <div className="input-group col-md-4 my-4">
                        <div className="input-group">
                            <span className="input-group-text" id="inputGroupPrepend2"><i className="fa-solid fa-user icon-color"></i></span>
                            <input id="first_name" name="first_name" type="name" placeholder="First name" value={firstName} onChange={(event) => setFirstName(event.target.value)} className="form-control" aria-describedby="inputGroupPrepend2" required />
                        </div>
                    </div>
                    }
                    {!registered && <div className="input-group col-md-4 my-4">
                        <div className="input-group">
                            <input id="last_name" name="last_name" type="name" placeholder="Last name" value={lastName} onChange={(event) => setLastName(event.target.value)} className="form-control" aria-describedby="inputGroupPrepend2" required />
                            <span className="input-group-text" id="inputGroupPrepend2"><i className="fa-solid fa-user icon-color"></i></span>
                        </div>
                    </div>
                    }
                    <div className="input-group col-md-4 my-4">
                        <div className="input-group">
                            <span className="input-group-text" id="inputGroupPrepend2"><i className="fa-solid fa-envelope icon-color"></i></span>
                            <input id="email" name="email" type="email" className="form-control" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} aria-describedby="inputGroupPrepend2" required />
                        </div>
                    </div>
                    {!registered && <div className="input-group col-md-4 my-4">
                        <div className="input-group">
                            <input id="alloc_sbu" name="alloc_sbu" type="name" placeholder="Allocation SBU" value={allocation_sbu} onChange={(event) => setAllocation_SBU(event.target.value)} className="form-control" aria-describedby="inputGroupPrepend2" />
                            <span className="input-group-text" id="inputGroupPrepend2"><i className="fa-solid fa-building-user icon-color"></i></span>
                        </div>
                    </div>
                    }
                    {!registered && <div className="input-group col-md-4 my-4">
                        <div className="input-group">
                            <span className="input-group-text" id="inputGroupPrepend2"><i className="fa-solid fa-briefcase icon-color"></i></span>
                            <input id="serv_sl" name="serv_sl" type="name" placeholder="Service SL" value={service_sl} onChange={(event) => setService_SL(event.target.value)} className="form-control" aria-describedby="inputGroupPrepend2" />
                        </div>
                    </div>
                    }
                    <div className="input-group col-md-4 my-4">
                        <div className="input-group password-container">
                            <input id="passwordField" name="password" type="password" className="form-control" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} aria-describedby="inputGroupPrepend2" required />
                            <span className="input-group-text" id="inputGroupPrepend2">{Picon ? <i className="fa-regular fa-eye-slash" onClick={showPassword}></i> : <i className="fa-regular fa-eye" onClick={showPassword}></i>}</span>
                        </div>
                        {registered && <h6 className="para pointe my-2 mx-2 login_signup" onClick={handleClickPass}>Forgot password?</h6>}
                    </div>
                    {!registered && <div className="input-group col-md-4 my-4">
                        <div className="input-group password-container">
                            <span className="input-group-text" id="inputGroupPrepend2">{Cicon ? <i className="fa-regular fa-eye-slash" onClick={showCPassword}></i> : <i className="fa-regular fa-eye" onClick={showCPassword}></i>}</span>
                            <input id="cpassword" name="cpassword" type="password" placeholder="Confirm password" value={cpassword} onChange={(event) => setCPassword(event.target.value)} className="form-control" aria-describedby="inputGroupPrepend2" required />
                        </div>
                    </div>}
                    {!registered && <h6 className="para pointer login_signup" onClick={handleClick}>Already a User</h6>}
                    {registered && <h6 className="para pointer login_signup" onClick={secondClick}>New User, SignUp</h6>}
                    <div className="col-12">
                        <button className="btn btn-secondary my-3 mx-3" type="button" onClick={cancel}>Cancel</button>
                        <button className="btn btn-primary my-3" type="submit">{registered ? "Login" : "Signup"}</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Login;