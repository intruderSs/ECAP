import React, { useState } from "react";

function EditCourse(props) {

    const [course, setCourse] = useState();
    const [Skill_Set, setSkill_Set] = useState([]);
    const [index, setIndex] = useState();

    const { allCourseData, getAllCourseData, updateCourse } = props;

    const data = allCourseData;

    const handleSearch = () => {
        data.filter(item => (
            item.course_name.toLowerCase() === course.toLowerCase() && setSkill_Set(item.skill_set)
        ))
    }

    function handleKeyDown(e) {
        if (e.key !== "Enter") return
        const value = e.target.value;
        if (!value.trim()) return
        setSkill_Set([...Skill_Set, value])
        e.target.value = "";
    }

    function removeSkill(index) {
        setSkill_Set(Skill_Set.filter((el, i) => i !== index));
    }

    const removeAll = (e) => {
        e.preventDefault();
        setSkill_Set([]);
    }

    const handleUpdate = (event) => {
        event.preventDefault();
        if (Skill_Set === data[index].skill_set) {
            props.showAlert("Nothing to update", "", "warning");
        } else {
            updateCourse(course, Skill_Set)
                .then(data => {
                    props.showAlert("Skill Cluster updated successfully", "", "success");
                    getAllCourseData();
                    setSkill_Set([]);
                    setCourse("");
                })
                .catch(err => {
                    props.showAlert("Update Failed", "One or more field is missing", "danger");
                    getAllCourseData();
                })
        }
    }

    const handleChange = (event) => {
        setCourse(event.target.value);
        for (let i = 0; i < data.length; i++) {
            if (course.toLowerCase() === data[i].course_name.toLowerCase()) {
                setSkill_Set(data[i].skill_set);
            } else {
                setSkill_Set([]);
            }
        }
    }

    return (
        <>
            <div className="col-md-4 my-4 edit-component certificate-card">
                <div className="input-group">
                    <input data-toggle="dropdown" className="form-control" type="search" value={course} onChange={handleChange} placeholder="Skill Cluster" aria-label="Skill Cluster" />
                    <span className="input-group-text" id="inputGroupPrepend2"><i onClick={handleSearch} className="fa-solid fa-magnifying-glass search_icon"></i></span>
                </div>
                <div className=" dropdown shadow-lg custom-dd">
                    {data.filter(item => {
                        const course_name = item.course_name.toLowerCase();
                        return course && (course_name.startsWith(course.toLowerCase())) && course_name !== course.toLowerCase();
                    }).slice(0, 5)
                        .map((item, index) => (
                            <div onClick={() => { setCourse(item.course_name); setSkill_Set(item.skill_set); setIndex(index) }} className="dropdown-row p-1 custom-dd-item" key={index}>{item.course_name}</div>
                        ))}
                </div>
            </div>
            <div className="wrapper certificate-card">
                <div className="content edit-component">
                    <h6> <i className="fa-solid fa-lightbulb" style={{ color: "#DC3535" }}></i> Press enter or add comma after each skill</h6>
                    <div className="tag-box">
                        <ul>
                            {Skill_Set.map((skill, index) => (
                                <li key={index}>{skill} <i onClick={() => removeSkill(index)} className="fa-solid fa-xmark"></i></li>
                            ))}
                            <input onKeyDown={handleKeyDown} placeholder="Type something" type="text" />
                        </ul>
                    </div>
                </div>
                <div className="details">
                    <p><span style={{ color: "#DC3535" }}><strong>{Skill_Set.length}</strong></span> skills added</p>
                    <div>
                        <button className="btn btn-danger btn-sm remove-b" onClick={removeAll}>Remove all</button>
                        <button className="btn btn-danger btn-sm" onClick={handleUpdate}>Update</button>
                    </div>
                </div>
            </div>

        </>
    )
}

export default EditCourse;