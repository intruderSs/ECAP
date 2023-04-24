import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import google from "../../images/google-cloud-icon.png";
import { useNavigate } from 'react-router-dom';

function SuggestionsGCP(props) {

    let navigate = useNavigate();

    const [suggested, setSuggested] = useState(false);

    const localData = props.datas;

    let GCPname = "";
    let gcpCountArr = [];
    let message = "Default";

    const GCP = ["Cloud Digital Leader", "Cloud Engineer", "Cloud Architect", "Cloud Database Engineer",
        "Cloud Developer", "Data Engineer", "Cloud DevOps Engineer", "Cloud Security Engineer", "Cloud Network Engineer",
        "Google Workspace Administrator", "Machine Learning Engineer"];

    for (let i = 0; i < localData.length; i++) {
        if (localData[i].CSP === "GCP") {
            for (let j = 0; j < localData.length; j++) {
                GCPname = localData[j].certification_name;
                for (let k = 0; k < GCP.length; k++) {
                    if (GCPname === GCP[k]) {
                        gcpCountArr.push(GCP.indexOf(GCP[k]));
                    }
                }
            }
        }
    }

    let gcpCount = Math.max(...gcpCountArr);
    message = `Let's try ${GCP[gcpCount + 1]} next!`;

    const notify = () => toast(<><span><img src={google} alt="Logo" className="suggestions-gcp gcp"></img></span> {message} 🔥🏆🚀</>, {
        position:"bottom-left",
        autoClose: 3000,
        closeOnClick: true,
        theme: "dark",
    });

    if (!suggested) {
        if (gcpCount >= 0) {
            notify();
            setSuggested(true);
        }
    }

    const shift = (event) => {
        event.preventDefault();
        //navigate("/home");
        window.open("https://cloud.google.com/certification");
      }
    
  
    return (
      <div onClick={shift}>
        <ToastContainer style={{fontSize: "25px"}}/>
      </div>
    );
}

export default SuggestionsGCP;