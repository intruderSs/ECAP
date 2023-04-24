import React, { useState } from "react";

function AddCourse(props) {

    const [newCourse, setNewCourse] = useState();
    const [newSkill_Set, setnewSkill_Set] = useState([]);

    const { allCourseData, getAllCourseData, addCourse } = props;

    const data = allCourseData;

    function handleKeyDown(e) {
        if (e.key !== "Enter") return
        const value = e.target.value;
        if (!value.trim()) return
        setnewSkill_Set([...newSkill_Set, value])
        e.target.value = "";
    }

    function removeSkill(index) {
        // console.log("clicked", index);
        setnewSkill_Set(newSkill_Set.filter((el, i) => i !== index));
    }

    const removeAll = (e) => {
        e.preventDefault();
        setnewSkill_Set([]);
    }

    const handleAdd = (e) => {
        addCourse(newCourse, newSkill_Set)
        .then(data => {
            props.showAlert("Skill Cluster added successfully", "", "success");
            getAllCourseData();
            setnewSkill_Set([]);
            setNewCourse("");
        })
        .catch(err => {
            props.showAlert("Failed to Add", "", "danger");
        })
    }

    return (
        <>
            <div className="col-md-4 my-4 edit-component certificate-card">
                <div className="input-group">
                    <input data-toggle="dropdown" className="form-control" type="text" value={newCourse} onChange={(event) => setNewCourse(event.target.value)} placeholder="Skill Cluster" aria-label="Skill Cluster" />
                    <span className="input-group-text" id="inputGroupPrepend2"><i className="fa-solid fa-circle-nodes cluster_icon"></i></span>
                </div>
            </div>
            <div className="wrapper certificate-card">
                <div className="content edit-component">
                    <h6> <i className="fa-solid fa-lightbulb" style={{ color: "#DC3535" }}></i> Press enter or add comma after each skill</h6>
                    <div className="tag-box">
                        <ul>
                            {newSkill_Set.map((skill, index) => (
                                <li key={index}>{skill} <i onClick={() => removeSkill(index)} className="fa-solid fa-xmark"></i></li>
                            ))}
                            <input onKeyDown={handleKeyDown} placeholder="Type something" type="text" />
                        </ul>
                    </div>
                </div>
                <div className="details">
                    <p><span style={{ color: "#DC3535" }}><strong>{newSkill_Set.length}</strong></span> skills added</p>
                    <div>
                        <button className="btn btn-danger btn-sm remove-b" onClick={removeAll}>Remove all</button>
                        <button className="btn btn-danger btn-sm" onClick={handleAdd}>Add</button>
                    </div>
                </div>
            </div>

        </>
    )
}

export default AddCourse;