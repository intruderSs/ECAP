import React, { useContext, useEffect } from "react";
import ApproveTable from "./ApproveTable";
import trainingContext from "../context/trainingContext";
import { useNavigate } from "react-router-dom";

function PendingRequests() {

    const navigate = useNavigate();

    const { getAllTrainingRequest, allTrainingData, updateTrainingDetails } = useContext(trainingContext);

    useEffect(() => {
        if (localStorage.getItem('token')) {
            getAllTrainingRequest();
        }
    }, [])

    const trainingData = allTrainingData.filter((datas) => { return datas.request === "false" });

    const goBack = () => {
       navigate("/admin");
    }

    return (
        <>
            <div className="my-3">
                <i onClick={goBack} className="fa-solid fa-arrow-left go-back"></i>
                <h2>Pending Training Requests</h2>
                <div className="my-3">
                    <h5 className="container mx-2">
                        {trainingData.length === 0 && "No data to display"}
                    </h5>
                    {trainingData.length > 0 && <ApproveTable getAllTrainingRequest={getAllTrainingRequest} allTrainingData={allTrainingData} updateTrainingDetails={updateTrainingDetails} />}
                </div>
            </div>
        </>
    )
}

export default PendingRequests;