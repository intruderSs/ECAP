import React, { useContext, useEffect, useRef, useState } from "react";
import trainingContext from "../context/trainingContext";
import UserTable from "./UserTable";
import { useNavigate } from "react-router";

function UserTrainingData(props) {

    const context = useContext(trainingContext);
    const { createTrainingRequest, getUserSpecificTrainingRequest, trainingData } = context;

    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            getUserSpecificTrainingRequest(localStorage.getItem('email'));
            console.log("Hello World");
        } else {
            navigate("/login");
            props.showAlert("First Authorize yourself", "", "warning");
        }
    }, [])

    const trainingRef = useRef(null);
    const trainingRefClose = useRef(null);

    const ref = useRef(null);
    const refClose = useRef(null);

    const [TData, setTData] = useState({
        csp: "",
        certificate_name: "",
        end_date: "",
    });

    let date = new Date();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let day = date.getDate();

    let applied_on = year + "-" + month + "-" + day;

    function makeid(first_name, certificate) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let string = first_name + certificate;
        let counter = 0;
        while (counter < string.length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    }

    const first_name = localStorage.getItem("first_name");
    const last_name = localStorage.getItem("last_name");
    const email_id = localStorage.getItem("email");
    const username = localStorage.getItem("username");
    const request = "false";
    const rejected = "false";
    const usecert = makeid(first_name, TData.certificate_name);

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

    const [certOptions, setCertOptions] = useState([]);

    useEffect(() => {
        switch (TData.csp) {
            case "AWS":
                setCertOptions(AWS);
                break;
            case "GCP":
                setCertOptions(GCP);
                break;
            case "Azure":
                setCertOptions(Azure);
                break;
            case "Salesforce":
                setCertOptions(Salesforce);
                break;
            case "IBM":
                setCertOptions(IBM);
                break;
            case "Oracle":
                setCertOptions(Oracle);
                break;
            default:
                setCertOptions([]);
        }
    }, [TData.csp])

    const handleRefresh = () => {
        getUserSpecificTrainingRequest(localStorage.getItem('email'));
        if (trainingData.length === 0) {
            //console.log("zero");
            trainingRef.current.click();
        }
    }

    const handleProceed = (event) => {
        event.preventDefault();
        ref.current.click();
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        createTrainingRequest(
            first_name,
            last_name,
            email_id,
            username,
            usecert,
            TData.csp,
            TData.certificate_name,
            localStorage.getItem('sbu'),
            localStorage.getItem('sl'),
            applied_on,
            TData.end_date,
            request,
            rejected
        )
            .then(data => {
                props.showAlert("Your registration has been completed", "Admin will shortly react out", "success");
                getUserSpecificTrainingRequest(localStorage.getItem('email'));
                refClose.current.click();
                setTData({
                    csp: "",
                    certificate_name: "",
                })
                console.log(data);
            })
            .catch(err => {
                props.showAlert(`${err.message}`, "regisration failure", "danger");
                setTData({
                    csp: "",
                    certificate_name: "",
                })
            })
    }

    const handleCancel = (event) => {
        event.preventDefault();
        setTData({
            csp: "",
            certificate_name: "",
        })
    }

    const onChange = (event) => {
        setTData({ ...TData, [event.target.name]: event.target.value })
    }

    const goBack = () => {
        navigate("/");
    }

    return (
        <>
        <i onClick={goBack} className="fa-solid fa-arrow-left go-back-user-training"></i>
            <button ref={ref} type="" className="training_button btn btn-danger" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                Click here!
            </button>
            <h3 className="tp">Want to apply for training program?</h3>
            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Apply for a training program</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form className='my-3 '>
                                <div className="input-group mb-3">
                                    <select className="form-select" id="csp" name="csp" value={TData.csp} onChange={onChange}>
                                        <option key="Select Certificate Provider..." value="" defaultChecked>Select certificate provider...</option>
                                        <option key="AWS" value="AWS">AWS</option>
                                        <option key="Azure" value="Azure">Azure</option>
                                        <option key="GCP" value="GCP">GCP</option>
                                        <option key="Oracle" value="Oracle">Oracle</option>
                                        <option key="Salesforce" value="Salesforce">Salesforce</option>
                                        <option key="IBM" value="IBM">IBM</option>
                                    </select>
                                    <label className="input-group-text" htmlFor="inputGroupSelect01"><i className="fa-solid fa-square-poll-horizontal icon-color"></i></label>
                                </div>
                                <div className="input-group mb-3">
                                    <label className="input-group-text" htmlFor="inputGroupSelect01"><i className="fa-solid fa-square-poll-horizontal icon-color"></i></label>
                                    <select className="form-select" id="certificate_name" name="certificate_name" value={TData.certificate_name} onChange={onChange}>
                                        <option defaultChecked value="">Select certification name...</option>
                                        {certOptions.map((item) => (
                                            <option key={item} value={item}>{item}</option>
                                        ))}
                                    </select>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" ref={refClose} className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCancel}>Cancel</button>
                            <button type="button" className="btn btn-primary" onClick={handleSubmit}>Apply</button>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <button ref={trainingRef} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#idMatched">
                    Launch static backdrop modal
                </button>
                <div className="modal fade" id="idMatched" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="staticBackdropLabel">Do you want to register for training program?</h1>
                            </div>
                            <div className="modal-footer">
                                <button type="button" ref={trainingRefClose} className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="button" ref={trainingRefClose} className="btn btn-primary" data-bs-dismiss="modal" onClick={handleProceed}>Proceed</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-2 mt-5 container">
                <i onClick={handleRefresh} className="fa-solid fa-rotate refreshUser"></i>
                <h2>Active Trainings</h2>
            </div>
            {trainingData.length > 0 ? <UserTable trainingData={trainingData} /> : <div className="container mx-2"><><h4>No data to display</h4><h5 className="tp_margin add-color">Click on the above button and apply, Hurry Up!!</h5></></div>}
        </>
    )
}

export default UserTrainingData;