import React, { useState, useContext, useEffect, useRef } from 'react';
import testContext from '../../context/testContext';
import { useNavigate } from "react-router-dom";
import userContext from '../../context/userContext';
import courseContext from '../../context/courseContext';

function Test() {

  const { getTestData } = useContext(testContext);

  const { addKnowledgeCheck, getSpecificUserData, userData, addSkill } = useContext(userContext);

  const { allCourseData, getAllCourseData } = useContext(courseContext);

  const navigate = useNavigate();

  const startRef = useRef(null);
  const cancelRef = useRef(null);

  const passResult = useRef(null);
  const failResult = useRef(null);

  const exceedRef = useRef(null);

  const [Agree, setAgree] = useState(false);

  const [checkedData, setCheckedData] = useState();
  const [mainData, setMainData] = useState();

  ///////result data
  const [correctAns, setCorrectAns] = useState();
  const [Result, setResult] = useState();
  const [AllQuestions, setAllQuestions] = useState();

  useEffect(() => {
    startRef.current.click();
    getSpecificUserData(localStorage.getItem('email'));
    getAllCourseData();
    getTestData(localStorage.getItem('Test_Name'))
      .then(data => {
        //console.log(data.Items[0].test);
        setCheckedData(data.Items[0].test);
        setMainData(data.Items[0].test);
      })
      .catch(err => {
        console.group(err);
      })
  }, [])

  console.group(mainData);

  const setAnswers = (data, name, checked) => {
    const checkedAnswer = data.answers.map((a) => a.ans === name ? { ...a, isChecked: checked } : { ...a, isChecked: false });
    return checkedAnswer;
  }

  const handleChange = (e) => {
    let { question, answers, correct } = e.target.dataset;
    let { checked, name } = e.target;

    const checkedValue = checkedData.map((data) => data.question === question ? { ...data, answers: setAnswers(data, name, checked) } : data);

    let count = 0;
    //console.log(checkedValue);
    for (let i of checkedValue) {
      for (let j of i.answers) {
        if (j.isChecked === true) {
          if (j.ans === i.answers[i.correctIndex].ans) {
            count += 1;
          }
        }
      }
    }

    setCheckedData(checkedValue);
    setCorrectAns(count);
  }

  const startTest = () => {
    if (userData && !userData[0]?.knowledgeTest) {
      console.log("Checked");
      let knowledgeTest = [{
        course_name: localStorage.getItem("Test_Name"),
        attempts_remaining: 2,
      }]
      addKnowledgeCheck(localStorage.getItem('email'), knowledgeTest)
        .then(data => {
          console.log("Test Started Successfully");
          setAgree(!Agree);
        })
        .catch(err => {
          console.log(err);
        })
    } else if (userData && userData[0]?.knowledgeTest && userData[0].knowledgeTest[0].course_name === localStorage.getItem("Test_Name")) {
      ///in future we have to work on for loop here
      console.log("Two");
      if (userData[0].knowledgeTest[0].attempts_remaining > 0) {
        let knowledgeTest = [{
          course_name: localStorage.getItem("Test_Name"),
          attempts_remaining: userData[0].knowledgeTest[0].attempts_remaining - 1,
        }]
        addKnowledgeCheck(localStorage.getItem('email'), knowledgeTest)
          .then(data => {
            console.log("Test Started Successfully");
            setAgree(!Agree);
          })
          .catch(err => {
            console.log(err);
          })
      } else {
        ///popup of attempts finished
        console.log("Three");
        exceedRef.current.click();
      }
    }
  }

  const handleTestSubmit = () => {
    let res = Math.round(correctAns / checkedData.length * 100);
    setAllQuestions(checkedData.length);
    setResult(res);
    if (res > 75) {
      let courseSkill = [];
      let userSkill = [];
      let userSkillWithRating = [];
      for (let i of allCourseData) {
        if (i.course_name === localStorage.getItem("Test_Name")) {
          for (let j of i.skill_set) {
            if (!courseSkill.includes(j)) {
              courseSkill.push(j);
            }
          }
        }
      }
      //console.log(courseSkill);

      for (let i of userData[0].skill_set) {
        if (!userSkill.includes(i)) {
          userSkill.push(i.skill_with_rating);
          userSkillWithRating.push(i);
        }
      }

      //console.log(userSkill);

      for (let i of courseSkill) {
        if (!userSkill.includes(i)) {
          userSkillWithRating.push({ rating: "8", skill_with_rating: i });
        }
      }
      //console.log(userSkillWithRating);

      addSkill(
        localStorage.getItem('email'),
        userSkillWithRating
      ).then(data => {
        console.log("done");
        passResult.current.click();
      })
      .catch(err => {
        console.log(err);
      })

    } else {
      failResult.current.click();
    }
  }

  const handleReset = () => {
    setCheckedData(mainData);
  }

  const handleCancel = () => {
    localStorage.removeItem("Test_Name");
    navigate("/userskills");
  }

  const closeResult = () => {
    localStorage.removeItem("Test_Name");
    navigate("/userskills");
  }

  return (
    <>

      <div>
        <button ref={exceedRef} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#limitAchieved">
          Launch static backdrop modal
        </button>
        <div className="modal fade" id="limitAchieved" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="staticBackdropLabel">Attempt limit exceeded, contact admin for more info!!</h1>
              </div>
              <div className="modal-footer">
                <button onClick={handleCancel} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <button ref={failResult} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#failResult">
          Launch static backdrop modal
        </button>
        <div className="modal fade" id="failResult" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-4" id="staticBackdropLabel"><span style={{ fontSize: "20px", color: "red" }}>Ohh-hoo!</span> You have not passed the test.</h1>
              </div>
              <div className="modal-body">
                <p><span style={{ fontSize: "18px", color: "#FF9900" }}>Achieved Percentage -</span> {Result}%</p>
                <p><span style={{ fontSize: "18px", color: "#FF9900" }}>Total questions -</span> {AllQuestions}</p>
                <p><span style={{ fontSize: "18px", color: "#FF9900" }}>Correct -</span> {correctAns}</p>
                <p><span style={{ fontSize: "18px", color: "#FF9900" }}>Incorrect -</span> {AllQuestions - correctAns}</p>
              </div>
              <div className="modal-footer">
                <button onClick={closeResult} type="button" ref={cancelRef} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <button ref={passResult} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#passResult">
          Launch static backdrop modal
        </button>
        <div className="modal fade" id="passResult" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-4" id="staticBackdropLabel"><span style={{ fontSize: "20px", color: "green" }}>Congratulations!!</span>You have cleared the exam.</h1>
              </div>
              <div className="modal-body">
                <p><span style={{ fontSize: "18px", color: "#FF9900" }}>Achieved Percentage -</span> {Result}%</p>
                <p><span style={{ fontSize: "18px", color: "#FF9900" }}>Total questions -</span> {AllQuestions}</p>
                <p><span style={{ fontSize: "18px", color: "#FF9900" }}>Correct -</span> {correctAns}</p>
                <p><span style={{ fontSize: "18px", color: "#FF9900" }}>Incorrect -</span> {AllQuestions - correctAns}</p>
              </div>
              <div className="modal-footer">
                <button onClick={closeResult} type="button" ref={cancelRef} className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <button ref={startRef} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#startTest">
          Launch static backdrop modal
        </button>
        <div className="modal fade" id="startTest" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-4" id="staticBackdropLabel">You are appearing for the test of <span style={{ fontSize: "20px", color: "#FF9900" }}>{localStorage.getItem("Test_Name")}</span></h1>
              </div>
              <div className="modal-body">
                <p><span style={{ fontSize: "18px", color: "#FF9900" }}>Time limit -</span> 10 Minutes</p>
                <p><span style={{ fontSize: "18px", color: "#FF9900" }}>Attempts left -</span> 2</p>
              </div>
              <div className="modal-footer">
                <button onClick={handleCancel} type="button" ref={cancelRef} className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button onClick={startTest} ref={cancelRef} data-bs-dismiss="modal" type="button" className="btn mx-3" style={{ background: "#ff9900", color: "#fff", width: "150px" }}>Start Test</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='test-container'>
        <div className='certificate-card test-main text-bg-dark'>
          <h3>{localStorage.getItem('Test_Name')}</h3>
        </div>
        {Agree && <div className='timer certificate-card'>
          <h3><i style={{ paddingLeft: "5px", marginTop: "auto", marginBottom: "auto", color: "#ff9900" }} className="fa-solid fa-hourglass-start fa-spin-pulse"></i> 10:00</h3>
        </div>}
      </div>
      {Agree && <div>
        {checkedData && checkedData.length > 0 && checkedData.map((data, index) => {
          return <div key={index} className='test-field-container certificate-card text-bg-light'>
            <div className='question-number'>
              <p style={{ fontSize: "2rem", fontWeight: "500" }}>Question {index + 1}<span style={{ fontSize: "1.2rem" }}>/{checkedData.length}</span></p>
            </div>
            <div className='question'>
              <p style={{ fontSize: "1.5rem", fontWeight: "500" }}>{data.question}</p>
            </div>
            <div className='options-container'>
              <div className='row my-3'>
                {data.answers.map((d, i) => {
                  return <div key={i} className="projectSelect col-md-6 option">
                    <label>
                      <input name={d.ans} checked={d?.isChecked || false} onChange={handleChange} data-correct={data.correctIndex} data-question={data.question} data-answers={data.answers} style={{ marginBottom: "auto", fontSize: "20px" }} className="form-check-input" type="checkbox" id="flexCheckDefault" />
                      <span>{d.ans}</span>
                    </label>
                  </div>
                })}
              </div>
            </div>
          </div>
        })}
      </div>}
      {Agree && <div className="test-buttons my-3">
        <button onClick={handleReset} type='button' className="btn btn-secondary mx-3" style={{ color: "#fff", width: "100px" }}>Reset</button>
        <button onClick={handleTestSubmit} type="button" className="btn mx-3" style={{ background: "#ff9900", color: "#fff", width: "150px" }}>Submit & End</button>
      </div>}
    </>
  )
}

export default Test;