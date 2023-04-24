import React, { useState, useRef} from "react";
import { motion, AnimatePresence } from "framer-motion";
import distance from "../../images/distance.png";
import development from "../../images/development.png";
import coder from "../../images/coder.png";
import freelancer from "../../images/freelancer.png";

function AllotProject(props) {

    const { allProjectData, getAllProject, allCourseData, getAllCourseData, getAllUserData, allUserData, allotProject, updateTeam } = props;

    const [checkedData, setCheckedData] = useState(allProjectData);

    const [viewData, setViewData] = useState();

    const [matched, setMatched] = useState();

    const handleRefresh = () => {
        getAllProject();
        getAllCourseData();
        getAllUserData();
    }

    const closeRef = useRef(null);

    const handleChange = (e) => {
        let count = 0;
        const { name, checked, value } = e.target;
        const checkedValue = checkedData.map((data) => data.project_name === name ? { ...data, isChecked: checked } : { ...data, isChecked: false });
        //console.log(checkedValue);
        for (let i = 0; i < checkedValue.length; i++) {
            if (checkedValue[i].isChecked === true) {
                count++;
                setViewData(checkedValue[i]);
            }
            if (count === 0) {
                setViewData("");
            }
        }
        setCheckedData(checkedValue);
    }

    const matchUser = () => {
        let user = [];
        let allskill = [];
        let unique_user = "";
        ////collecting all skill at one place
        for (let i of allCourseData) {
            for (let j of viewData.skills_required) {
                if (i.course_name === j) {
                    //console.log(i.skill_set);
                    for (let k of i.skill_set) {
                        if (!allskill.includes(k)) {
                            allskill.push(k);
                        }
                    }
                }
            }
        }

        ///collecting all matched user at one place
        for (let i of allUserData) {
            if (i?.skill_cluster) {
                for (let j of i.skill_cluster) {
                    for (let k of viewData.skills_required) {
                        if (j.cluster === k) {
                            let matched_user = i;
                            //console.log(matched_user);
                            // console.log(i.skill_set.length);
                            // console.log(i.skill_set);
                            // console.log("all-skill", allskill);
                            // console.log("all-skill", allskill.length);
                            let matched_percentage = Math.round(i.skill_set.length / allskill.length * 100);
                            if (matched_percentage > 100) {
                                matched_percentage = 100;
                            }
                            //console.log(matched_percentage);
                            const new_data = { matched_user, matched_percentage };
                            //const new_data = matched_user.map((data) => {return {...data, matched_percentage: matched_percentage}});
                            if (!user.includes(new_data)) {
                                user.push(new_data);
                                //console.log(i);
                            }
                        }
                    }
                }
            }
        }

        unique_user = Array.from(new Set(user.map(JSON.stringify)), JSON.parse);
        console.log(unique_user);
        setMatched(unique_user);
    }

    const [fullView, setFllView] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const viewFullInfo = () => {
        setFllView(true);
        document.getElementById("dashInfo").classList.add("blur-kar-do");
        document.getElementById("refreshThis").classList.add("blur-kar-do");
    }

    const closefullView = () => {
        setFllView(false);
        document.getElementById("dashInfo").classList.remove("blur-kar-do");
        document.getElementById("refreshThis").classList.remove("blur-kar-do");
    }

    const [showSkills, setShowSkills] = useState(false);

    const ViewMore = () => {
        setShowSkills(!showSkills);
    }

    const [role, setRole] = useState();

    const AssignProject = (e) => {
        e.preventDefault();
        let date_ = new Date();
        let month = date_.getMonth();
        let year = date_.getFullYear();
        let day = date_.getDate();
        let date = year + "-" + month + "-" + day;
        const alloted_by = localStorage.getItem('first_name') + " " + localStorage.getItem('last_name');
        const project = viewData.project_name;
        const mail = selectedId.matched_user.email_id;
        const name = selectedId.matched_user.first_name + " " + selectedId.matched_user.last_name;
        const project_id = viewData.project_id;
        const project_data = {
            alloted_by,
            date,
            role,
            project
        }
        const team_data = {
            name,
            mail,
            role,
            added_on: date
        }
        if (selectedId.matched_user.project) {
            console.log("user has other project");
            let user_project = [selectedId.matched_user.project];
            let allProject = [...user_project, project_data];
            //console.log(allProject);
            allotProject(mail, allProject)
                .then(data => {
                    if (viewData.team) {
                        let team = [viewData.team];
                        let all_team = [...team, team_data];
                       // console.log("yes team");
                       // console.log(all_team);
                        updateTeam(project_id, all_team)
                            .then(data => {
                                props.showAlert("Project Assigned Successfully", '', 'success');
                                closeRef.current.click();
                                setViewData("")
                                setCheckedData(allProjectData);
                            })
                            .catch(err => {
                                console.log(err);
                                props.showAlert("Failed to update team", '', 'danger');
                                closeRef.current.click();
                            })
                    } else {
                       // console.log("no team");
                       let te = [team_data];
                        updateTeam(project_id, te)
                            .then(data => {
                                props.showAlert("Project Assigned Successfully", '', 'success');
                                closeRef.current.click();
                                setViewData("")
                                setCheckedData(allProjectData);
                            })
                            .catch(err => {
                                console.log(err);
                                props.showAlert("Failed to update team", '', 'danger');
                                closeRef.current.click();
                            })
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        } else {
            //console.log("No project");
            let user_project = [project_data];
            allotProject(mail, user_project)
                .then(data => {
                    if (viewData.team) {
                        let team = [viewData.team];
                        let all_team = [...team, team_data];
                       // console.log("yes team");
                        //console.log(all_team);
                        updateTeam(project_id, all_team)
                            .then(data => {
                                props.showAlert("Project Assigned Successfully", '', 'success');
                                closeRef.current.click();
                                setViewData("")
                                setCheckedData(allProjectData);
                            })
                            .catch(err => {
                                console.log(err);
                                props.showAlert("Failed to update team", '', 'danger');
                                closeRef.current.click();
                            })
                    } else {
                        //console.log("no team");
                        let te = [team_data]
                        updateTeam(project_id, te)
                            .then(data => {
                                props.showAlert("Project Assigned Successfully", '', 'success');
                                closeRef.current.click();
                                setViewData("");
                                setCheckedData(allProjectData);
                            })
                            .catch(err => {
                                console.log(err);
                                props.showAlert("Failed to update team", '', 'danger');
                                closeRef.current.click();
                            })
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
        // const team_data = {
        //     name: "Shahil SInha",
        //     mail: "shahilsinha1133@gmail.com",
        //     role: "Full Stack Web Developer",
        //     added_on: new Date()
        // }
        // if (viewData.team) {
        //     console.log("Team Exist");
        //     let oldteam = [viewData.team];
        //     let team = [...oldteam, team_data];
        //     console.log(team);
        // } else {
        //     console.log("Team Not Exist");
        // }
    }


    return (
        <>
            <div id="refreshThis">
                <div className="projectTableView">
                    <div style={{ position: "relative" }}>
                        <i className="fa-solid fa-rotate refreshProject me-2" onClick={handleRefresh}></i>
                    </div>
                </div>
            </div>
            <div style={{ position: "absolute" }} id="dashInfo">
                {checkedData && checkedData.length > 0 ? <div className="allotProjectDiv">
                    <div className="projectDiv card certificate-card text-bg-dark border-dark">
                        <div className="card-body">
                            <h3 className="card-subtitle mb-2 text-muted" style={{ justifyContent: "center", display: "flex" }}>Active Projects</h3>
                            <hr style={{ color: "#ff9900", marginTop: "2px" }} />
                            {/* <div style={{display: "flex", justifyContent: "space-evenly"}}>
                            <h4>Reg-Me</h4>
                            <input value="Reg-Me" style={{ marginBottom: "auto", fontSize: "20px"}} className="form-check-input" type="checkbox" id="flexCheckDefault" />
                        </div> */}
                            {checkedData.map((data, id) => {
                                return <div className="projectSelect" key={id} style={{ justifyContent: "center", display: "flex" }}>
                                    <label>
                                        <input onChange={handleChange} checked={data?.isChecked || false} name={data.project_name} value={data.project_id} style={{ marginBottom: "auto", fontSize: "20px" }} className="form-check-input" type="checkbox" id="flexCheckDefault" />
                                        <span>{data.project_name}</span>
                                    </label>
                                </div>
                            })}
                        </div>
                    </div>
                    {viewData ? <div className="detailsDivMain">
                        <div className="detailsDiv certificate-card card">
                            <div className="card-body">
                                <motion.i button onClick={matchUser} className="fa-solid fa-arrow-right fa-xl cancel-skill view-matched-user" style={{ marginTop: "auto", marginBottom: "auto" }}></motion.i>
                                <h3 className="card-subtitle mb-2 text-muted" style={{ justifyContent: "center", display: "flex" }}>Project Details</h3>
                                <hr style={{ color: "#000", marginTop: "2px" }} />
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <h4 className="card-subtitle mb-2 mt-1 text-muted">{viewData.project_name}</h4>
                                    <motion.div className="timeline-main">
                                        <motion.h6 className="card-subtitle mb-2 text-muted date-field">{viewData.satrting_date}</motion.h6>
                                        <img className="fa-bounce" src={distance} style={{ width: "50px", heignt: "50px" }} alt="..." />
                                        <motion.h6 className="card-subtitle mb-2 text-muted date-field">{viewData.ending_date}</motion.h6>
                                    </motion.div>
                                </div>
                                <motion.div className="skills_timeline">
                                    <motion.div className="me-2 skills-card certificate-card">
                                        <motion.h5 className="card-subtitle mb-2 text-muted" style={{ justifyContent: "center", display: "flex" }}>Skills Required</motion.h5>
                                        <motion.hr style={{ marginTop: "2px", color: "#FD841F" }} />
                                        <div className="allot-project-skill-div timeline-main">
                                            {viewData.skills_required && viewData.skills_required.length > 0 && viewData.skills_required.map((data) => {
                                                return <motion.h5 className="card-subtitle mb-2" style={{ justifyContent: "center", display: "flex" }}>{data}</motion.h5>
                                            })}
                                        </div>
                                    </motion.div>
                                    <motion.div className="ms-2 skills-card certificate-card">
                                        <motion.h5 className="card-subtitle mb-2 text-muted" style={{ justifyContent: "center", display: "flex" }}>Team</motion.h5>
                                        <motion.hr style={{ marginTop: "2px", color: "#FD841F" }} />
                                        {viewData.team && viewData.team.length > 0 ? <>
                                            <motion.h5 style={{ justifyContent: "center", display: "flex", fontSize: "35px", alignItems: "center" }} className="timeline-main card-subtitle mb-2 mt-4 text-muted"><img className="fa-bounce me-3" src={development} style={{ width: "40px", heignt: "40px" }} alt="..." /> <i style={{ fontSize: "20px", marginTop: "auto", marginBottom: "auto" }} className="fa-solid me-3 fa-arrow-right-long"></i> {viewData.team.length}</motion.h5>
                                            <div style={{ justifyContent: "end", display: "flex" }}>
                                                <button style={{ fontSize: "10px" }} className="redeem-btn">view more <i style={{ fontSize: "8px" }} className="fa-solid fa-arrow-right"></i></button>
                                            </div>
                                        </> : <motion.h5 style={{ justifyContent: "center", display: "flex" }} className="fa-shake card-subtitle mb-2 mt-4 text-muted">No data to display</motion.h5>}
                                    </motion.div>
                                </motion.div>
                            </div>
                        </div>
                        {matched && <div className="allotDiv certificate-card card" style={{ backgroundColor: "#FFA559", border: "#FFA559" }}>
                            <div className="card-body">
                                <h4 className="card-subtitle mb-2" style={{ justifyContent: "center", display: "flex", color: "#454545" }}>Matched Employee</h4>
                                <motion.hr style={{ marginTop: "2px", color: "#454545" }} />
                                <div className="my-3" style={{ justifyContent: "center", display: "flex" }}>
                                    {matched && matched.length > 0 && matched.map((data, id) => {
                                        return <div className="certificate-card card col-md-3 me-2 ms-2 user-matched-card" style={{ alignItems: "center" }} layoutId={data.id} onClick={() => { !fullView && setSelectedId(data); viewFullInfo(); }}>
                                            <img src={coder} style={{ width: "70px", heignt: "70px", margin: "10px" }} alt="..." />
                                            <span className="badge text-bg-success">{data.matched_percentage}% matched</span>
                                            <motion.h5 className="card-subtitle mb-2 my-2 text-muted" style={{ justifyContent: "center", display: "flex" }}>{data.matched_user.first_name} {data.matched_user.last_name}</motion.h5>
                                        </div>
                                    })}
                                </div>
                            </div>
                        </div>}
                    </div>
                        : <i style={{ display: "flex", justifyContent: "center", fontSize: "90px", color: "#FF9900" }} className="fa-solid fa-dog fa-bounce fa-2xl dog"></i>}
                </div> : <div className="my-3">
                    <h4 className="container mx-2">
                        No data to display
                    </h4>
                </div>}
            </div>
            <div style={{ justifyContent: "center", display: "flex" }}>
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
                                <motion.i button onClick={() => { setSelectedId(null); closefullView(); }} ref={closeRef} className="fa-solid fa-xmark fa-lg cancel-skill project-details-cancel" style={{ marginTop: "auto", marginBottom: "auto" }}></motion.i>
                                <motion.h3 className="card-subtitle mb-3 mt-1" style={{ color: "#FD841F", justifyContent: 'center', display: 'flex' }}>{selectedId.matched_user.first_name} {selectedId.matched_user.last_name}</motion.h3>
                                <motion.h5 className="card-subtitle mb-2 text-muted"><span style={{ color: "#FFB26B", justifyContent: 'center', display: 'flex' }}>{selectedId.matched_percentage}% matched</span> {selectedId.description}</motion.h5>
                                <motion.div className="mt-3 skills-div">
                                    <motion.h4 className="card-subtitle mb-2 text-muted" style={{ justifyContent: "center", display: "flex" }}>Achieved Clusters</motion.h4>
                                    <motion.hr style={{ marginTop: "2px", color: "#FD841F" }} />
                                    <div className="skill-div">
                                        {selectedId.matched_user.skill_cluster && selectedId.matched_user.skill_cluster.length > 0 && selectedId.matched_user.skill_cluster.map((data) => {
                                            return <motion.h5 className="card-subtitle mb-2" style={{ justifyContent: "center", display: "flex" }}>{data.cluster}</motion.h5>
                                        })}
                                    </div>
                                    {selectedId.matched_user.skill_cluster && selectedId.matched_user.skill_cluster.length > 0 && !showSkills && <div style={{ justifyContent: "end", display: "flex" }}>
                                        <button onClick={ViewMore} style={{ fontSize: "10px" }} className="redeem-btn">view more <i style={{ fontSize: "8px" }} className="fa-solid fa-arrow-right"></i></button>
                                    </div>}
                                </motion.div>
                                {showSkills && <motion.div className="mt-3 skills-div">
                                    <motion.i button onClick={ViewMore} className="fa-solid fa-xmark fa-lg cancel-skill show-skill-cancel" style={{ marginTop: "auto", marginBottom: "auto" }}></motion.i>
                                    <motion.h4 className="card-subtitle mb-2 text-muted" style={{ justifyContent: "center", display: "flex" }}>Skills</motion.h4>
                                    <motion.hr style={{ marginTop: "2px", color: "#FD841F" }} />
                                    <div className="skill-div">
                                        {selectedId.matched_user.skill_set && selectedId.matched_user.skill_set.length > 0 && selectedId.matched_user.skill_set.map((data) => {
                                            return <motion.h5 className="card-subtitle mb-2" style={{ justifyContent: "center", display: "flex" }}>{data.skill_with_rating}</motion.h5>
                                        })}
                                    </div>
                                </motion.div>}
                                <motion.div className="timeline-main">
                                    <motion.div className="mt-4 me-2 timeline">
                                        <motion.h5 className="card-subtitle mb-2 text-muted" style={{ justifyContent: "center", display: "flex" }}>About employee</motion.h5>
                                        <motion.hr style={{ marginTop: "2px", color: "#FD841F" }} />
                                        <motion.div className="timeline-main">
                                            <motion.h6 className="card-subtitle mb-2 text-muted date-field"><span style={{ color: '#FFB26B' }}>Allocation SBU - </span>{selectedId.matched_user.allocation_sbu}</motion.h6>
                                        </motion.div>
                                        <motion.div className="timeline-main">
                                            <motion.h6 className="card-subtitle mb-2 text-muted date-field"><span style={{ color: '#FFB26B' }}>Service Sl - </span>{selectedId.matched_user.service_sl}</motion.h6>
                                        </motion.div>
                                    </motion.div>
                                    <motion.div className="mt-4 ms-2 timeline">
                                        <motion.h5 className="card-subtitle mb-2 text-muted" style={{ justifyContent: "center", display: "flex" }}>Allot Project</motion.h5>
                                        <motion.hr style={{ marginTop: "2px", color: "#FD841F" }} />
                                        <div style={{ justifyContent: "center", display: "flex" }}>
                                            <img style={{ width: "80px" }} className="fa-beat me-3" src={freelancer} alt="..." />
                                        </div>
                                        <motion.h5 style={{ justifyContent: "center", display: "flex", fontSize: "35px", alignItems: "center" }} className="card-subtitle mb-2 mt-4 text-muted">
                                            <div className="role-div">
                                                <input value={role} onChange={((e) => setRole(e.target.value))} className="role-input" placeholder="enter role"></input>
                                            </div>
                                            <div style={{ justifyContent: "end", display: "flex" }}>
                                                <button style={{ fontSize: "14px" }} className="assign-btn" onClick={AssignProject} data-userdata={selectedId.matched_user}>Assign</button>
                                            </div>
                                        </motion.h5>
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    )
}

export default AllotProject;