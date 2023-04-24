import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { Container, Row, Tabs, Tab } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import userContext from "../context/userContext";
import neural from "../images/neural.png";
import pending from "../images/hard-work.png";
import pencil from "../images/pencil.png";
import climbing from "../images/climbing.png";
import approveContext from "../context/approveContext";
import courseContext from "../context/courseContext";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

function AddSkills(props) {

    const { getSpecificUserData, userData, addSkill } = useContext(userContext);

    const { createApproveData } = useContext(approveContext);

    const { allCourseData, getAllCourseData } = useContext(courseContext);

    useEffect(() => {
        if (localStorage.getItem('token')) {
            //getData(localStorage.getItem('email'));
            getSpecificUserData(localStorage.getItem('email'));
            getAllCourseData();
        } else {
            navigate("/login");
            props.showAlert("First Authorize yourself", "", "warning");
        }
    }, [])

    const navigate = useNavigate();

    const [Skill__Set, setSkill__Set] = useState([]);

    const [skill_set, setskill_set] = useState(userData.length > 0 && userData[0]?.skill_set ? userData[0].skill_set : []);

    const [all_skill, set_all_skill] = useState([]);

    const [clusterName, setClusterName] = useState();
    const [completed, setCompleted] = useState();
    const [pending_, setPending] = useState();
    const [all, setAll] = useState();

    // const [main_skill_set, setMainSkillSet] = useState([]);

    // if (userData.length > 0) {
    //     console.log(userData[0].skill_set);
    //     setMainSkillSet(userData[0].skill_set);
    // }

    const loadAllSkill = (e) => {
        let value = e.target.value;
        let s = [];
        if (allCourseData.length > 0) {
            for (let i of allCourseData) {
                for (let j of i.skill_set) {
                    if (!s.includes(j)) {
                        s.push(j);
                    }
                }
            }
        }
        if (value === "") {
            set_all_skill([]);
        } else {
            set_all_skill(s.filter((data) => { return data.startsWith(value) }));
        }
    }

    ///////approve data
    let date = new Date();
    let email_id = localStorage.getItem("email");
    let approve_id = email_id + date;
    let approval_status = "false";
    let approved_ = "false";
    let name = localStorage.getItem('first_name') + " " + localStorage.getItem("last_name");



    function handleKeyDown(e) {
        if (e.key !== "Enter") return
        const value = e.target.value;
        if (!value.trim()) return
        setSkill__Set([...Skill__Set, value])
        setskill_set([...skill_set, { skill_with_rating: value, rating: "" }])
        e.target.value = "";
    }

    function removeSkill(index) {
        setSkill__Set(Skill__Set.filter((el, i) => i !== index));
        setskill_set(skill_set.filter((el, i) => i !== index));
    }

    const removeAll = (e) => {
        e.preventDefault();
        setSkill__Set([]);
        set_all_skill([]);
        document.getElementById("skillInput").value = "";
    }

    const handleUpdate = (event) => {
        event.preventDefault();
        if (skill_set.length > 0) {
            addSkill(
                localStorage.getItem('email'),
                skill_set)
                .then(data => {
                    getSpecificUserData(localStorage.getItem('email'));
                    props.showAlert(`Success`, "Updated Successfully", "success");
                    console.log(data);
                    setSkill__Set([]);
                    setskill_set([]);
                    createApproveData(
                        approve_id,
                        email_id,
                        name,
                        Skill__Set,
                        approval_status,
                        approved_
                    )
                        .then(data => {
                            props.showAlert('success', "Skill data sent for approval", 'success');
                        })
                        .catch(err => {
                            props.showAlert(`Failure`, `${err.message}`, "danger");
                        })
                })
                .catch(err => {
                    props.showAlert(`Failure`, `${err.message}`, "danger");
                    console.log(err.message);
                    setSkill__Set([]);
                    setskill_set([]);
                })
        } else {
            props.showAlert("Enter skills first", "", "danger");
        }

    }

    const goBack = () => {
        navigate("/");
    }

    const handleClick = (e) => {
        const { name, value } = e.target;
        const checkedValue = skill_set.map((data) => data.skill_with_rating === name ? { ...data, rating: value } : data);
        //console.log(checkedValue);
        setskill_set(checkedValue);
    }

    const onSuggestionClick = (s) => {
        console.log(all_skill);
        set_all_skill(all_skill.filter((data) => { return data !== s }));
        setSkill__Set([...Skill__Set, s]);
        setskill_set([...skill_set, { skill_with_rating: s, rating: "" }]);
        document.getElementById("skillInput").value = "";
    }

    /////////////////////////////////////cluster

    const getClusterDetails = (name) => {
        let cluster = allCourseData.filter((d) => { return d.course_name === name });
        if (cluster.length > 0) {
            return cluster[0].skill_set;
        } else {
            return 0
        }
    }

    const getCommonSkill = (name) => {
        let cluster = allCourseData.filter((d) => { return d.course_name === name });
        let matched = [];
        if (cluster.length > 0 && userData.length > 0 && userData[0]?.skill_set) {
            for (let i of userData[0].skill_set) {
                //console.log(i.skill_with_rating);
                for (let j of cluster[0].skill_set) {
                    if (i.skill_with_rating.includes(j)) {
                        if (!matched.includes(j)) {
                            matched.push(j);
                        }
                    }
                }
            }
        }
        return matched;
    }

    const getUnCommonSkill = (name) => {
        let cluster = allCourseData.filter((d) => { return d.course_name === name });
        let matched = [];
        let not_matched = [];
        let fake = [];
        if (cluster.length > 0 && userData.length > 0 && userData[0]?.skill_set) {
            for (let i of userData[0].skill_set) {
                //console.log(i.skill_with_rating);
                for (let j of cluster[0].skill_set) {
                    if (i.skill_with_rating.includes(j)) {
                        if (!matched.includes(j)) {
                            matched.push(j);
                        }
                    }
                }
            }
            for (let j of cluster[0].skill_set) {
                if (!matched.includes(j)) {
                    if (!not_matched.includes(j)) {
                        not_matched.push(j);
                    }
                }
            }
            return not_matched;
        } else {
            if (cluster[0]?.skill_set) {
                return cluster[0].skill_set;
            } else {
                return fake;
            }
        }
    }

    const handleTest = (e) => {
        localStorage.setItem('Test_Name', e.target.dataset.active);
        navigate('/testknowledge');
    }

    const popover = (
        <Popover id="popover-basic" className="poppver-body">
            <Popover.Body>
                <div class="S___cluster me-4">
                    <div class="skills-bar">
                        <div class="bar">
                            <div class="info">
                                <span style={{ fontSize: "20px" }}>{clusterName}  <i style={{ color: "green" }} className="fa-solid fa-person-running fa-beat-fade"></i></span>
                            </div>
                            {completed && all && <div class="progress-line"><span className="html" value={Math.round(completed.length / all.length * 100) + "%"} style={{ width: Math.round(completed.length / all.length * 100) + "%" }}></span></div>}
                            <div style={{ display: "flex", justifyContent: "space-between" }} className="mt-3">
                                <div class="info ms-5">
                                    <span>Completed</span>
                                    <hr style={{ margin: "auto" }} />
                                    {completed && completed.map((data, i) => {
                                        return <div>
                                            <span style={{ color: "#ff9900" }}>{data} <i style={{ fontWeight: "bold", color: "green" }} className="fa-solid fa-check fa-bounce"></i></span>
                                        </div>
                                    })}
                                    {completed && completed.length === 0 && <span style={{ justifyContent: "center", display: "flex", fontSize: "30px", color: "#FF9900" }}><i className="fa-minus fa-solid fa-shake"></i></span>}
                                </div>
                                <div class="info me-5">
                                    <span>Pending</span>
                                    <hr style={{ margin: "auto" }} />
                                    {pending_ && pending_.map((data, i) => {
                                        return <div key={i}>
                                            <span style={{ color: "#B2B2B2" }}>{data}</span>
                                        </div>
                                    })}
                                    {pending_ && pending_.length === 0 && <span style={{ justifyContent: "center", display: "flex", fontSize: "30px", color: "#FF9900" }}><i className="fa-minus fa-solid fa-shake"></i></span>}
                                </div>
                                <div class="info me-5">
                                    <span>All</span>
                                    <hr style={{ margin: "auto" }} />
                                    {all && all.map((data, i) => {
                                        return <div key={i}>
                                            <span style={{ color: "#B2B2B2" }}>{data}</span>
                                        </div>
                                    })}
                                    {all && all.length === 0 && <span style={{ justifyContent: "center", display: "flex", fontSize: "30px", color: "#FF9900" }}><i className="fa-minus fa-solid fa-shake"></i></span>}
                                </div>
                            </div>
                        </div>
                    </div>
                    {pending_ && pending_.length > 0 && <div className="test-div">
                        <p>Let's test your knowledge <i data-active={clusterName} onClick={handleTest} className="fa-solid fa-arrow-right fa-lg cancel-skill" style={{ paddingLeft: "3px", marginTop: "auto", marginBottom: "auto" }}></i></p>
                    </div>}
                </div>
            </Popover.Body>
        </Popover>
    );

    const handleClusterDetails = (name, completed, pending, all) => {
        setClusterName(name);
        setCompleted(completed);
        setPending(pending);
        setAll(all);
    }

    console.log(userData[0]);


    return (
        <>
            <i onClick={goBack} className="fa-solid fa-arrow-left go-back-user-skill"></i>
            <div className="skill-nav">
                <Container className='class-container'>
                    <Row className='justify-content-center'>
                        <Tabs justify variant='pills' defaultActiveKey="tab-1" className="mb-1 p-0 col-md-4">
                            <Tab eventKey="tab-1" title="View Cluster" className="mb-5">
                                {userData && userData[0]?.skill_cluster ? userData[0].skill_cluster.map((data, id) => {
                                    return <OverlayTrigger trigger="click" placement="right" overlay={popover} rootClose>
                                        <div key={id} className="cluster-wrap" style={{ marginTop: '30px' }} onClick={() => handleClusterDetails(data.cluster, getCommonSkill(data.cluster), getUnCommonSkill(data.cluster), getClusterDetails(data.cluster))}>
                                            <div className="cluster-img-div">
                                                <div>
                                                    <img src={neural} className="cluster-img" alt="..." />
                                                </div>
                                                <div className="cluster_body">
                                                    <h3>{data.cluster}</h3>
                                                    <p>Approved by: {data.approved_by}</p>
                                                </div>
                                            </div>
                                            <div className="cluster-wrapper">
                                                <div className="card  mb-3 card-skill text-bg-dark" style={{ width: "253px" }}>
                                                    <div className="card-body cluster-body">
                                                        <div style={{ padding: "20px", background: "#FDD36A50", borderRadius: "5px" }}>
                                                            <img src={climbing} style={{ width: "70px", heignt: "70px" }} alt="..." />
                                                        </div>
                                                        <h6 className="card-text" style={{ color: "#FDD36A90", fontSize: "20px", marginTop: "8px" }}>Skills Completed - {getCommonSkill(data.cluster).length}</h6>
                                                    </div>
                                                </div>
                                                <div className="card ms-2  mb-3 card-skill text-bg-dark" style={{ width: "253px" }}>
                                                    <div className="card-body cluster-body">
                                                        <div style={{ padding: "20px", background: "#FDD36A50", borderRadius: "5px" }}>
                                                            <img src={pending} style={{ width: "70px", heignt: "70px" }} alt="..." />
                                                        </div>
                                                        <h6 className="card-text" style={{ color: "#FDD36A90", fontSize: "20px", marginTop: "8px" }}>Skills Pending - {getUnCommonSkill(data.cluster).length}</h6>
                                                    </div>
                                                </div>
                                                <div className="card ms-2  mb-3 card-skill text-bg-dark" style={{ width: "253px" }}>
                                                    <div className="card-body cluster-body">
                                                        <div style={{ padding: "20px", background: "#FDD36A50", borderRadius: "5px" }}>
                                                            <img src={pencil} style={{ width: "70px", heignt: "70px" }} alt="..." />
                                                        </div>
                                                        <h6 className="card-text" style={{ color: "#FDD36A90", fontSize: "20px", marginTop: "8px" }}>All Skills - {getClusterDetails(data.cluster).length}</h6>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </OverlayTrigger>
                                }) : <i style={{ display: "flex", justifyContent: "center", marginTop: "200px", fontSize: "90px", color: "#FF9900" }} className="fa-solid fa-dog fa-bounce fa-2xl"></i>}

                            </Tab>
                            <Tab eventKey="tab-2" title="Add Skills" className="mb-4">
                                <div className="skill-wrapper certificate-card" style={{ marginTop: '30px' }}>
                                    <div className="skill-content edit-component">
                                        <h6> <i className="fa-solid fa-lightbulb" style={{ color: "#FF9900" }}></i> Press enter after each skill</h6>
                                        <div className="tag-box">
                                            <ul>
                                                {Skill__Set.map((skill, index) => (
                                                    <li key={index}>{skill}
                                                        <div className="rating">
                                                            <input type="radio" name={skill} value={10} onClick={handleClick}></input>
                                                            <input type="radio" name={skill} value={9} onClick={handleClick}></input>
                                                            <input type="radio" name={skill} value={8} onClick={handleClick}></input>
                                                            <input type="radio" name={skill} value={7} onClick={handleClick}></input>
                                                            <input type="radio" name={skill} value={6} onClick={handleClick}></input>
                                                            <input type="radio" name={skill} value={5} onClick={handleClick}></input>
                                                            <input type="radio" name={skill} value={4} onClick={handleClick}></input>
                                                            <input type="radio" name={skill} value={3} onClick={handleClick}></input>
                                                            <input type="radio" name={skill} value={2} onClick={handleClick}></input>
                                                            <input type="radio" name={skill} value={1} onClick={handleClick}></input>
                                                        </div>
                                                        <i onClick={() => removeSkill(index)} className="fa-solid fa-xmark" style={{ fontSize: "25px" }}></i></li>
                                                ))}
                                                <input onChange={loadAllSkill} onKeyDown={handleKeyDown} placeholder="Type something" type="text" id="skillInput" />
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="skill-details">
                                        <p><span style={{ color: "#FF9900" }}><strong>{Skill__Set.length}</strong></span> skills added</p>
                                        <div>
                                            <button className="btn btn-sm remove-b" onClick={removeAll} style={{ background: "#ff9900", color: "#fff" }}>Remove all</button>
                                            <button className="btn btn-sm" onClick={handleUpdate} style={{ background: "#ff9900", color: "#fff" }}>Update</button>
                                        </div>
                                    </div>
                                </div>
                                {all_skill.length > 0 && <div className="skill-wrapper text-bg-dark certificate-card" style={{ marginTop: '30px', width: "600px", marginBottom: "30px" }}>
                                    <div className="skill-content-suggestions edit-component">
                                        <h6> <i className="fa-solid fa-puzzle-piece" style={{ color: "#FF9900" }}></i> Suggestions</h6>
                                        <div className="tag-box">
                                            <ul>
                                                {all_skill && all_skill.map((s, i) => {
                                                    return <li key={i}>{s}
                                                        <i onClick={() => onSuggestionClick(s)} value={s} className="fa-solid fa-plus fa-bounce" style={{ fontSize: "25px", paddingRight: "10px" }}></i></li>
                                                })}
                                            </ul>
                                        </div>
                                    </div>
                                </div>}
                            </Tab>
                        </Tabs>
                    </Row>
                </Container>
            </div>
        </>
    )
}

export default AddSkills;