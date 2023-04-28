import React, { useContext, useState, useEffect, useRef } from "react";
import dataContext from "../context/dataContext";
import mailContext from "../context/mailContext";
import { useNavigate } from "react-router";
import userContext from "../context/userContext";
import courseContext from "../context/courseContext";


function AddCertificate(props) {

    const context = useContext(dataContext);
    const { addData, getData, datas } = context;

    const { getSpecificUserData, userData, addSkill, addCluster } = useContext(userContext);

    const { allCourseData, getAllCourseData } = useContext(courseContext);

    const { sendMail } = useContext(mailContext);

    const userName = localStorage.getItem('email');
    const name = localStorage.getItem('first_name') + " " + localStorage.getItem('last_name');
    const deleteflag = "removeDeleteRequest";

    const ref = useRef(null);
    const refClose = useRef(null);

    const refNameMatched = useRef(null);
    const refCloseNameMatched = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            getData();
            getSpecificUserData(localStorage.getItem('email'));
            getAllCourseData();
        } else {
            navigate("/login");
            props.showAlert("First Authorize yourself", "", "warning");
        }
    }, [])

    const [data, setData] = useState({
        CSP: "",
        certification_name: "",
        certification_level: "",
        certification_id: "",
        date_of_certification: "",
        date_of_expiry: "",
        validity: "",
    });

    const addSkillAndCluster = (cert) => {
        let mail = localStorage.getItem('email');
        let oldcluster = userData[0]?.skill_cluster ? userData[0].skill_cluster : [];
        let date_ = new Date();
        let month = date_.getMonth();
        let year = date_.getFullYear();
        let day = date_.getDate();
        let date = year + "-" + month + "-" + day;
        const approved_by = "System";
        const cluster = "AWS Infra";
        let data = {
            approved_by,
            date,
            cluster,
            cert
        }
        //console.log(oldcluster);
        if (oldcluster) {
            let allCluster = [...oldcluster, data];
            //console.log(allCluster);
            addCluster(mail, allCluster)
                .then(data => {
                    let courseSkill = [];
                    let userSkill = [];
                    let userSkillWithRating = [];
                    for (let i of allCourseData) {
                        if (i.course_name === cluster) {
                            for (let j of i.skill_set) {
                                if (!courseSkill.includes(j)) {
                                    courseSkill.push(j);
                                }
                            }
                        }
                    }
                    //console.log(courseSkill);

                    for (let i of userData[0].skill_set) {
                        if (!userSkill.includes(i)) {
                            userSkill.push(i.skill_with_rating);
                            userSkillWithRating.push(i);
                        }
                    }

                    //console.log(userSkill);

                    for (let i of courseSkill) {
                        if (!userSkill.includes(i)) {
                            userSkillWithRating.push({ rating: "8", skill_with_rating: i });
                        }
                    }
                    //console.log(userSkillWithRating);

                    addSkill(
                        localStorage.getItem('email'),
                        userSkillWithRating
                    ).then(data => {
                        //console.log(userSkillWithRating);
                    })
                        .catch(err => {
                            console.log(err);
                        })
                })
                .catch(err => {
                    console.log(err);
                })
        } else {
            //console.log("Zero Cluster");
            addCluster(mail, data)
                .then(data => {
                    let courseSkill = [];
                    let userSkill = [];
                    let userSkillWithRating = [];
                    for (let i of allCourseData) {
                        if (i.course_name === cluster) {
                            for (let j of i.skill_set) {
                                if (!courseSkill.includes(j)) {
                                    courseSkill.push(j);
                                }
                            }
                        }
                    }
                    //console.log(courseSkill);

                    for (let i of userData[0].skill_set) {
                        if (!userSkill.includes(i)) {
                            userSkill.push(i.skill_with_rating);
                            userSkillWithRating.push(i);
                        }
                    }

                    //console.log(userSkill);

                    for (let i of courseSkill) {
                        if (!userSkill.includes(i)) {
                            userSkillWithRating.push({ rating: "8", skill_with_rating: i });
                        }
                    }
                    //console.log(userSkillWithRating);

                    addSkill(
                        localStorage.getItem('email'),
                        userSkillWithRating
                    ).then(data => {
                        console.log("done");
                    })
                        .catch(err => {
                            console.log(err);
                        })
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }

    const addCertificate = () => {
        addData(userName,
            name,
            data.CSP,
            data.certification_name,
            data.certification_level,
            data.certification_id,
            data.date_of_certification,
            data.date_of_expiry,
            data.validity,
            deleteflag
        )
            .then(data => {
                sendMail(process.env.REACT_APP_ADMIN_EMAIL, localStorage.getItem('email'), `Congratulations for clearing the ${data.CSP} certified ${data.certification_name} having certificate id ${data.certification_id}, your certificate has been successfully uploaded to your account.`, "Certificate Notification");
                props.showAlert("Certificate added successfully", "goto view certificate page to view your certificates", "success");
                getData();
                setData({
                    CSP: "",
                    certification_name: "",
                    certification_level: "",
                    certification_id: "",
                    date_of_certification: "",
                    date_of_expiry: "",
                    validity: ""
                })
                addSkillAndCluster(data.certification_name);
            }).catch(err => {
                props.showAlert(`${err}`, "Validation Id already exists", "danger");
                ref.current.click();
                setData({
                    CSP: "",
                    certification_name: "",
                    certification_level: "",
                    certification_id: "",
                    date_of_certification: "",
                    date_of_expiry: "",
                    validity: "",
                })
            })
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        // if (datas.length > 0) {
        //     for (let i = 0; i < datas.length; i++) {
        //         if (datas[i].certification_name === data.certification_name) {
        //             refNameMatched.current.click();
        //             break;
        //         } else {
        //             addCertificate();
        //         }
        //     }
        // } else {
        //     addCertificate();
        // }
        addCertificate();

    }

    const proceed = (event) => {
        event.preventDefault();
        addCertificate();
    }

    const handleCancel = (event) => {
        event.preventDefault();
        setData({
            CSP: "",
            certification_name: "",
            certification_level: "",
            certification_id: "",
            date_of_certification: "",
            date_of_expiry: "",
            validity: ""
        })
        props.showAlert("Cancelled", "", "primary");
    }

    const onChange = (event) => {
        setData({ ...data, [event.target.name]: event.target.value })
    }

    const onInput = (event) => {
        if (event.target.value.length > 1) {
            event.target.value = "";
            props.showAlert("Invalid Validity : ", "it should be 1,2 or 3 years", "warning");
        }
        event.target.value = event.target.value.replace(/[4-9 && 0]/g, "");
        //value = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    }

    ////start of certification

    let date = new Date();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let day = date.getDate();

    //console.log(date);

    let maxDate = "";

    if (month <= 9) {
        if (day <= 9) {
            maxDate = year + "-0" + month + "-0" + day;
        } else {
            maxDate = year + "-0" + month + "-" + day;
        }
    } else {
        maxDate = year + "-" + month + "-" + day;
    }

    //console.log(maxDate);

    // maxDate = year + '-' + month + '-' + day;
    //console.log(maxDate);


    let minYear = date.getFullYear() - 5;
    let minDate = "";

    if (month <= 9) {
        if (day <= 9) {
            minDate = minYear + "-0" + month + "-0" + day;
        } else {
            minDate = minYear + "-0" + month + "-" + day;
        }
    } else {
        minDate = minYear + "-" + month + "-" + day;
    }

    //console.log(minDate);



    /////end of certification
    let enteredDate = new Date(data.date_of_certification);
    // console.log("entered date" + enteredDate);

    let expMonth = enteredDate.getMonth() + 1;
    let expYear = enteredDate.getFullYear();
    let expDay = enteredDate.getDate();

    //console.log("YEar is:" + expYear);

    let minExpYear = expYear + 1;
    let maxExpYear = expYear + 3;

    let minExpDate = "";
    let maxExpDate = maxExpYear + '-' + expMonth + '-' + expDay;

    if (expMonth <= 9) {
        if (expDay <= 9) {
            minExpDate = minExpYear + "-0" + expMonth + "-0" + expDay;
        } else {
            minExpDate = minExpYear + "-0" + expMonth + "-" + expDay;
        }
    } else {
        minExpDate = minExpYear + "-" + expMonth + "-" + expDay;
    }

    //console.log(minExpDate);

    if (expMonth <= 9) {
        if (expDay <= 9) {
            maxExpDate = maxExpYear + "-0" + expMonth + "-0" + expDay;
        } else {
            maxExpDate = maxExpYear + "-0" + expMonth + "-" + expDay;
        }
    } else {
        maxExpDate = maxExpYear + "-" + expMonth + "-" + expDay;
    }

    //console.log(maxExpDate);

    // console.log("minimum" + minExpDate);
    //console.log("max" + maxExpDate);

    //////automatic validity fetch functionality

    let endDate = new Date(data.date_of_expiry);
    let endDate_s = endDate.getFullYear();

    let validity_data = endDate_s - expYear;
    data.validity = validity_data;


    ////displaying required names only


    const AWS = ["Cloud Practitioner", "Solutions Architect Associate", "Developer Associate",
        "SysOps Administrator", "Solutions Architect Professional", "DevOps Engineer",
        "Advanced Networking Speciality", "Data Analytics Speciality", "Database Speciality",
        "Machine Learning Speciality", "Security Speciality", "SAP on AWS Speciality"];
    const Azure = ["Azure Fundamentals", "Azure AI Fundamentals", "Azure Data Fundamentals", "Azure Administrator",
        "Azure Developer", "Azure Security Engineer", "Designing and Implementing a Microsoft Azure AI Solution",
        "Azure Data Scientist", "Miccrosoft Data Analyst Associate", "Data Engineering on Microsoft Azure",
        "Azure Database Administrator", "Azure Solutions Architect", "Azure DevOps Engineer"];
    const GCP = ["Cloud Digital Leader", "Cloud Engineer", "Cloud Architect", "Cloud Database Engineer",
        "Cloud Developer", "Data Engineer", "Cloud DevOps Engineer", "Cloud Security Engineer", "Cloud Network Engineer",
        "Google Workspace Administrator", "Machine Learning Engineer"];
    const IBM = ["IBM Cloud Advocate", "IBM Cloud Technical Advocate", "IBM Cloud Professional Architect",
        "IBM Cloud Advanced Architect", "IBM Cloud Profesional Developer", "IBM CLoud Associate Site Reliability Engineer (SRE)",
        "IBM Cloud Professional Site Reliability Engineer", "IBM Cloud Professional Sales Engineer", "IBM CLoud Security Engineer Speciality",
        "IBM Cloud Satellite Speciality", "IBM Cloud for Financial Services Speciality", "IBM Cloud DevSecOps Speciality"];
    const Oracle = ["Oracle Cloud Data Management 2022 Foundations Certified Associate", "Oracle Cloud Infrastructure 2022 Certified Foundations Associate",
        "Oracle Cloud Infrastructure 2022 Certified Architect Associate", "Oracle Cloud Infrastructure 2022 DevOps Certified Professional",
        "Oracle Cloud Infrastructure 2022 Certified Security Professsional", "Oracle Cloud Infrastructure Data Science 2022 Certified Professional",
        "Oracle Cloud Infrastructure 2022 Certified Cloud Operations Professional", "Oracle Cloud Infrastructure 2022 Certified Developer Professional",
        "Oracle Cloud Infrastructure 2022 Certified Architect Professional", "Oracle Cloud Infrastructure 2022 Observability and Management Certified Professional",
        "Oracle Cloud Infrastructure 2021 HPC and Big Data Solutions Certified Associate (Available only in Japan)"];
    const Salesforce = ["Certified Associate", "Certified Administrator", "Advanced Administrator", "Platform App Builder", "User Experience (UX) Designer",
        "Strategy Designer", "Service Cloud Consultant", "CPQ Specialist", "Sales Cloud Consultant", "Field Service Consultant", "Experience Cloud Consultant",
        "TableAu CRM & Einstein Discovery Consultant", "Nonprofit Cloud Consultant", "Education Cloud Consultant",
        "Omnistudio Consultant", "Business Analyst", "Platform Developer 1", "Platform Developer 2", "Javascript Developer 1", "Industries CPQ Developer",
        "Omnistudio Developer", "B2C Commerce Developer", "B2C Commerce Architect", "B2B Commerce Developer", "B2B Commerce Administrator", "Identity & Access Management Architect",
        "Sharing & Visibility Architect", "Development Lifecycle & Deployment Architect",
        "Heroku Architect", "Integration Architect", "Data Architect", "Application Architect", "System Architect", "B2C Solution Architect", "B2B Solution Architect", "Technical Architect",
        "Pardot Specialist", "Pardot Consultant", "Marketing Cloud Administrator", "Marketing Cloud Email Specialist", "Marketing Cloud Developer"];

    const levels = {
        AWS: ["Beginner", "Associate", "Professional", "Speciality"],
        GCP: ["Foundational", "Associate", "Professional"],
        Azure: ["Fundamentals", "Associate", "Expert"],
        Salesforce: ["Admin", "Consultant", "Developer", "Architect", "Designer", "Marketers"],
        IBM: ["Foundational", "Architect", "Developer", "Professional", "Specialty"],
        Oracle: ["Associate", "Professional", "Specialist"]
    }

    const [options, setOptions] = useState([]);
    const [level, setLevel] = useState([]);

    useEffect(() => {
        switch (data.CSP) {
            case "AWS":
                setOptions(AWS);
                setLevel(levels.AWS);
                break;
            case "GCP":
                setOptions(GCP);
                setLevel(levels.GCP);
                break;
            case "Azure":
                setOptions(Azure);
                setLevel(levels.Azure);
                break;
            case "Salesforce":
                setOptions(Salesforce);
                setLevel(levels.Salesforce);
                break;
            case "IBM":
                setOptions(IBM);
                setLevel(levels.IBM);
                break;
            case "Oracle":
                setOptions(Oracle);
                setLevel(levels.Oracle);
                break;
            default:
                setOptions([]);
                setLevel([]);
        }
    }, [data.CSP])

    //console.log(data.CSP);
    // console.log(options);
    //console.log(level);


    return (
        <>
            <div>
                <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#idMatched">
                    Launch static backdrop modal
                </button>
                <div className="modal fade" id="idMatched" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="staticBackdropLabel">Certificate with this ID already exist.</h1>
                            </div>
                            <div className="modal-footer">
                                <button type="button" ref={refClose} className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCancel}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <button ref={refNameMatched} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#nameMatched">
                    Launch static backdrop modal
                </button>
                <div className="modal fade" id="nameMatched" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="staticBackdropLabel">You are having this certificate in your account. Do you want to add another of the same name??</h1>
                            </div>
                            <div className="modal-footer">
                                <button type="button" ref={refCloseNameMatched} className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCancel}>Close</button>
                                <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={proceed}>Proceed</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="col-md-6 text-center margin">
                <h2>Add Details of your certificate</h2>
                <form className='my-3'>
                    <div className="input-group mb-3">
                        <label className="input-group-text" htmlFor="inputGroupSelect01"><i className="fa-solid fa-square-poll-horizontal icon-color"></i></label>
                        <select className="form-select" id="CSP" name="CSP" value={data.CSP} onChange={onChange}>
                            <option key="Select Certificate Provider..." value="" defaultChecked>Select certificate provider...</option>
                            <option key="AWS" value="AWS">AWS</option>
                            <option key="Azure" value="Azure">Azure</option>
                            <option key="GCP" value="GCP">GCP</option>
                            <option key="Oracle" value="Oracle">Oracle</option>
                            <option key="Salesforce" value="Salesforce">Salesforce</option>
                            <option key="IBM" value="IBM">IBM</option>
                        </select>
                    </div>
                    <div className="input-group mb-3">
                        <select className="form-select" id="certification_name" name="certification_name" value={data.certification_name} onChange={onChange}>
                            <option defaultChecked value="">Select certification name...</option>
                            {options.map((item) => (
                                <option key={item} value={item}>{item}</option>
                            ))}
                        </select>
                        <label className="input-group-text" htmlFor="inputGroupSelect01"><i className="fa-solid fa-square-poll-horizontal icon-color"></i></label>
                    </div>
                    <div className="input-group mb-3">
                        <label className="input-group-text" htmlFor="inputGroupSelect01"><i className="fa-solid fa-code icon-color"></i></label>
                        <select className="form-select" id="certification_level" name="certification_level" value={data.certification_level} onChange={onChange}>
                            <option defaultChecked value="">Select certification level...</option>
                            {level.map((item) => (
                                <option key={item} value={item}>{item}</option>
                            ))}
                        </select>
                    </div>
                    {/* <div className="input-group mb-3">
                        <span className="input-group-text" id="basic-addon3"></span>
                        <input id="certification_level" name="certification_level" onChange={onChange} value={data.certification_level} type="text" className="form-control" placeholder="Enter Certification Level" aria-describedby="basic-addon3" required />
                    </div> */}

                    <div className="input-group mb-3">
                        <input id="certification_id" name="certification_id" onChange={onChange} value={data.certification_id} type="text" className="form-control" placeholder="Enter Validation Id" aria-label="Amount (to the nearest dollar)" required />
                        <span className="input-group-text"><i className="fa-solid fa-id-card icon-color"></i></span>
                    </div>

                    <div className="input-group mb-3">
                        <input max={maxDate} min={minDate} id="date_of_certification" name="date_of_certification" onChange={onChange} value={data.date_of_certification} type="date" className="form-control" placeholder="Valid till" aria-label="Server" required />
                        <span className="input-group-text"><i className="fa-solid fa-calendar-days icon-color"></i></span>
                        <input max={maxExpDate} min={minExpDate} id="date_of_expiry" name="date_of_expiry" onChange={onChange} value={data.date_of_expiry} type="date" className="form-control" placeholder="Valid till" aria-label="Server" required />
                    </div>
                    <div className="input-group mb-3">
                        <input id="validity" name="validity" onInput={onInput} onChange={onChange} value={data.validity || "0"} type="number" className="form-control" placeholder="Validity" aria-label="Server" required />
                        <span className="input-group-text"><i className="fa-solid fa-hashtag icon-color"></i></span>
                    </div>
                    <button type='button' className="btn btn-secondary mx-3 btn-lg" onClick={handleCancel}>Cancel</button>
                    <button disabled={data.CSP === "" || data.certification_name === "" || data.certification_level === "" || data.certification_id.length < 10 || data.date_of_certification === "" || data.date_of_expiry === "" || data.validity === ""} type="submit" className="btn btn-primary mx-3 btn-lg" onClick={handleSubmit}>Add</button>
                </form>
            </div>
        </>
    )

}

export default AddCertificate;