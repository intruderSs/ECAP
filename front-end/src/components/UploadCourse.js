import React, { useState, useRef, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UploadTable from "./UploadTable";
import { CSVReader } from "react-papaparse";
import courseContext from "../context/courseContext";
import { CSVLink } from "react-csv";

function UploadCourse(props) {

    const context = useContext(courseContext);
    const { addCourse } = context;

    const formatRef = useRef(null);
    const formatCloseRef = useRef(null);

    const navigate = useNavigate();

    const [tableHeader, setTableHeader] = useState([]);
    const [tableRows, setTableRows] = useState([]);

    const header = useMemo(() => tableHeader, [tableHeader]);
    const data = useMemo(() => tableRows, [tableRows]);

    const buttonRef = useRef(null);

    ////////sample data to download
    const headerFormat = [
        {
            label: "Skill Cluster",
            key: "course_name",
        },
        {
            label: "Number of Skills",
            key: "skill_set.length",
        },
        {
            label: "Skill Set",
            key: 'skill_set',
        }
    ]

    const sampleData = [{
        skill_cluster: "Clourse1",
        number_of_skills: 4,
        skill_set: ["Skill1", "Skill2", "Skill3", "Skill4"],
    }]

    const csvSampleLink = {
        filename: "course_sample.csv",
        headers: headerFormat,
        data: sampleData
    }

    const handleOnFileLoad = (data) => {
        //ref.current.click();
        //console.log(data);
        if (headerFormat.length === data[0].data.length) {
            for (let i = 0; i < headerFormat.length; i++) {
                if (!headerFormat[i].accessor === data[0][i]) {
                    console.log("not matched");
                    handleRemoveFile();
                    formatRef.current.click();
                    break;
                }
            }
            console.log("matched");
            const columns = data[0].data.map((col, index) => {
                return {
                    Header: col,
                    accessor: col,
                };
            });
            //console.log(columns);

            const rows = data.slice(1).map((row) => {
                return row.data.reduce((acc, curr, index) => {
                    acc[columns[index].accessor] = curr;
                    return acc;
                }, {});
            });
            //console.log(rows);

            setTableHeader(columns);
            setTableRows(rows);
        } else {
            console.log("Not Matched");
            handleRemoveFile();
            formatRef.current.click();
        }

    }

    const onErrorHandler = (err, file, inputElem, reason) => {
        console.log(err);
    }

    const handleFileRemove = (data) => {
        //console.log(data);
        setTableHeader([]);
        setTableRows([]);
    }

    const handleOpenCSVReader = (e) => {
        if (buttonRef.current) {
            buttonRef.current.open(e);
        }
    }

    const handleRemoveFile = (e) => {
        if (buttonRef.current) {
            buttonRef.current.removeFile(e);
        }
    }

    const handleCancel = () => {
        handleRemoveFile();
        navigate("/courses");
    }

    console.log(data);

    const handleAllUpload = () => {
        for (let i = 0; i < data.length; i++) {
            let skill_set_main = data[i].skill_set.split(",");
            addCourse(
                data[i].course_name,
                skill_set_main,
            )
                .then(data => {
                    props.showAlert("Upload Successful", "Navigate to Training Data to view the records", "success");
                    console.log(data);
                    handleRemoveFile();
                })
                .catch(err => {
                    props.showAlert(`${err.message}`, "upload failure", "danger");
                })
        }
    }


    return (
        <>
            <div>
                <button ref={formatRef} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#formatError">
                    Launch static backdrop modal
                </button>
                <div className="modal fade" id="formatError" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-4" id="staticBackdropLabel">Ohh-hoo! Please provide the data in proper format! <span style={{ fontSize: "20px", color: "#FF9900" }}>Click the download button to download a sample</span></h1>
                            </div>
                            <div className="modal-footer">
                                <button type="button" ref={formatCloseRef} className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <CSVLink className="btn btn-primary" {...csvSampleLink}>Download</CSVLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="my-3">
                <i onClick={handleCancel} className="fa-solid fa-arrow-left go-back"></i>
                <CSVReader
                    ref={buttonRef}
                    onFileLoad={handleOnFileLoad}
                    onError={onErrorHandler}
                    onClick
                    noDrag
                    noProgressBar
                    onRemoveFile={handleFileRemove}
                >
                    {({ file }) =>
                        <>
                            <div className="col-md-8" style={{ height: "40px" }}>
                                <button className="upload_btn btn btn-danger" onClick={handleOpenCSVReader}>
                                    Select file!
                                </button>
                                {file && <div className="input-group custom_div">
                                    <div className="card border-danger col-md-3" style={{ height: "38px" }}>
                                        <div className="custom_body">
                                            {file && file.name}
                                        </div>
                                    </div>
                                    <span className="input-group-text"><i onClick={handleRemoveFile} className="fa-solid fa-trash upload-delete-color"></i></span>
                                    <i onClick={handleAllUpload} className="fa-solid fa-cloud-arrow-up cloud-upload"></i>
                                </div>}
                            </div>
                        </>}
                </CSVReader>
                <div className="row my-3">
                    <h3>
                        {header.length > 0 ? "Training Data" : "Nothing to Display"}
                    </h3>
                    <UploadTable columns={header} data={data} />
                </div>
            </div>
        </>
    )
}

export default UploadCourse;