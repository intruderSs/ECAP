import React, { useEffect, useState, useContext, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import UserPool from "../UserPool";
import { useNavigate, NavLink } from "react-router-dom";
import { AccountContext } from "../context/Account";
import gear from "../images/gear.png";
import dataContext from "../context/dataContext";
import mailContext from "../context/mailContext";
import logo from "../images/logo.png";
import userContext from "../context/userContext";
import trainingContext from "../context/trainingContext";
import approveContext from "../context/approveContext";


function Header(props) {

    let location = useLocation();

    const [admin, setAdmin] = useState(false);

    const { approveData, getAllApproveData } = useContext(approveContext);

    const approve_data = approveData.filter((datas) => { return datas.approval_status === "false" });

    const context = useContext(dataContext);
    const { datas, delData, getDeleteData, deleteFlag, getData } = context;

    const { deleteMail, sendMail } = useContext(mailContext);

    const { deleteUser } = useContext(userContext);

    const { getUserSpecificTrainingRequest } = useContext(trainingContext);

    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [cpassword, setCPassword] = useState("");

    const navigate = useNavigate();

    const ref = useRef(null);
    //const refClose = useRef(null);

    const [Picon, setPIcon] = useState(false);
    const [NPicon, setNPicon] = useState(false);
    const [Cicon, setCIcon] = useState(false);

    const refPass = useRef(null);
    const refClosePass = useRef(null);

    const { getSession } = useContext(AccountContext);

    const { showAlert } = props;

    const [status, setStatus] = useState(false);

    const [value, setValue] = useState(1);

    // useEffect(() => {
    //     if (localStorage.getItem('token')) {
    //         if (localStorage.getItem('email') === process.env.REACT_APP_ADMIN_EMAIL) {
    //             getDeleteData();
    //         }
    //     }
    // }, [])

    useEffect(() => {
            getSession()
                .then((session) => {
                    //console.log("Session : ", session);
                    setStatus(true);
                    if (process.env.REACT_APP_ADMIN_EMAIL === session.email) {
                        setAdmin(true);
                        if (value === 1) {
                            navigate("/admin");
                            getDeleteData();
                            getAllApproveData();
                            setValue(2);
                        }
                    } else {
                        setAdmin(false);
                        getData();
                        getUserSpecificTrainingRequest(localStorage.getItem('email'));
                    }
                }).catch(err => {
                    //console.log(err);
                    setStatus(false);
                    props.showAlert("Not Logged in : ", `${err}`, "secondary");
                })
    }, [location]);

    const logout = () => {
        const user = UserPool.getCurrentUser();
        if (user) {
            user.signOut();
            navigate("/login");
            setStatus(false);
            setAdmin(false);
            localStorage.removeItem('token');
            props.showAlert("Logged Out Successfully", "", "success");
        }
    };

    const handleClick = () => {
        ref.current.click();
    }

    const handleClickPass = (props) => {
        refPass.current.click();
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        getSession().then(({ user }) => {
            if (newPassword === cpassword) {
                user.changePassword(password, newPassword, (err, result) => {
                    if (err) {
                        props.showAlert(err.message, ": old password is incorrect", "danger");
                    } else {
                        props.showAlert(result, ": password changed successfully", "success");
                        sendMail(process.env.REACT_APP_ADMIN_EMAIL, localStorage.getItem('email'), "Password changed successfully", "Password change alert")
                    }
                })
            } else {
                props.showAlert("Password Error: ", "Password and confirm password not matched", "warning");
            }
        })
        refClosePass.current.click();
        setPassword("");
        setNewPassword("");
        setCPassword("");
    }

    const showPassword = () => {
        var x = document.getElementById("current_pass");
        if (x.type === "password") {
            x.type = "text";
            setPIcon(true);
        } else {
            x.type = "password";
            setPIcon(false);
        }
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

    const showNPassword = () => {
        var x = document.getElementById("new_Pass");
        if (x.type === "password") {
            x.type = "text";
            setNPicon(true);
        } else {
            x.type = "password";
            setNPicon(false);
        }
    }

    const showCPassword = () => {
        var x = document.getElementById("cPass");
        if (x.type === "password") {
            x.type = "text";
            setCIcon(true);
        } else {
            x.type = "password";
            setCIcon(false);
        }
    }

    //////////////////////////Delete account functionality

    const [request, setRequest] = useState(false);

    const deleteAccRef = useRef(null);
    const deleteAccCloseRef = useRef(null);

    const promptDeleteRef = useRef(null);
    const promptCliseDeleteRef = useRef(null);

    const onDeleteClick = () => {
        let deleteflag = "deleteRequested";
        let i;
        let count = 0;
        for (i = 0; i < datas.length; i++) {
            let certification = datas[i].deleteflag;
            if (certification === deleteflag) {
                count++;
            }
        }
        console.log(count);
        if (datas.length === count && datas.length !== 0) {
            setRequest(true);
        } else {
            setRequest(false);
        }
        deleteAccRef.current.click();
    }

    const onDeleteConfirmClick = () => {
        deleteAccCloseRef.current.click();
        if (datas.length === 0) {
            /////delete account functionality
            getSession().then(({ user }) => {
                user.deleteUser((err, result) => {
                    if (err) {
                        props.showAlert("Failure", `${err.message}`, "danger");
                        return;
                    }
                    //////ses email identity delete function
                    deleteUser()
                        .then(data => {
                            deleteMail(localStorage.getItem('email').toLowerCase());
                            sendMail(process.env.REACT_APP_ADMIN_EMAIL, localStorage.getItem('email'), "Account deleted successfully, thanks for being with us", "Account Deleted");
                            localStorage.removeItem('email');
                            localStorage.removeItem('first_name');
                            localStorage.removeItem('last_name');
                            localStorage.removeItem('token');
                            localStorage.removeItem('allocation_sbu');
                            localStorage.removeItem('service_sl');
                            props.showAlert("Success", "Account deleted successfully", "success");
                            //console.log(localStorage);
                            //console.log(sessionStorage);
                            navigate("/login");
                            //user.signOut();
                            setStatus(false);
                            setAdmin(false);
                        })
                        .catch(err => {
                            props.showAlert("Failure", `${err.message}`, "danger");
                        })
                })
            })
        } else {
            promptDeleteRef.current.click();
        }
    }

    const setDeleteMarkerOnAllCertificates = () => {
        let deleteflag = "deleteRequested";
        let i;
        for (i = 0; i < datas.length; i++) {
            let certification = datas[i].certification_id;
            console.log(certification);
            deleteFlag(certification, deleteflag)
                .then(data => {
                    setRequest(true);
                    props.showAlert("Delete request raised successfully", "wait some time to get response from the admin", "success");
                    promptCliseDeleteRef.current.click();
                }).catch(err => {
                    setRequest(false);
                    props.showAlert(`${err}`, "failed to raise delete request", "danger");
                    promptCliseDeleteRef.current.click();
                })
        }
        ////email to admin that this user has requested to delete his account
        sendMail(localStorage.getItem("email"), process.env.REACT_APP_ADMIN_EMAIL, "Please help me to delete my account", "Account delete request");
    }


    return (
        <>
            <div>
                <button ref={deleteAccRef} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#accountDelete">
                    Launch static backdrop modal
                </button>
                <div className="modal fade" id="accountDelete" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="staticBackdropLabel">{request ? "You have already raised the delete request, please wait sometime" : "Want to permanently delete your account?"}</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-footer">
                                <button type="button" ref={deleteAccCloseRef} className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                {!request && <button className="btn btn-primary" type="button" onClick={onDeleteConfirmClick}>Delete account</button>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <button ref={promptDeleteRef} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#allCertificateDelete">
                    Launch static backdrop modal
                </button>
                <div className="modal fade" id="allCertificateDelete" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="staticBackdropLabel">You are having {datas.length} certificates in your account, you have to delete all your certificates in order to delete your account</h1>
                            </div>
                            <div className="modal-footer">
                                <button type="button" ref={promptCliseDeleteRef} className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button className="btn btn-primary" type="button" onClick={setDeleteMarkerOnAllCertificates}>Raise delete request</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            <div>
                <button ref={refPass} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#password">
                    Launch static backdrop modal
                </button>
                <div className="modal fade" id="password" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="staticBackdropLabel">Change your password here!</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">

                                <div className="input-group mb-3">
                                    <input value={password} onChange={(event) => setPassword(event.target.value)} id="current_pass" name="current_pass" type="password" className="form-control" placeholder="Enter Current Password" aria-label="Certification Name" aria-describedby="basic-addon2" required />
                                    <span className="input-group-text" id="basic-addon2">{Picon ? <i className="fa-regular fa-eye-slash" onClick={showPassword}></i> : <i className="fa-regular fa-eye" onClick={showPassword}></i>}</span>
                                </div>
                                <div className="input-group mb-3">
                                    <span className="input-group-text" id="basic-addon3">{NPicon ? <i className="fa-regular fa-eye-slash" onClick={showNPassword}></i> : <i className="fa-regular fa-eye" onClick={showNPassword}></i>}</span>
                                    <input value={newPassword} onChange={(event) => setNewPassword(event.target.value)} id="new_Pass" name="newPass" type="password" className="form-control" placeholder="Enter New Password" aria-describedby="basic-addon3" required />
                                </div>
                                <div className="input-group mb-3">
                                    <input value={cpassword} onChange={(event) => setCPassword(event.target.value)} id="cPass" name="cPass" type="password" className="form-control" placeholder="Confirm Password" aria-describedby="basic-addon3" required />
                                    <span className="input-group-text" id="basic-addon3">{Cicon ? <i className="fa-regular fa-eye-slash" onClick={showCPassword}></i> : <i className="fa-regular fa-eye" onClick={showCPassword}></i>}</span>
                                </div>

                            </div>
                            <div className="modal-footer">
                                <button type="button" ref={refClosePass} className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button disabled={password.length < 8 || newPassword.length < 8 || cpassword.length < 8} className="btn btn-primary" type="button" onClick={handleSubmit}>Save Changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div>
                <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#profile">
                    Launch static backdrop modal
                </button>
                <div className="modal fade" id="profile" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="staticBackdropLabel">{admin ? "Admin Info" : "User info"}</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="col-md-10">
                                    <div className=" my-3">
                                        <div className="card-body">
                                            <h5 className="card-title mb-2">Username : {localStorage.getItem('first_name')} {localStorage.getItem("last_name")}</h5>
                                            <h6 className="card-subtitle mb-2 text-muted">Email : {localStorage.getItem('email')}</h6>
                                            {!admin && <>
                                                <h6 className="card-subtitle mb-2 text-muted">Allocation SBU : {localStorage.getItem('sbu')}</h6>
                                                <h6 className="card-subtitle mb-2 text-muted">Service SL : {localStorage.getItem('sl')}</h6>
                                                {datas.length > 0 ? <h6 className="card-subtitle mb-2 text-muted">Number of Certifications : {datas.length}</h6> : <h6 className="card-subtitle mb-2 text-muted">You have not uploaded any certificates here!!</h6>}</>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {location.pathname === "/testknowledge" ?
                "" :
                <nav className="sticky-top navbar navbar-dark navbar-expand-lg bg-dark">
                    <div className="container-fluid">
                        <img src={logo} alt="Logo" width="35" height="35" className="d-inline-block align-text-top"></img>
                        {admin ?
                            <Link id="brand_name" className="navbar-brand" to="/admin">ECAP Admin</Link> :
                            <Link id="brand_name" className="navbar-brand" to="/home">ECAP</Link>}
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            {!admin ? <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <NavLink id="hover" className='nav-link' aria-current="page" to="/">Home</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink id="hover" className='nav-link' aria-current="page" to="/addcertificate">Add Certificate</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink id="hover" className='nav-link' to="/dashboard">View Certificates</NavLink>
                                </li>
                                {/* <li className="nav-item">
                                <NavLink id="hover" className='nav-link' to="/explore">Explore More</NavLink>
                            </li> */}
                                <li className="nav-item">
                                    <NavLink id="hover" className='nav-link' to="/login">Login</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink id="hover" className='nav-link' to="/about">About</NavLink>
                                </li>
                            </ul> : <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <NavLink id="hover" className='nav-link' to="/admin">Dashboard</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink id="hover" className='nav-link' to="/projects">Project</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink id="hover" className='nav-link' to="/trainingdata">Training Data</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink id="hover" className='nav-link' to="/courses">Courses</NavLink>
                                </li>
                                <li className="nav-item me-2">
                                    <NavLink id="hover" className='nav-link position-relative' to="/approveskill">Approve Skill Request {approve_data.length !== 0 && <span className="p-1 position-absolute top-48 start-100 translate-middle badge rounded-pill bg-success">
                                        {approve_data.length}
                                        <span className="visually-hidden">New alerts</span>
                                    </span>}</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink id="hover" className='nav-link' to="/viewall">View All Certificates</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink id="hover" className='nav-link position-relative' to="/deleterequest">Delete Request {delData.length !== 0 && <span className="p-1 position-absolute top-48 start-100 translate-middle badge rounded-pill bg-success">
                                        {delData.length}
                                        <span className="visually-hidden">New alerts</span>
                                    </span>}</NavLink>
                                </li>
                            </ul>}
                            <form className="d-flex" role="search">
                                {status && <>
                                    <div className="btn-group dropdown-center">
                                        <img src={gear} className="gear" type="button" data-bs-toggle="dropdown" alt="gear" />
                                        <ul className="dropdown-menu dropdown-menu-dark">
                                            <li><button className="dropdown-item" type="button" onClick={handleClick}>{admin ? "Admin Profile" : "User profile"}</button></li>
                                            <li><button className="dropdown-item" type="button" onClick={handleClickPass} >Change Password</button></li>
                                            <li><hr className="dropdown-divider" /></li>
                                            <li><button className="dropdown-item" type="button" onClick={logout}>Logout</button></li>
                                            {!admin && <>
                                                <li><hr className="dropdown-divider" /></li>
                                                <li><button className="dropdown-item" type="button" onClick={onDeleteClick}>Delete account</button></li>
                                            </>}
                                        </ul>
                                    </div>
                                    {admin ? <span className="navbar-text">
                                        Admin, <span className="user-color">{localStorage.getItem('first_name')}</span> <span className="user-color">{localStorage.getItem('last_name')}</span>
                                    </span> : <span className="navbar-text">
                                        Logged in as, <span className="user-color">{localStorage.getItem('first_name')}</span> <span className="user-color">{localStorage.getItem('last_name')}</span>
                                    </span>}
                                </>}
                            </form>
                        </div>
                    </div>
                </nav>
            }


        </>
    )
}

export default Header;