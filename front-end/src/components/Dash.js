import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import shahil from "../images/shahil.png";
import userContext from "../context/userContext";
import dataContext from "../context/dataContext";
import { AccountContext } from "../context/Account";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import cash from "../images/cash.png";
import account from "../images/account.png";
import university from "../images/university.png";
import star from "../images/star.png";
import motivation from "../images/motivation.png";
import flame from "../images/flame.png";
import trend from "../images/trend.png";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import trainingContext from "../context/trainingContext";

function Dash(props) {

    const { userData, getSpecificUserData, updateUserData } = useContext(userContext);

    const { datas, getData } = useContext(dataContext);

    const { getSession, authenticate } = useContext(AccountContext);

    const { getUserSpecificTrainingRequest, trainingData } = useContext(trainingContext);

    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            //getData(localStorage.getItem('email'));
            getSpecificUserData(localStorage.getItem('email'));
            getUserSpecificTrainingRequest(localStorage.getItem('email'));
            getData();
        } else {
            navigate("/login");
            props.showAlert("First Authorize yourself", "", "warning");
        }
    }, [])

    const userRef = useRef(null);
    const userRefClose = useRef(null);

    const [f_n, setF_N] = useState("");
    const [l_n, setL_N] = useState("");
    const [a_sbu, setA_sbu] = useState("");
    const [s_sl, setS_sl] = useState("");
    const [p_p, setP_P] = useState("");

    const [Passicon, setPassIcon] = useState(false);

    const showPassword_P = () => {
        var x = document.getElementById("password_pass");
        if (x.type === "password") {
            x.type = "text";
            setPassIcon(true);
        } else {
            x.type = "password";
            setPassIcon(false);
        }
    }


    const handleUserDataEdit = () => {
        userRef.current.click();
    }

    const popover = (
        <Popover id="popover-basic" className="poppver-body">
            <Popover.Body>
                <div className="skills me-4">
                    <div className="skills-bar">
                        {userData.length > 0 && userData[0]?.skill_set ?  userData[0].skill_set.map((data, index) => {
                            return <div className="bar" key={index}>
                                <div className="info">
                                    <span>{data.skill_with_rating}</span>
                                </div>
                                <div className="progress-line"><span className="html" value={data.rating + "0%"} style={{ width: data.rating + "0%"}}></span></div>
                            </div>
                        }) : <span style={{fontSize: "20px"}}>No skills added</span>}
                        
                    </div>
                </div>
            </Popover.Body>
        </Popover>
    );

    /////////change user details functionality
    const updateUserDetails = (event) => {
        event.preventDefault();
        getSession().then(({ user, email }) => {
            authenticate(email, p_p).then(() => {
                const attributes = [
                    new CognitoUserAttribute({ Name: 'name', Value: f_n }),
                    new CognitoUserAttribute({ Name: 'nickname', Value: l_n }),
                ];
                user.updateAttributes(attributes, (err, result) => {
                    if (err) {
                        // setSuccess(false);
                        props.showAlert("Failure", `${err.message}`, "warning");
                        setF_N("");
                        setL_N("");
                        setA_sbu("");
                        setS_sl("");
                        setP_P("");
                        userRefClose.current.click();
                    } else {
                        //setSuccess(true);
                        updateUserData(
                            f_n, l_n, a_sbu, s_sl
                        )
                            .then(data => {
                                getSpecificUserData();
                                props.showAlert(`Success`, "Updated Successfully", "success");
                                console.log(data, result);
                                localStorage.setItem('first_name', f_n);
                                localStorage.setItem('last_name', l_n);
                                localStorage.setItem('sbu', a_sbu);
                                localStorage.setItem("sl", s_sl);
                                setF_N("");
                                setL_N("");
                                setA_sbu("");
                                setS_sl("");
                                setP_P("");
                                userRefClose.current.click();
                            })
                            .catch(err => {
                                props.showAlert(`Failure`, `${err.message}`, "danger");
                                console.log(err.message);
                                setF_N("");
                                setL_N("");
                                setA_sbu("");
                                setS_sl("");
                                setP_P("");
                                userRefClose.current.click();
                            })
                    }
                })
            })
        })
    }

    const handleCancelUpdateUserData = (event) => {
        event.preventDefault();
        setF_N("");
        setL_N("");
        setA_sbu("");
        setS_sl("");
        setP_P("");
        //userRefClose.current.close();
    }

    const ViewUserTrainingDetails = () => {
        navigate("/usertrainingdata");
    }

    const SkillsPage = () => {
        navigate("/userskills");
    }

    return (
        <>
            <div className="dash-div col-md-11" style={{ marginBottom: "30px" }}>
                <div className="col-md-11 me-4">
                    <div className="user-img-div certificate-card">
                        <div>
                            <img src={shahil} className="user-img" alt="..." />
                        </div>
                        <div className="user-body">
                            <h3 style={{ color: "#ffbf00" }}>{localStorage.getItem("first_name")} {localStorage.getItem("last_name")}</h3>
                            <h6>{localStorage.getItem("sbu")} {localStorage.getItem("sl")}</h6>
                        </div>
                    </div>
                    <div className="activity text-bg-dark certificate-card">
                        <h6 className="my-2 mx-3" style={{ fontSize: "25px" }}>Your activity over last 6 months</h6>
                        <div className="row">
                            <OverlayTrigger trigger="click" placement="right" overlay={popover} rootClose>
                                <div className="card col-md-2 my-3 mx-3 ms-4 mb-3 activity-details-card-clickable" style={{ background: "#FEFAE025" }}>
                                    <div className="card-body activity-body">
                                        {userData.length > 0 && userData[0]?.skill_set ? <h4 className="card-title">{userData[0].skill_set.length}</h4> : <h4 className="card-title">0</h4>}
                                        <hr className="admin-hr-color" />
                                        <h6 className="card-text" style={{ color: "#fff", fontSize: "20px" }}>Skills Aquired</h6>
                                    </div>
                                </div>
                            </OverlayTrigger>
                            <div className="card col-md-2 my-3 mx-3 mb-3 activity-details-card-clickable" style={{ background: "#FEFAE025" }}>
                                <div className="card-body activity-body">
                                    <h4 className="card-title">{trainingData.length > 0 ? trainingData.filter((data) => {return data.rejected === 'false' && data.request === "true" }).length : 0}</h4>
                                    <hr className="admin-hr-color" />
                                    <h6 className="card-text" style={{ color: "#fff", fontSize: "20px" }}>Specialization Completed</h6>
                                </div>
                            </div>
                            <div className="card col-md-2 my-3 mx-3 mb-3 activity-details-card-clickable" style={{ background: "#FEFAE025" }}>
                                <div className="card-body activity-body">
                                    <h4 className="card-title">{datas.length > 0 ? datas.length : 0}</h4>
                                    <hr className="admin-hr-color" />
                                    <h6 className="card-text" style={{ color: "#fff", fontSize: "20px" }}>Certificates Achieved</h6>
                                </div>
                            </div>
                            <div className="card col-md-2 my-3 mx-3 mb-3 activity-details-card-clickable" style={{ background: "#FEFAE025" }}>
                                <div className="card-body activity-body">
                                    <h4 className="card-title">{userData.length > 0 && userData[0]?.skill_cluster ? userData[0].skill_cluster.length : 0}</h4>
                                    <hr className="admin-hr-color" />
                                    <h6 className="card-text" style={{ color: "#fff", fontSize: "20px" }}>Achieved Cluster</h6>
                                </div>
                            </div>
                            <div className="card col-md-2 my-3 mx-3 mb-3 activity-details-card-clickable" style={{ background: "#FEFAE025" }}>
                                <div className="card-body activity-body">
                                    <h4 className="card-title">{userData.length > 0 && userData[0]?.project ? userData[0].project.length : 0}</h4>
                                    <hr className="admin-hr-color" />
                                    <h6 className="card-text" style={{ color: "#fff", fontSize: "20px" }}>Total Projects</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                    <h4 style={{ marginTop: "15px", marginLeft: "5px" }}>Quick Actions</h4>
                    <div className="quick-actions">
                        <div className="row">
                            <div onClick={handleUserDataEdit} className="card ms-2 me-3 mb-3 card-one text-bg-dark certificate-card" style={{ width: "253px" }}>
                                <div className="card-body activity-body">
                                    <div style={{ padding: "20px", background: "#19A7CE50", borderRadius: "5px" }}>
                                        <img src={account} style={{ width: "70px", heignt: "70px" }} alt="..." />
                                    </div>
                                    <h6 className="card-text" style={{ color: "#19A7CE90", fontSize: "20px", marginTop: "8px" }}>Complete your profile- 84%</h6>
                                </div>
                            </div>
                            <div onClick={SkillsPage} className="card ms-2 me-3 mb-3 card-two text-bg-dark certificate-card" style={{ width: "253px" }}>
                                <div className="card-body activity-body">
                                    <div className="hoverEffect" style={{ padding: "20px", background: "#30E3DF50", borderRadius: "5px" }}>
                                        <img src={motivation} style={{ width: "70px", heignt: "70px" }} alt="..." />
                                    </div>
                                    <h6 className="card-text" style={{ color: "#30E3DF90", fontSize: "20px", marginTop: "8px" }}>Add new Skills to the collection</h6>
                                </div>
                            </div>
                            <div onClick={ViewUserTrainingDetails} className="card ms-2 me-3 mb-3 card-three text-bg-dark certificate-card" style={{ width: "253px" }}>
                                <div className="card-body activity-body">
                                    <div style={{ padding: "20px", background: "#AA77FF50", borderRadius: "5px" }}>
                                        <img src={university} style={{ width: "70px", heignt: "70px" }} alt="..." />
                                    </div>
                                    <h6 className="card-text" style={{ color: "#AA77FF90", fontSize: "20px", marginTop: "8px" }}>Take on a Specialization</h6>
                                </div>
                            </div>
                            <div className="card ms-2  mb-3 card-four text-bg-dark certificate-card" style={{ width: "253px" }}>
                                <div className="card-body activity-body">
                                    <div style={{ padding: "20px", background: "#FDD36A50", borderRadius: "5px" }}>
                                        <img src={star} style={{ width: "70px", heignt: "70px" }} alt="..." />
                                    </div>
                                    <h6 className="card-text" style={{ color: "#FDD36A90", fontSize: "20px", marginTop: "8px" }}>Add aspirational skills rating</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4" >
                    <h6 className=" mx-3" style={{ fontSize: "20px", marginTop: "84px" }}>Your SuperCoins</h6>
                    <div className="card my-3 mx-3 mb-3 activity-details-card certificate-card" style={{ background: "#fff" }}>
                        <div className="user-img-div">
                            <div>
                                <img src={cash} style={{ height: "50px", width: "50px" }} alt="..." />
                            </div>
                            <div className="user-body mx-2">
                                <h3><span style={{ fontSize: "30px" }}>439</span><span style={{ fontSize: "20px", color: "gray" }}> SuperCoins</span></h3>
                            </div>
                        </div>
                        <div className="user-body mx-2">
                            <h6 style={{ fontSize: "18px", marginLeft: "60px" }}>You have 15 new SuperCoins</h6>
                        </div>
                        <div className="user-body mx-2 my-3">
                            <button className="redeem-btn" style={{ marginLeft: "60px" }}>Redeem now <i style={{ fontSize: "13px" }} className="fa-solid fa-arrow-right"></i></button>
                        </div>
                    </div>
                    <div className="mx-3" style={{ display: "flex" }}>
                        <img src={flame} style={{ height: "25px", width: "25px" }} alt="..." />
                        <h6 className="mx-1" style={{ fontSize: "20px", marginTop: "auto", marginBottom: "auto" }}>What's trending</h6>
                    </div>
                    <div className="card my-3 mx-3 mb-3 activity-details-card certificate-card" style={{ background: "#fff" }}>
                        <div className="user-body mx-3 my-3">
                            <h6 style={{ fontSize: "17px" }}>Courses & Certifications</h6>
                            <div style={{ display: "flex" }}>
                                <img src={trend} style={{ height: "25px", width: "20px" }} alt="..." />
                                <h6 className="mx-1" style={{ fontSize: "15px", marginTop: "auto", marginBottom: "auto" }}>Python</h6>
                            </div>
                            <div style={{ display: "flex" }}>
                                <img src={trend} style={{ height: "25px", width: "20px" }} alt="..." />
                                <h6 className="mx-1" style={{ fontSize: "15px", marginTop: "auto", marginBottom: "auto" }}>AWS Architect Certification</h6>
                            </div>
                            <div style={{ display: "flex" }}>
                                <img src={trend} style={{ height: "25px", width: "20px" }} alt="..." />
                                <h6 className="mx-1" style={{ fontSize: "15px", marginTop: "auto", marginBottom: "auto" }}>Frontend - ReactJS, AngularJS</h6>
                            </div>
                        </div>
                        <hr style={{ width: "300px", marginLeft: "auto", marginRight: "auto", marginTop: "1px", marginBottom: "1px" }} />
                        <div className="user-body mx-3 my-3">
                            <h6 style={{ fontSize: "17px" }}>Specializations</h6>
                            <div style={{ display: "flex" }}>
                                <img src={trend} style={{ height: "25px", width: "20px" }} alt="..." />
                                <h6 className="mx-1" style={{ fontSize: "15px", marginTop: "auto", marginBottom: "auto" }}>Big Data Architect Specialization</h6>
                            </div>
                            <div style={{ display: "flex" }}>
                                <img src={trend} style={{ height: "25px", width: "20px" }} alt="..." />
                                <h6 className="mx-1" style={{ fontSize: "15px", marginTop: "auto", marginBottom: "auto" }}>AWS Architect Certification</h6>
                            </div>
                            <div style={{ display: "flex" }}>
                                <img src={trend} style={{ height: "25px", width: "20px" }} alt="..." />
                                <h6 className="mx-1" style={{ fontSize: "15px", marginTop: "auto", marginBottom: "auto" }}>Google Cloud Certification</h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            <div>
                <button ref={userRef} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#changeUserDetails">
                    Launch static backdrop modal
                </button>
                <div className="modal fade" id="changeUserDetails" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="staticBackdropLabel">Update your info. here!</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="update-img-div">
                                <div>
                                    <img src={shahil} alt="..." />
                                </div>
                            </div>
                            <div className="modal-body">
                                <div className="input-group mb-3">
                                    <span className="input-group-text" id="inputGroupPrepend2"><i className="fa-solid fa-user icon-color"></i></span>
                                    <input id="first_name" name="first_name" type="name" value={f_n} onChange={(event) => setF_N(event.target.value)} placeholder="First name" className="form-control" aria-describedby="inputGroupPrepend2" required />
                                </div>
                                <div className="input-group mb-3">
                                    <input id="last_name" name="last_name" type="last_name" value={l_n} onChange={(event) => setL_N(event.target.value)} placeholder="Last name" className="form-control" aria-describedby="inputGroupPrepend2" required />
                                    <span className="input-group-text" id="inputGroupPrepend2"><i className="fa-solid fa-user icon-color"></i></span>
                                </div>
                                <div className="input-group mb-3">
                                    <input id="allocation_sbu" name="allocation_sbu" type="allocation_sbu" value={a_sbu} onChange={(event) => setA_sbu(event.target.value)} placeholder="Allocation SBU" className="form-control" aria-describedby="inputGroupPrepend2" required />
                                    <span className="input-group-text" id="inputGroupPrepend2"><i className="fa-solid fa-building-user icon-color"></i></span>
                                </div>
                                <div className="input-group mb-3">
                                    <span className="input-group-text" id="inputGroupPrepend2"><i className="fa-solid fa-briefcase icon-color"></i></span>
                                    <input id="service_sl" name="service_sl" type="name" value={s_sl} onChange={(event) => setS_sl(event.target.value)} placeholder="Service SL" className="form-control" aria-describedby="inputGroupPrepend2" required />
                                </div>
                                <div className="input-group mb-3">
                                    <input id="password_pass" name="password_pass" type="password" value={p_p} onChange={(event) => setP_P(event.target.value)} className="form-control" placeholder="Enter Password" aria-describedby="basic-addon3" required />
                                    <span className="input-group-text" id="basic-addon3">{Passicon ? <i className="fa-regular fa-eye-slash" onClick={showPassword_P}></i> : <i className="fa-regular fa-eye" onClick={showPassword_P}></i>}</span>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" ref={userRefClose} className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCancelUpdateUserData}>Cancel</button>
                                <button disabled={f_n.length < 5 || l_n.length < 5 || a_sbu.length < 5 || s_sl.length < 5 || p_p.length < 8} className="btn btn-primary" type="button" onClick={updateUserDetails}>Update</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dash;