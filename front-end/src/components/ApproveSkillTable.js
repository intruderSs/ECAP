import React, { useState, useEffect, useRef, useContext } from "react";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import check from "../images/check-mark.png";
import userContext from "../context/userContext";

function ApproveSkillTable(props) {

    const ref = useRef(null);
    const refClose = useRef(null);

    const { allCourseData, approveData, updateApproveData, getAllApproveData } = props;

    const { addCluster, getSpecificData, userData } = useContext(userContext);

    //console.log(allTrainingData);

    const [mainData, setMainData] = useState(approveData);

    const [trainingData, setTrainingData] = useState(mainData.filter((datas) => { return datas.approval_status === "false" }));

    const [selectAll, setSelectAll] = useState(false);

    const [cluster, setCluster] = useState("");
    const [allSkill, setAllSkill] = useState();
    const [user_S, setUser_S] = useState();
    const [matched_S, setMatched_S] = useState();

    //console.log(allCluster);
    useEffect(() => {
        getAllApproveData();
    }, [trainingData])

    // const [data, setData] = useState({
    //     email_id: "shahil.sinha9378@gmail.com",
    //     eend_date: "2023-1-31",
    //     erequest: true,
    //     erejected: false,
    //     usecert: "Tk5nf6bSNu5TeBKF3mAISEoQYZlmApr"
    // })

    // const handleAllApprove = () => {
    //     updateTrainingDetails(data.usecert, data.email_id, data.eend_date, data.erequest, data.erejected)
    //     .then(data => {
    //         console.log("Updated Successfuly");
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     })
    // }


    const [multiCheck, setMultiCheck] = useState(false);

    let count = 0;

    const handleChange = (e) => {
        //alert("Hello Select");
        const { name, checked } = e.target;
        if (name === "allselect") {
            const checkedValue = trainingData.map((user) => { return { ...user, isChecked: checked } });
            setSelectAll(true);
            count = trainingData.length;
            //console.log(checkedValue);
            setTrainingData(checkedValue);
        } else {
            const checkedValue = trainingData.map((user) => user.approve_id === name ? { ...user, isChecked: checked } : user);
            setSelectAll(false);
            console.log(checkedValue);
            for (let i = 0; i < checkedValue.length; i++) {
                if (checkedValue[i].isChecked === true) {
                    count++;
                }
            }
            if (count > 1 && count) {
                setMultiCheck(true);
                setSelectAll(true);
            } else if (count === trainingData.length) {
                setMultiCheck(false);
            } else {
                setMultiCheck(false);
            }
            console.log(count);
            setTrainingData(checkedValue);
        }
    }


    ////////cluster allotment dynamically more than one
    const addAllCluster = (mail, data, approve, oldcluster) => {
        if (oldcluster) {
            let allCluster = [...oldcluster, data];
            console.log(allCluster);
            addCluster(mail, allCluster)
                .then(data => {
                    props.shoAlert('Cluster added successfully', '', 'success');
                    const newData = trainingData.filter((data) => { return data.approve_id !== approve });
                    setTrainingData(newData);
                })
                .catch(err => {
                    console.log(err);
                })
        } else {
            console.log("Zero Cluster");
            addCluster(mail, data)
                .then(data => {
                    props.shoAlert('Cluster added successfully', '', 'success');
                    const newData = trainingData.filter((data) => { return data.approve_id !== approve });
                    setTrainingData(newData);
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }

    const handleAllApprove = (event) => {
        event.preventDefault();
        const checkedInput = [];
        for (let i = 0; i < trainingData.length; i++) {
            if (trainingData[i].isChecked === true) {
                checkedInput.push(trainingData[i]);
            }
        }
        console.log(checkedInput);
        let approval_status = "true";
        let approved_ = "true";
        let date_ = new Date();
        let month = date_.getMonth();
        let year = date_.getFullYear();
        let day = date_.getDate();
        let date = year + "-" + month + "-" + day;
        const approved_by = localStorage.getItem('first_name') + " " + localStorage.getItem('last_name');
        const cluster_data = {
            approved_by,
            date,
            cluster
        }
        for (let j = 0; j < checkedInput.length; j++) {
            updateApproveData(
                checkedInput[j].approve_id,
                approval_status,
                approved_,
                approved_by,
                date,
                cluster
            )
                .then(data => {
                    getSpecificData(checkedInput[j].email_id)
                        .then(data => {
                            console.log(data.Items[0].skill_cluster);
                            addAllCluster(checkedInput[j].email_id, cluster_data, checkedInput[j].approve_id, data.Items[0]?.skill_cluster && [data.Items[0].skill_cluster]);
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

    const handleAllReject = (event) => {
        event.preventDefault();
        const checkedInput = [];
        for (let i = 0; i < trainingData.length; i++) {
            if (trainingData[i].isChecked === true) {
                checkedInput.push(trainingData[i]);
            }
        }
        //console.log(checkedInput);
        let approval_status = "true";
        let approved_ = "false";
        let date_ = new Date();
        let month = date_.getMonth();
        let year = date_.getFullYear();
        let day = date_.getDate();
        let date = year + "-" + month + "-" + day;
        const approved_by = localStorage.getItem('first_name') + " " + localStorage.getItem('last_name');
        const clus_ter = "";
        for (let j = 0; j < checkedInput.length; j++) {
            updateApproveData(
                checkedInput[j].approve_id,
                approval_status,
                approved_,
                approved_by,
                date,
                clus_ter
            )
                .then(data => {
                    console.log("request rejected successfully");
                    const newData = trainingData.filter((data) => { return data.approve_id !== checkedInput[j].approve_id });
                    setTrainingData(newData);
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }

    const handleClick = (e) => {
        let value = e.target.value;
        let name = e.target.name;
        let u = [name.split(",")];
        setUser_S(name.split(","));
        if (value) {
            setCluster(value);
            ref.current.click();
            let matched_skills = allCourseData.filter((datas) => { return datas.course_name === value });
            //console.log(matched_skills[0].skill_set);
            setAllSkill(matched_skills[0].skill_set);
            let matched = [];
            for (let i of matched_skills[0].skill_set) {
                for (let j of u) {
                    if (j.includes(i)) {
                        if (!matched.includes(i)) {
                            matched.push(i);
                        }
                    }
                }
            }
            // for (let i of matched_skills[0].skill_set) {
            //     for (let j of u) {
            //         if (i.includes(j)) {
            //             if (!matched.includes(j)) {
            //                 matched.push(j);
            //             }
            //         }
            //     }
            // }
            console.log(matched);
            setMatched_S(matched);
        }
    }

    const popover = (
        <Popover id="popover-basic" className="poppver-body">
            <Popover.Body>
                <div class="S___skill me-4">
                    <div class="skills-bar">
                        <div class="bar">
                            <div class="info">
                                <span style={{ fontSize: "20px" }}>{cluster}</span>
                            </div>
                            {user_S && allSkill && <div class="progress-line"><span className="html" value={Math.round(matched_S.length / allSkill.length * 100) + "%"} style={{ width: Math.round(matched_S.length / allSkill.length * 100) + "%" }}></span></div>}
                            <div style={{ display: "flex", justifyContent: "space-between" }} className="mt-3">
                                <div class="info ms-5">
                                    <span>User's Skill</span>
                                    <hr style={{ margin: "auto" }} />
                                    {user_S && user_S.map((data, i) => {
                                        return <div>
                                            <span style={{ color: "#B2B2B2" }}>{data}</span>
                                        </div>
                                    })}
                                </div>
                                <div class="info me-5">
                                    <span>Matched Skill</span>
                                    <hr style={{ margin: "auto" }} />
                                    {matched_S && matched_S.map((data, i) => {
                                        return <div key={i}>
                                            <span style={{ color: "#ff9900" }}>{data} <img className="mb-1" style={{ height: "18px", width: "18px" }} src={check} /></span>
                                        </div>
                                    })}
                                </div>
                                <div class="info me-5">
                                    <span>All Skill</span>
                                    <hr style={{ margin: "auto" }} />
                                    {allSkill && allSkill.map((data, i) => {
                                        return <div key={i}>
                                            <span style={{ color: "#B2B2B2" }}>{data}</span>
                                        </div>
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Popover.Body>
        </Popover>
    );

    const SkillCluster = (skill) => {
        let maxCount = 0;
        let definedSkill = [];
        for (let i of allCourseData) {
            //console.log(allCourseData[i].skill_set);
            for (let j of i.skill_set) {
                let count = 0;
                if (skill.includes(j)) {
                    count++;
                }
                if (count > maxCount) {
                    if (!definedSkill.includes(i.course_name)) {
                        definedSkill.push(i.course_name);
                    }
                }
            }
            //console.log(definedSkill);
        }
        return (
            <select className="form-select text-bg-dark" id="CSP" name={[skill]} onChange={handleClick}>
                <option key="Select Certificate Provider..." value="" defaultChecked>Select skill cluster...</option>
                {definedSkill.map((data, index) => {
                    return <option style={{ color: "#FFBF00", background: "#393E46" }} key={index} value={data}>{data}</option>
                })}
            </select>
        )
    }


    const mapAdminFunction = trainingData.map((data, index) => {
        return (
            <tr key={index + 1}>
                <th scope="row">{index + 1}</th>
                <td>
                    {data.email_id}
                </td>
                <td>
                    {data.name}
                </td>
                <td>
                    {data.skills.map((s, i) => (
                        <span className="span-skill" key={i}>{s}</span>
                    ))}
                </td>
                <td>
                    {SkillCluster(data.skills)}
                </td>
                <td>
                    <input name={data.approve_id} checked={data?.isChecked || false} onChange={handleChange} className="form-check-input" type="checkbox" id="flexCheckDefault" />
                    {!selectAll && data?.isChecked && <div><i onClick={handleAllApprove} className="fa-solid fa-circle-check table-approve-icon me-1"></i><i onClick={handleAllReject} className="fa-solid fa-rectangle-xmark table-reject-icon"></i></div>}
                </td>
            </tr>
        )
    })

    return (
        <>
            <div>
                <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#clusterDetails">
                    Launch static backdrop modal
                </button>
                <div className="modal fade" id="clusterDetails" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="staticBackdropLabel">Details</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <h3>{cluster}</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <OverlayTrigger trigger="click" placement="right" overlay={popover} rootClose>
                <button style={{ visibility: "hidden" }} ref={ref}>Click</button>
            </OverlayTrigger>

            <div className="history-table certificate-card">
                <table className="table table-striped table-striped-columns table-dark table-hover table-bordered">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Email ID</th>
                            <th scope="col">Name</th>
                            <th scope="col">Skills</th>
                            <th scope="col" style={{ color: "#ffbf00" }}>Matched with Cluster</th>
                            <th scope="col">
                                <input name="allselect" checked={!trainingData.some((user) => user?.isChecked !== true)} onChange={handleChange} className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                                {!trainingData.some((user) => user?.isChecked !== true) && <div><i onClick={handleAllApprove} className="fa-solid fa-circle-check table-approve-icon"></i> <i onClick={handleAllReject} className="fa-solid fa-rectangle-xmark table-reject-icon"></i></div>}
                                {multiCheck && <div><i onClick={handleAllApprove} className="fa-solid fa-circle-check table-approve-icon"></i><i onClick={handleAllReject} className="fa-solid fa-rectangle-xmark table-reject-icon"></i></div>}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {mapAdminFunction}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default ApproveSkillTable;