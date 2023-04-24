import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import salesforce from "../../images/salesforce-icon.png";
import { useNavigate } from 'react-router-dom';

function SuggestionsSalesforce(props) {

  let navigate = useNavigate();

  const [suggested, setSuggested] = useState(false);

  const localData = props.datas;

  let Salesforcename = "";
  let salesforceCountArr = [];
  let message = "Default";

  const Salesforce = ["Certified Associate", "Certified Administrator", "Advanced Administrator", "Platform App Builder", "User Experience (UX) Designer", "Strategy Designer", "Service Cloud Consultant", "CPQ Specialist", "Sales Cloud Consultant", "Field Service Consultant", "Experience Cloud Consultant", "TableAu CRM & Einstein Discovery Consultant", "Nonprofit Cloud Consultant", "Education Cloud Consultant",
    "Omnistudio Consultant", "Business Analyst", "Platform Developer 1", "Platform Developer 2", "Javascript Developer 1", "Industries CPQ Developer", "Omnistudio Developer", "B2C Commerce Developer", "B2C Commerce Architect", "B2B Commerce Developer", "B2B Commerce Administrator", "Identity & Access Management Architect", "Sharing & Visibility Architect", "Development Lifecycle & Deployment Architect",
    "Heroku Architect", "Integration Architect", "Data Architect", "Application Architect", "System Architect", "B2C Solution Architect", "B2B Solution Architect", "Technical Architect", "Pardot Specialist", "Pardot Consultant", "Marketing Cloud Administrator", "Marketing Cloud Email Specialist", "Marketing Cloud Developer"];

  for (let i = 0; i < localData.length; i++) {
    if (localData[i].CSP === "Salesforce") {
      for (let j = 0; j < localData.length; j++) {
        Salesforcename = localData[j].certification_name;
        for (let k = 0; k < Salesforce.length; k++) {
          if (Salesforcename === Salesforce[k]) {
            salesforceCountArr.push(Salesforce.indexOf(Salesforce[k]));
          }
        }
      }
    }
  }

  let salesforceCount = Math.max(...salesforceCountArr);
  message = `Let's try ${Salesforce[salesforceCount + 1]} next!`;

  const notify = () => toast(<><span><img src={salesforce} alt="Logo" className="suggestions-salesforce salesforce"></img></span> {message} 🔥🚀🎖️</>, {
    position: "top-left",
    autoClose: 3000,
    closeOnClick: true,
    theme: "dark",
  });

  if (!suggested) {
    if (salesforceCount >= 0) {
      notify();
      setSuggested(true);
    }
  }

  const shift = (event) => {
    event.preventDefault();
    //navigate("/home");
    console.log("Click");
    window.open("https://www.webassessor.com/salesforce");
  }


  return (
    <div onClick={shift}>
      <ToastContainer style={{ fontSize: "25px" }} />
    </div>
  );
}

export default SuggestionsSalesforce;