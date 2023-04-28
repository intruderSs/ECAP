import React, { useContext, useEffect } from "react";
import approveContext from "../context/approveContext";
import ApproveSkillTable from "./ApproveSkillTable";
import courseContext from "../context/courseContext";

function ApproveSkill(props) {

    const { approveData, getAllApproveData, updateApproveData } = useContext(approveContext);

    const { allCourseData, getAllCourseData } = useContext(courseContext);

    useEffect(() => {
        getAllApproveData();
        getAllCourseData();
    }, [])

    const handleRefresh = () => {
        getAllApproveData();
        getAllCourseData();
    }


    const approve_data = approveData.filter((datas) => { return datas.approval_status === "false" });

    return (
        <>
            <div className="my-3">
                    <i className="fa-solid fa-rotate refreshApproveSkill" onClick={handleRefresh}></i>
                <h2>Approve Skill Requests</h2>
                <div className="my-3">
                    <h5 className="container mx-2">
                        {approve_data.length === 0 && "No data to display"}
                    </h5>
                    {approve_data.length > 0 && <ApproveSkillTable showAlert={props.showAlert} allCourseData={allCourseData} getAllCourseData={getAllCourseData} getAllApproveData={getAllApproveData} approveData={approveData} updateApproveData={updateApproveData} />}
                </div>
            </div>
        </>
    )
}

export default ApproveSkill;