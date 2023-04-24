import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import oracle from "../../images/oracle-icon.png";
import { useNavigate } from 'react-router-dom';

function SuggestionsOracle(props) {

  let navigate = useNavigate();

  const [suggested, setSuggested] = useState(false);

  const localData = props.datas;

  let Oraclename = "";
  let oracleCountArr = [];
  let message = "Default";

  const Oracle = ["Oracle Cloud Data Management 2022 Foundations Certified Associate", "Oracle Cloud Infrastructure 2022 Certified Foundations Associate", "Oracle Cloud Infrastructure 2022 Certified Architect Associate", "Oracle Cloud Infrastructure 2022 DevOps Certified Professional", "Oracle Cloud Infrastructure 2022 Certified Security Professsional", "Oracle Cloud Infrastructure Data Science 2022 Certified Professional",
    "Oracle Cloud Infrastructure 2022 Certified Cloud Operations Professional", "Oracle Cloud Infrastructure 2022 Certified Developer Professional", "Oracle Cloud Infrastructure 2022 Certified Architect Professional", "Oracle Cloud Infrastructure 2022 Observability and Management Certified Professional", "Oracle Cloud Infrastructure 2021 HPC and Big Data Solutions Certified Associate (Available only in Japan)"];

  for (let i = 0; i < localData.length; i++) {
    if (localData[i].CSP === "Oracle") {
      for (let j = 0; j < localData.length; j++) {
        Oraclename = localData[j].certification_name;
        for (let k = 0; k < Oracle.length; k++) {
          if (Oraclename === Oracle[k]) {
            oracleCountArr.push(Oracle.indexOf(Oracle[k]));
          }
        }
      }
    }
  }

  let oracleCount = Math.max(...oracleCountArr);
  message = `Let's try ${Oracle[oracleCount + 1]} next!`;

  const notify = () => toast(<><span><img src={oracle} alt="Logo" className="suggestions-oracle oracle"></img></span> {message} 🔥🏆🎖️</>, {
    position: "top-right",
    autoClose:3000,
    closeOnClick: true,
    theme: "dark",
  });

  if (!suggested) {
    if (oracleCount >= 0) {
      notify();
      setSuggested(true);
    }
  }

  const shift = (event) => {
    event.preventDefault();
    //navigate("/home");
    window.open("https://education.oracle.com/registration");
  }


return (
  <div onClick={shift}>
    <ToastContainer style={{fontSize: "25px"}}/>
  </div>
);
}

export default SuggestionsOracle;