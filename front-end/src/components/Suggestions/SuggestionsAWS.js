import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import aws from "../../images/aws-icon.png";
import { useNavigate } from 'react-router-dom';


function SuggestionsAWS(props) {

  let navigate = useNavigate();

  const [suggested, setSuggested] = useState(false);

  let localData = props.datas;

  // console.log("localData", localData);

  let AWSname = "";
  const awsCountArr = [];
  let message = "Default";

  const AWS = ["Cloud Practitioner", "Solutions Architect Associate", "Developer Associate",
    "SysOps Administrator", "Solutions Architect Professional", "DevOps Engineer",
    "Advanced Networking Speciality", "Data Analytics Speciality", "Database Speciality",
    "Machine Learning Speciality", "Security Speciality", "SAP on AWS Speciality"];

  for (let i = 0; i < localData.length; i++) {
    if (localData[i].CSP === "AWS") {
      for (let j = 0; j < localData.length; j++) {
        AWSname = localData[j].certification_name;
        for (let k = 0; k < AWS.length; k++) {
          if (AWSname === AWS[k]) {
            awsCountArr.push(AWS.indexOf(AWS[k]));
          }
        }
      }
    }
  }

  // for (let i = 0; i < localData.length; i++) {
  //   AWSname = localData[i].certification_name;
  //   //console.log(AWSname);
  //   for (let k = 0; k < AWS.length; k++) {
  //     if (AWSname === AWS[k]) {

  //     }
  //   }
  // }

  // console.log("Arr", awsCountArr);


  let awsCount = Math.max(...awsCountArr);
  message = `Let's try ${AWS[awsCount + 1]} next!`;

  const notify = () => toast(<><span><img src={aws} alt="Logo" className="suggestions-aws aws"></img></span> {message} 🔥🏆✌️</>, {
    position: "bottom-left",
    autoClose: 3000,
    closeOnClick: true,
    theme: "dark",
  });


  if (!suggested) {
    if (awsCount >= 0) {
      notify();
      setSuggested(true);
    }
  }

  const shift = (event) => {
    event.preventDefault();
    window.open("https://www.aws.training/certification/?ch=cta&cta=header&p=1");
  }

  // useEffect(() => {
  //   if (!suggested) {
  //     if (localData.length != 0) {
  //       notify();
  //       setSuggested(true);
  //     }
  //   }
  // })

  return (
    <div onClick={shift}>
      <ToastContainer style={{fontSize: "25px"}} />
    </div>
  );
}

export default SuggestionsAWS;