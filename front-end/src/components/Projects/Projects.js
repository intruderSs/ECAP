import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Tabs, Tab } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import courseContext from "../../context/courseContext";
import projectContext from "../../context/projectContext";
import userContext from "../../context/userContext";
import { motion, AnimatePresence } from "framer-motion";
import distance from "../../images/distance.png";
import development from "../../images/development.png";
import { CSVLink } from "react-csv";
import ProjectTableView from "./ProjectTableView";
import AllotProject from "./AllotProject";

function Projects(props) {

    const { getAllCourseData, allCourseData } = useContext(courseContext);

    const { addProject, getAllProject, allProjectData, updateTeam } = useContext(projectContext);

    const { getAllUserData, allUserData, allotProject } = useContext(userContext);

    const [Skill__Set, setSkill__Set] = useState([]);
    const [all_skill, set_all_skill] = useState([]);

    ////project data variables
    const [projectName, setProjectName] = useState();
    const [projectDescription, setProjectDescription] = useState();
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();

    useEffect(() => {
        getAllCourseData();
        getAllProject();
        getAllUserData();
    }, [])

    function handleKeyDown(e) {
        if (e.key !== "Enter") return
        const value = e.target.value;
        if (!value.trim()) return
        setSkill__Set([...Skill__Set, value])
        e.target.value = "";
    }

    const loadAllSkill = (e) => {
        let value = e.target.value;
        let s = [];
        if (allCourseData.length > 0) {
            for (let i of allCourseData) {
                if (!s.includes(i.course_name)) {
                    s.push(i.course_name);
                }
            }
        }
        if (value === "") {
            set_all_skill([]);
        } else {
            set_all_skill(s.filter((data) => { return data.toLowerCase().startsWith(value.toLowerCase()) }));
        }
    }

    function removeSkill(index) {
        setSkill__Set(Skill__Set.filter((el, i) => i !== index));
    }

    const onSuggestionClick = (s) => {
        // console.log(all_skill);
        set_all_skill(all_skill.filter((data) => { return data !== s }));
        setSkill__Set([...Skill__Set, s]);
        document.getElementById("skillInput").value = "";
    }

    /////start of project
    let date = new Date();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let day = date.getDate();

    let minDate = "";

    if (month <= 9) {
        if (day <= 9) {
            minDate = year + "-0" + month + "-0" + day;
        } else {
            minDate = year + "-0" + month + "-" + day;
        }
    } else {
        if (day <= 9) {
            minDate = year + "-" + month + "-0" + day;
        } else {
            minDate = year + "-" + month + "-" + day;
        }
    }

    let maxMonth = date.getMonth() + 2;
    let maxDate = "";

    if (month <= 8) {
        if (day <= 9) {
            maxDate = year + "-0" + maxMonth + "-0" + day;
        } else {
            maxDate = year + "-0" + maxMonth + "-" + day;
        }
    } else {
        if (day <= 9) {
            maxDate = year + "-" + maxMonth + "-0" + day;
        } else {
            maxDate = year + "-" + maxMonth + "-" + day;
        }
    }

    /////////////////////end date
    let enteredDate = new Date(startDate);
    let endMonth = enteredDate.getMonth() + 1;
    let endYear = enteredDate.getFullYear();
    let endDay = enteredDate.getDate();

    let minEndMonth = endMonth + 1;
    let minEndDate = "";

    if (minEndMonth <= 8) {
        if (endDay <= 9) {
            minEndDate = endYear + "-0" + minEndMonth + "-0" + endDay;
        } else {
            minEndDate = endYear + "-0" + minEndMonth + "-" + endDay;
        }
    } else {
        minEndDate = endYear + "-" + minEndMonth + "-" + endDay;
    }


    let maxEndMonth = endMonth + 6;
    let maxEndDate = "";

    if (maxEndMonth <= 9) {
        if (endDay <= 9) {
            maxEndDate = endYear + "-0" + maxEndMonth + "-0" + endDay;
        } else {
            maxEndDate = endYear + "-0" + maxEndMonth + "-" + endDay;
        }
    } else {
        if (endDay <= 9) {
            maxEndDate = endYear + "-" + maxEndMonth + "-0" + endDay;
        } else {
            maxEndDate = endYear + "-" + maxEndMonth + "-" + endDay;
        }
    }

    const removeAllSkill = () => {
        setSkill__Set([]);
    }

    const add = (e) => {
        e.preventDefault();
        addProject(
            projectName + date,
            projectName,
            projectDescription,
            startDate,
            endDate,
            Skill__Set,
        )
            .then(data => {
                props.showAlert("Project added successfully", "", "success");
                setSkill__Set([]);
                setEndDate("");
                setStartDate("");
                setProjectDescription("");
                setProjectName("");
            })
            .catch(err => {
                props.showAlert("Failed to add", "", "danger");
            })
    }

    const handleCancel = (e) => {
        e.preventDefault();
        setSkill__Set([]);
        setEndDate("");
        setStartDate("");
        setProjectDescription("");
        setProjectName("");
        props.showAlert("Cancelled", "", "warning");
        console.log("cancel function got called");
    }

    ////view Project
    const [selectedId, setSelectedId] = useState(null);
    const [fullView, setFllView] = useState(false);

    const viewFullInfo = () => {
        setFllView(true);
        document.getElementById("allInfo").classList.add("blur-kar-do");
    }

    const closefullView = () => {
        setFllView(false);
        document.getElementById("allInfo").classList.remove("blur-kar-do");
    }

    const handleRefresh = () => {
        getAllProject();
    }
    ///////////////download all functionality

    const download_headers = [
        {
            label: "Project Name", key: "project_name"
        },
        {
            label: "Description", key: "description"
        },
        {
            label: "Start Date", key: "satrting_date"
        },
        {
            label: "End Date", key: "ending_date"
        },
        {
            label: "Skills Required", key: "skills_required"
        },
        {
            label: "Team", key: "team"
        }
    ]

    const csvAllLink = {
        filename: "certificate_data.csv",
        headers: download_headers,
        data: allProjectData
    }

    ////table view
    const [tableView, setTableView] = useState(false);

    const handleView = () => {
        setTableView(!tableView);
    }

    ////////table view functionality
    const columns = [
        {
            Header: "Project Name",
            accessor: "project_name",
        },
        {
            Header: "Start Date",
            accessor: "satrting_date",
        },
        {
            Header: "End Date",
            accessor: "ending_date",
        },
        {
            Header: "Skills Required",
            accessor: "skills_required",
        }
    ]

    const rows = allProjectData;

    return (
        <>
            <i className="fa-solid fa-arrow-left go-back-user-skill"></i>
            <div className="skill-nav">
                <Container className='class-container'>
                    <Row className='justify-content-center'>
                        <Tabs justify variant='pills' defaultActiveKey="tab-1" className="mb-1 p-0 col-md-4">
                            <Tab eventKey="tab-1" title="View Projects">
                                {tableView && !fullView && allProjectData.length > 0 && <div style={{ position: "absolute", left: "22%", top: "16%" }} className="form-check form-switch view-toggler">
                                    <CSVLink style={{ position: "relative" }} className="download-button btn btn-sm btn-danger" {...csvAllLink}>Download</CSVLink>
                                </div>}
                                {!fullView && <div className="projectTableView">
                                    <div style={{ position: "relative" }}>
                                        <i className="fa-solid fa-rotate refreshProject me-2" onClick={handleRefresh}></i>
                                    </div>
                                </div>}
                                {!fullView && allProjectData.length > 0 && <div style={{ position: "absolute", top: "16.5%", left: "32%" }} className="form-check form-switch view-toggler">
                                    <input style={{ position: "relative" }} onClick={handleView} className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" />
                                </div>}
                                {!tableView && <div style={{ justifyContent: "center", display: "flex" }}>
                                    <div className="row my-3 project-card" id="allInfo">
                                        {allProjectData && allProjectData.length > 0 && allProjectData.map((data, id) => {
                                            return <motion.div style={{ cursor: "pointer" }} className="card my-3 mx-3 border-dark text-bg-dark col-md-3 certificate-card p-card" layoutId={data.id} onClick={() => { !fullView && setSelectedId(data); viewFullInfo(); }}>
                                                <motion.div className="card-body">
                                                    <motion.h3 className="card-subtitle mb-2 text-muted">{data.project_name}</motion.h3>
                                                    <motion.hr />
                                                    <motion.h6 className="card-subtitle mb-2 text-muted">Started on - {data.satrting_date}</motion.h6>
                                                    <motion.h6 className="card-subtitle mb-2 text-muted">Ending on -  {data.ending_date}</motion.h6>
                                                </motion.div>
                                            </motion.div>
                                        })}
                                    </div>
                                    <AnimatePresence>
                                        {selectedId && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.5 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{
                                                    default: {
                                                        duration: 0.3,
                                                        ease: [0, 0.71, 0.2, 1.01]
                                                    },
                                                    scale: {
                                                        type: "spring",
                                                        damping: 11,
                                                        stiffness: 100,
                                                        restDelta: 0.001
                                                    }
                                                }}
                                                className="card my-3 mx-3 border-dark text-bg-dark certificate-card project-details" layoutId={selectedId}>
                                                <motion.div className="card-body">
                                                    <motion.i button onClick={() => { setSelectedId(null); closefullView(); }} className="fa-solid fa-xmark fa-lg cancel-skill project-details-cancel" style={{ marginTop: "auto", marginBottom: "auto" }}></motion.i>
                                                    <motion.h3 className="card-subtitle mb-3 mt-1" style={{ color: "#FD841F" }}>{selectedId.project_name}</motion.h3>
                                                    <motion.h5 className="card-subtitle mb-2 text-muted"><span style={{ color: "#FFB26B" }}>About project -</span> {selectedId.description}</motion.h5>
                                                    <motion.div className="mt-3 skills-div">
                                                        <motion.h4 className="card-subtitle mb-2 text-muted" style={{ justifyContent: "center", display: "flex" }}>Skills required</motion.h4>
                                                        <motion.hr style={{ marginTop: "2px", color: "#FD841F" }} />
                                                        <div className="skill-div">
                                                            {selectedId.skills_required && selectedId.skills_required.length > 0 && selectedId.skills_required.map((data) => {
                                                                return <motion.h5 className="card-subtitle mb-2" style={{ justifyContent: "center", display: "flex" }}>{data}</motion.h5>
                                                            })}
                                                        </div>
                                                    </motion.div>
                                                    <motion.div className="timeline-main">
                                                        <motion.div className="mt-4 me-2 timeline">
                                                            <motion.h5 className="card-subtitle mb-2 text-muted" style={{ justifyContent: "center", display: "flex" }}>Timeline</motion.h5>
                                                            <motion.hr style={{ marginTop: "2px", color: "#FD841F" }} />
                                                            <motion.div className="timeline-main">
                                                                <motion.h6 className="card-subtitle mb-2 text-muted date-field">{selectedId.satrting_date}</motion.h6>
                                                                <img className="fa-bounce" src={distance} style={{ width: "50px", heignt: "50px" }} alt="..." />
                                                                <motion.h6 className="card-subtitle mb-2 text-muted date-field">{selectedId.ending_date}</motion.h6>
                                                            </motion.div>
                                                        </motion.div>
                                                        <motion.div className="mt-4 ms-2 timeline">
                                                            <motion.h5 className="card-subtitle mb-2 text-muted" style={{ justifyContent: "center", display: "flex" }}>Team</motion.h5>
                                                            <motion.hr style={{ marginTop: "2px", color: "#FD841F" }} />
                                                            {selectedId.team && selectedId.team.length > 0 ? <>
                                                                <motion.h5 style={{ justifyContent: "center", display: "flex", fontSize: "35px", alignItems: "center" }} className="card-subtitle mb-2 mt-4 text-muted"><img className="fa-bounce me-3" src={development} style={{ width: "40px", heignt: "40px" }} alt="..." /> <i style={{ fontSize: "20px", marginTop: "auto", marginBottom: "auto" }} className="fa-solid me-3 fa-arrow-right-long"></i> {selectedId.team.length}</motion.h5>
                                                                <div style={{ justifyContent: "end", display: "flex" }}>
                                                                    <button style={{ fontSize: "10px" }} className="redeem-btn">view more <i style={{ fontSize: "8px" }} className="fa-solid fa-arrow-right"></i></button>
                                                                </div>
                                                            </> : <motion.h5 style={{ justifyContent: "center", display: "flex" }} className="fa-shake card-subtitle mb-2 mt-4 text-muted">No data to display</motion.h5>}
                                                        </motion.div>
                                                    </motion.div>
                                                </motion.div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>}
                                {tableView && <div className="my-4"><ProjectTableView columns={columns} data={rows} /></div>}
                            </Tab>
                            <Tab eventKey="tab-2" title="Add Project">
                                <div className="project-wrapper certificate-card mb-5" style={{ marginTop: '30px' }}>
                                    <div className="skill-content edit-component">
                                        <h6> <i className="fa-solid fa-diagram-project" style={{ color: "#FF9900" }}></i> Add Project details</h6>
                                    </div>
                                    <form className='my-3'>
                                        <div className="input-group mb-3">
                                            <input value={projectName} onChange={(event) => setProjectName(event.target.value)} id="project_name" name="project_name" type="text" className="form-control" placeholder="Enter project name" aria-label="Project Name" required />
                                            <span className="input-group-text"><i className="fa-solid fa-briefcase icon-color"></i></span>
                                        </div>
                                        <div className="input-group mb-3">
                                            <span className="input-group-text"><i className="fa-solid fa-circle-info icon-color"></i></span>
                                            <textarea value={projectDescription} onChange={(event) => setProjectDescription(event.target.value)} id="project_description" name="project_description" type="text" className="form-control" placeholder="Project description" aria-label="Project Description" required />
                                        </div>
                                        <div className="input-group mb-3">
                                            <input min={minDate} max={maxDate} value={startDate} onChange={(event) => setStartDate(event.target.value)} id="date_of_certification" name="date_of_certification" type="date" className="form-control" placeholder="Valid till" aria-label="Server" required />
                                            <span className="input-group-text"><i className="fa-solid fa-calendar-days icon-color"></i></span>
                                            <input min={minEndDate} max={maxEndDate} value={endDate} onChange={(event) => setEndDate(event.target.value)} id="date_of_expiry" name="date_of_expiry" type="date" className="form-control" placeholder="Valid till" aria-label="Server" required />
                                        </div>
                                        <div className="input-group mb-3 project-content edit-component">
                                            <div className="form-control">
                                                <div className="tag-box" style={{ display: "flex", justifyContent: "space-between" }}>
                                                    <ul>
                                                        {Skill__Set.map((skill, index) => (
                                                            <li key={index}>{skill} <i onClick={() => removeSkill(index)} className="fa-solid fa-xmark"></i></li>
                                                        ))}
                                                        <input onChange={loadAllSkill} onKeyDown={handleKeyDown} placeholder="Add skill" type="text" id="skillInput" />
                                                    </ul>
                                                    {Skill__Set.length > 0 && <i onClick={removeAllSkill} className="fa-solid fa-xmark fa-lg cancel-skill" style={{ marginTop: "auto", marginBottom: "auto" }}></i>}
                                                </div>
                                            </div>
                                            <span className="input-group-text" style={{ display: "flex" }}><i className="fa-solid fa-hashtag icon-color"></i></span>
                                        </div>
                                        {all_skill.length > 0 && <div className="skill-wrapper text-bg-dark certificate-card" style={{ marginTop: '30px', width: "700px", marginBottom: "30px" }}>
                                            <div className="project-content edit-component">
                                                <h6> <i className="fa-solid fa-puzzle-piece" style={{ color: "#FF9900" }}></i> Suggestions</h6>
                                                <div className="tag-box">
                                                    <ul>
                                                        {all_skill && all_skill.map((s, i) => {
                                                            return <li key={i}>{s}
                                                                <i onClick={() => onSuggestionClick(s)} value={s} className="fa-solid fa-plus fa-bounce" style={{ fontSize: "20px", paddingRight: "10px" }}></i></li>
                                                        })}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>}
                                        <div className="project-buttons">
                                            <button disabled={projectName === "" & projectDescription === "" & startDate === "" & endDate === "" & Skill__Set.length === 0} onClick={handleCancel} type='button' className="btn btn-secondary mx-3" style={{ color: "#fff" }}>Cancel</button>
                                            <button disabled={projectName === "" || projectDescription === "" || startDate === "" || endDate === "" || Skill__Set.length === 0} onClick={add} type="button" className="btn mx-3" style={{ background: "#ff9900", color: "#fff" }}>Add</button>
                                        </div>
                                    </form>
                                </div>
                            </Tab>
                            <Tab eventKey="tab-3" title="Allot Project">
                                <div>
                                    {allProjectData.length > 0 && <AllotProject updateTeam={updateTeam} showAlert={props.showAlert} allotProject={allotProject} addProject={addProject} allCourseData={allCourseData} getAllCourseData={getAllCourseData} allProjectData={allProjectData} getAllProject={getAllProject} getAllUserData={getAllUserData} allUserData = {allUserData} />}
                                </div>
                            </Tab>
                        </Tabs>
                    </Row>
                </Container>
            </div>
        </>
    )
}

export default Projects;