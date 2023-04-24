import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ibm from "../../images/ibm-icon.png";
import { useNavigate } from 'react-router-dom';

function SuggestionsIBM(props) {

  let navigate = useNavigate();

  const [suggested, setSuggested] = useState(false);

  const localData = props.datas;

  let IBMname = "";
  let ibmCountArr = [];
  let message = "Default";

  const IBM = ["IBM Cloud Advocate", "IBM Cloud Technical Advocate", "IBM Cloud Professional Architect",
    "IBM Cloud Advanced Architect", "IBM Cloud Profesional Developer", "IBM CLoud Associate Site Reliability Engineer (SRE)",
    "IBM Cloud Professional Site Reliability Engineer", "IBM Cloud Professional Sales Engineer", "IBM CLoud Security Engineer Speciality",
    "IBM Cloud Satellite Speciality", "IBM Cloud for Financial Services Speciality", "IBM Cloud DevSecOps Speciality"];

  for (let i = 0; i < localData.length; i++) {
    if (localData[i].CSP === "IBM") {
      for (let j = 0; j < localData.length; j++) {
        IBMname = localData[j].certification_name;
        for (let k = 0; k < IBM.length; k++) {
          if (IBMname === IBM[k]) {
            ibmCountArr.push(IBM.indexOf(IBM[k]));
          }
        }
      }
    }
  }

  let ibmCount = Math.max(...ibmCountArr);
  message = `Let's try ${IBM[ibmCount + 1]} next!`;

  const notify = () => toast(<><span><img src={ibm} alt="Logo" className="suggestions-ibm ibm"></img></span> {message} 🏆🏅🚀</>, {
    position: "bottom-right",
    autoClose: 3000,
    closeOnClick: true,
    theme: "dark",
  });

  if (!suggested) {
    if (ibmCount >= 0) {
      notify();
      setSuggested(true);
    }
  }

  const shift = (event) => {
    event.preventDefault();
    //navigate("/home");
    window.open("https://www.ibm.com/training/cloud");
  }


return (
  <div onClick={shift}>
    <ToastContainer style={{fontSize: "25px"}}/>
  </div>
);
}

export default SuggestionsIBM;