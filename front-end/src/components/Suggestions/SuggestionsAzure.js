import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import azure from "../../images/azure-icon.png";
import { useNavigate } from 'react-router-dom';

function SuggestionsAzure(props) {

    let navigate = useNavigate();

    const [suggested, setSuggested] = useState(false);

    const localData = props.datas;

    let Azurename = "";
    let azureCountArr = [];
    let message = "Default";

    const Azure = ["Azure Fundamentals", "Azure AI Fundamentals", "Azure Data Fundamentals", "Azure Administrator",
        "Azure Developer", "Azure Security Engineer", "Designing and Implementing a Microsoft Azure AI Solution",
        "Azure Data Scientist", "Miccrosoft Data Analyst Associate", "Data Engineering on Microsoft Azure",
        "Azure Database Administrator", "Azure Solutions Architect", "Azure DevOps Engineer"];

    for (let i = 0; i < localData.length; i++) {
        if (localData[i].CSP === "Azure") {
            for (let j = 0; j < localData.length; j++) {
                Azurename = localData[j].certification_name;
                for (let k = 0; k < Azure.length; k++) {
                    if (Azurename === Azure[k]) {
                        azureCountArr.push(Azure.indexOf(Azure[k]));
                    }
                }
            }
        }
    }

    let azureCount = Math.max(...azureCountArr);
    message = `Let's try ${Azure[azureCount + 1]} next!`;

    const notify = () => toast(<><span><img src={azure} alt="Logo" className="suggestions-azure azure"></img></span> {message} 🔥🏆✌️</>, {
        position: "bottom-right",
        autoClose: 3000,
        closeOnClick: true,
        theme: "dark",
    });

    if (!suggested) {
        if (azureCount >= 0) {
            notify();
            setSuggested(true);
        }
    }

    const shift = (event) => {
        event.preventDefault();
        //navigate("/home");
        window.open("https://examregistration.microsoft.com/");
      }
    
  
    return (
      <div onClick={shift}>
        <ToastContainer style={{fontSize: "25px"}} />
      </div>
    );
}

export default SuggestionsAzure;