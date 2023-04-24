import React, { useState, useEffect, useContext } from "react";
import courseContext from '../context/courseContext';
import { CSVLink } from "react-csv";
import { useNavigate } from "react-router-dom";

const ViewAllCourse = ({ showAlert }) => {

    const navigate = useNavigate();

    const context = useContext(courseContext);
    const { allCourseData, getAllCourseData, deleteCourseData } = context;

    const [trainingData, setTrainingData] = useState(allCourseData);
    const [selectAll, setSelectAll] = useState(false);
    const [multiCheck, setMultiCheck] = useState(false);
    let count = 0;

    useEffect(() => {
        getAllCourseData();
    }, [trainingData])

    const handleRefresh = () => {
        getAllCourseData();
        setTrainingData(allCourseData);
        setSelectAll(false);
        setMultiCheck(false);
    }

    const handleChange = (e) => {
        //alert("Hello Select");
        const { name, checked } = e.target;
        if (name === "allselect") {
            const checkedValue = trainingData.map((data) => { return { ...data, isChecked: checked } });
            setSelectAll(true);
            count = trainingData.length;
            console.log(count);
            console.log(checkedValue);
            setTrainingData(checkedValue);
        } else {
            const checkedValue = trainingData.map((data) => data.course_name === name ? { ...data, isChecked: checked } : data);
            setSelectAll(false);
            console.log(checkedValue);
            for (let i = 0; i < checkedValue.length; i++) {
                if (checkedValue[i].isChecked === true) {
                    count++;
                }
            }
            if (count > 1) {
                setMultiCheck(true);
                setSelectAll(true);
            } else if (count === trainingData.length) {
                console.log("reached");
                setMultiCheck(false);
            } else {
                setMultiCheck(false);
            }
            console.log(count);
            setTrainingData(checkedValue);
        }
    }

    const handleAllDelete = (event) => {
        event.preventDefault();
        const checkedInput = [];
        for (let i = 0; i < trainingData.length; i++) {
            if (trainingData[i].isChecked === true) {
                checkedInput.push(trainingData[i].course_name);
            }
        }
        for (let j = 0; j < checkedInput.length; j++) {
            deleteCourseData(checkedInput[j])
                .then(data => {
                    console.log("Deleted Successfully", data);
                    const newData = trainingData.filter((data) => { return data.course_name !== checkedInput[j] });
                    console.log(newData);
                    setTrainingData(newData);
                    showAlert(`SKill Cluster ${checkedInput[j]} is  deleted successfully`, "", "success");
                })
                .catch(err => {
                    showAlert("Failed to delete", `${err}`, "success");
                })
        }
    }

    const handleUpload = (e) => {
        e.preventDefault();
        navigate("/uploadcourse");
    }

    const mapFunction = trainingData.map((data, index) => {
        return (
            <tr key={index + 1}>
                <th scope="row">{index + 1}</th>
                <td>
                    {data.course_name}
                </td>
                <td>
                    {data.skill_set.length}
                </td>
                <td>
                    {data.skill_set.map((s, i) => (
                        <span className="span-skill" key={i}>{s}</span>
                    ))}
                </td>
                <td>
                    <input name={data.course_name} checked={data?.isChecked || false} onChange={handleChange} className="form-check-input" type="checkbox" id="flexCheckDefault" />
                    {!selectAll && data?.isChecked && <i onClick={handleAllDelete} className="fa-solid fa-trash table-delete-icon"></i>}
                </td>
            </tr>
        )
    })

    //////download functionality
    const headersAll = [
        {
            label: "course_name", key: "course_name"
        },
        {
            label: "skill_set", key: "skill_set"
        },
        {
            label: "number_of_skills", key: "skill_set.length"
        }
    ]

    const csvAllLink = {
        filename: "course_data.csv",
        headers: headersAll,
        data: allCourseData
    }

    return (
        <>
            <div style={{ paddingTop: "10px" }}>
                <h2>All Course Data</h2>
                <i onClick={handleRefresh} className="fa-solid fa-rotate refreshCourse"></i>
                {allCourseData.length > 0 ? <div className="action-btn col-md-1">
                    <button className="download-button btn btn-danger dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Actions
                    </button>
                    <ul className="dropdown-menu dropdown-menu-dark">
                        <li><CSVLink className="dropdown-item" {...csvAllLink}>Download as .csv</CSVLink></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><button onClick={handleUpload} className="dropdown-item" type="button">Upload</button></li>
                    </ul>
                </div> :
                    <div className="action-btn col-md-1">
                        <button onClick={handleUpload} className="download-button btn btn-danger" type="button">
                            Upload
                        </button>
                    </div>
                }
            </div>
            <h5 className="container mx-2">
                {allCourseData.length === 0 && "No data to display"}
            </h5>
            {allCourseData.length > 0 && <div className="mb-3 certificate-card">
                <table style={{ width: "100%" }} className="table table-striped table-striped-columns table-dark table-hover table-bordered ">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Skill Cluster</th>
                            <th scope="col">Number of Skills</th>
                            <th scope="col">Skill Set</th>
                            <th scope="col">
                                <input name="allselect" checked={!trainingData.some((user) => user?.isChecked !== true)} onChange={handleChange} className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                                {!trainingData.some((user) => user?.isChecked !== true) && <i onClick={handleAllDelete} className="fa-solid fa-trash table-delete-icon"></i>}
                                {multiCheck && <i onClick={handleAllDelete} className="fa-solid fa-trash table-delete-icon"></i>}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {mapFunction}
                    </tbody>
                </table>
            </div>}
        </>
    )

}

export default ViewAllCourse;